
import { AppLayout } from "@/components/layout/AppLayout";
import { LifeStageWidget } from "@/components/dashboard/LifeStageWidget";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { QuickAddButtons } from "@/components/dashboard/QuickAddButtons";
import { AiInsightsWidget } from "@/components/dashboard/AiInsightsWidget";
import { MoodPredictionWidget } from "@/components/dashboard/MoodPredictionWidget";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquareHeart } from "lucide-react";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <AppLayout>
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-gray-600">Here's your wellness summary for today</p>
            </div>
            <Button asChild variant="outline" className="h-10">
              <Link to="/ai-health-chat">
                <MessageSquareHeart className="mr-2 h-5 w-5" />
                Chat with AI Assistant
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <LifeStageWidget />
            </div>
            <div>
              <ReadinessScore />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <UpcomingEvents />
            </div>
            <div>
              <QuickAddButtons />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <AiInsightsWidget />
            </div>
            <div>
              <MoodPredictionWidget />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
