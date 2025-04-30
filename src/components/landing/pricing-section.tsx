
import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popularFeature?: string;
  buttonText: string;
  highlighted?: boolean;
};

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with basic AI chat capabilities",
    features: [
      "Access to ChatGPT",
      "5 conversations per day",
      "Basic chat features",
      "Standard response time",
    ],
    buttonText: "Start for Free",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Everything in Free plus enhanced AI models",
    features: [
      "Access to all AI models",
      "Unlimited conversations",
      "Priority response time",
      "Chat history forever",
      "File uploads",
      "Advanced prompting tools",
    ],
    popularFeature: "Most Popular",
    buttonText: "Get Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    description: "Custom solutions for organizations",
    features: [
      "All Pro features",
      "Dedicated support",
      "Custom API integration",
      "Team collaboration",
      "SSO authentication",
      "Compliance & security",
    ],
    buttonText: "Contact Sales",
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="pricing" className="py-20 px-4 bg-background/40 overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 transform transition-all duration-700 ease-out" 
          style={{ 
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)" 
          }}>
          <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs. All plans include access to our AI models.
          </p>
          
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              className={cn(
                "px-4 py-2 rounded-full transition-colors",
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-full transition-colors relative",
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="absolute -top-3 -right-16 bg-green-500 text-white text-xs py-0.5 px-2 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {tiers.map((tier, i) => (
            <div key={tier.name}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col h-full border transition-all duration-500 ease-out transform hover:shadow-lg",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                tier.highlighted ? "border-primary/50 bg-primary/5 shadow-md" : "border-border bg-card",
              )}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {tier.popularFeature && (
                <div className="absolute -top-3 inset-x-0 text-center">
                  <span className="bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                    {tier.popularFeature}
                  </span>
                </div>
              )}
              
              <div className="mb-5">
                <h3 className="font-bold text-xl">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "Contact us" && (
                    <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={cn(
                  "mt-auto w-full", 
                  tier.highlighted 
                    ? "bg-gradient-wine hover:bg-gradient-wine-gold transition-all duration-300"
                    : "bg-secondary text-foreground hover:bg-secondary/90"
                )}
              >
                {tier.buttonText}
                {tier.highlighted && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
        
        <div 
          className="mt-16 text-center transform transition-all duration-700 ease-out" 
          style={{ 
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "600ms"
          }}
        >
          <p className="text-muted-foreground">
            All plans come with a 14-day money-back guarantee. No questions asked.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Button variant="outline" size="sm">Compare Plans</Button>
            <Button variant="link" size="sm">View FAQ</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
