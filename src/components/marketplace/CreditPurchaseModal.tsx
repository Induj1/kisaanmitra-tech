
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseExt } from '@/integrations/supabase/clientExt';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  upiId: z.string().min(5, {
    message: "Please enter a valid UPI ID",
  }),
  paymentMethod: z.enum(["upi", "paytm", "phonepay", "googlepay"], {
    required_error: "Please select a payment method",
  }),
});

interface CreditPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({ open, onClose, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "100",
      upiId: "",
      paymentMethod: "upi",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to purchase credits",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate a payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Convert rupee amount to credits (1:1 ratio for simplicity)
      const creditsToAdd = parseInt(values.amount);
      
      // Use the increment RPC function to add credits
      const { data, error } = await supabaseExt.rpc('increment', { 
        row_id: user.id,
        amount: creditsToAdd
      });
      
      if (error) throw error;
      
      toast({
        title: "Credits Purchased",
        description: `Successfully added ${creditsToAdd} credits to your account.`,
      });
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error purchasing credits:", error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error.message || "Failed to add credits to your account.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            Buy farm credits to use in the marketplace
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="10" 
                      step="10" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi">UPI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paytm" id="paytm" />
                        <Label htmlFor="paytm">Paytm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phonepay" id="phonepay" />
                        <Label htmlFor="phonepay">PhonePe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="googlepay" id="googlepay" />
                        <Label htmlFor="googlepay">Google Pay</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID or Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@upi or phone number" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Purchase ${form.watch('amount')} Credits`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreditPurchaseModal;
