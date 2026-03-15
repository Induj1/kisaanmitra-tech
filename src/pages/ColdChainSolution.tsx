
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
  Thermometer,
  Droplets,
  Calendar,
  Clock,
  Play,
  PieChart,
  BarChart,
  RefreshCw,
  Users,
  MapPin,
  Bookmark,
  Phone,
  Sun,
  Timer,
  AlertCircle,
  Smartphone // Added missing Smartphone icon import
} from 'lucide-react';

// Mock data for storage units
const storageUnits = [
  {
    id: "CS-001",
    name: "Meghalaya Solar Storage Unit",
    location: "Shillong, Meghalaya",
    capacity: "500 kg",
    temperature: 4.2,
    humidity: 85,
    status: "active",
    powerSource: "solar",
    batteryLevel: 78,
    lastUpdated: "10 minutes ago",
    utilization: 60,
    items: [
      { name: "Oranges", quantity: "120 kg", storageDate: "2025-04-15", expiryDate: "2025-04-30" },
      { name: "Kiwi", quantity: "80 kg", storageDate: "2025-04-18", expiryDate: "2025-05-02" },
      { name: "Local Cherry", quantity: "100 kg", storageDate: "2025-04-20", expiryDate: "2025-05-05" }
    ]
  },
  {
    id: "CS-002",
    name: "Assam Community Storage",
    location: "Guwahati, Assam",
    capacity: "800 kg",
    temperature: 3.8,
    humidity: 82,
    status: "active",
    powerSource: "hybrid",
    batteryLevel: 64,
    lastUpdated: "25 minutes ago",
    utilization: 75,
    items: [
      { name: "Bhut Jolokia", quantity: "200 kg", storageDate: "2025-04-10", expiryDate: "2025-05-10" },
      { name: "Ginger", quantity: "250 kg", storageDate: "2025-04-12", expiryDate: "2025-05-12" },
      { name: "Local Vegetables", quantity: "150 kg", storageDate: "2025-04-19", expiryDate: "2025-04-26" }
    ]
  }
];

// Mock data for community members
const communityMembers = [
  { id: 1, name: "Rohan Sharma", role: "SHG Leader", phone: "+91 98765 43210", storage: "CS-001" },
  { id: 2, name: "Preeti Patel", role: "Member", phone: "+91 87654 32109", storage: "CS-001" },
  { id: 3, name: "Ajay Singh", role: "Technical Support", phone: "+91 76543 21098", storage: "CS-001" },
  { id: 4, name: "Lakshmi Devi", role: "Member", phone: "+91 65432 10987", storage: "CS-001" },
  { id: 5, name: "Vikram Mehta", role: "SHG Leader", phone: "+91 54321 09876", storage: "CS-002" },
  { id: 6, name: "Sanjana Roy", role: "Member", phone: "+91 43210 98765", storage: "CS-002" }
];

