
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  ThermometerIcon,
  Activity,
  Calendar,
  Plus,
  Clock,
  ArrowRight,
  Tag,
  AlertTriangle,
  Pill,
  Syringe,
  Phone,
  Users,
  RefreshCw,
  Stethoscope,
  CheckCircle,
  ClipboardList,
  Info
} from 'lucide-react';

// Mock livestock data
const livestockData = [
  {
    id: "COW-001",
    name: "Lakshmi",
    type: "Cow",
    breed: "Gir",
    age: "4 years",
    status: "healthy",
    collarId: "C-12345",
    lastUpdated: "10 minutes ago",
    metrics: {
      temperature: 38.6,
      heartRate: 72,
      activity: "Normal",
      movements: 87
    },
    vitals: [
      { time: "08:00", temp: 38.5, heart: 70 },
      { time: "12:00", temp: 38.7, heart: 72 },
      { time: "16:00", temp: 38.6, heart: 73 },
      { time: "20:00", temp: 38.4, heart: 71 }
    ],
    alerts: [],
    vaccinations: [
      { name: "FMD Vaccine", date: "2025-01-15", due: "2025-07-15" },
      { name: "Brucellosis", date: "2024-11-10", due: "2025-11-10" }
    ]
  },
  {
    id: "COW-002",
    name: "Kali",
    type: "Cow",
    breed: "Sahiwal",
    age: "3 years",
    status: "alert",
    collarId: "C-12346",
    lastUpdated: "15 minutes ago",
    metrics: {
      temperature: 39.8,
      heartRate: 88,
      activity: "Low",
      movements: 45
    },
    vitals: [
      { time: "08:00", temp: 39.1, heart: 78 },
      { time: "12:00", temp: 39.4, heart: 82 },
      { time: "16:00", temp: 39.7, heart: 85 },
      { time: "20:00", temp: 39.8, heart: 88 }
    ],
    alerts: [
      { type: "temperature", message: "Temperature above normal range", timestamp: "2025-04-22T15:30:00" }
    ],
    vaccinations: [
      { name: "FMD Vaccine", date: "2025-02-10", due: "2025-08-10" },
      { name: "Brucellosis", date: "2024-12-05", due: "2025-12-05" }
    ]
  },
  {
    id: "GOAT-001",
    name: "Chotu",
    type: "Goat",
    breed: "Black Bengal",
    age: "2 years",
    status: "healthy",
    collarId: "G-56789",
    lastUpdated: "25 minutes ago",
    metrics: {
      temperature: 39.1,
      heartRate: 90,
      activity: "High",
      movements: 120
    },
    vitals: [
      { time: "08:00", temp: 39.0, heart: 88 },
      { time: "12:00", temp: 39.2, heart: 92 },
      { time: "16:00", temp: 39.1, heart: 90 },
      { time: "20:00", temp: 39.0, heart: 89 }
    ],
    alerts: [],
    vaccinations: [
      { name: "PPR Vaccine", date: "2025-03-15", due: "2025-09-15" },
      { name: "Anthrax", date: "2025-01-20", due: "2025-07-20" }
    ]
  }
];

// Mock veterinarians data
const vetsData = [
  { id: 1, name: "Dr. Anjali Sharma", specialization: "Large Animals", phone: "+91 98765 43210", available: true },
  { id: 2, name: "Dr. Rajesh Verma", specialization: "Dairy Animals", phone: "+91 87654 32109", available: true },
  { id: 3, name: "Dr. Priya Patel", specialization: "Small Ruminants", phone: "+91 76543 21098", available: false }
];

// Create a custom HeartPulse component to avoid conflict with any imported one
const HeartPulse: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4 .5-1h5.27" />
  </svg>
);

// Also create a StepsIcon component since it's used but not imported
const StepsIcon: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 12v8" />
    <path d="M4 4v4" />
    <path d="M12 20v-4" />
    <path d="M12 8V4" />
    <path d="M20 20V12" />
    <path d="M20 4v4" />
    <path d="M2 12h4" />
    <path d="M10 8h4" />
    <path d="M18 12h4" />
  </svg>
);

