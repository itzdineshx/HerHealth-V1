
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSleepRecommendations } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export type SleepRecommendation = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tips: string[];
  bedtimeSuggestion?: string;
  wakeSuggestion?: string;
  cyclePhaseSpecific?: boolean;
  cyclePhaseContext?: string;
};

export const SleepOptimization = ({ cyclePhase = "general" }: { cyclePhase?: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<SleepRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const sleepRecs = await getSleepRecommendations(user.id, cyclePhase);
        setRecommendations(sleepRecs);
      } catch (error) {
        console.error("Error fetching sleep recommendations:", error);
        toast({
          title: "Unable to load sleep recommendations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, cyclePhase, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sleep Optimization</CardTitle>
          <CardDescription>Personalized for better rest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-5/6 mb-3" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sleepImages = [
    "https://images.unsplash.com/photo-1455642305367-68834a9e7cb9?q=80&w=1169&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455642305367-68834a9e7cb9?q=80&w=1169&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542736536-cabcba4e5ebb?q=80&w=1170&auto=format&fit=crop"
  ];

  return (
    <Card>
      <CardHeader className="bg-herhealth-blue-light/30">
        <CardTitle className="flex items-center">
          <Moon className="mr-2 h-5 w-5" />
          Sleep Optimization
        </CardTitle>
        <CardDescription>
          {cyclePhase !== "general" 
            ? `Tailored for your ${cyclePhase} phase`
            : "Personalized for better rest"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            <>
              <div className="p-4 rounded-lg bg-gradient-to-r from-herhealth-blue-light/20 to-herhealth-purple-light/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-herhealth-blue-dark" />
                  <h4 className="font-medium">Suggested Sleep Schedule</h4>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Bedtime</p>
                    <p className="text-lg font-semibold">{recommendations[0].bedtimeSuggestion || "10:30 PM"}</p>
                  </div>
                  <div className="h-px w-16 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sleep Duration</p>
                    <p className="text-lg font-semibold">7.5 hours</p>
                  </div>
                  <div className="h-px w-16 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Wake Up</p>
                    <p className="text-lg font-semibold">{recommendations[0].wakeSuggestion || "6:00 AM"}</p>
                  </div>
                </div>
              </div>
            
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="p-3 border rounded-md relative overflow-hidden hover:shadow-sm transition-all">
                  {rec.imageUrl && (
                    <div className="absolute right-0 top-0 w-16 h-full">
                      <img 
                        src={rec.imageUrl || sleepImages[index % sleepImages.length]} 
                        alt={rec.title} 
                        className="h-full object-cover opacity-20"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-herhealth-blue-dark" />
                    <h4 className="text-sm font-medium">{rec.title}</h4>
                  </div>
                  <p className="text-sm mt-2">{rec.description}</p>
                  {rec.tips?.length > 0 && (
                    <div className="mt-2">
                      <ul className="text-xs text-gray-600 list-disc list-inside">
                        {rec.tips.slice(0, 2).map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rec.cyclePhaseSpecific && rec.cyclePhaseContext && (
                    <p className="text-xs mt-2 text-herhealth-pink-dark">
                      {rec.cyclePhaseContext}
                    </p>
                  )}
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                View Full Sleep Report
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <Moon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <h3 className="text-gray-500">No sleep recommendations available</h3>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
