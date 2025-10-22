import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Map, 
  Route, 
  Shield, 
  TrendingUp, 
  Bell, 
  Heart,
  Users,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Interactive Safety Maps",
    description: "Explore destinations with color-coded crime data overlays and real-time security information.",
  },
  {
    icon: Route,
    title: "Safe Route Planning",
    description: "Get optimized routes that prioritize your safety while considering distance and time.",
  },
  {
    icon: Shield,
    title: "Security Ratings",
    description: "Every location is rated based on comprehensive crime statistics and local safety data.",
  },
  {
    icon: TrendingUp,
    title: "Safety Trends",
    description: "View historical crime patterns and seasonal safety variations for better planning.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Receive notifications about safety concerns and incidents in your planned destinations.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark safe locations and create your personal list of trusted destinations.",
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Benefit from verified traveler reviews and local safety tips from our community.",
  },
  {
    icon: Clock,
    title: "24/7 Updates",
    description: "Access continuously updated safety data from trusted sources around the clock.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="heading-features">
            Everything You Need to Travel Safely
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and data to help you make informed decisions about your travel destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={idx} 
                className="hover-elevate"
                data-testid={`card-feature-${idx}`}
              >
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
