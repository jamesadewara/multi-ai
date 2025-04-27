
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children: React.ReactNode;
  className?: string;
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.2)",
      shimmerSize = "50%",
      borderRadius = "1rem",
      shimmerDuration = "1s",
      background = "linear-gradient(135deg, #8E2140 0%, #B03054 100%)",
      children,
      className,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const updateMousePosition = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };

    return (
      <button
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          if (buttonRef) buttonRef.current = node;
        }}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:translate-y-[-2px] active:translate-y-[1px]",
          "flex items-center justify-center",
          "shadow-[0_4px_14px_0_rgba(142,33,64,0.39)]",
          "hover:shadow-[0_6px_20px_rgba(142,33,64,0.23)]",
          "px-6 py-3 font-medium text-white",
          className
        )}
        style={{
          background: background as string,
          borderRadius: borderRadius as string,
        }}
        onMouseMove={updateMousePosition}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        {isHovering && (
          <span
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${shimmerColor}, transparent 50%)`,
              pointerEvents: 'none',
            }}
          />
        )}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
