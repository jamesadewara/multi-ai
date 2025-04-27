
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
  onToggleMode: () => void;
}

export function LoginForm({ onSuccess, onToggleMode }: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success("Login successful!");
        onSuccess?.();
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Failed to login. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="h-12"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="h-12"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="gradient-btn w-full h-12 mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <div className="text-center mt-4">
        <p className="text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={onToggleMode}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}
