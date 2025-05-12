import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Filter, Clock, ArrowRight, Heart, Brain, Baby, ThermometerSnowflake, Activity, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchArticles } from "@/services/apiService";

interface ResourceArticle {
  id: string;
  title: string;
  description: string;
  category: "menopause" | "mentalhealth" | "pregnancy" | "general" | "wellness";
  readTime: number;
  imageSrc: string;
  url?: string;
  featured?: boolean;
}

// Default articles data
const defaultArticles: ResourceArticle[] = [
  {
    id: "1",
    title: "Understanding Perimenopause: Early Signs and Symptoms",
    description: "Learn about the early warning signs of perimenopause and how to manage the transition.",
    category: "menopause",
    readTime: 8,
    imageSrc: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.mayoclinic.org/diseases-conditions/perimenopause/symptoms-causes/syc-20354666",
    featured: true
  },
  {
    id: "2",
    title: "The Connection Between Hormones and Mental Health",
    description: "Explore how hormonal changes throughout your life can impact your mental wellbeing.",
    category: "mentalhealth",
    readTime: 12,
    imageSrc: "https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.womenshealth.gov/mental-health/mental-health-conditions/depression"
  },
  {
    id: "3",
    title: "Nutrition During Pregnancy: Trimester by Trimester",
    description: "A comprehensive guide to nutrition needs during each stage of pregnancy.",
    category: "pregnancy",
    readTime: 15,
    imageSrc: "https://images.unsplash.com/photo-1595924736292-f0e1c3d2a8cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy"
  },
  {
    id: "4",
    title: "Hot Flash Management Strategies That Actually Work",
    description: "Evidence-based approaches to managing hot flashes during menopause.",
    category: "menopause",
    readTime: 7,
    imageSrc: "https://images.unsplash.com/photo-1559662780-c3bab6f7e00b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.menopause.org/for-women/menopauseflashes/menopause-symptoms-and-treatments/managing-hot-flashes"
  },
  {
    id: "5",
    title: "Building a Sustainable Self-Care Routine",
    description: "How to create and maintain a self-care practice that fits your lifestyle.",
    category: "wellness",
    readTime: 5,
    imageSrc: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.nih.gov/health-information/emotional-wellness-toolkit",
    featured: true
  },
  {
    id: "6",
    title: "Understanding Your Menstrual Cycle's Four Phases",
    description: "A detailed look at each phase of your cycle and how it affects your body and mind.",
    category: "general",
    readTime: 10,
    imageSrc: "https://images.unsplash.com/photo-1584805646889-c9ba8e3ebc23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.womenshealth.gov/menstrual-cycle/your-menstrual-cycle"
  },
  {
    id: "7",
    title: "Hormone Replacement Therapy: Benefits and Risks",
    description: "The latest research on HRT to help you make an informed decision with your healthcare provider.",
    category: "menopause",
    readTime: 14,
    imageSrc: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.nia.nih.gov/health/hormone-replacement-therapy-menopause-symptoms-risks"
  },
  {
    id: "8",
    title: "Mindfulness Practices for Anxiety Relief",
    description: "Simple mindfulness techniques you can practice daily to reduce anxiety.",
    category: "mentalhealth",
    readTime: 6,
    imageSrc: "https://images.unsplash.com/photo-1592554379916-8e6bf5f17aa3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    url: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"
  }
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<ResourceArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add AI-powered wellness resources to the default articles
  const aiWellnessResources: ResourceArticle[] = [
    {
      id: "ai-wellness-1",
      title: "AI-Powered Nutrition: Personalized Meal Plans for Your Cycle",
      description: "Learn how our Gemini AI technology creates custom meal suggestions based on your cycle phase and dietary preferences.",
      category: "wellness",
      readTime: 7,
      imageSrc: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1180&auto=format&fit=crop",
      url: "/ai-wellness",
      featured: true
    },
    {
      id: "ai-wellness-2",
      title: "Sleep Better with AI: Cycle-Optimized Rest Strategies",
      description: "Discover how our AI assistant analyzes your cycle data to provide personalized sleep recommendations for better rest.",
      category: "wellness",
      readTime: 5,
      imageSrc: "https://images.unsplash.com/photo-1455642305367-68834a9e7cb9?q=80&w=1169&auto=format&fit=crop",
      url: "/ai-wellness"
    },
    {
      id: "ai-wellness-3",
      title: "AI Workout Recommendations: Exercise Based on Your Hormones",
      description: "Maximize your fitness results with AI-powered workout suggestions tailored to your hormonal fluctuations throughout your cycle.",
      category: "wellness",
      readTime: 8,
      imageSrc: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1170&auto=format&fit=crop",
      url: "/ai-wellness"
    }
  ];
  
  // Add the AI wellness resources to the default articles
  const allDefaultArticles = [...defaultArticles, ...aiWellnessResources];
  
  useEffect(() => {
    // Load articles from API or use mock data
    const loadArticles = async () => {
      try {
        setLoading(true);
        // Try to fetch articles from API
        const apiArticles = await fetchArticles(activeCategory !== "all" ? activeCategory : undefined);
        
        // If we got articles from API, use them
        if (apiArticles && apiArticles.length > 0) {
          const formattedArticles: ResourceArticle[] = apiArticles.map(article => ({
            id: article.id,
            title: article.title,
            description: article.summary,
            category: article.category === "mental" ? "mentalhealth" : 
                     article.category === "pregnancy" || article.category === "menopause" ? article.category : "wellness",
            readTime: Math.floor(article.content.length / 1000) + 5, // Estimate read time based on content length
            imageSrc: article.imageUrl || "/placeholder.svg",
            featured: false
          }));
          
          // Mark a few as featured
          if (formattedArticles.length > 0) {
            formattedArticles[0].featured = true;
          }
          if (formattedArticles.length > 3) {
            formattedArticles[3].featured = true;
          }
          
          setArticles(formattedArticles);
        } else {
          // Fall back to default mock data with AI resources
          setArticles(allDefaultArticles);
        }
      } catch (error) {
        console.error("Error loading articles:", error);
        toast({
          title: "Error loading resources",
          description: "Failed to load resource articles. Using default content.",
          variant: "destructive"
        });
        setArticles(allDefaultArticles);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
  }, [activeCategory, toast]);
  
  const filterArticles = () => {
    return articles.filter(article => {
      // Filter by search query
      const matchesQuery = searchQuery === "" || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = activeCategory === "all" || article.category === activeCategory;
      
      return matchesQuery && matchesCategory;
    });
  };
  
  const featuredArticles = articles.filter(article => article.featured);
  const filteredArticles = filterArticles();
  
  const handleArticleClick = (article: ResourceArticle) => {
    if (article.url) {
      window.open(article.url, '_blank');
    } else {
      toast({
        title: "Content coming soon",
        description: "This article will be available soon. Please check back later.",
      });
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "menopause":
        return <ThermometerSnowflake className="h-4 w-4" />;
      case "mentalhealth":
        return <Brain className="h-4 w-4" />;
      case "pregnancy":
        return <Baby className="h-4 w-4" />;
      case "wellness":
        return <Activity className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  // Update the getRelatedCategories function to include AI topics
  const getRelatedCategories = () => {
    switch (activeCategory) {
      case "menopause":
        return ["Menopause Symptoms", "HRT", "Post-menopause", "Perimenopause"];
      case "mentalhealth":
        return ["Anxiety", "Depression", "Stress Management", "Self-Care"];
      case "pregnancy":
        return ["First Trimester", "Nutrition", "Exercise", "Postpartum"];
      case "wellness":
        return ["AI Nutrition", "Sleep Optimization", "AI Workouts", "Mindfulness"];
      default:
        return ["Popular Topics", "AI Wellness", "Latest Articles", "Editor's Choice"];
    }
  };

  return (
    <AppLayout>
      <div className="py-8 bg-gradient-to-b from-herhealth-pink-light/30 to-white animate-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <BookOpen className="mr-2" />
              Health Resources
            </h1>
            <p className="text-gray-600">Evidence-based articles and resources for every stage of your health journey</p>
          </div>
          
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Featured Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow hover-scale cursor-pointer" onClick={() => handleArticleClick(article)}>
                    <div className="bg-gray-100 h-48">
                      <img 
                        src={article.imageSrc} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        {getCategoryIcon(article.category)}
                        <span className="ml-1 capitalize">{article.category}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4" />
                        <span className="ml-1">{article.readTime} min read</span>
                      </div>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="text-herhealth-pink-dark hover:text-herhealth-pink flex items-center">
                        Read Article
                        {article.url ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500" size={18} />
                <span className="text-sm font-medium">Filter:</span>
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="menopause">Menopause</TabsTrigger>
                    <TabsTrigger value="mentalhealth">Mental Health</TabsTrigger>
                    <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
                    <TabsTrigger value="wellness">Wellness</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Related Topics */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {getRelatedCategories().map((category, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="bg-white hover:bg-herhealth-pink-light/20"
                  onClick={() => setSearchQuery(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="hover:shadow-md transition-shadow hover-scale cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      {getCategoryIcon(article.category)}
                      <span className="ml-1 capitalize">{article.category}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4" />
                      <span className="ml-1">{article.readTime} min read</span>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {article.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-herhealth-pink-dark hover:text-herhealth-pink flex items-center p-0">
                      Read More
                      {article.url ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { 
                    setSearchQuery(''); 
                    setActiveCategory('all'); 
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-12 bg-herhealth-pink-light/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
            <p className="mb-4">Subscribe to our newsletter for the latest women's health insights and resources</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input placeholder="Your email address" type="email" className="flex-grow" />
              <Button className="bg-herhealth-pink-dark hover:bg-herhealth-pink text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Helper component for displaying no results
const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Search size={48} strokeWidth={1.5} className="opacity-50" />
    </div>
  );
};

export default ResourcesPage;
