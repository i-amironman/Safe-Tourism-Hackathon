import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const handleGetStarted = () => {
    console.log("Get started clicked");
  };

  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-cta">
          Ready to Travel Safer?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of travelers who plan their trips with confidence using real-time safety data and intelligent route optimization.
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-lg px-8"
          onClick={handleGetStarted}
          data-testid="button-cta-get-started"
        >
          Get Started for Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
