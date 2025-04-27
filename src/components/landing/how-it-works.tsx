
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    number: 1,
    title: "Create an Account",
    description: "Sign up for free and get instant access to multiple AI models",
  },
  {
    number: 2,
    title: "Start a Conversation",
    description: "Choose your preferred AI assistant and begin chatting right away",
  },
  {
    number: 3,
    title: "Switch Models Anytime",
    description: "Easily switch between different AI models during your conversation",
  },
  {
    number: 4,
    title: "Save Your Chats",
    description: "All your conversations are automatically saved for future reference",
  },
];

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
  inView: boolean;
  delay: number;
}

function StepCard({ number, title, description, isActive = false, inView, delay }: StepCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border transition-all duration-500 ease-out hover:shadow-md",
        isActive ? "border-primary bg-primary/5" : "border-border",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold transition-all duration-300",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {number}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 px-4 bg-secondary/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <div className={cn(
          "text-center mb-12 transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h2 className="text-3xl font-bold mb-4">How MultiAI Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with MultiAI is simple and straightforward. Follow these steps to access 
            multiple AI assistants through our unified interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              isActive={index === 1}
              inView={inView}
              delay={index}
            />
          ))}
        </div>
        
        <div className={cn(
          "mt-16 p-8 rounded-2xl glass-morphism transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
        style={{ transitionDelay: "600ms" }}>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users already chatting with their favorite AI models.
            </p>
            <button className="gradient-btn px-8 py-3 hover-lift">
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
