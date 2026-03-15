import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone, 
  MapPin, 
  Calendar, 
  Bolt, 
  Play, 
  Eye, 
  BarChart, 
  Camera, 
  CloudOff,
  Leaf, 
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const DroneMonitoring: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("book");
  const [location, setLocation] = useState<string>("");
  const [farmSize, setFarmSize] = useState<string>("small");
  const [specificArea, setSpecificArea] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previousFlights, setPreviousFlights] = useState<any[]>([]);
  const [activeFlights, setActiveFlights] = useState<any[]>([]);
  const [livePreviewActive, setLivePreviewActive] = useState<boolean>(false);
  const [liveAnalysisData, setLiveAnalysisData] = useState<any>(null);
  const [cropHealthIndex, setCropHealthIndex] = useState<number>(0);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const mockPreviousFlights = [
        {
          id: 'DR-1234',
          date: '2025-04-15',
          location: 'Bijnor, Uttar Pradesh',
          status: 'completed',
          insights: {
            cropHealth: 'Good',
            soilMoisture: 'Optimal',
            pestDetection: 'None detected',
            recommendations: 'Continue with current irrigation schedule'
          }
        },
        {
          id: 'DR-1186',
          date: '2025-04-02',
          location: 'Bijnor, Uttar Pradesh',
          status: 'completed',
          insights: {
            cropHealth: 'Average',
            soilMoisture: 'Low in southeast section',
            pestDetection: 'Minor aphid presence detected',
            recommendations: 'Increase irrigation in southeast section and consider organic pest control methods'
          }
        }
      ];
      
      setPreviousFlights(mockPreviousFlights);
      
      setActiveFlights([
        {
          id: 'DR-1278',
          scheduledDate: '2025-04-24',
          estimatedDuration: '45 minutes',
          location: 'Bijnor, Uttar Pradesh',
          status: 'scheduled',
          progress: 0
        }
      ]);
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !dateTime) {
      toast({
        title: "Missing Information",
        description: "Please provide both location and preferred date/time.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    setTimeout(() => {
      const newFlight = {
        id: `DR-${Math.floor(1000 + Math.random() * 1000)}`,
        scheduledDate: dateTime.split('T')[0],
        estimatedDuration: '45 minutes',
        location: location,
        status: 'scheduled',
        progress: 0
      };
      
      setActiveFlights([...activeFlights, newFlight]);
      
      setLocation("");
      setFarmSize("small");
      setSpecificArea("");
      setDateTime("");
      setPriority("");
      
      toast({
        title: "Drone Monitoring Scheduled",
        description: `Your drone monitoring has been scheduled for ${new Date(dateTime).toLocaleString()}`,
      });
      
      setActiveTab("active");
      setSubmitting(false);
    }, 2000);
  };
  
  const startLivePreview = () => {
    setLivePreviewActive(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setLiveAnalysisData({
          cropHealth: {
            status: 'Good',
            score: 85,
            details: 'Overall healthy crop with good vegetative growth',
            issues: [{
              location: 'Northeast corner',
              issue: 'Minor signs of nitrogen deficiency',
              severity: 'Low',
              recommendation: 'Consider adding nitrogen-rich organic fertilizer'
            }]
          },
          soilCondition: {
            moisture: 'Optimal (65%)',
            compaction: 'Low',
            erosion: 'None detected'
          },
          pestDetection: {
            status: 'Minor',
            details: 'Small aphid population detected in southern section',
            recommendation: 'Monitor closely; consider organic pest control if population increases'
          },
          recommendations: [
            'Continue current irrigation schedule',
            'Add nitrogen-rich organic fertilizer to northeast section',
            'Monitor aphid population in southern section'
          ]
        });
        
        animateCropHealth();
      }
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const animateCropHealth = () => {
    let count = 0;
    const targetValue = 85;
    const interval = setInterval(() => {
      count += 2;
      setCropHealthIndex(count);
      
      if (count >= targetValue) {
        clearInterval(interval);
      }
    }, 20);
  };
  
  const stopLivePreview = () => {
    setLivePreviewActive(false);
    setLiveAnalysisData(null);
    setAnalysisProgress(0);
    setCropHealthIndex(0);
  };
  
  const renderBookingForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Farm Location <span className="text-red-500">*</span></Label>
          <div className="flex gap-2">
            <Input
              id="location"
              placeholder="Enter village, district, state"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="button" variant="outline" className="flex-shrink-0">
              <MapPin size={18} className="mr-2" /> Map
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="farm-size">Farm Size</Label>
          <RadioGroup value={farmSize} onValueChange={setFarmSize} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Small (&lt; 2 acres)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium (2-5 acres)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large (&gt; 5 acres)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specific-area">Specific Area of Interest (Optional)</Label>
          <Textarea
            id="specific-area"
            placeholder="Describe any specific areas you want the drone to focus on"
            value={specificArea}
            onChange={(e) => setSpecificArea(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-time">Preferred Date & Time <span className="text-red-500">*</span></Label>
          <Input
            id="date-time"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Priority Level</Label>
          <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent">Urgent (₹500 extra)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Smartphone size={18} className="mr-2" /> Schedule Drone Monitoring
            </>
          )}
        </Button>
      </div>
    </form>
  );
  
  const renderActiveFlights = () => (
    <div className="space-y-6">
      {activeFlights.length === 0 ? (
        <div className="text-center py-10">
          <Smartphone size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Active Flights</h3>
          <p className="text-gray-400 mt-2">You don't have any scheduled or in-progress drone monitoring.</p>
          <Button variant="link" onClick={() => setActiveTab("book")}>
            Schedule a Drone Flight
          </Button>
        </div>
      ) : (
        activeFlights.map((flight) => (
          <Card key={flight.id} className="overflow-hidden">
            <CardHeader className="bg-blue-50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center">
                  <Smartphone size={18} className="mr-2 text-blue-600" />
                  Flight #{flight.id}
                </CardTitle>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                </span>
              </div>
              <CardDescription>
                Scheduled for {new Date(flight.scheduledDate).toLocaleDateString()} • Estimated duration: {flight.estimatedDuration}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{flight.location}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium">Waiting for drone dispatch</span>
                  </div>
                  <Progress value={flight.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Flight Cancelled",
                    description: `Flight #${flight.id} has been cancelled.`,
                  });
                  setActiveFlights(activeFlights.filter(f => f.id !== flight.id));
                }}
              >
                Cancel Flight
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab("live")}
              >
                <Play size={14} className="mr-1" /> Simulate Live View
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
  
  const renderPreviousFlights = () => (
    <div className="space-y-6">
      {previousFlights.length === 0 ? (
        <div className="text-center py-10">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Previous Flights</h3>
          <p className="text-gray-400 mt-2">Once you complete drone monitoring sessions, they will appear here.</p>
          <Button variant="link" onClick={() => setActiveTab("book")}>
            Schedule Your First Drone Flight
          </Button>
        </div>
      ) : (
        previousFlights.map((flight) => (
          <Card key={flight.id} className="overflow-hidden">
            <CardHeader className="bg-green-50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center">
                  <Smartphone size={18} className="mr-2 text-green-600" />
                  Flight #{flight.id}
                </CardTitle>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Completed
                </span>
              </div>
              <CardDescription>
                Monitored on {new Date(flight.date).toLocaleDateString()} • {flight.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center text-sm font-medium mb-1">
                      <Leaf size={14} className="mr-1 text-green-600" />
                      Crop Health
                    </div>
                    <p className="text-sm">{flight.insights.cropHealth}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center text-sm font-medium mb-1">
                      <Droplets size={14} className="mr-1 text-blue-600" />
                      Soil Moisture
                    </div>
                    <p className="text-sm">{flight.insights.soilMoisture}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <AlertTriangle size={14} className="mr-1 text-amber-600" />
                    Pest Detection
                  </div>
                  <p className="text-sm">{flight.insights.pestDetection}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <CheckCircle size={14} className="mr-1 text-primary" />
                    Recommendations
                  </div>
                  <p className="text-sm">{flight.insights.recommendations}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
              >
                <BarChart size={14} className="mr-1" /> Detailed Analysis
              </Button>
              
              <Button 
                size="sm"
              >
                <Eye size={14} className="mr-1" /> View Images
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
  
  const renderLiveView = () => (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg relative overflow-hidden" style={{ height: '300px' }}>
        {livePreviewActive ? (
          <>
            <img 
              src="https://via.placeholder.com/800x400?text=Live+Drone+Feed" 
              alt="Live Drone Feed" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75 mr-1"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-2"></span>
                LIVE
              </span>
            </div>
            
            {analysisProgress < 100 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <p className="text-lg font-medium mb-2">Analyzing Farm Data...</p>
                <div className="w-64">
                  <Progress value={analysisProgress} className="h-2 mb-2" />
                  <p className="text-xs text-center">{analysisProgress}% Complete</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <CloudOff size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500">Live feed not active</p>
            <Button 
              variant="default" 
              className="mt-4"
              onClick={startLivePreview}
            >
              <Play size={16} className="mr-2" /> Start Live Preview
            </Button>
          </div>
        )}
      </div>
      
      {livePreviewActive && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <Leaf size={16} className="mr-2 text-green-600" />
                  Crop Health Index
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="flex items-center gap-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        cropHealthIndex > 75 ? 'bg-green-500' : 
                        cropHealthIndex > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cropHealthIndex}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg">{cropHealthIndex}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <Droplets size={16} className="mr-2 text-blue-600" />
                  Soil Moisture
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="text-2xl font-bold text-blue-600">65%</div>
                <p className="text-xs text-gray-500">Optimal Range: 60-70%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <AlertTriangle size={16} className="mr-2 text-amber-600" />
                  Issues Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="text-2xl font-bold text-amber-600">Minor</div>
                <p className="text-xs text-gray-500">2 areas require attention</p>
              </CardContent>
            </Card>
          </div>
          
          {liveAnalysisData && (
            <Card>
              <CardHeader>
                <CardTitle>Live Analysis Results</CardTitle>
                <CardDescription>
                  Real-time insights based on multispectral imaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center">
                      <Leaf size={16} className="mr-2 text-green-600" />
                      Crop Health Assessment
                    </h3>
                    <p className="mt-1 text-sm">{liveAnalysisData.cropHealth.details}</p>
                    
                    {liveAnalysisData.cropHealth.issues.map((issue: any, i: number) => (
                      <div key={i} className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-200">
                        <p className="text-sm font-medium text-amber-800">Issue at {issue.location}</p>
                        <p className="text-xs mt-1">{issue.issue} (Severity: {issue.severity})</p>
                        <p className="text-xs mt-1 text-amber-700">Recommendation: {issue.recommendation}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center">
                      <Droplets size={16} className="mr-2 text-blue-600" />
                      Soil Condition
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <span className="text-xs text-gray-600">Moisture</span>
                        <p className="text-sm font-medium">{liveAnalysisData.soilCondition.moisture}</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <span className="text-xs text-gray-600">Compaction</span>
                        <p className="text-sm font-medium">{liveAnalysisData.soilCondition.compaction}</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <span className="text-xs text-gray-600">Erosion</span>
                        <p className="text-sm font-medium">{liveAnalysisData.soilCondition.erosion}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center">
                      <AlertTriangle size={16} className="mr-2 text-amber-600" />
                      Pest Detection
                    </h3>
                    <p className="mt-1 text-sm">{liveAnalysisData.pestDetection.details}</p>
                    <p className="mt-1 text-sm text-primary-dark">{liveAnalysisData.pestDetection.recommendation}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <h3 className="text-sm font-medium flex items-center text-green-800">
                      <CheckCircle size={16} className="mr-2" />
                      Recommendations
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {liveAnalysisData.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 gap-2">
                <Button variant="outline" size="sm" onClick={stopLivePreview}>
                  End Live Session
                </Button>
                <Button size="sm">
                  <Camera size={14} className="mr-1" /> Capture & Save
                </Button>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </div>
  );
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Smartphone className="mr-3 text-primary" />
              Drone-Assisted Farm Monitoring
            </h1>
            <p className="text-gray-600 mt-2">
              Advanced multispectral imaging to analyze your farm's health and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bolt size={16} className="mr-1" /> How It Works
            </Button>
            <Button variant="outline" size="sm">
              <Clock size={16} className="mr-1" /> Check Availability
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="book">Book</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="previous">Previous</TabsTrigger>
                <TabsTrigger value="live">Live View</TabsTrigger>
              </TabsList>
              
              {loading ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-gray-500">Loading drone data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <TabsContent value="book" className="mt-0">
                    {renderBookingForm()}
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-0">
                    {renderActiveFlights()}
                  </TabsContent>
                  
                  <TabsContent value="previous" className="mt-0">
                    {renderPreviousFlights()}
                  </TabsContent>
                  
                  <TabsContent value="live" className="mt-0">
                    {renderLiveView()}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-primary/10 pb-3">
                <CardTitle className="text-lg">Benefits of Drone Monitoring</CardTitle>
                <CardDescription>Advanced technology for better farming</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p className="text-sm">Multispectral imaging reveals crop health issues invisible to the naked eye</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p className="text-sm">Access hilly and difficult terrain without physical inspection</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p className="text-sm">Early detection of pests, diseases and irrigation issues</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p className="text-sm">Real-time insights and recommendations delivered over 5G</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p className="text-sm">Track crop growth patterns over time with historical data</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 pb-3">
                <CardTitle className="text-lg">Service Plans</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">One-time Monitoring</h3>
                    <p className="text-sm text-gray-600 mt-1">Single drone monitoring session with basic analysis</p>
                    <p className="text-primary font-bold mt-2">₹1,500 per visit</p>
                  </div>
                  
                  <div className="p-3 border rounded-md border-primary bg-primary/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Seasonal Package</h3>
                        <p className="text-sm text-gray-600 mt-1">3 monitoring sessions throughout growing season</p>
                        <p className="text-primary font-bold mt-2">₹3,600 / season</p>
                      </div>
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Best Value</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">Annual Subscription</h3>
                    <p className="text-sm text-gray-600 mt-1">Regular monitoring for multiple crops year-round</p>
                    <p className="text-primary font-bold mt-2">₹12,000 / year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Have Questions?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">Our agricultural experts are here to help you get the most out of drone monitoring.</p>
                <Button className="w-full mt-4" variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DroneMonitoring;
