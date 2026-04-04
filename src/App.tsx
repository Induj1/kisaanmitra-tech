import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Demo from "./pages/Demo";
import Government from "./pages/Government";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FarmPlanner from "./pages/FarmPlanner";
import Marketplace from "./pages/Marketplace";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import Loans from "./pages/Loans";
import AskExpert from "./pages/AskExpert";
import NotFound from "./pages/NotFound";
import CropCalendar from "./pages/CropCalendar";
import Settings from "./pages/Settings";
import DroneMonitoring from "./pages/DroneMonitoring";
import OrganicCertification from "./pages/OrganicCertification";
import ColdChainSolution from "./pages/ColdChainSolution";
import LivestockMonitoring from "./pages/LivestockMonitoring";
import CropAnalysis from '@/pages/CropAnalysis';
import JarvisAssistant from "./pages/JarvisAssistant";
import FarmPlannerDetail from "./pages/features/FarmPlannerDetail";
import MarketplaceDetail from "./pages/features/MarketplaceDetail";
import WeatherDetail from "./pages/features/WeatherDetail";
import AskExpertDetail from "./pages/features/AskExpertDetail";
import GovernmentSchemesDetail from "./pages/features/GovernmentSchemesDetail";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/features" element={<Features />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/government" element={<Government />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      
      {/* Feature Detail Pages */}
      <Route path="/features/farm-planner" element={<FarmPlannerDetail />} />
      <Route path="/features/marketplace" element={<MarketplaceDetail />} />
      <Route path="/features/weather" element={<WeatherDetail />} />
      <Route path="/features/ask-expert" element={<AskExpertDetail />} />
      <Route path="/features/government-schemes" element={<GovernmentSchemesDetail />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/farm-planner" 
        element={
          <ProtectedRoute>
            <FarmPlanner />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/marketplace" 
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/weather" 
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/market-prices" 
        element={
          <ProtectedRoute>
            <MarketPrices />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loans" 
        element={
          <ProtectedRoute>
            <Loans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ask-expert" 
        element={
          <ProtectedRoute>
            <AskExpert />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assistant" 
        element={
          <ProtectedRoute>
            <JarvisAssistant />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/crop-calendar" 
        element={
          <ProtectedRoute>
            <CropCalendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* New pages */}
      <Route 
        path="/drone-monitoring" 
        element={
          <ProtectedRoute>
            <DroneMonitoring />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organic-certification" 
        element={
          <ProtectedRoute>
            <OrganicCertification />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cold-chain-solution" 
        element={
          <ProtectedRoute>
            <ColdChainSolution />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/livestock-monitoring" 
        element={
          <ProtectedRoute>
            <LivestockMonitoring />
          </ProtectedRoute>
        } 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="/crop-analysis" element={<CropAnalysis />} />
      <Route path="/crop-analysis/report" element={<CropAnalysis />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const toggleContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    document.documentElement.classList.toggle('high-contrast', newValue);
  };
  
  // Initialize contrast mode from localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
                <AppRoutes />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
