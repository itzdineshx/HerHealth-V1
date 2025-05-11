
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonalizedInsights } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";

export const AiInsightsWidget = () => {
  const { user } = useAuth();
  
  const { data: insights, isLoading, isError } = useQuery({
    queryKey: ['insights', user?.id],
    queryFn: () => fetchPersonalizedInsights(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  if (isLoading) {
    return (
      <Card hover glass>
        <CardHeader className="bg-gradient-to-r from-herhealth-blue-light/50 to-herhealth-purple-light/50 pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Wellness Insights</CardTitle>
          </div>
          <CardDescription>Analyzing your patterns...</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !insights) {
    return (
      <Card hover glass>
        <CardHeader className="bg-gradient-to-r from-herhealth-blue-light/50 to-herhealth-purple-light/50 pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Wellness Insights</CardTitle>
          </div>
          <CardDescription>Personalized for you</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 text-center">
          <p className="text-sm text-gray-600 mb-4">
            We couldn't generate your insights at this time.
          </p>
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card hover className="glass-effect">
      <CardHeader className="bg-gradient-to-r from-herhealth-blue-light/50 to-herhealth-purple-light/50 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Wellness Insights</CardTitle>
          </div>
          <Sparkles className="h-4 w-4 text-herhealth-blue-dark" />
        </div>
        <CardDescription>Updated {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 rounded-lg border bg-white/70 dark:bg-black/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                {insight.type === 'prediction' ? (
                  <TrendingUp className="h-5 w-5 text-herhealth-blue-dark mt-0.5" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-herhealth-pink-dark mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-medium mb-1 text-balance">{insight.title}</h4>
                  <p className="text-sm text-gray-600 text-balance">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
