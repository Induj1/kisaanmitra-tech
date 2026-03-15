
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { supabaseExt } from '@/integrations/supabase/clientExt';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Please provide a detailed description" }),
  price: z.string().min(1).refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  category: z.string().min(2, { message: "Please select a category" }),
  image_url: z.string().optional(),
});

interface ProductFormProps {
  onSuccess: () => void;
  sellerProfile: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, sellerProfile }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: 'Seeds',
      image_url: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to list a product",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabaseExt
        .from('marketplace_listings')
        .insert({
          title: values.title,
          description: values.description,
          price: Number(values.price),  // Now represents credits instead of rupees
          category: values.category,
          image_url: values.image_url || null,
          seller_id: user.id,
          seller_name: sellerProfile?.name || 'Unknown Seller',
          seller_location: sellerProfile?.location || 'Unknown Location',
          status: 'active',
        });

      if (error) throw error;
      
      form.reset();
      
      toast({
        title: "Listing Created",
        description: "Your product has been listed on the marketplace",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error listing product:", error);
      toast({
        variant: "destructive",
        title: "Listing Failed",
        description: error.message || "Failed to create listing",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const categories = [
    "Seeds", "Fertilizers", "Tools", "Machinery", 
    "Pesticides", "Produce", "Livestock", "Others"
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Organic Rice Seeds" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your product in detail..." 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (Credits)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" step="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...field}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/image.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Listing...
            </>
          ) : (
            'List Product'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
