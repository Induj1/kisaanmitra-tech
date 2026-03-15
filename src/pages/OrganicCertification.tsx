
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
  Leaf,
  ListChecks,
  QrCode,
  BarChart,
  FileText,
  Calendar,
  Clock,
  Flower,
  Droplets,
  Flame,
  Shield,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Upload,
  ShieldCheck
} from 'lucide-react';

const OrganicCertification: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(false);
  const [certificationStatus, setCertificationStatus] = useState<number>(68);
  const [farmData, setFarmData] = useState<any>(null);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("");
  const [inputQuantity, setInputQuantity] = useState<string>("");
  const [inputDate, setInputDate] = useState<string>("");
  const [inputDescription, setInputDescription] = useState<string>("");
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      // Mock farm data
      setFarmData({
        farmName: "Himalayan Organic Farm",
        location: "Darjeeling, West Bengal",
        area: "4.5 hectares",
        crops: ["Tea", "Ginger", "Cardamom"],
        certificationProgress: 68,
        startDate: "2024-12-15",
        estimatedCompletionDate: "2025-06-15",
        status: "in-progress",
        requirements: [
          { id: 1, name: "No synthetic fertilizers for 36 months", status: "completed", date: "2025-01-15" },
          { id: 2, name: "Soil testing documentation", status: "completed", date: "2025-02-10" },
          { id: 3, name: "Buffer zones from conventional farms", status: "completed", date: "2025-02-28" },
          { id: 4, name: "Approved organic seeds and planting stock", status: "completed", date: "2025-03-05" },
          { id: 5, name: "Crop rotation implementation", status: "in-progress", date: null },
          { id: 6, name: "Water management plan", status: "in-progress", date: null },
          { id: 7, name: "Pest management records", status: "pending", date: null },
          { id: 8, name: "Harvest and post-harvest handling protocols", status: "pending", date: null }
        ],
        inputLog: [
          { id: 1, type: "Fertilizer", name: "Vermicompost", quantity: "500 kg", date: "2025-01-10", approved: true },
          { id: 2, type: "Fertilizer", name: "Cow Manure", quantity: "800 kg", date: "2025-02-05", approved: true },
          { id: 3, type: "Pest Control", name: "Neem Oil Spray", quantity: "20 liters", date: "2025-02-20", approved: true },
          { id: 4, type: "Seeds", name: "Organic Ginger Rhizomes", quantity: "200 kg", date: "2025-03-01", approved: true }
        ]
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputType || !inputQuantity || !inputDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new input log entry
    const newInputLog = {
      id: farmData.inputLog.length + 1,
      type: inputType,
      name: inputDescription || `Organic ${inputType}`,
      quantity: inputQuantity,
      date: inputDate,
      approved: true // Auto-approve for demo purposes
    };
    
    // Update farm data
    setFarmData({
      ...farmData,
      inputLog: [...farmData.inputLog, newInputLog]
    });
    
    // Show success message
    toast({
      title: "Input Recorded",
      description: `Added ${inputQuantity} of ${inputDescription || inputType} to your organic certification records.`,
    });
    
    // Reset form
    setInputType("");
    setInputQuantity("");
    setInputDate("");
    setInputDescription("");
  };
  
  const generateQRCode = () => {
    setLoading(true);
    
    // Simulate API call to generate QR code
    setTimeout(() => {
      setQrCodeGenerated(true);
      setLoading(false);
      
      toast({
        title: "QR Code Generated",
        description: "Your organic certification QR code has been generated successfully.",
      });
    }, 2000);
  };
  
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Leaf className="mr-2 text-green-600" size={20} />
              Certification Progress
            </CardTitle>
            <CardDescription>Organic certification journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Overall progress</span>
                  <span className="font-medium">{farmData?.certificationProgress || 0}%</span>
                </div>
                <Progress value={farmData?.certificationProgress || 0} className="h-2 bg-gray-100" />
              </div>
              
              <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Started</p>
                  <p className="font-medium">
                    {farmData?.startDate ? new Date(farmData.startDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Completion</p>
                  <p className="font-medium">
                    {farmData?.estimatedCompletionDate ? new Date(farmData.estimatedCompletionDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-start">
                  <AlertCircle size={18} className="mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Next Steps Required</p>
                    <ul className="mt-1 space-y-1">
                      <li className="text-xs text-amber-700">• Complete water management documentation</li>
                      <li className="text-xs text-amber-700">• Submit pest management records by May 15</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveTab("requirements")}>
              <ListChecks size={16} className="mr-2" /> View All Requirements
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <QrCode className="mr-2 text-primary" size={20} />
              Organic Certification QR
            </CardTitle>
            <CardDescription>Generate QR code for product verification</CardDescription>
          </CardHeader>
          <CardContent>
            {qrCodeGenerated ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-md border mb-3">
                  <img 
                    src="https://via.placeholder.com/200x200?text=Organic+QR" 
                    alt="QR Code" 
                    className="w-36 h-36"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kisaanmitra.org/verify/himalayan-organic-farm";
                    }}
                  />
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-medium">Scan to verify organic certification</p>
                  <p className="text-xs text-gray-500 mt-1">Valid until: June 15, 2025</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <QrCode size={60} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Generate a QR code that customers can scan to verify your organic certification
                </p>
                <Button 
                  onClick={generateQRCode} 
                  disabled={loading || (farmData?.certificationProgress || 0) < 50}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Generate QR Code</>
                  )}
                </Button>
                {(farmData?.certificationProgress || 0) < 50 && (
                  <p className="text-xs text-amber-600 mt-2">
                    You need to complete at least 50% of certification requirements
                  </p>
                )}
              </div>
            )}
          </CardContent>
          {qrCodeGenerated && (
            <CardFooter className="pt-0 flex justify-between">
              <Button size="sm" variant="outline">
                <Smartphone size={14} className="mr-1" /> Share
              </Button>
              <Button size="sm" variant="outline">
                <Download size={14} className="mr-1" /> Download
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center">
                <ListChecks className="mr-2 text-primary" size={20} />
                Recent Farm Inputs
              </CardTitle>
              <CardDescription>Track your organic farming inputs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("inputs")}>
              Add New Input
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Type</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Input</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Quantity</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Date Applied</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {farmData?.inputLog.slice().reverse().slice(0, 5).map((input: any) => (
                  <tr key={input.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{input.type}</td>
                    <td className="py-3 text-sm font-medium">{input.name}</td>
                    <td className="py-3 text-sm">{input.quantity}</td>
                    <td className="py-3 text-sm">{new Date(input.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${input.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {input.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {(!farmData?.inputLog || farmData.inputLog.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No inputs recorded yet. Start tracking your organic farm inputs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderRequirements = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ListChecks className="mr-2 text-primary" size={20} />
            Certification Requirements Checklist
          </CardTitle>
          <CardDescription>Track your organic certification requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Overall progress</span>
                <span className="font-medium">{farmData?.certificationProgress || 0}%</span>
              </div>
              <Progress value={farmData?.certificationProgress || 0} className="h-2 bg-gray-100" />
            </div>
            
            <div className="space-y-4">
              {farmData?.requirements.map((req: any) => (
                <div key={req.id} className={`p-3 rounded-md border ${
                  req.status === 'completed' ? 'bg-green-50 border-green-200' : 
                  req.status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      {req.status === 'completed' ? (
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : req.status === 'in-progress' ? (
                        <Clock size={18} className="mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle size={18} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{req.name}</p>
                        {req.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed on: {new Date(req.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        req.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 text-primary" size={20} />
            Documentation Required
          </CardTitle>
          <CardDescription>Files needed for your organic certification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Soil Test Results</p>
                    <p className="text-xs text-gray-500">Required format: PDF</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Upload size={14} className="mr-1" /> Upload
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Farm Map with Buffer Zones</p>
                    <p className="text-xs text-gray-500">Required format: JPG, PNG</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Upload size={14} className="mr-1" /> Upload
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Water Management Plan</p>
                    <p className="text-xs text-gray-500">Required format: PDF, DOC</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Upload size={14} className="mr-1" /> Upload
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Seed Purchase Records</p>
                    <p className="text-xs text-gray-500">Required format: PDF, XLS</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Upload size={14} className="mr-1" /> Upload
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderInputLog = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ListChecks className="mr-2 text-primary" size={20} />
            Add New Farm Input
          </CardTitle>
          <CardDescription>Record fertilizers, seeds, pest control or other inputs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddInput} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input-type">Input Type <span className="text-red-500">*</span></Label>
                <Select value={inputType} onValueChange={setInputType} required>
                  <SelectTrigger id="input-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                    <SelectItem value="Seeds">Seeds</SelectItem>
                    <SelectItem value="Pest Control">Pest Control</SelectItem>
                    <SelectItem value="Soil Amendment">Soil Amendment</SelectItem>
                    <SelectItem value="Water">Irrigation Water</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="input-quantity">Quantity <span className="text-red-500">*</span></Label>
                <Input
                  id="input-quantity"
                  placeholder="e.g., 500 kg, 20 liters"
                  value={inputQuantity}
                  onChange={(e) => setInputQuantity(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-date">Date Applied <span className="text-red-500">*</span></Label>
              <Input
                id="input-date"
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-description">Description</Label>
              <Input
                id="input-description"
                placeholder="e.g., Vermicompost, Neem Oil Spray"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Record Input
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 text-primary" size={20} />
            Input History Log
          </CardTitle>
          <CardDescription>Complete record of all inputs used on your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Type</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Input</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Quantity</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Date Applied</th>
                  <th className="text-left py-2 font-medium text-sm text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {farmData?.inputLog.slice().reverse().map((input: any) => (
                  <tr key={input.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{input.type}</td>
                    <td className="py-3 text-sm font-medium">{input.name}</td>
                    <td className="py-3 text-sm">{input.quantity}</td>
                    <td className="py-3 text-sm">{new Date(input.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${input.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {input.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {(!farmData?.inputLog || farmData.inputLog.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No inputs recorded yet. Add your first farm input using the form above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ShieldCheck className="mr-3 text-green-600" />
              Smart Organic Certification Tracker
            </h1>
            <p className="text-gray-600 mt-2">
              Track, monitor, and verify your organic certification journey
            </p>
          </div>
        </div>
        
        {loading && !farmData ? (
          <div className="h-60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-500">Loading farm data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader className="bg-green-50 pb-3">
                  <CardTitle className="text-lg">Farm Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Farm Name</p>
                      <p className="font-medium">{farmData?.farmName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{farmData?.location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{farmData?.area || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Main Crops</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {farmData?.crops.map((crop: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText size={14} className="mr-1" /> View Full Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Certification Benefits</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <Flame size={14} className="mr-2 text-amber-500 mt-1 flex-shrink-0" />
                      <span>Premium pricing for organic produce</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Flower size={14} className="mr-2 text-pink-500 mt-1 flex-shrink-0" />
                      <span>Access to specialty organic markets</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Droplets size={14} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Improved soil health and biodiversity</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <Shield size={14} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                      <span>Government subsidies for organic farmers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Help Resources</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText size={14} className="mr-2" />
                      Certification Guidelines
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <PlayCircle size={14} className="mr-2" />
                      Video Tutorials
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare size={14} className="mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="inputs">Input Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="mt-0">
                  {renderDashboard()}
                </TabsContent>
                
                <TabsContent value="requirements" className="mt-0">
                  {renderRequirements()}
                </TabsContent>
                
                <TabsContent value="inputs" className="mt-0">
                  {renderInputLog()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default OrganicCertification;

// Helper components for rendering
const Circle: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const PlayCircle: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

const MessageSquare: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Download: React.FC<{size: number, className: string}> = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
