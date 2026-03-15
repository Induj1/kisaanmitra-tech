import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MapPin, CloudRain, Sprout, PlaneTakeoff, Calculator, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveDataWidget from '@/components/LiveDataWidget';
import MapPlanner from '@/components/MapPlanner';
import LocationAccessPopup from '@/components/LocationAccessPopup';
import { supabase } from "@/integrations/supabase/client";

const FarmPlanner = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationAccess, setLocationAccess] = useState<boolean>(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [irrigationBudget, setIrrigationBudget] = useState<string>("");
  const [fertilizerBudget, setFertilizerBudget] = useState<string>("");
  const [pesticideBudget, setPesticideBudget] = useState<string>("");
  const [budgetStep, setBudgetStep] = useState<boolean>(false);
  const [planReady, setPlanReady] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [cropOptions, setCropOptions] = useState([
    { value: "wheat", label: "गेहूं (Wheat)" },
    { value: "rice", label: "चावल (Rice)" },
    { value: "maize", label: "मक्का (Maize)" },
    { value: "cotton", label: "कपास (Cotton)" },
    { value: "sugarcane", label: "गन्ना (Sugarcane)" },
  ]);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/sign-in');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Check for stored location first
    const storedLat = localStorage.getItem('userLatitude');
    const storedLng = localStorage.getItem('userLongitude');
    
    if (storedLat && storedLng) {
      setLatitude(parseFloat(storedLat));
      setLongitude(parseFloat(storedLng));
      setLocationAccess(true);
    } else {
      // Try to get location automatically
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            setLocationAccess(true);
            
            // Store in localStorage
            localStorage.setItem('userLatitude', lat.toString());
            localStorage.setItem('userLongitude', lng.toString());
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationAccess(false);
          }
        );
      }
    }
  }, []);

  const handleLocationGranted = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationAccess(true);
    setShowLocationPopup(false);
    
    toast({
      title: "स्थान प्राप्त किया गया",
      description: "आपके स्थान के आधार पर मौसम और मंडी जानकारी अपडेट की गई है",
    });
  };

  const requestLocationAccess = () => {
    setShowLocationPopup(true);
  };

  const generateRecommendation = () => {
    if (!selectedCrop) {
      toast({
        variant: "destructive",
        title: "फसल चुनें",
        description: "कृपया अपनी फसल का चयन करें",
      });
      return;
    }

    setBudgetStep(true);
  };

  const generatePlan = () => {
    setIsLoading(true);
    
    // Mock AI recommendation based on inputs
    setTimeout(() => {
      const irrigationBudgetNum = parseInt(irrigationBudget) || 0;
      const fertilizerBudgetNum = parseInt(fertilizerBudget) || 0;
      const pesticideBudgetNum = parseInt(pesticideBudget) || 0;
      
      // Simple recommendation logic (in a real app, this would come from an AI model)
      const recommendation = {
        crop: selectedCrop,
        irrigation: {
          type: irrigationBudgetNum > 5000 ? "ड्रिप सिंचाई (Drip Irrigation)" : "स्प्रिंकलर सिंचाई (Sprinkler System)",
          estimatedCost: irrigationBudgetNum * 0.8,
          waterSavings: irrigationBudgetNum > 5000 ? "60%" : "40%",
        },
        fertilizer: {
          recommendation: fertilizerBudgetNum > 3000 ? 
            "जैविक खाद और NPK मिश्रण (Organic manure with NPK mix)" : 
            "यूरिया और डीएपी (Urea and DAP mix)",
          estimatedCost: fertilizerBudgetNum * 0.9,
          coverage: `${Math.floor(fertilizerBudgetNum / 500)} एकड़`,
        },
        pesticides: {
          recommendation: pesticideBudgetNum > 2000 ? 
            "जैविक कीटनाशक (Organic pesticides)" : 
            "रासायनिक कीटनाशक (Chemical pesticides)",
          estimatedCost: pesticideBudgetNum * 0.75,
          applicationFrequency: "हर 15-20 दिनों में (Every 15-20 days)",
        },
        totalCost: irrigationBudgetNum * 0.8 + fertilizerBudgetNum * 0.9 + pesticideBudgetNum * 0.75,
        expectedYield: `${Math.floor(Math.random() * 5) + 10} क्विंटल प्रति एकड़`,
        roi: `${Math.floor(Math.random() * 30) + 60}%`,
      };
      
      setAiRecommendation(recommendation);
      setPlanReady(true);
      setIsLoading(false);
    }, 2000);
  };

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header toggleContrast={toggleContrast} isHighContrast={isHighContrast} />
      
      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
            {/* Left Column - Farm Planner */}
            <div className="md:col-span-8 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/10 pb-2">
                  <CardTitle className="flex items-center">
                    <Sprout className="mr-2 text-primary" size={24} />
                    फार्म प्लानर (Farm Planner)
                  </CardTitle>
                  <CardDescription>
                    अपनी फसल और बजट के आधार पर अनुशंसाएँ प्राप्त करें
                    (Get recommendations based on your crop and budget)
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  {!locationAccess ? (
                    <div className="text-center py-6">
                      <MapPin className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-3">स्थान की अनुमति प्रदान करें</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        बेहतर फसल अनुशंसाओं के लिए हमें आपके स्थान तक पहुंच की आवश्यकता है
                        <br />
                        (We need access to your location for better crop recommendations)
                      </p>
                      <Button onClick={requestLocationAccess} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            प्रतीक्षा करें...
                          </>
                        ) : (
                          <>स्थान साझा करें (Share Location)</>
                        )}
                      </Button>
                    </div>
                  ) : !budgetStep ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">1. फसल का चयन करें (Select Crop)</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          अपने क्षेत्र के लिए उपयुक्त फसल का चयन करें
                        </p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                          <SelectTrigger>
                            <SelectValue placeholder="फसल चुनें (Select crop)" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropOptions.map((crop) => (
                              <SelectItem key={crop.value} value={crop.value}>
                                {crop.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full" 
                          onClick={generateRecommendation}
                          disabled={!selectedCrop || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              प्रतीक्षा करें...
                            </>
                          ) : (
                            <>अगला कदम (Next Step) <ArrowRight className="ml-2 h-4 w-4" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : !planReady ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">2. अपना बजट निर्धारित करें (Set Your Budget)</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          प्रति एकड़ के हिसाब से अनुमानित बजट दर्ज करें
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              सिंचाई बजट (Irrigation Budget) ₹
                            </label>
                            <Input
                              type="number"
                              placeholder="₹ 5,000 - 15,000"
                              value={irrigationBudget}
                              onChange={(e) => setIrrigationBudget(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              उर्वरक बजट (Fertilizer Budget) ₹
                            </label>
                            <Input
                              type="number"
                              placeholder="₹ 3,000 - 8,000"
                              value={fertilizerBudget}
                              onChange={(e) => setFertilizerBudget(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              कीटनाशक बजट (Pesticide Budget) ₹
                            </label>
                            <Input
                              type="number"
                              placeholder="₹ 2,000 - 5,000"
                              value={pesticideBudget}
                              onChange={(e) => setPesticideBudget(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setBudgetStep(false)}
                        >
                          पीछे (Back)
                        </Button>
                        <Button 
                          onClick={generatePlan}
                          disabled={!irrigationBudget || !fertilizerBudget || !pesticideBudget || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              योजना बना रहे हैं...
                            </>
                          ) : (
                            <>योजना बनाएँ (Generate Plan)</>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-bold mb-2">आपकी कृषि योजना तैयार है!</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          (Your farm plan is ready!)
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-2 text-primary">सिंचाई अनुशंसा (Irrigation Recommendation)</h4>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>अनुशंसित प्रकार:</span>
                                  <span className="font-medium">{aiRecommendation.irrigation.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>अनुमानित लागत:</span>
                                  <span className="font-medium">₹{aiRecommendation.irrigation.estimatedCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>पानी की बचत:</span>
                                  <span className="font-medium">{aiRecommendation.irrigation.waterSavings}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-primary">उर्वरक अनुशंसा (Fertilizer Recommendation)</h4>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>अनुशंसित प्रकार:</span>
                                  <span className="font-medium">{aiRecommendation.fertilizer.recommendation}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>अनुमानित लागत:</span>
                                  <span className="font-medium">₹{aiRecommendation.fertilizer.estimatedCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>कवरेज क्षेत्र:</span>
                                  <span className="font-medium">{aiRecommendation.fertilizer.coverage}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-primary">कीटनाशक अनुशंसा (Pesticide Recommendation)</h4>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>अनुशंसित प्रकार:</span>
                                  <span className="font-medium">{aiRecommendation.pesticides.recommendation}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>अनुमानित लागत:</span>
                                  <span className="font-medium">₹{aiRecommendation.pesticides.estimatedCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>उपयोग आवृत्ति:</span>
                                  <span className="font-medium">{aiRecommendation.pesticides.applicationFrequency}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="pt-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-bold mb-3 text-center">अनुमानित परिणाम (Expected Results)</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">कुल लागत</p>
                                <p className="font-bold text-lg">₹{aiRecommendation.totalCost.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">अनुमानित उपज</p>
                                <p className="font-bold text-lg">{aiRecommendation.expectedYield}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">अनुमानित ROI</p>
                                <p className="font-bold text-lg text-green-600">{aiRecommendation.roi}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setPlanReady(false);
                            setBudgetStep(true);
                          }}
                        >
                          बजट संशोधित करें (Edit Budget)
                        </Button>
                        <Button 
                          onClick={() => {
                            setPlanReady(false);
                            setBudgetStep(false);
                            setSelectedCrop("");
                          }}
                        >
                          नई योजना (New Plan)
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Map Planner */}
              <MapPlanner />
            </div>
            
            {/* Right Column - Weather and Market Data */}
            <div className="md:col-span-4 space-y-4">
              <LiveDataWidget 
                widgetType="weather" 
                latitude={latitude}
                longitude={longitude}
                onRequestLocation={requestLocationAccess}
              />
              <LiveDataWidget 
                widgetType="mandi" 
                latitude={latitude}
                longitude={longitude}
                onRequestLocation={requestLocationAccess}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Location Access Popup */}
      <LocationAccessPopup
        open={showLocationPopup}
        onOpenChange={setShowLocationPopup}
        onLocationGranted={handleLocationGranted}
      />
    </div>
  );
};

export default FarmPlanner;
