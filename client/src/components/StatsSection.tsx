import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPinned, Shield, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Travelers",
    description: "Trust our platform",
  },
  {
    icon: MapPinned,
    value: "200+",
    label: "Cities Covered",
    description: "Worldwide coverage",
  },
  {
    icon: Shield,
    value: "1M+",
    label: "Safety Reports",
    description: "Real-time data points",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Satisfaction Rate",
    description: "From our users",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="text-center"
                data-testid={`stat-item-${idx}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary-foreground/10">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2" data-testid="stat-value">{stat.value}</div>
                <div className="text-lg font-semibold mb-1" data-testid="stat-label">{stat.label}</div>
                <div className="text-sm opacity-90" data-testid="stat-description">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
