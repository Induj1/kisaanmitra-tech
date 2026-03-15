
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabaseExt } from '@/integrations/supabase/clientExt';
import { Loader2 } from 'lucide-react';

interface CreditTrackerProps {
  totalCredits?: number;
  usedCredits?: number;
  pendingCredits?: number;
  creditScore?: number;
  onRefresh?: () => void;
}

const CreditTracker: React.FC<CreditTrackerProps> = ({
  totalCredits: initialTotalCredits = 1000,
  usedCredits: initialUsedCredits = 75,
  pendingCredits: initialPendingCredits = 100,
  creditScore: initialCreditScore,
  onRefresh
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [creditScore, setCreditScore] = useState(initialCreditScore);
  const [totalCredits, setTotalCredits] = useState(initialTotalCredits);
  const [usedCredits, setUsedCredits] = useState(initialUsedCredits);
  const [pendingCredits, setPendingCredits] = useState(initialPendingCredits);
  
  useEffect(() => {
    if (user) {
      fetchCreditData();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (initialCreditScore !== undefined) {
      setCreditScore(initialCreditScore);
    }
  }, [initialCreditScore]);
  
  const fetchCreditData = async () => {
    setIsLoading(true);
    try {
      // Fetch user credit score
      const { data: profileData, error: profileError } = await supabaseExt
        .from('farmer_profiles')
        .select('credit_score')
        .eq('user_id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profileData) {
        setCreditScore(profileData.credit_score);
      }
      
      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabaseExt
        .from('marketplace_transactions')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (transactionsError) throw transactionsError;
      
      if (transactionsData) {
        setTransactions(transactionsData);
        
        // Calculate used credits based on transactions
        const used = transactionsData
          .filter(t => t.buyer_id === user.id)
          .reduce((sum, t) => sum + (t.credits_used || 0), 0);
        
        setUsedCredits(used);
        
        // Get pending credits (simulated - would be from pending harvests/verifications)
        setPendingCredits(50);
      }
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error fetching credit data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate available credits
  const availableCredits = creditScore !== undefined ? creditScore : 0;
  const usedPercentage = Math.min(100, Math.round((usedCredits / totalCredits) * 100));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="text-lg">
          {creditScore !== undefined ? 'Credit Score' : 'Credit Tracker'}
        </CardTitle>
        <CardDescription>
          {creditScore !== undefined 
            ? `Your current credit score: ${creditScore}` 
            : 'Monitor and use your KisaanMitra credits'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : creditScore !== undefined ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Credit Score</span>
              <span className={`text-lg font-bold ${
                creditScore >= 700 ? 'text-green-600' :
                creditScore >= 600 ? 'text-amber-600' : 'text-red-600'
              }`}>{creditScore}</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Poor</span>
                <span className="text-xs text-gray-500">Excellent</span>
              </div>
              <Progress value={(creditScore / 850) * 100} className="h-2" />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Loan Eligibility</span>
                <span className={`text-sm font-semibold ${
                  creditScore >= 600 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {creditScore >= 600 ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {creditScore >= 600 
                  ? 'You can apply for loans based on your credit score' 
                  : 'Improve your credit score to become eligible for loans'}
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Marketplace Discount</span>
                <span className="text-sm font-semibold text-green-600">
                  10% off using credits
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Use your credits in the marketplace for discounts on purchases
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Available Credits</span>
              <span className="text-lg font-bold text-primary">{availableCredits}</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Used</span>
                <span className="text-xs text-gray-500">{usedCredits} of {totalCredits} credits</span>
              </div>
              <Progress value={usedPercentage} className="h-2" />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pending Credits</span>
                <span className="text-sm font-semibold text-amber-600">+{pendingCredits}</span>
              </div>
              <p className="text-xs text-gray-600">Credits will be added to your account after harvest verification</p>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Recent Transactions</h4>
              
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map(transaction => {
                    const isBuyer = transaction.buyer_id === user.id;
                    const amount = transaction.credits_used || 0;
                    
                    return (
                      <div key={transaction.id} className="flex justify-between items-center text-sm">
                        <span>{isBuyer ? 'Purchase' : 'Sale'}: {transaction.product_title || 'Product'}</span>
                        <span className={isBuyer ? 'text-red-500' : 'text-green-500'}>
                          {isBuyer ? `-${amount}` : '+50'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent transactions</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      {!isLoading && !creditScore && (
        <CardFooter className="flex justify-between space-x-2">
          <Button variant="outline" className="flex-1" onClick={fetchCreditData}>
            Refresh
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary-dark" onClick={() => window.location.href = '/marketplace'}>
            Marketplace
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CreditTracker;
