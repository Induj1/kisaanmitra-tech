import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageLayout from '@/components/PageLayout';
import LocationAccessPopup from '@/components/LocationAccessPopup';
import SensorDataWidget from '@/components/SensorDataWidget';
import DeviceConnectionDialog from '@/components/DeviceConnectionDialog';
import { 
  Cloud, 
  Tractor, 
  BarChart4, 
  Lightbulb, 
  Droplets, 
  Calendar, 
  SlidersHorizontal, 
  Wifi,
  TrendingUp,
  Thermometer,
  AlertTriangle,
  Leaf,
  Activity,
  Building2,
  Bot
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, isNewUser, setIsNewUser } = useAuth();
  const { translate } = useLanguage();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy"
  });
  const [alertsData, setAlertsData] = useState([
    { id: 1, type: "Weather", message: "Heavy rain expected tomorrow", severity: "medium" },
    { id: 2, type: "Soil", message: "Low moisture in Field 2", severity: "high" }
  ]);
  const [tasksData, setTasksData] = useState([
    { id: 1, title: "Irrigate North Field", dueDate: "Today", status: "pending" },
    { id: 2, title: "Apply fertilizer to crops", dueDate: "Tomorrow", status: "pending" },
    { id: 3, title: "Inspect irrigation system", dueDate: "3 days", status: "completed" }
  ]);
  const [sendingRiskAlert, setSendingRiskAlert] = useState(false);

  useEffect(() => {
    const storedLat = localStorage.getItem('userLatitude');
    const storedLng = localStorage.getItem('userLongitude');
    
    if (storedLat && storedLng) {
      setLatitude(parseFloat(storedLat));
      setLongitude(parseFloat(storedLng));
      setLocationGranted(true);
    } else if (!locationGranted && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationGranted(true);
          
          localStorage.setItem('userLatitude', position.coords.latitude.toString());
          localStorage.setItem('userLongitude', position.coords.longitude.toString());
        },
        (error) => {
          console.log("Geolocation error or permission denied:", error);
        }
      );
    }
    
    if (isNewUser) {
      setShowLocationPopup(true);
      setIsNewUser(false);
    }
  }, [isNewUser, setIsNewUser, locationGranted]);

  const handleLocationGranted = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationGranted(true);
    
    localStorage.setItem('userLatitude', lat.toString());
    localStorage.setItem('userLongitude', lng.toString());
  };

  const handleSendRiskAlert = async () => {
    try {
      setSendingRiskAlert(true);
      const response = await fetch("https://cd63ce29821c.ngrok-free.app/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "risk_alert",
          source: "web_dashboard",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send alert");
      }

      window.alert("Risk alert sent to the mobile app.");
    } catch (error) {
      console.error("Error sending risk alert:", error);
      window.alert("Failed to send risk alert. Please try again.");
    } finally {
      setSendingRiskAlert(false);
    }
  };

  const featureItems = [
    {
      icon: Bot,
      title: 'Jarvis Assistant',
      description: 'Ask once to plan, check prices, or open any tool',
      route: '/assistant',
      color: 'bg-emerald-500',
    },
    {
      icon: Cloud,
      title: translate('weather'),
      description: translate('checkForecasts'),
      route: '/weather',
      color: 'bg-blue-500',
    },
    {
      icon: Tractor,
      title: translate('farmPlanner'),
      description: translate('planFarmActivities'),
      route: '/farm-planner',
      color: 'bg-green-500',
    },
    {
      icon: Lightbulb,
      title: translate('askExpert'),
      description: translate('getAIAdvice'),
      route: '/ask-expert',
      color: 'bg-orange-500',
    },
    {
      icon: Calendar,
      title: translate('cropCalendar'),
      description: translate('seasonalPlanting'),
      route: '/crop-calendar',
      color: 'bg-indigo-500',
    },
    {
      icon: Leaf,
      title: translate('cropAnalysis'),
      description: translate('analyzeYourCrops'),
      route: '/crop-analysis',
      color: 'bg-lime-500',
    },
    {
      icon: Building2,
      title: translate('government'),
      description: 'Government schemes and support',
      route: '/government',
      color: 'bg-slate-500',
    },
    {
      icon: SlidersHorizontal,
      title: translate('settings'),
      description: translate('managePreferences'),
      route: '/settings',
      color: 'bg-gray-500',
    },
  ];

  const renderAlertIcon = (severity: string) => {
    switch(severity) {
      case 'high':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'medium':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'low':
        return <AlertTriangle className="text-blue-500" size={18} />;
      default:
        return <AlertTriangle className="text-gray-500" size={18} />;
    }
  };

  const getTaskStatusStyle = (status: string) => {
    switch(status) {
      case 'completed':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <PageLayout>
      {/* Hero Section with Agricultural Background */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}/>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Leaf className="w-8 h-8" />
                {translate('welcome')}, {user?.email?.split('@')[0] || 'Farmer'}!
              </h1>
              <p className="text-green-100 text-lg">
                {translate('personalizedAssistant')} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowDeviceDialog(true)}
                variant="outline"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                <Wifi size={18} />
                Connect Device
              </Button>
              <Button
                onClick={handleSendRiskAlert}
                disabled={sendingRiskAlert}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                <AlertTriangle size={18} />
                {sendingRiskAlert ? "Sending..." : "Send Risk Alert"}
              </Button>
              <Button 
                asChild
                className="bg-white text-green-700 hover:bg-green-50 shadow-lg"
              >
                <Link to="/farm-planner">
                  <Tractor className="mr-2" size={18} />
                  Plan Farm
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Current Temperature</p>
                      <h3 className="text-3xl font-bold mt-1 text-blue-900 dark:text-blue-100">{weatherData.temperature}°C</h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                        <Cloud size={14} />
                        {weatherData.condition}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500 shadow-lg">
                      <Thermometer className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">Soil Moisture</p>
                      <h3 className="text-3xl font-bold mt-1 text-green-900 dark:text-green-100">62%</h3>
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                        <Activity size={14} />
                        Optimal Level
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500 shadow-lg">
                      <Droplets className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Crop Health</p>
                      <h3 className="text-3xl font-bold mt-1 text-amber-900 dark:text-amber-100">Good</h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                        <AlertTriangle size={14} />
                        2 Warnings
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-500 shadow-lg">
                      <Leaf className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Market Trends</p>
                      <h3 className="text-3xl font-bold mt-1 text-purple-900 dark:text-purple-100">+2.4%</h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                        <TrendingUp size={14} />
                        Above Average
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500 shadow-lg">
                      <BarChart4 className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all">
                <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Alerts
                  </CardTitle>
                  <CardDescription>Important notifications for your farm</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {alertsData.map(alert => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                        {renderAlertIcon(alert.severity)}
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{alert.type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1 shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Calendar className="w-5 h-5" />
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>Your scheduled farm activities</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {tasksData.map(task => (
                      <div key={task.id} className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shadow-lg ${task.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{task.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTaskStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1 shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all">
                <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <TrendingUp className="w-5 h-5" />
                    Farm Performance
                  </CardTitle>
                  <CardDescription>Overall trends in your farm operations</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p>Monitoring yield, input usage, and crop health over time.</p>
                    <p>Use the Analytics tab for detailed charts and breakdowns.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 dark:from-teal-950 dark:via-green-950 dark:to-emerald-950">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Activity className="w-6 h-6" />
                    Farm Health Overview
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">Real-time sensor data from your fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <SensorDataWidget />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farm Analytics</CardTitle>
                <CardDescription>Detailed analysis of your farm performance</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Activity size={48} className="text-primary mx-auto mb-4 opacity-40" />
                  <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mt-2">
                    View detailed analytics about your farm performance, crop yields, resource usage, and financial metrics.
                  </p>
                  <Button className="mt-4">View Full Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sensors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Connected Devices</CardTitle>
                    <CardDescription>Manage your IoT sensors and devices</CardDescription>
                  </div>
                  <Button onClick={() => setShowDeviceDialog(true)} variant="outline" size="sm">
                    <Wifi className="mr-2" size={16} />
                    Add Device
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border border-green-200 dark:border-green-900">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Soil Moisture Sensor</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Field 1 - North</p>
                          <div className="flex items-center mt-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-xs text-green-600">Connected</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">62%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Last update: 5m ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-amber-200 dark:border-amber-900">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Temperature Sensor</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Greenhouse</p>
                          <div className="flex items-center mt-2">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                            <span className="text-xs text-amber-600">Warning</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">32°C</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Last update: 2m ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Irrigation Controller</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Field 2 - South</p>
                          <div className="flex items-center mt-2">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                            <span className="text-xs text-blue-600">Operational</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Auto Mode</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Next watering: Today 6PM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <Tractor className="w-7 h-7 text-green-600" />
          {translate('features')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featureItems.map((item, index) => (
            <Link to={item.route} key={index} className="group transition-transform hover:scale-105 hover:shadow-xl">
              <Card className="h-full shadow-lg border-0 hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800">
                <div className={`h-2 ${item.color.replace('bg-', 'bg-gradient-to-r from-').replace('-500', '-400 to-' + item.color.split('-')[1] + '-600')}`}></div>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <LocationAccessPopup 
        open={showLocationPopup} 
        onOpenChange={setShowLocationPopup}
        onLocationGranted={handleLocationGranted}
      />

      <DeviceConnectionDialog
        open={showDeviceDialog}
        onOpenChange={setShowDeviceDialog}
      />
    </PageLayout>
  );
};

export default Dashboard;
