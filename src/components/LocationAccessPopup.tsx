
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LocationAccessPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationGranted?: (latitude: number, longitude: number) => void;
}

const LocationAccessPopup: React.FC<LocationAccessPopupProps> = ({
  open,
  onOpenChange,
  onLocationGranted
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location obtained:", latitude, longitude);
          
          if (onLocationGranted) {
            onLocationGranted(latitude, longitude);
          }
          
          // Store location in localStorage for persistence
          localStorage.setItem('userLatitude', latitude.toString());
          localStorage.setItem('userLongitude', longitude.toString());
          
          toast({
            title: "स्थान प्राप्त किया गया",
            description: "आपके स्थान के आधार पर मौसम और मंडी जानकारी अपडेट की गई है",
          });
          
          setIsLoading(false);
          onOpenChange(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          
          let errorMessage = "कृपया स्थान की अनुमति प्रदान करें और पुनः प्रयास करें";
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "स्थान की अनुमति अस्वीकार कर दी गई। कृपया ब्राउज़र सेटिंग में स्थान की अनुमति दें।";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "स्थान जानकारी उपलब्ध नहीं है।";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "स्थान प्राप्त करने का समय समाप्त हो गया।";
          }
          
          toast({
            variant: "destructive",
            title: "स्थान प्राप्त करने में विफल",
            description: errorMessage,
          });
          
          setIsLoading(false);
        },
        options
      );
    } else {
      toast({
        variant: "destructive",
        title: "स्थान सेवा उपलब्ध नहीं है",
        description: "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है",
      });
      
      setIsLoading(false);
    }
  };

  const handleGoToFarmPlanner = () => {
    onOpenChange(false);
    navigate('/farm-planner');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            स्थान की अनुमति दें
            <br />
            <span className="text-sm font-normal">
              (Allow Location Access)
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            आपके स्थान के आधार पर मौसम और मंडी जानकारी प्रदान करने के लिए
            <br />
            (To provide weather and market information based on your location)
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <MapPin className="h-16 w-16 text-primary mb-4" />
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
            स्थान तक पहुंच प्रदान करके, आप मौसम और स्थानीय मंडियों के लिवे अपडेट प्राप्त कर सकते हैं।
            <br />
            (By granting location access, you'll receive updates for weather and local markets.)
          </p>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            बाद में (Later)
          </Button>
          
          <Button
            onClick={handleGetLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                प्रतीक्षा करें...
              </>
            ) : (
              <>स्थान साझा करें (Share Location)</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationAccessPopup;
