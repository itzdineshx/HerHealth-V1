
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWorkoutRecommendations } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export type WorkoutRecommendation = {
  title: string;
  description: string;
  duration: number;
  intensity: "low" | "moderate" | "high";
  benefits: string[];
  exercises: string[];
  imageUrl?: string;
  videoUrl?: string;
};

export const WorkoutRecommendations = ({ cyclePhase = "general", fitnessLevel = "moderate", preferences = [] }: {
  cyclePhase?: string;
  fitnessLevel?: string;
  preferences?: string[];
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const recommendations = await generateWorkoutRecommendations(user.id, cyclePhase, fitnessLevel, preferences);
        setWorkouts(recommendations);
      } catch (error) {
        console.error("Error fetching workout recommendations:", error);
        toast({
          title: "Unable to load workout recommendations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user, cyclePhase, fitnessLevel, preferences, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Workouts</CardTitle>
          <CardDescription>Based on your cycle phase and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6 mb-3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const workoutImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1170&auto=format&fit=crop"
  ];

  return (
    <Card>
      <CardHeader className="bg-herhealth-green-light/30">
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recommended Workouts
        </CardTitle>
        <CardDescription>
          {cyclePhase !== "general" 
            ? `Optimized for your ${cyclePhase} phase • ${fitnessLevel} intensity`
            : `Personalized ${fitnessLevel} intensity workouts`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <div key={index} className="border rounded-md overflow-hidden hover:shadow-md transition-all">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={workout.imageUrl || workoutImages[index % workoutImages.length]} 
                    alt={workout.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1170&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium">
                    {workout.duration} min
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                    {workout.intensity} intensity
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium">{workout.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{workout.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">Exercises:</p>
                    <p className="text-xs text-gray-500">{workout.exercises.slice(0, 3).join(", ")}{workout.exercises.length > 3 ? "..." : ""}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      if (workout.videoUrl) {
                        window.open(workout.videoUrl, '_blank');
                      } else {
                        toast({
                          title: `${workout.title}`,
                          description: `${workout.exercises.join(", ")}`,
                        });
                      }
                    }}
                    className="w-full mt-3 text-xs h-8" 
                    variant="outline"
                  >
                    Start Workout
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Activity className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <h3 className="text-gray-500">No workout recommendations available</h3>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
