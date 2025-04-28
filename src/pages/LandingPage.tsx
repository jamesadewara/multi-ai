
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { NavDropdown } from "@/components/landing/nav-dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthModal } from "@/components/auth/auth-modal";

// Navigation configuration
const navigationItems = {
  resources: [
    { label: "Documentation", href: "#documentation" },
    { label: "API Reference", href: "#api" },
    { label: "Blog", href: "#blog" },
  ],
  community: [
    { label: "Forums", href: "#forums" },
    { label: "Discord", href: "#discord" },
    { label: "GitHub", href: "#github" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
  ],
  products: [
    { label: "MultiAI Chat", href: "#chat" },
    { label: "Enterprise Solutions", href: "#enterprise" },
    { label: "API Access", href: "#api-access" },
  ],
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    ref: headerRef,
    inView: headerInView,
    entry: headerEntry
  } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleSignup = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleSuccessfulAuth = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header
        ref={headerRef}
        className={cn(
          "pb-4 py-4 px-4 border-b sticky top-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent",
          headerInView && "animate-fade-in"
        )}
      >
        <div className="container pb-4 py-4 mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center animate-fade-in delay-200">
            <img
              src="/images/multi-ai.png"
              alt="MultiAI Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold ml-2">MultiAI</span>
          </div>

          {isMobile ? (
            <></>
          ) : (
            <nav className="hidden md:flex items-center space-x-6 animate-fade-in delay-400">
              <NavDropdown label="Resources" items={navigationItems.resources} />
              <NavDropdown label="Community" items={navigationItems.community} />
              <NavDropdown label="Company" items={navigationItems.company} />
              <NavDropdown label="Products" items={navigationItems.products} />
            </nav>
          )}

          <div className="flex items-center space-x-2 animate-fade-in delay-600">
            <ThemeToggle />
            <Button className="bg-gradient-wine hover-scale" onClick={handleSignup}>
              {isAuthenticated ? "Go to Chat" : "Sign Up Free"}
            </Button>
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <ScrollArea className="flex-1">
                    <nav className="flex flex-col mt-8 space-y-4">
                      <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                      </a>
                      <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                        How It Works
                      </a>
                      <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                        Pricing
                      </a>

                      {/* Mobile dropdown sections */}
                      {["resources", "community", "company", "products"].map((section) => (
                        <div key={section} className="space-y-2 pt-2">
                          <p className="text-sm font-medium text-muted-foreground capitalize">{section}</p>
                          {navigationItems[section as keyof typeof navigationItems].map(item => (
                            <a
                              key={item.href}
                              href={item.href}
                              className="block text-sm px-2 py-1 hover:text-primary"
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </nav>
                  </ScrollArea>
                </SheetContent>
              </Sheet>)
              : <></>}
          </div>
        </div>
      </header>


      <main className="flex-1">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
      </main>

      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleSuccessfulAuth}
        defaultMode={authMode}
      />
    </div>
  );
}
