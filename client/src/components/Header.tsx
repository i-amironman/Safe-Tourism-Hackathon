import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MapPin, Menu } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2" data-testid="link-logo">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">SafeTravel</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-home">
              Home
            </a>
          </Link>
          <Link href="/map">
            <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-map">
              Safety Map
            </a>
          </Link>
          <Link href="/trips">
            <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-trips">
              My Trips
            </a>
          </Link>
          <Link href="/about">
            <a className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-about">
              About
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="hidden md:inline-flex" data-testid="button-get-started">
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/">
              <a className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </a>
            </Link>
            <Link href="/map">
              <a className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Safety Map
              </a>
            </Link>
            <Link href="/trips">
              <a className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                My Trips
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </a>
            </Link>
            <Button className="w-full" data-testid="button-mobile-get-started">
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
