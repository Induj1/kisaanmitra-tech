
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Wifi, Thermometer, Droplets, Wind, RefreshCw } from "lucide-react";

interface DeviceConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SensorReading {
  type: string;
  value: number;
  unit: string;
  timestamp: string;
}

const DeviceConnectionDialog = ({ open, onOpenChange }: DeviceConnectionDialogProps) => {
  const [connecting, setConnecting] = useState(false);
  const [fetchingData, setFetchingData] = useState<string | null>(null);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const { toast } = useToast();

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDeviceConnected(true);
      toast({
        title: "Device Connected",
        description: "Your sensor device has been successfully connected",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the sensor device. Please try again.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const fetchSensorData = async (sensorType: string) => {
    // Check if device is connected
    if (!deviceConnected) {
      toast({
        title: "Error",
        description: "Sensor device not connected. Please connect your device first.",
        variant: "destructive"
      });
      return;
    }
    
    setFetchingData(sensorType);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock data based on sensor type
      let newReading: SensorReading = {
        type: sensorType,
        value: 0,
        unit: '',
        timestamp: new Date().toISOString()
      };
      
      switch (sensorType) {
        case 'soil':
          newReading = {
            ...newReading,
            value: parseFloat((Math.random() * 100).toFixed(1)),
            unit: '%'
          };
          break;
        case 'temperature':
          newReading = {
            ...newReading,
            value: parseFloat((Math.random() * 15 + 20).toFixed(1)),
            unit: '°C'
          };
          break;
        case 'humidity':
          newReading = {
            ...newReading,
            value: parseFloat((Math.random() * 50 + 30).toFixed(1)),
            unit: '%'
          };
          break;
        case 'rainfall':
          newReading = {
            ...newReading,
            value: parseFloat((Math.random() * 30).toFixed(1)),
            unit: 'mm'
          };
          break;
      }
      
      setSensorReadings(prev => [newReading, ...prev.slice(0, 4)]);
      
      toast({
        title: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Data Retrieved`,
        description: `Latest ${sensorType} sensor data has been loaded`,
      });
    } catch (error) {
      toast({
        title: "Error Fetching Data",
        description: `Could not retrieve ${sensorType} data. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setFetchingData(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Sensor Device</DialogTitle>
          <DialogDescription>
            Connect to your sensor device to fetch real-time field data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            className="w-48"
            variant="outline"
          >
            <Wifi className={`mr-2 ${connecting ? 'text-blue-500' : ''}`} />
            {connecting ? 'Connecting...' : 'Connect Device'}
          </Button>
        </div>
        
        {!deviceConnected && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-700">
              Device not connected. Connect your device to access sensor data.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-3 my-4">
          <Button 
            onClick={() => fetchSensorData('soil')} 
            disabled={fetchingData !== null}
            variant="secondary"
            className="flex flex-col h-24 gap-2"
          >
            <Droplets size={24} />
            <span>Soil Data</span>
            <span className="text-xs">(N, K, P, pH)</span>
          </Button>
          
          <Button 
            onClick={() => fetchSensorData('temperature')} 
            disabled={fetchingData !== null}
            variant="secondary"
            className="flex flex-col h-24 gap-2"
          >
            <Thermometer size={24} />
            <span>Temperature</span>
          </Button>
          
          <Button 
            onClick={() => fetchSensorData('humidity')} 
            disabled={fetchingData !== null}
            variant="secondary"
            className="flex flex-col h-24 gap-2"
          >
            <Droplets size={24} />
            <span>Humidity</span>
          </Button>
          
          <Button 
            onClick={() => fetchSensorData('rainfall')} 
            disabled={fetchingData !== null}
            variant="secondary" 
            className="flex flex-col h-24 gap-2"
          >
            <Wind size={24} />
            <span>Rainfall</span>
          </Button>
        </div>
        
        {sensorReadings.length > 0 && (
          <div className="border rounded-md p-4 mb-4">
            <h3 className="text-sm font-medium mb-2">Latest Readings</h3>
            <div className="space-y-2">
              {sensorReadings.map((reading, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{reading.type}:</span>
                  <span>{reading.value} {reading.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          {fetchingData && (
            <div className="flex items-center">
              <RefreshCw size={16} className="animate-spin mr-2" />
              <span className="text-sm">Fetching {fetchingData} data...</span>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceConnectionDialog;
