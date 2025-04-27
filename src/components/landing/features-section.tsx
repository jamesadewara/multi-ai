
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const features = [
  {
    title: "Multiple AI Models",
    description: "Access ChatGPT, Claude, DeepSeek, and more through one unified interface",
    icon: "💬",
  },
  {
    title: "Seamless Conversations",
    description: "Switch between AI models while maintaining your conversation context",
    icon: "🔄",
  },
  {
    title: "Beautiful Interface",
    description: "Enjoy a modern, responsive design with dark mode support and elegant animations",
    icon: "✨",
  },
  {
    title: "No API Keys Needed",
    description: "Everything works out of the box with our simulated AI responses",
    icon: "🔑",
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
  inView: boolean;
  delay: number;
}

function FeatureCard({ title, description, icon, className, inView, delay }: FeatureCardProps) {
  return (
    <div className={cn(
      "rounded-2xl p-6 glass-morphism transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1",
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      className
    )}
    style={{
      transitionDelay: `${delay * 150}ms`
    }}>
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 px-4 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 animate-pulse opacity-60" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-wine-600/5 animate-pulse opacity-50" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl font-bold mb-4 transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            All Your Favorite AIs in One Place
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: "100ms" }}>
            MultiAI brings together the best AI models in one intuitive interface, 
            letting you leverage the unique strengths of each assistant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              inView={inView}
              delay={index}
            />
          ))}
        </div>
        
        <div className={cn(
          "mt-16 bg-secondary/50 rounded-2xl p-8 transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
        style={{ transitionDelay: "600ms" }}>
          <h3 className="text-2xl font-bold mb-6 text-center">Supported AI Models</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {name: "ChatGPT", provider: "OpenAI"},
              {name: "Claude", provider: "Anthropic"},
              {name: "DeepSeek", provider: "DeepSeek"},
              {name: "Mistral", provider: "Mistral AI"},
            ].map((model, index) => (
              <div key={index} className={cn(
                "flex items-center gap-2 p-4 transition-all duration-500 ease-out hover:bg-background/50 rounded-lg hover-scale",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${700 + index * 100}ms` }}>
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
