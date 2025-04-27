
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'signup';
  className?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'login', className }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md p-0 overflow-hidden glass-morphism", className)}>
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center pt-8 pb-2">
            <div className="mb-2">
              <img 
                src="/images/multi-ai.png" 
                alt="MultiAI Logo" 
                className="w-16 h-16 mx-auto" 
              />
            </div>
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your information to create an account'}
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {mode === 'login' ? (
              <LoginForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
            ) : (
              <SignupForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
