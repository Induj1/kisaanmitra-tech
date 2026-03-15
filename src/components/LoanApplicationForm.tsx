
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import CreditTracker from './CreditTracker';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LoanApplicationFormProps {
  userId: string | undefined;
  creditScore: number;
}

const formSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Loan amount must be a positive number",
  }),
  purpose: z.string().min(10, { message: "Please provide a detailed purpose for the loan" }),
});

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ userId, creditScore = 0 }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEligible = creditScore >= 600;
  const maxLoanAmount = calculateMaxLoanAmount(creditScore);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      purpose: '',
    },
  });

  function calculateMaxLoanAmount(creditScore: number): number {
    // Simple calculation based on credit score
    if (creditScore < 600) return 0;
    if (creditScore < 650) return 25000;
    if (creditScore < 700) return 50000;
    if (creditScore < 750) return 100000;
    return 200000;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to apply for a loan",
      });
      return;
    }

    if (!isEligible) {
      toast({
        variant: "destructive",
        title: "Not Eligible",
        description: "Your credit score is too low to apply for a loan",
      });
      return;
    }

    const amount = Number(values.amount);
    if (amount > maxLoanAmount) {
      toast({
        variant: "destructive",
        title: "Amount Too High",
        description: `The maximum loan amount for your credit score is ₹${maxLoanAmount}`,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([{
          user_id: userId,
          amount: amount,
          purpose: values.purpose,
          credit_score_at_application: creditScore,
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast({
          title: "Loan Application Successful",
          description: "Your loan application has been submitted. We will contact you shortly.",
        });
        
        form.reset();
      }
    } catch (error: any) {
      console.error('Error submitting loan application:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit loan application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to apply for loans.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium mb-2">Loan Eligibility</h3>
        <div className="mb-4">
          <CreditTracker creditScore={creditScore} />
        </div>
        <p className="text-sm">
          {isEligible 
            ? `You are eligible for loans up to ₹${maxLoanAmount}` 
            : "You are not eligible for loans at this time. Please improve your credit score."}
        </p>
      </div>

      {isEligible ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25000" 
                      {...field} 
                      min="1000" 
                      max={maxLoanAmount} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can borrow up to ₹{maxLoanAmount}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please explain in detail how you plan to use this loan" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Apply for Loan'
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="text-center p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 mb-2">
            You are not eligible for loans at this time
          </p>
          <p className="text-sm text-red-600/80 dark:text-red-400/80">
            You need a credit score of at least 600 to be eligible for loans
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanApplicationForm;
