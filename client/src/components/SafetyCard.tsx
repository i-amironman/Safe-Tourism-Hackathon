import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type SafetyLevel = "safe" | "moderate" | "caution";

interface SafetyCardProps {
  location: string;
  safetyLevel: SafetyLevel;
  crimeRate: number;
  description: string;
  lastUpdated: string;
}

const safetyConfig = {
  safe: {
    icon: CheckCircle,
    badge: "success",
    color: "text-success",
    label: "Safe",
  },
  moderate: {
    icon: AlertCircle,
    badge: "warning",
    color: "text-warning",
    label: "Moderate Risk",
  },
  caution: {
    icon: AlertTriangle,
    badge: "destructive",
    color: "text-destructive",
    label: "Use Caution",
  },
} as const;

export function SafetyCard({ location, safetyLevel, crimeRate, description, lastUpdated }: SafetyCardProps) {
  const config = safetyConfig[safetyLevel];
  const Icon = config.icon;

  return (
    <Card className="hover-elevate" data-testid={`card-safety-${location.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg" data-testid="text-location">{location}</CardTitle>
          <CardDescription className="text-xs mt-1">Updated {lastUpdated}</CardDescription>
        </div>
        <Badge variant={config.badge as any} data-testid="badge-safety-level">
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-muted-foreground">Crime Rate</span>
              <span className={`text-2xl font-bold ${config.color}`} data-testid="text-crime-rate">
                {crimeRate}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  safetyLevel === "safe" ? "bg-success" : 
                  safetyLevel === "moderate" ? "bg-warning" : "bg-destructive"
                }`}
                style={{ width: `${Math.min(crimeRate, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
