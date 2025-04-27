
import { useState, useEffect } from "react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };

  const handleSuccessfulAuth = () => {
    navigate("/chat");
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5
      }
    }
  };
  
  const floatingElements = [
    { top: "10%", left: "5%", size: "80px", color: "lavender-300/20", delay: 0 },
    { top: "20%", right: "10%", size: "120px", color: "teal-300/20", delay: 2 },
    { top: "70%", left: "15%", size: "100px", color: "gold-300/20", delay: 1.5 },
    { top: "60%", right: "15%", size: "70px", color: "wine-600/20", delay: 1 }
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-32 px-4">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent z-0" />
  
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 lg:left-40 w-20 h-20 rounded-full bg-lavender-300/20 animate-float [animation-delay:1s] z-0" />
      <div className="absolute top-40 right-10 lg:right-60 w-32 h-32 rounded-full bg-teal-300/20 animate-float [animation-delay:2s] z-0" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gold-300/20 animate-float z-0" />
      
      {/* Floating Elements */}
      {floatingElements.map((el, index) => (
        <motion.div 
          key={index}
          className={`absolute w-${el.size} h-${el.size} rounded-full bg-${el.color} z-0`}
          style={{ 
            top: el.top, 
            left: el.left, 
            right: el.right,
            width: el.size,
            height: el.size
          }}
          initial={{ y: 0 }}
          animate={{ y: [-15, 15, -15] }}
          transition={{ 
            repeat: Infinity, 
            duration: 6, 
            ease: "easeInOut",
            delay: el.delay
          }}
        />
      ))}
      
      <motion.div 
        className="container relative z-10 mx-auto max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div 
            className="flex items-center mb-6"
            variants={itemVariants}
          >
            <motion.img 
              src="/images/multi-ai.png" 
              alt="MultiAI Logo" 
              className="h-16 w-16"
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            />
            <motion.h1 
              className="text-4xl md:text-6xl font-bold ml-3"
              variants={itemVariants}
            >
              Multi<span className="text-primary">AI</span>
            </motion.h1>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold leading-tight mb-6"
            variants={itemVariants}
          >
            All Your Favorite{" "}
            <span className="bg-clip-text text-transparent bg-gradient-wine-gold">
              AI Assistants
            </span>{" "}
            in One Place
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
            variants={itemVariants}
          >
            Chat with multiple AI models through a single, elegant interface. Compare responses, 
            leverage unique capabilities, and find the perfect AI assistant for every task.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-6"
            variants={itemVariants}
          >
            <ShimmerButton 
              onClick={handleGetStartedClick}
              className="rounded-full px-8 py-3 text-base md:text-lg font-medium"
              background="linear-gradient(135deg, #8E2140 0%, #B03054 100%)"
            >
              Get Started Free
            </ShimmerButton>
            
            <button 
              onClick={handleLoginClick}
              className="px-8 py-3 text-base md:text-lg font-medium border border-input rounded-full hover:bg-accent hover:text-accent-foreground transition-colors hover-lift"
            >
              Login
            </button>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            variants={itemVariants}
          >
            No credit card required. Free to get started.
          </motion.p>
        </div>
      </motion.div>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleSuccessfulAuth}
        defaultMode={authMode}
      />
    </section>
  );
}