const ColdChainSolution: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("CS-001");
  const [temperatureHistory, setTemperatureHistory] = useState<any[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<any[]>([]);
  const [alertsActive, setAlertsActive] = useState<boolean>(true);
  const [bookingData, setBookingData] = useState({
    productType: "",
    quantity: "",
    storageDate: "",
    duration: "",
    notes: ""
  });
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    // Generate mock temperature and humidity data
    generateMockEnvironmentData();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [selectedUnit]);
  
  const generateMockEnvironmentData = () => {
    const tempData = [];
    const humidData = [];
    const now = new Date();
    
    // Generate 24 hours of data points
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(now.getHours() - 23 + i);
      
      // Random temperature between 3-6°C with some variation
      const temp = 3 + Math.random() * 3;
      // Random humidity between 75-90% with some variation
      const humidity = 75 + Math.random() * 15;
      
      tempData.push({
        time: time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        value: temp.toFixed(1)
      });
      
      humidData.push({
        time: time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        value: Math.round(humidity)
      });
    }
    
    setTemperatureHistory(tempData);
    setHumidityHistory(humidData);
  };
  
  const getCurrentUnit = () => {
    return storageUnits.find(unit => unit.id === selectedUnit) || storageUnits[0];
  };
  
  const handleRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest storage unit data...",
    });
    
    setTimeout(() => {
      generateMockEnvironmentData();
      setLoading(false);
      
      toast({
        title: "Data Updated",
        description: "Storage monitoring data has been refreshed.",
      });
    }, 2000);
  };
  
  const toggleAlerts = () => {
    setAlertsActive(!alertsActive);
    
    toast({
      title: alertsActive ? "Alerts Disabled" : "Alerts Enabled",
      description: alertsActive
        ? "You will no longer receive alerts for this storage unit."
        : "You will now receive temperature and humidity alerts for this unit.",
    });
  };
  
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.productType || !bookingData.quantity || !bookingData.storageDate || !bookingData.duration) {
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
        title: "Storage Booked",
        description: `Your ${bookingData.quantity} of ${bookingData.productType} has been booked for cold storage.`,
      });
      
      // Reset form
      setBookingData({
        productType: "",
        quantity: "",
        storageDate: "",
        duration: "",
        notes: ""
      });
      
      setLoading(false);
      setActiveTab("dashboard");
    }, 2000);
  };
  
  const renderDashboard = () => {
    const unit = getCurrentUnit();
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select storage unit" />
            </SelectTrigger>
            <SelectContent>
              {storageUnits.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={toggleAlerts}>
              {alertsActive ? 'Disable Alerts' : 'Enable Alerts'} 
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Thermometer size={18} className="mr-2 text-blue-600" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 flex items-center">
                {unit.temperature}°C
                <span className="text-xs ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Optimal
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target range: 2-6°C</p>
              
              <div className="mt-4 h-20">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Last 24 hours</span>
                </div>
                <div className="flex items-end h-16 border-b border-l">
                  {temperatureHistory.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500"
                        style={{ height: `${(parseFloat(point.value) - 2) * 10}px` }}
                      ></div>
                      {i % 4 === 0 && (
                        <div className="text-[8px] text-gray-500 mt-1">
                          {point.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Droplets size={18} className="mr-2 text-indigo-600" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 flex items-center">
                {unit.humidity}%
                <span className="text-xs ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  Optimal
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target range: 80-90%</p>
              
              <div className="mt-4 h-20">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Last 24 hours</span>
                </div>
                <div className="flex items-end h-16 border-b border-l">
                  {humidityHistory.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-indigo-500"
                        style={{ height: `${(point.value - 70) / 2}px` }}
                      ></div>
                      {i % 4 === 0 && (
                        <div className="text-[8px] text-gray-500 mt-1">
                          {point.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Sun size={18} className="mr-2 text-amber-600" />
                Power Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="text-lg font-medium">
                    {unit.powerSource === 'solar' ? 'Solar Powered' : 'Hybrid Solar/Grid'}
                  </div>
                  <div className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Battery Level</span>
                    <span className="font-medium">{unit.batteryLevel}%</span>
                  </div>
                  <Progress value={unit.batteryLevel} className="h-2 bg-gray-100" />
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Current Power Source</span>
                    <span className="font-medium">
                      {unit.batteryLevel > 20 ? 'Battery' : 'Grid Backup'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last grid charging: Yesterday, 8:30 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChart size={18} className="mr-2 text-primary" />
                Storage Utilization
              </CardTitle>
              <CardDescription>
                Current capacity: {unit.capacity} • Last updated: {unit.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeDasharray={`${unit.utilization}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{unit.utilization}%</div>
                      <div className="text-xs text-gray-500">Used</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="text-sm font-medium">Currently Stored Items:</div>
                {unit.items.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span>{item.quantity}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Stored: {new Date(item.storageDate).toLocaleDateString()}</span>
                      <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("booking")}>
                <Bookmark size={16} className="mr-2" /> Book Storage Space
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users size={18} className="mr-2 text-primary" />
                Community Members
              </CardTitle>
              <CardDescription>
                SHG members and technical support contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityMembers
                  .filter(member => member.storage === selectedUnit)
                  .map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Phone size={14} className="mr-1" /> Call
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Users size={16} className="mr-2" /> View All Community Members
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2 bg-amber-50">
            <div className="flex items-start">
              <AlertCircle size={20} className="mr-2 text-amber-600 mt-1" />
              <div>
                <CardTitle className="text-base">Smart Alerts</CardTitle>
                <CardDescription>
                  Notifications will be sent to your phone when conditions are outside optimal range
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center text-sm font-medium text-green-800 mb-1">
                  <CheckCircle size={16} className="mr-2" />
                  Temperature Stable
                </div>
                <p className="text-xs text-green-700">
                  Current temperature is within optimal range for produce preservation.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center text-sm font-medium text-green-800 mb-1">
                  <CheckCircle size={16} className="mr-2" />
                  Humidity Stable
                </div>
                <p className="text-xs text-green-700">
                  Current humidity level is optimal for produce freshness.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center text-sm font-medium text-green-800 mb-1">
                  <CheckCircle size={16} className="mr-2" />
                  Power Supply Normal
                </div>
                <p className="text-xs text-green-700">
                  Solar power generation is sufficient. Battery charging normally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderBooking = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bookmark size={20} className="mr-2 text-primary" />
              Book Cold Storage Space
            </CardTitle>
            <CardDescription>
              Reserve space in your community's solar-powered cold storage unit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storage-unit">Storage Unit</Label>
                  <Select 
                    value={selectedUnit} 
                    onValueChange={setSelectedUnit}
                    disabled
                  >
                    <SelectTrigger id="storage-unit">
                      <SelectValue placeholder="Select storage unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageUnits.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Location: {getCurrentUnit().location}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-type">Product Type <span className="text-red-500">*</span></Label>
                  <Select 
                    value={bookingData.productType} 
                    onValueChange={(value) => setBookingData({...bookingData, productType: value})}
                    required
                  >
                    <SelectTrigger id="product-type">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                      <SelectItem value="Dairy">Dairy Products</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 100 kg"
                    value={bookingData.quantity}
                    onChange={(e) => setBookingData({...bookingData, quantity: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storage-date">Storage Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="storage-date"
                    type="date"
                    value={bookingData.storageDate}
                    onChange={(e) => setBookingData({...bookingData, storageDate: e.target.value})}
                    required
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Storage Duration <span className="text-red-500">*</span></Label>
                <Select 
                  value={bookingData.duration} 
                  onValueChange={(value) => setBookingData({...bookingData, duration: value})}
                  required
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select storage duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="3-weeks">3 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="custom">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any special instructions or details about your produce"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
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
                  <>Book Storage Space</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Booking Information</CardTitle>
            <CardDescription>Terms and conditions for using the cold storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Storage Rates</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• ₹5 per kg per week for SHG members</li>
                  <li>• ₹8 per kg per week for non-members</li>
                  <li>• Minimum storage: 20 kg</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Rules & Guidelines</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• All produce must be cleaned before storage</li>
                  <li>• Bring produce in clean, reusable containers</li>
                  <li>• Pickup and delivery times: 9 AM - 5 PM daily</li>
                  <li>• 24-hour notice required for early withdrawal</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Community Benefits</h3>
                <p className="text-xs text-blue-700">
                  Your participation helps maintain this community-owned cold storage facility. 5% of all storage fees go toward equipment maintenance and expanding cold chain infrastructure in our region.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Thermometer className="mr-3 text-blue-600" />
              Community Cold Chain Solution
            </h1>
            <p className="text-gray-600 mt-2">
              Solar-powered cold storage with real-time monitoring for SHGs and youth cooperatives
            </p>
          </div>
        </div>
        
        {loading && !getCurrentUnit() ? (
          <div className="h-60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-500">Loading cold storage data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader className="bg-blue-50 pb-3">
                  <CardTitle className="text-lg">Storage Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Storage Unit</p>
                      <p className="font-medium">{getCurrentUnit().name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-400" />
                        <p className="font-medium">{getCurrentUnit().location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{getCurrentUnit().capacity}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Power Source</p>
                      <p className="font-medium">
                        {getCurrentUnit().powerSource === 'solar' 
                          ? 'Solar Powered' 
                          : 'Hybrid (Solar + Grid)'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Storage Benefits</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <Timer size={14} className="mr-2 text-amber-500 mt-1 flex-shrink-0" />
                      <span>Extends produce shelf life by 2-3 weeks</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Sun size={14} className="mr-2 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>100% solar-powered, eco-friendly operation</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Smartphone size={14} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Real-time monitoring via mobile app</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Users size={14} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                      <span>Community-owned and operated facility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("booking")}
                    >
                      <Bookmark size={14} className="mr-2" />
                      Book Storage Space
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart size={14} className="mr-2" />
                      View Usage Reports
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar size={14} className="mr-2" />
                      Schedule Pickup/Delivery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="booking">Book Storage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="mt-0">
                  {renderDashboard()}
                </TabsContent>
                
                <TabsContent value="booking" className="mt-0">
                  {renderBooking()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ColdChainSolution;

// Helper component for rendering
const CheckCircle: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
