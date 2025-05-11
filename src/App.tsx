
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster"; 
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import CycleTrackerPage from "./pages/CycleTrackerPage";
import ResourcesPage from "./pages/ResourcesPage";
import WellnessHubPage from "./pages/WellnessHubPage";
import AIHealthChatPage from "./pages/AIHealthChatPage";
import MenopausePage from "./pages/MenopausePage";
import MentalHealthPage from "./pages/MentalHealthPage";
import PregnancyPage from "./pages/PregnancyPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import OnboardingPage from "./pages/OnboardingPage";
import ContactPage from "./pages/ContactPage";
import AIWellnessPage from "./pages/AIWellnessPage";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cycle-tracker" element={<CycleTrackerPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/wellness-hub" element={<WellnessHubPage />} />
            <Route path="/ai-wellness" element={<AIWellnessPage />} />
            <Route path="/ai-health-chat" element={<AIHealthChatPage />} />
            <Route path="/menopause" element={<MenopausePage />} />
            <Route path="/mental-health" element={<MentalHealthPage />} />
            <Route path="/pregnancy" element={<PregnancyPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
