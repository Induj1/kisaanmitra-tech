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
  Wifi,
  TrendingUp,
  Thermometer,
  AlertTriangle,
  Leaf,
  Activity,
  Building2,
  Package,
  Landmark,
  User,
  Mic,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

/** Card hero images (Unsplash — see https://unsplash.com/license). */
const cardImage = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=640&h=360&q=80`;

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
  color: string;
  image: string;
  imageAlt: string;
};

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

  const featureItems: FeatureItem[] = [
    {
      icon: Mic,
      title: 'Voice Assistant',
      description: 'Jarvis: plan, prices, and tools by voice or chat',
      route: '/assistant',
      color: 'bg-violet-500',
      image: cardImage('photo-1478737270239-2f02b77fc618'),
      imageAlt: 'Microphone for voice farming assistant',
    },
    {
      icon: Leaf,
      title: translate('cropAnalysis'),
      description: translate('analyzeYourCrops'),
      route: '/crop-analysis',
      color: 'bg-lime-500',
      image: cardImage('photo-1500651230702-0e2d8a49d4ad'),
      imageAlt: 'Rows of healthy crops in a field',
    },
    {
      icon: Lightbulb,
      title: 'Crop Advice',
      description: translate('getAIAdvice'),
      route: '/ask-expert',
      color: 'bg-teal-500',
      image: cardImage('photo-1416879595882-3373a0480b5b'),
      imageAlt: 'Farmer reviewing crops for expert advice',
    },
    {
      icon: Package,
      title: 'Marketplace',
      description: 'Buy and sell produce with farm credits',
      route: '/marketplace',
      color: 'bg-amber-500',
      image: cardImage('photo-1488459716781-31db52582fe9'),
      imageAlt: 'Fresh produce at a local market',
    },
    {
      icon: Building2,
      title: 'Apply Loan',
      description: 'Apply for agricultural credit and track status',
      route: '/loans',
      color: 'bg-rose-500',
      image: cardImage('photo-1560179707-f14e90ef3623'),
      imageAlt: 'Financial services and banking support',
    },
    {
      icon: User,
      title: 'My Profile',
      description: translate('managePreferences'),
      route: '/settings',
      color: 'bg-sky-500',
      image: cardImage('photo-1507003211169-0a1dd7228f2d'),
      imageAlt: 'Farmer profile and account settings',
    },
    {
      icon: Cloud,
      title: translate('weather'),
      description: translate('checkForecasts'),
      route: '/weather',
      color: 'bg-blue-500',
      image: cardImage('photo-1504608524841-42fe6f032b4b'),
      imageAlt: 'Weather clouds over farmland',
    },
    {
      icon: Tractor,
      title: translate('farmPlanner'),
      description: translate('planFarmActivities'),
      route: '/farm-planner',
      color: 'bg-green-500',
      image: cardImage('photo-1625246333195-78d9c38ad449'),
      imageAlt: 'Tractor in a green field',
    },
    {
      icon: Calendar,
      title: translate('cropCalendar'),
      description: translate('seasonalPlanting'),
      route: '/crop-calendar',
      color: 'bg-indigo-500',
      image: cardImage('photo-1416879595882-3373a0480b5b'),
      imageAlt: 'Planting and seasonal farm calendar',
    },
    {
      icon: Landmark,
      title: translate('government'),
      description: 'Government schemes and support',
      route: '/government',
      color: 'bg-slate-500',
      image: cardImage('photo-1486406146926-c627a92ad1ab'),
      imageAlt: 'Institutions and government agriculture programs',
    },
  ];

  const renderAlertIcon = (severity: string) => {
    switch (severity) {
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
    switch (status) {
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
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
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

            <div className="flex flex-wrap gap-3">
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
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Market Trend</p>
                      <h3 className="text-3xl font-bold mt-1 text-purple-900 dark:text-purple-100">+12%</h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                        <TrendingUp size={14} />
                        vs last month
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500 shadow-lg">
                      <BarChart4 className="text-white" size={28} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" size={20} />
                    Active Alerts
                  </CardTitle>
                  <CardDescription>Issues that need your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertsData.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.type}</TableCell>
                          <TableCell>{alert.message}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {renderAlertIcon(alert.severity)}
                              <span className="capitalize">{alert.severity}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-green-600" size={20} />
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>Your farm to-do list</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasksData.map((task) => (
                      <div
                        key={task.id}
                        className={`flex justify-between items-center p-3 rounded-lg ${getTaskStatusStyle(task.status)}`}
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs opacity-80">Due: {task.dueDate}</p>
                        </div>
                        <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart4 size={22} />
                  Yield &amp; input summary
                </CardTitle>
                <CardDescription>High-level trends for your operation (sample data)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Est. yield index', value: '94%', tone: 'text-green-600' },
                    { label: 'Water use vs target', value: '−8%', tone: 'text-blue-600' },
                    { label: 'Input cost trend', value: '+3%', tone: 'text-amber-600' },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl border p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground">{row.label}</p>
                      <p className={`text-2xl font-bold ${row.tone}`}>{row.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <SensorDataWidget />
            <Card>
              <CardHeader>
                <CardTitle>Device status</CardTitle>
                <CardDescription>Connected field hardware (sample)</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex justify-between items-start p-4 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div>
                    <h4 className="font-medium">Soil sensor pack</h4>
                    <p className="text-xs text-muted-foreground">Field 1 — North</p>
                    <p className="text-xs text-emerald-600 mt-2">Online</p>
                  </div>
                  <Activity className="text-emerald-500" size={22} />
                </div>
                <div className="flex justify-between items-start p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div>
                    <h4 className="font-medium">Greenhouse temperature</h4>
                    <p className="text-xs text-muted-foreground">Zone B</p>
                    <p className="text-xs text-amber-600 mt-2">Warning</p>
                  </div>
                  <Thermometer className="text-amber-500" size={22} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <Tractor className="w-7 h-7 text-green-600" />
          {translate('features')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {featureItems.map((item, index) => (
            <Link to={item.route} key={index} className="group transition-transform hover:scale-[1.02] hover:shadow-xl">
              <Card className="h-full shadow-lg border-0 hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" aria-hidden />
                  <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl flex items-center justify-center ${item.color} shadow-lg ring-2 ring-white/90 dark:ring-gray-900/80`}>
                    <item.icon size={24} className="text-white" aria-hidden />
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{item.description}</p>
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
