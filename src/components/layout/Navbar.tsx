
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Activity, 
  Brain, 
  Heart, 
  Baby, 
  ThermometerSnowflake, 
  LogOut, 
  Bell, 
  BookOpen,
  MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClass = (path: string) => {
    return `px-3 py-2 rounded-md text-sm font-medium ${
      isActiveRoute(path) 
        ? "bg-herhealth-pink-light text-herhealth-pink-dark" 
        : "hover:bg-herhealth-pink-light/50 transition-colors"
    }`;
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-herhealth-pink-dark">Her</span>
              <span className="text-2xl font-bold text-herhealth-green-dark">Health</span>
            </Link>
          </div>
          
          {user ? (
            <>
              {/* Desktop navigation */}
              <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/cycle" className={linkClass("/cycle")}>
                  Cycle Tracker
                </Link>
                <Link to="/wellness" className={linkClass("/wellness")}>
                  Wellness Hub
                </Link>
                <Link to="/mental-health" className={linkClass("/mental-health")}>
                  Mental Health
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={linkClass("")}>
                      More
                      <span className="ml-1">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/pregnancy" className="flex items-center w-full">
                        <Baby className="mr-2 h-4 w-4" />
                        Pregnancy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/menopause" className="flex items-center w-full">
                        <ThermometerSnowflake className="mr-2 h-4 w-4" />
                        Menopause
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/resources" className="flex items-center w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Resources
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/ai-health-chat" className="flex items-center w-full">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        AI Health Chat
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/notifications" className={`relative ${linkClass("/notifications")}`}>
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-herhealth-pink-dark text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
                </Link>
                
                <div className="relative ml-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-1 h-9 w-9">
                        <Avatar>
                          <AvatarImage src={user?.photoURL || "https://img.icons8.com/?size=100&id=A2cvMrJpftoK&format=png&color=000000"} alt="Profile" />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center cursor-pointer w-full">
                          <User className="mr-2 h-4 w-4" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden space-x-2">
                <Link to="/notifications" className={`relative p-2 rounded-md ${isActiveRoute("/notifications") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : ""}`}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-herhealth-pink-dark text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-1 h-9 w-9">
                      <Avatar>
                        <AvatarImage src={user?.photoURL || "https://img.icons8.com/?size=100&id=A2cvMrJpftoK&format=png&color=000000"} alt="Profile" />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <button
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-herhealth-pink-dark hover:bg-herhealth-pink-light">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-herhealth-pink-dark hover:bg-herhealth-pink text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {user && isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/dashboard") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <User className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/cycle"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/cycle") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <Calendar className="h-5 w-5" />
              Cycle Tracker
            </Link>
            <Link
              to="/wellness"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/wellness") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <Activity className="h-5 w-5" />
              Wellness Hub
            </Link>
            <Link
              to="/mental-health"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/mental-health") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <Brain className="h-5 w-5" />
              Mental Health
            </Link>
            <Link
              to="/pregnancy"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/pregnancy") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <Baby className="h-5 w-5" />
              Pregnancy
            </Link>
            <Link
              to="/menopause"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/menopause") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <ThermometerSnowflake className="h-5 w-5" />
              Menopause
            </Link>
            <Link
              to="/resources"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/resources") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <BookOpen className="h-5 w-5" />
              Resources
            </Link>
            <Link
              to="/ai-health-chat"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveRoute("/ai-health-chat") ? "bg-herhealth-pink-light text-herhealth-pink-dark" : "hover:bg-herhealth-pink-light/50"} flex items-center gap-3`}
            >
              <MessageCircle className="h-5 w-5" />
              AI Health Chat
            </Link>
            <button
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-herhealth-pink-light/50 flex items-center gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
