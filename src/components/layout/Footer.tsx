
import { Link } from "react-router-dom";
import { Heart, Instagram, Twitter, Facebook, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter",
    });
    setEmail("");
  };
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="col-span-1 md:col-span-4">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-herhealth-pink-dark">Her</span>
              <span className="text-xl font-bold text-herhealth-green-dark">Health</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Empowering women through personalized health insights and cycle tracking.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <a href="https://instagram.com/herhealthapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-4 w-4 text-gray-600 hover:text-herhealth-pink-dark" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <a href="https://twitter.com/herhealthapp" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4 text-gray-600 hover:text-herhealth-pink-dark" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <a href="https://facebook.com/herhealthapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-4 w-4 text-gray-600 hover:text-herhealth-pink-dark" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <a href="mailto:contact@herhealth.app" target="_blank" rel="noopener noreferrer" aria-label="Email">
                  <Mail className="h-4 w-4 text-gray-600 hover:text-herhealth-pink-dark" />
                </a>
              </Button>
            </div>
            
            <form onSubmit={handleSubscribe} className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h3>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" className="bg-herhealth-pink-dark hover:bg-herhealth-pink text-white">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/cycle" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Cycle Tracking
                </Link>
              </li>
              <li>
                <Link to="/wellness" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Wellness Hub
                </Link>
              </li>
              <li>
                <Link to="/mental-health" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Mental Health
                </Link>
              </li>
              <li>
                <Link to="/ai-health-chat" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  AI Health Assistant
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Life Stages</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/pregnancy" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Pregnancy
                </Link>
              </li>
              <li>
                <Link to="/menopause" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Menopause
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <a href="https://womenshealth.gov" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Women's Health Resources
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://help.herhealth.app/faq" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <Link to="/support" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="https://community.herhealth.app" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-sm text-gray-600 hover:text-herhealth-pink-dark transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-sm text-gray-600 flex items-center">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-herhealth-pink-dark" />
            <span>for women's wellness</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {currentYear} HerHealth. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
