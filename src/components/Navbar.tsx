import { useState } from "react";
import { Brain, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CogniQuest
          </span>
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>

          <Link to="/auth">
            <Button>Start Your Quest</Button>
          </Link>
        </div>

        {/* Hamburger button (Mobile only) */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 space-y-3 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Link 
            to="/auth" 
            className="block"
            onClick={() => setOpen(false)}
          >
            <Button variant="ghost" className="w-full">Sign In</Button>
          </Link>

          <Link 
            to="/auth" 
            className="block"
            onClick={() => setOpen(false)}
          >
            <Button className="w-full">Start Your Quest</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
