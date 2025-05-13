import React, { useState } from "react";
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
import {
  LogOut,
  Settings,
  User as UserIcon,
  Home,
  Menu,
  Search,
  Bell,
  Calendar,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);

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
    <nav className="w-full border-b bg-white dark:bg-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-herhealth-pink to-herhealth-pink-dark flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <span className="text-xl font-semibold text-herhealth-pink-dark">HerHealth</span>
            </Link>
            
            <div className="hidden lg:block ml-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {mainNavItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link to={item.href}>
                        <NavigationMenuLink 
                          className={cn(
                            navigationMenuTriggerStyle(),
                            isActive(item.href) 
                              ? "bg-herhealth-pink-light/20 text-herhealth-pink-dark"
                              : ""
                          )}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-herhealth-pink-light/20"
            >
              <Search className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Search</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-herhealth-pink-light/20 relative"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-herhealth-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            
            <div className="ml-4 flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 flex items-center justify-center p-0 transition-all hover:scale-105">
                    <Avatar className="h-8 w-8 border-2 border-herhealth-pink-light">
                      <AvatarImage src="/placeholder.svg" alt={user?.name} />
                      <AvatarFallback className="bg-herhealth-pink-light text-herhealth-pink-dark">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium leading-none">{user?.name}</span>
                      <span className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-herhealth-pink">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-herhealth-pink to-herhealth-pink-dark flex items-center justify-center text-white font-bold">
                      H
                    </div>
                    <span>HerHealth</span>
                  </SheetTitle>
                  <SheetDescription>
                    Your wellness journey companion
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-6">
                  {user && (
                    <div className="flex items-center gap-3 p-3 bg-herhealth-pink-light/20 rounded-lg mb-4">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage src="/placeholder.svg" alt={user?.name} />
                        <AvatarFallback className="bg-herhealth-pink text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium hover:bg-herhealth-pink-light/20",
                        isActive(item.href)
                          ? "bg-herhealth-pink-light/30 text-herhealth-pink-dark"
                          : "text-gray-600"
                      )}
                    >
                      {item.name === "Home" && <Home className="h-5 w-5" />}
                      {item.name === "Dashboard" && <Home className="h-5 w-5" />}
                      {item.name === "Cycle Tracker" && <Calendar className="h-5 w-5" />}
                      {item.name === "Wellness Hub" && <Home className="h-5 w-5" />}
                      {item.name === "AI Wellness" && <Home className="h-5 w-5" />}
                      {item.name === "Resources" && <Home className="h-5 w-5" />}
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium hover:bg-herhealth-pink-light/20 text-gray-600"
                    >
                      <UserIcon className="h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium hover:bg-herhealth-pink-light/20 text-gray-600"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                  </div>
                  
                  {user && (
                    <Button 
                      variant="outline" 
                      className="mt-4 border-herhealth-pink text-herhealth-pink-dark hover:bg-herhealth-pink-light/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