const LivestockMonitoring: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string>("COW-001");
  const [appointmentData, setAppointmentData] = useState({
    vetId: "",
    date: "",
    time: "",
    reason: "",
    details: ""
  });
  const [newAnimalData, setNewAnimalData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    collarId: ""
  });
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [selectedAnimal]);
  
  const getCurrentAnimal = () => {
    return livestockData.find(animal => animal.id === selectedAnimal) || livestockData[0];
  };
  
  const handleRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest collar data...",
    });
    
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Data Updated",
        description: "Livestock monitoring data has been refreshed.",
      });
    }, 2000);
  };
  
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointmentData.vetId || !appointmentData.date || !appointmentData.time || !appointmentData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      // Find vet name
      const vet = vetsData.find(v => v.id.toString() === appointmentData.vetId);
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${vet?.name} has been scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
      });
      
      // Reset form
      setAppointmentData({
        vetId: "",
        date: "",
        time: "",
        reason: "",
        details: ""
      });
      
      setLoading(false);
      setActiveTab("dashboard");
    }, 2000);
  };
  
  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAnimalData.name || !newAnimalData.type || !newAnimalData.breed || !newAnimalData.age) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Animal Added",
        description: `${newAnimalData.name} has been added to your livestock. Pair with a collar to begin monitoring.`,
      });
      
      // Reset form
      setNewAnimalData({
        name: "",
        type: "",
        breed: "",
        age: "",
        collarId: ""
      });
      
      setLoading(false);
      setActiveTab("dashboard");
    }, 2000);
  };
  
  const renderDashboard = () => {
    const animal = getCurrentAnimal();
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select animal" />
            </SelectTrigger>
            <SelectContent>
              {livestockData.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("register")}>
              <Plus size={16} className="mr-2" /> Add Animal
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={animal.status === 'alert' ? 'border-red-300' : ''}>
            <CardHeader className={`pb-2 ${animal.status === 'alert' ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center">
                  <Heart size={18} className={`mr-2 ${animal.status === 'alert' ? 'text-red-600' : 'text-green-600'}`} />
                  Health Status
                </CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  animal.status === 'alert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {animal.status === 'alert' ? 'Needs Attention' : 'Healthy'}
                </span>
              </div>
              <CardDescription>
                Last updated {animal.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThermometerIcon size={16} className="mr-2 text-red-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <div className={`font-medium ${
                    animal.metrics.temperature > 39.5 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {animal.metrics.temperature}°C
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HeartPulse size={16} className="mr-2 text-red-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <div className={`font-medium ${
                    animal.metrics.heartRate > 85 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {animal.metrics.heartRate} BPM
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm">Activity Level</span>
                  </div>
                  <div className={`font-medium ${
                    animal.metrics.activity === 'Low' ? 'text-amber-600' : 'text-gray-900'
                  }`}>
                    {animal.metrics.activity}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StepsIcon size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">Movements (24h)</span>
                  </div>
                  <div className={`font-medium ${
                    animal.metrics.movements < 50 ? 'text-amber-600' : 'text-gray-900'
                  }`}>
                    {animal.metrics.movements}
                  </div>
                </div>
                
                {animal.alerts.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-md border border-red-200 mt-2">
                    <div className="flex items-start">
                      <AlertTriangle size={18} className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Health Alert</p>
                        {animal.alerts.map((alert, index) => (
                          <p key={index} className="text-xs text-red-700 mt-1">
                            {alert.message}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              {animal.status === 'alert' ? (
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setActiveTab("appointment")}
                >
                  <Stethoscope size={16} className="mr-2" /> Schedule Vet Visit
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full">
                  <ClipboardList size={16} className="mr-2" /> View Health Record
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Tag size={18} className="mr-2 text-indigo-600" />
                Animal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="font-medium">{animal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID:</span>
                  <span className="font-medium">{animal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="font-medium">{animal.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Breed:</span>
                  <span className="font-medium">{animal.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age:</span>
                  <span className="font-medium">{animal.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Collar ID:</span>
                  <span className="font-medium">{animal.collarId}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-400 mb-2">Health Collar Status</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Connected & Monitoring</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Calendar size={18} className="mr-2 text-primary" />
                Vaccination Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {animal.vaccinations.map((vax, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Syringe size={14} className="mr-2 text-primary" />
                        <span className="font-medium text-sm">{vax.name}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Last: {new Date(vax.date).toLocaleDateString()}</span>
                      <span>Due: {new Date(vax.due).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Pill size={14} className="mr-1" /> View Full Medical Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity size={18} className="mr-2 text-primary" />
              Vitals History (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Temperature (°C)</span>
                </div>
                <div className="h-24 relative">
                  <div className="absolute inset-0 flex items-end justify-between border-b border-l">
                    <div className="absolute left-0 bottom-0 w-full h-full">
                      {animal.vitals.map((data, i) => (
                        <React.Fragment key={i}>
                          <div 
                            className={`absolute h-1 rounded-sm ${
                              data.temp > 39.5 ? 'bg-red-500' : data.temp > 39.2 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              bottom: `${(data.temp - 38) * 60}px`, 
                              left: `${(i / (animal.vitals.length - 1)) * 100}%`,
                              width: '3px'
                            }}
                          ></div>
                          {i < animal.vitals.length - 1 && (
                            <div 
                              className={`absolute h-0.5 ${
                                data.temp > 39.5 || animal.vitals[i+1].temp > 39.5 ? 'bg-red-300' : 
                                data.temp > 39.2 || animal.vitals[i+1].temp > 39.2 ? 'bg-amber-300' : 'bg-blue-300'
                              }`}
                              style={{ 
                                bottom: `${(data.temp - 38) * 60}px`, 
                                left: `${(i / (animal.vitals.length - 1)) * 100}%`,
                                width: `${100 / (animal.vitals.length - 1)}%`,
                                transform: `translateY(-50%) rotate(${Math.atan2(
                                  (animal.vitals[i+1].temp - data.temp) * 60, 
                                  100 / (animal.vitals.length - 1)
                                ) * (180 / Math.PI)}deg)`,
                                transformOrigin: 'left center'
                              }}
                            ></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {animal.vitals.map((data, i) => (
                      <div key={i} className="z-10 flex flex-col items-center">
                        <div 
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${
                            data.temp > 39.5 ? 'bg-red-500' : data.temp > 39.2 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ transform: 'translateY(-12px)' }}
                        >
                          {data.temp}
                        </div>
                        <span className="text-xs mt-2">{data.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Heart Rate (BPM)</span>
                </div>
                <div className="h-24 relative">
                  <div className="absolute inset-0 flex items-end justify-between border-b border-l">
                    <div className="absolute left-0 bottom-0 w-full h-full">
                      {animal.vitals.map((data, i) => (
                        <React.Fragment key={i}>
                          <div 
                            className={`absolute h-1 rounded-sm ${
                              data.heart > 85 ? 'bg-red-500' : data.heart > 80 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              bottom: `${(data.heart - 60) * 1.5}px`, 
                              left: `${(i / (animal.vitals.length - 1)) * 100}%`,
                              width: '3px'
                            }}
                          ></div>
                          {i < animal.vitals.length - 1 && (
                            <div 
                              className={`absolute h-0.5 ${
                                data.heart > 85 || animal.vitals[i+1].heart > 85 ? 'bg-red-300' : 
                                data.heart > 80 || animal.vitals[i+1].heart > 80 ? 'bg-amber-300' : 'bg-green-300'
                              }`}
                              style={{ 
                                bottom: `${(data.heart - 60) * 1.5}px`, 
                                left: `${(i / (animal.vitals.length - 1)) * 100}%`,
                                width: `${100 / (animal.vitals.length - 1)}%`,
                                transform: `translateY(-50%) rotate(${Math.atan2(
                                  (animal.vitals[i+1].heart - data.heart) * 1.5, 
                                  100 / (animal.vitals.length - 1)
                                ) * (180 / Math.PI)}deg)`,
                                transformOrigin: 'left center'
                              }}
                            ></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {animal.vitals.map((data, i) => (
                      <div key={i} className="z-10 flex flex-col items-center">
                        <div 
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${
                            data.heart > 85 ? 'bg-red-500' : data.heart > 80 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ transform: 'translateY(-12px)' }}
                        >
                          {data.heart}
                        </div>
                        <span className="text-xs mt-2">{data.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-primary/5 rounded-lg p-4 border">
          <div className="flex items-start">
            <Info size={20} className="mr-2 text-primary mt-1" />
            <div>
              <h3 className="text-base font-medium">How the Livestock Health Monitoring Collar Works</h3>
              <p className="text-sm text-gray-600 mt-1">
                The collar contains sensors that monitor your animal's vital signs, movement patterns, and location. Data is transmitted via 5G to provide real-time health insights. The system will alert you when abnormal patterns are detected, helping you address health issues before they become serious.
              </p>
              <Button variant="link" className="p-0 h-auto text-primary mt-2">
                Learn more about the technology
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAppointment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope size={20} className="mr-2 text-primary" />
            Schedule Veterinary Appointment
          </CardTitle>
          <CardDescription>
            Book an appointment with a veterinarian for {getCurrentAnimal().name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vet-select">Select Veterinarian <span className="text-red-500">*</span></Label>
              <Select 
                value={appointmentData.vetId} 
                onValueChange={(value) => setAppointmentData({...appointmentData, vetId: value})}
                required
              >
                <SelectTrigger id="vet-select">
                  <SelectValue placeholder="Choose a veterinarian" />
                </SelectTrigger>
                <SelectContent>
                  {vetsData.map(vet => (
                    <SelectItem 
                      key={vet.id} 
                      value={vet.id.toString()}
                      disabled={!vet.available}
                    >
                      {vet.name} - {vet.specialization} {!vet.available && "(Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Date <span className="text-red-500">*</span></Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                  required
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time <span className="text-red-500">*</span></Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointment-reason">Reason for Visit <span className="text-red-500">*</span></Label>
              <Select 
                value={appointmentData.reason} 
                onValueChange={(value) => setAppointmentData({...appointmentData, reason: value})}
                required
              >
                <SelectTrigger id="appointment-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health-alert">Health Alert from Monitoring System</SelectItem>
                  <SelectItem value="routine">Routine Check-up</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="injury">Injury or Wound</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointment-details">Additional Details</Label>
              <Input
                id="appointment-details"
                placeholder="Any specific symptoms or concerns"
                value={appointmentData.details}
                onChange={(e) => setAppointmentData({...appointmentData, details: e.target.value})}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Schedule Appointment</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderRegister = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus size={20} className="mr-2 text-primary" />
            Register New Animal
          </CardTitle>
          <CardDescription>
            Add a new animal to your livestock monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAnimal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animal-name">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="animal-name"
                  placeholder="Animal name"
                  value={newAnimalData.name}
                  onChange={(e) => setNewAnimalData({...newAnimalData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="animal-type">Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={newAnimalData.type} 
                  onValueChange={(value) => setNewAnimalData({...newAnimalData, type: value})}
                  required
                >
                  <SelectTrigger id="animal-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cow">Cow</SelectItem>
                    <SelectItem value="Goat">Goat</SelectItem>
                    <SelectItem value="Sheep">Sheep</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Buffalo">Buffalo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animal-breed">Breed <span className="text-red-500">*</span></Label>
                <Input
                  id="animal-breed"
                  placeholder="Breed"
                  value={newAnimalData.breed}
                  onChange={(e) => setNewAnimalData({...newAnimalData, breed: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="animal-age">Age <span className="text-red-500">*</span></Label>
                <Input
                  id="animal-age"
                  placeholder="e.g., 3 years"
                  value={newAnimalData.age}
                  onChange={(e) => setNewAnimalData({...newAnimalData, age: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="animal-collar">Collar ID</Label>
              <Input
                id="animal-collar"
                placeholder="Optional - can be paired later"
                value={newAnimalData.collarId}
                onChange={(e) => setNewAnimalData({...newAnimalData, collarId: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                The collar ID can be found on the physical collar device
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Register Animal</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Livestock Health Monitoring</h1>
            <p className="text-gray-500 mt-1">
              Monitor your livestock vital signs and health status in real-time
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="appointment">Schedule Vet</TabsTrigger>
              <TabsTrigger value="register">Register Animal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              {renderDashboard()}
            </TabsContent>
            
            <TabsContent value="appointment" className="space-y-4">
              {renderAppointment()}
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              {renderRegister()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default LivestockMonitoring;
