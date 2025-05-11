
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center py-12">
          <h1 className="text-6xl font-bold mb-4 text-herhealth-pink-dark">404</h1>
          <p className="text-2xl text-gray-700 mb-2">Page not found</p>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the page you're looking for. The link might be broken,
            or the page may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button asChild className="bg-herhealth-pink-dark hover:bg-herhealth-pink">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
