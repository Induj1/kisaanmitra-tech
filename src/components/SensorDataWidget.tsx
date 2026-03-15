
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SensorData {
  n: number; // Nitrogen
  k: number; // Potassium
  p: number; // Phosphorus
  ph: number; // pH level
  timestamp?: string;
}

const SensorDataWidget = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock function to simulate fetching sensor data from API
  const fetchSensorData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to a real sensor system
      // For now, we'll simulate with random values
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const mockData: SensorData = {
        n: parseFloat((Math.random() * 100 + 50).toFixed(1)), // 50-150
        k: parseFloat((Math.random() * 200 + 100).toFixed(1)), // 100-300
        p: parseFloat((Math.random() * 80 + 20).toFixed(1)), // 20-100
        ph: parseFloat((Math.random() * (8.5 - 5.5) + 5.5).toFixed(1)), // 5.5-8.5
        timestamp: new Date().toISOString()
      };
      
      setSensorData(mockData);
      toast({
        title: "Data Refreshed",
        description: "Latest soil sensor data has been loaded",
      });
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      toast({
        title: "Error Fetching Data",
        description: "Could not retrieve sensor data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLevelIndicator = (value: number, type: string) => {
    let level: string;
    let color: string;
    
    switch(type) {
      case 'n':
        level = value < 70 ? 'Low' : value > 120 ? 'High' : 'Optimal';
        color = value < 70 ? 'text-orange-500' : value > 120 ? 'text-blue-500' : 'text-green-500';
        break;
      case 'k':
        level = value < 150 ? 'Low' : value > 250 ? 'High' : 'Optimal';
        color = value < 150 ? 'text-orange-500' : value > 250 ? 'text-blue-500' : 'text-green-500';
        break;
      case 'p':
        level = value < 40 ? 'Low' : value > 80 ? 'High' : 'Optimal';
        color = value < 40 ? 'text-orange-500' : value > 80 ? 'text-blue-500' : 'text-green-500';
        break;
      case 'ph':
        level = value < 6.5 ? 'Acidic' : value > 7.5 ? 'Alkaline' : 'Neutral';
        color = value < 6.5 ? 'text-orange-500' : value > 7.5 ? 'text-blue-500' : 'text-green-500';
        break;
      default:
        level = 'Unknown';
        color = 'text-gray-500';
    }
    
    return <span className={color + " font-medium"}>{level}</span>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          Soil Sensor Data
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchSensorData} 
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Fetching...' : 'Refresh'}
          </Button>
        </CardTitle>
        <CardDescription>
          Latest readings from your field sensors
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {sensorData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Nitrogen (N)</div>
              <div className="text-2xl font-bold">{sensorData.n} ppm</div>
              <div className="text-sm">Status: {getLevelIndicator(sensorData.n, 'n')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Potassium (K)</div>
              <div className="text-2xl font-bold">{sensorData.k} ppm</div>
              <div className="text-sm">Status: {getLevelIndicator(sensorData.k, 'k')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Phosphorus (P)</div>
              <div className="text-2xl font-bold">{sensorData.p} ppm</div>
              <div className="text-sm">Status: {getLevelIndicator(sensorData.p, 'p')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">pH Level</div>
              <div className="text-2xl font-bold">{sensorData.ph}</div>
              <div className="text-sm">Status: {getLevelIndicator(sensorData.ph, 'ph')}</div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No sensor data available</p>
            <p className="text-sm mt-2">Click refresh to fetch latest readings</p>
          </div>
        )}
      </CardContent>
      
      {sensorData && sensorData.timestamp && (
        <CardFooter className="pt-0">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(sensorData.timestamp).toLocaleString()}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default SensorDataWidget;
