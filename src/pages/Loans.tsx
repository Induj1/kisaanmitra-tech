
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import LoanApplicationList from '@/components/LoanApplicationList';
import CreditTracker from '@/components/CreditTracker';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { InfoIcon, AlertTriangle, BadgeCheck, BanknoteIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Loans = () => {
  const { user } = useAuth();
  const [isHighContrast, setIsHighContrast] = useState(false);
  const { language, setLanguage, translate } = useLanguage();
  const [creditScore, setCreditScore] = useState(650);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };
  
  const handleProfileRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header 
        toggleContrast={toggleContrast} 
        isHighContrast={isHighContrast}
      />
      
      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {translate('loans')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {translate('applyForLoans')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
                  <div className="flex items-center">
                    <BanknoteIcon className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                    <CardTitle className="text-xl text-green-700 dark:text-green-400">
                      Loan Eligibility
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Check your eligibility for agricultural loans
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <CreditTracker 
                    creditScore={creditScore}
                    onRefresh={handleProfileRefresh}
                  />
                  
                  <div className="mt-6">
                    <Alert variant={creditScore >= 600 ? "default" : "destructive"}>
                      {creditScore >= 600 ? (
                        <BadgeCheck className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {creditScore >= 600 ? "You are eligible for loans" : "Limited loan eligibility"}
                      </AlertTitle>
                      <AlertDescription>
                        {creditScore >= 600 
                          ? "With your current credit score, you can apply for agricultural loans up to ₹50,000."
                          : "Your credit score is below our threshold. You can only apply for small loans up to ₹10,000."}
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <div className="flex items-start gap-3">
                      <InfoIcon className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-400">
                          How to improve your credit score
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-blue-800 dark:text-blue-300">
                          <li>Complete your profile with valid information</li>
                          <li>Make marketplace transactions on the platform</li>
                          <li>Repay existing loans on time</li>
                          <li>Maintain regular farming activity records</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="bg-primary/10 border-b">
                  <CardTitle>Loan Schemes</CardTitle>
                  <CardDescription>Available loan options</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-white dark:bg-gray-800">
                      <h4 className="font-medium text-primary">Crop Loan</h4>
                      <p className="text-sm mt-1">Short-term loan for seasonal crops</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">4%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-white dark:bg-gray-800">
                      <h4 className="font-medium text-primary">Equipment Loan</h4>
                      <p className="text-sm mt-1">For purchasing farm equipment</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">6%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-white dark:bg-gray-800">
                      <h4 className="font-medium text-primary">Land Development Loan</h4>
                      <p className="text-sm mt-1">For irrigation and land improvements</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">5.5%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md bg-white dark:bg-gray-800">
                      <h4 className="font-medium text-primary">Micro Loan</h4>
                      <p className="text-sm mt-1">Small loans for immediate needs</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="apply" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
              <TabsTrigger value="history">Loan History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apply">
              <LoanApplicationForm 
                userId={user?.id} 
                creditScore={creditScore} 
              />
            </TabsContent>
            
            <TabsContent value="history">
              <LoanApplicationList 
                userId={user?.id} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Loans;
