import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trash2, Edit } from "lucide-react";
import { useState } from "react";

interface TripPlanningCardProps {
  id: string;
  title: string;
  destinations: string[];
  startDate?: string;
  endDate?: string;
  safetyRating: number;
}

export function TripPlanningCard({ 
  id, 
  title, 
  destinations, 
  startDate, 
  endDate, 
  safetyRating 
}: TripPlanningCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    console.log("Deleting trip:", id);
    setTimeout(() => setIsDeleting(false), 1000);
  };

  const handleEdit = () => {
    console.log("Editing trip:", id);
  };

  const getSafetyBadge = (rating: number) => {
    if (rating >= 80) return { variant: "success" as const, label: "Safe" };
    if (rating >= 50) return { variant: "warning" as const, label: "Moderate" };
    return { variant: "destructive" as const, label: "Caution" };
  };

  const safety = getSafetyBadge(safetyRating);

  return (
    <Card className="hover-elevate" data-testid={`card-trip-${id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl" data-testid="text-trip-title">{title}</CardTitle>
          <Badge variant={safety.variant} data-testid="badge-trip-safety">
            {safety.label} {safetyRating}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span data-testid="text-destinations-count">{destinations.length} destinations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {destinations.slice(0, 3).map((dest, idx) => (
              <Badge key={idx} variant="outline" data-testid={`badge-destination-${idx}`}>
                {dest}
              </Badge>
            ))}
            {destinations.length > 3 && (
              <Badge variant="outline">+{destinations.length - 3} more</Badge>
            )}
          </div>
        </div>
        {(startDate || endDate) && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span data-testid="text-trip-dates">
              {startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleEdit}
          data-testid="button-edit-trip"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          data-testid="button-delete-trip"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
