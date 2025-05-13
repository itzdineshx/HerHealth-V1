
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/utils/ScrollToTop";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AppLayout = ({ 
  children,
  title = "HerHealth - Women's Health & Wellness Platform",
  description = "Personalized health tracking and insights for every stage of a woman's life"
}: AppLayoutProps) => {
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-[#FFF5F7]">
        <Navbar />
        <main className="flex-grow animate-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
        <Footer />
        <Toaster />
        <ScrollToTop />
      </div>
    </>
  );
};
