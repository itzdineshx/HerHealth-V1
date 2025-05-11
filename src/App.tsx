
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import ScrollToTop from "./utils/ScrollToTop";

// Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CycleTrackerPage = lazy(() => import("./pages/CycleTrackerPage"));
const WellnessHubPage = lazy(() => import("./pages/WellnessHubPage"));
const MentalHealthPage = lazy(() => import("./pages/MentalHealthPage"));
const PregnancyPage = lazy(() => import("./pages/PregnancyPage"));
const MenopausePage = lazy(() => import("./pages/MenopausePage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AIHealthChatPage = lazy(() => import("./pages/AIHealthChatPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Loading Component
const LoadingSpinner = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-herhealth-pink-light border-t-herhealth-pink-dark rounded-full animate-spin"></div>
    <p className="mt-4 text-herhealth-pink-dark">Loading...</p>
  </div>
);

// Create QueryClient with improved caching settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cycle" element={<CycleTrackerPage />} />
                <Route path="/wellness" element={<WellnessHubPage />} />
                <Route path="/mental-health" element={<MentalHealthPage />} />
                <Route path="/pregnancy" element={<PregnancyPage />} />
                <Route path="/menopause" element={<MenopausePage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/ai-health-chat" element={<AIHealthChatPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Additional pages mentioned in footer */}
                <Route path="/support" element={<ContactPage />} />  {/* Reuse ContactPage for now */}
                <Route path="/cookies" element={<PrivacyPolicyPage />} />  {/* Reuse PrivacyPage for now */}
                <Route path="/accessibility" element={<TermsPage />} />  {/* Reuse TermsPage for now */}
                
                {/* Redirect /index.html to home page */}
                <Route path="/index.html" element={<Navigate to="/" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
