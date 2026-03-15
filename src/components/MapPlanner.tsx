
import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus, Layers, CircleHelp, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LocationAccessPopup from './LocationAccessPopup';
import { supabase } from "@/integrations/supabase/client";

interface CropRecommendation {
  cropName: string;
  confidence: number;
  soilSuitability: string;
  waterRequirement: string;
  seasonalFit: string;
}

const MapPlanner: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [selectedArea, setSelectedArea] = useState<number>(2.5); // In hectares
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [zoom, setZoom] = useState(14);
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    soil: false,
    weather: false,
    boundaries: true
  });

  useEffect(() => {
    // Check if we already have location stored
    const storedLat = localStorage.getItem('userLatitude');
    const storedLng = localStorage.getItem('userLongitude');

    if (storedLat && storedLng) {
      setUserLocation({
        lat: parseFloat(storedLat),
        lng: parseFloat(storedLng)
      });
    } else {
      // Show location popup after a short delay
      setTimeout(() => {
        setLocationPopupOpen(true);
      }, 1000);
    }

    // Mock loading a map
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // When user location is available, get crop recommendations
    if (userLocation) {
      fetchCropRecommendations();
    }
  }, [userLocation]);

  const handleLocationGranted = (latitude: number, longitude: number) => {
    console.log("Fetching with coords:", latitude, longitude);
    setUserLocation({ lat: latitude, lng: longitude });
    setLocationPopupOpen(false);
  };

  const fetchCropRecommendations = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('crop-recommendations', {
        body: {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          area: selectedArea
        }
      });

      if (error) {
        throw error;
      }

      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: "Analysis Complete",
          description: "We've analyzed your location and found suitable crops for your area.",
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "We couldn't analyze your location. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const requestManualLocationAccess = () => {
    setLocationPopupOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden h-full">
        <CardHeader className="bg-primary/10 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 text-primary" size={20} />
                Farm Planner
              </CardTitle>
              <CardDescription>Interactive GIS-based planning tool</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white text-primary hover:bg-primary hover:text-white"
              onClick={requestManualLocationAccess}
            >
              <MapPin size={16} className="mr-1" /> Set Location
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[300px] relative bg-gray-200"
          >
            {!mapLoaded || isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-600">
                    {isLoading ? "Analyzing location data..." : "Loading map data..."}
                  </p>
                </div>
              </div>
            ) : null}
            
            {/* Pigeon Maps component */}
            {userLocation && (
              <Map
                height={300}
                center={[userLocation.lat, userLocation.lng]}
                zoom={zoom}
                onBoundsChanged={({ center, zoom }) => {
                  setUserLocation({ lat: center[0], lng: center[1] });
                  setZoom(zoom);
                }}
              >
                {/* Location marker */}
                <Marker
                  width={50}
                  anchor={[userLocation.lat, userLocation.lng]}
                  color="#10b981"
                />
                
                {/* Farm location label */}
                <Overlay anchor={[userLocation.lat, userLocation.lng]} offset={[0, -30]}>
                  <div className="px-2 py-1 bg-white rounded text-xs shadow-md border border-green-500">
                    Your Farm Location
                  </div>
                </Overlay>

                {/* Field boundaries overlay */}
                {activeLayers.boundaries && (
                  <>
                    <Overlay anchor={[userLocation.lat + 0.002, userLocation.lng - 0.002]} offset={[0, 0]}>
                      <div className="w-24 h-20 border-2 border-green-500 bg-green-500/20 rounded-md"></div>
                    </Overlay>
                    <Overlay anchor={[userLocation.lat - 0.001, userLocation.lng + 0.003]} offset={[0, 0]}>
                      <div className="w-20 h-16 border-2 border-yellow-500 bg-yellow-500/20 rounded-md"></div>
                    </Overlay>
                  </>
                )}
              </Map>
            )}

            {/* Map controls */}
            <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-white shadow-md hover:bg-gray-100"
                onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
              >
                <Plus size={16} />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-white shadow-md hover:bg-gray-100"
                onClick={() => setZoom(prev => Math.max(prev - 1, 3))}
              >
                <Minus size={16} />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className={`bg-white shadow-md hover:bg-gray-100 ${layersOpen ? 'bg-gray-200' : ''}`}
                onClick={() => setLayersOpen(!layersOpen)}
              >
                <Layers size={16} />
              </Button>
            </div>

            {/* Layers panel */}
            {layersOpen && (
              <div className="absolute top-2 right-14 bg-white shadow-md rounded-md p-2 border border-gray-200 w-40 z-10">
                <h4 className="text-xs font-medium mb-2">Map Layers</h4>
                <div className="space-y-1">
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={activeLayers.satellite} 
                      onChange={() => toggleLayer('satellite')}
                      className="mr-2"
                    />
                    Satellite Imagery
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={activeLayers.soil} 
                      onChange={() => toggleLayer('soil')}
                      className="mr-2"
                    />
                    Soil Health
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={activeLayers.weather} 
                      onChange={() => toggleLayer('weather')}
                      className="mr-2"
                    />
                    Weather Patterns
                  </label>
                  <label className="flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      checked={activeLayers.boundaries} 
                      onChange={() => toggleLayer('boundaries')}
                      className="mr-2"
                    />
                    Field Boundaries
                  </label>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col bg-gray-50 p-3">
          <div className="w-full flex justify-between items-center mb-2">
            <div className="text-xs text-gray-600">
              <p>Selected Area: <span className="font-semibold">{selectedArea} hectares</span></p>
              {recommendations.length > 0 && (
                <p>Recommended Crops: <span className="font-semibold">
                  {recommendations.map(rec => rec.cropName).join(', ')}
                </span></p>
              )}
            </div>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary-dark font-noto"
              onClick={fetchCropRecommendations}
              disabled={isLoading || !userLocation}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Location</>
              )}
            </Button>
          </div>
          
          {/* Crop recommendations detail */}
          {recommendations.length > 0 && (
            <div className="w-full bg-white rounded-md p-2 border border-gray-100 text-xs">
              <div className="font-medium mb-1">Top Recommendation: {recommendations[0].cropName}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>Confidence: <span className="text-green-600 font-medium">{recommendations[0].confidence}%</span></div>
                <div>Soil Suitability: <span className="font-medium">{recommendations[0].soilSuitability}</span></div>
                <div>Water Requirement: <span className="font-medium">{recommendations[0].waterRequirement}</span></div>
                <div>Seasonal Fit: <span className="font-medium">{recommendations[0].seasonalFit}</span></div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      <LocationAccessPopup
        open={locationPopupOpen}
        onOpenChange={setLocationPopupOpen}
        onLocationGranted={handleLocationGranted}
      />
    </>
  );
};

export default MapPlanner;
