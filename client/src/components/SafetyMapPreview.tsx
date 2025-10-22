import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Layers, Navigation } from "lucide-react";
import { useState } from "react";

export function SafetyMapPreview() {
  const [activeLayer, setActiveLayer] = useState<"crime" | "routes" | "safety">("crime");

  const layers = [
    { id: "crime" as const, label: "Crime Data", icon: Map },
    { id: "routes" as const, label: "Safe Routes", icon: Navigation },
    { id: "safety" as const, label: "Safety Zones", icon: Layers },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" data-testid="heading-map-preview">
            Interactive Safety Maps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore detailed crime statistics and safety information with our interactive map interface
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">London Safety Overview</CardTitle>
                <CardDescription>Last updated: 2 hours ago</CardDescription>
              </div>
              <div className="flex gap-2">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <Button
                      key={layer.id}
                      variant={activeLayer === layer.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveLayer(layer.id)}
                      data-testid={`button-layer-${layer.id}`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {layer.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted/30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              
              <div className="relative z-10 text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Map className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {activeLayer === "crime" && "Crime Heat Map"}
                  {activeLayer === "routes" && "Safe Route Planning"}
                  {activeLayer === "safety" && "Safety Zone Analysis"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {activeLayer === "crime" && "View color-coded crime statistics across different neighborhoods and districts"}
                  {activeLayer === "routes" && "Plan your journey with routes optimized for safety and efficiency"}
                  {activeLayer === "safety" && "Identify safe areas and high-risk zones at a glance"}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge variant="success">Low Risk Areas</Badge>
                  <Badge variant="warning">Moderate Risk</Badge>
                  <Badge variant="destructive">High Alert Zones</Badge>
                </div>
              </div>

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Card className="p-3 shadow-lg">
                  <div className="text-xs text-muted-foreground mb-1">Overall Safety</div>
                  <div className="text-2xl font-bold text-success">8.2/10</div>
                </Card>
              </div>

              <div className="absolute bottom-4 right-4">
                <Button data-testid="button-explore-map">
                  Explore Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
