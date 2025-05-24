
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User as UserIcon, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mainNavItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Cycle Tracker", href: "/cycle-tracker" },
    { name: "Wellness Hub", href: "/wellness-hub" },
    { name: "AI Wellness", href: "/ai-wellness" },
    { name: "Resources", href: "/resources" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-herhealth-pink-dark hover:text-herhealth-pink transition-colors duration-200"
            >
              HerHealth
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 max-w-3xl mx-8">
            <div className="flex items-center justify-center space-x-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-herhealth-pink-light/50 hover:text-herhealth-pink-dark ${
                    isActive(item.href)
                      ? "bg-herhealth-pink-light text-herhealth-pink-dark shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-herhealth-pink-dark rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative rounded-full h-10 w-10 p-0 hover:bg-herhealth-pink-light/50 transition-colors duration-200"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-herhealth-pink-light ring-offset-2">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback className="bg-herhealth-pink text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg" 
                align="end" 
                forceMount
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500">{user?.email || 'user@example.com'}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200/50" />
                <DropdownMenuItem asChild className="hover:bg-herhealth-pink-light/30 transition-colors">
                  <Link to="/profile" className="flex items-center p-3 cursor-pointer">
                    <UserIcon className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-herhealth-pink-light/30 transition-colors">
                  <Link to="/settings" className="flex items-center p-3 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200/50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-50 text-red-600 transition-colors p-3 cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="p-2 rounded-lg hover:bg-herhealth-pink-light/50 transition-colors duration-200"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-white/95 backdrop-blur-sm border-l border-gray-200/50"
              >
                <SheetHeader className="text-left pb-6 border-b border-gray-200/50">
                  <SheetTitle className="text-xl font-bold text-herhealth-pink-dark">
                    HerHealth
                  </SheetTitle>
                  <SheetDescription className="text-gray-600">
                    Navigate through your wellness journey
                  </SheetDescription>
                </SheetHeader>
                
                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-2 mt-6">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-herhealth-pink-light text-herhealth-pink-dark shadow-sm"
                          : "text-gray-600 hover:bg-herhealth-pink-light/30 hover:text-gray-900"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile User Section */}
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10 ring-2 ring-herhealth-pink-light">
                      <AvatarImage src="/placeholder.svg" alt={user?.name} />
                      <AvatarFallback className="bg-herhealth-pink text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-herhealth-pink-light/30 transition-colors"
                    >
                      <UserIcon className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-herhealth-pink-light/30 transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">Log out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};
