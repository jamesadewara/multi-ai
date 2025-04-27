
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: NavLinkItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium hover:text-primary transition-colors px-1 py-2"
      >
        {label}
        <ChevronDown className={cn(
          "ml-1.5 h-4 w-4 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "absolute left-0 mt-2 w-48 rounded-md shadow-lg border border-border z-10",
        "transition-all duration-200 ease-in-out origin-top-left",
        isOpen 
          ? "opacity-100 scale-100 translate-y-0" 
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}>
        <div className="py-1 rounded-md bg-popover">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
