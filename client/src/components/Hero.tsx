import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Safe_urban_travel_hero_image_6104c3b6.png";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
          Travel with Confidence
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
          Explore the world safely with real-time crime data, intelligent route planning, and trusted safety insights
        </p>

        <div className="w-full max-w-2xl mb-12">
          <div className="flex gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-xl">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <Input
                type="search"
                placeholder="Search destinations, cities, or neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                data-testid="input-hero-search"
              />
            </div>
            <Button 
              size="lg" 
              className="rounded-full px-8"
              onClick={handleSearch}
              data-testid="button-hero-search"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="flex flex-col items-center text-white">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-3">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Real-Time Safety Data</h3>
            <p className="text-white/80 text-sm">Live crime statistics and security alerts</p>
          </div>
          <div className="flex flex-col items-center text-white">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-3">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Smart Route Planning</h3>
            <p className="text-white/80 text-sm">AI-powered safe route optimization</p>
          </div>
          <div className="flex flex-col items-center text-white">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-3">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Safety Trends</h3>
            <p className="text-white/80 text-sm">Historical analysis and predictions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
