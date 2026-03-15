
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  location: z.string().min(2, { message: "Please enter your location" }),
  crop_type: z.string().min(2, { message: "Please enter crop type" }),
  land_size: z.string().min(1).refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Land size must be a positive number",
  }),
});

type FarmerProfile = {
  id: string;
  name: string;
  phone: string;
  location: string;
  address: string;
  crop_type: string;
  land_size: number;
  credit_score: number;
  user_id: string;
};

interface UserSettingsProps {
  profile: FarmerProfile | null;
  onProfileUpdate: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ profile, onProfileUpdate }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      crop_type: profile?.crop_type || '',
      land_size: profile?.land_size ? profile.land_size.toString() : '1',
    },
  });

  // Update form values when profile changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        crop_type: profile.crop_type || '',
        land_size: profile.land_size ? profile.land_size.toString() : '1',
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('farmer_profiles')
        .update({
          name: values.name,
          phone: values.phone,
          location: values.location,
          address: values.location, // Using location as address
          crop_type: values.crop_type,
          land_size: Number(values.land_size), // Explicitly convert to number
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      onProfileUpdate();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="crop_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Crop</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="land_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Size (acres)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0.1" step="0.1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="submit"
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserSettings;
