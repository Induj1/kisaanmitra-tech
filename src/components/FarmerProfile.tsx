
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FarmerProfileProps {
  user: User | null;
  onProfileCreated?: (profile: any) => void;
  onProfileUpdated?: (profile: any) => void;
  mode: 'create' | 'edit';
  existingProfile?: any;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  land_size: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Land size must be a positive number",
  }),
  crop_type: z.string().min(2, { message: "Crop type is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
});

const FarmerProfile: React.FC<FarmerProfileProps> = ({ 
  user, 
  onProfileCreated, 
  onProfileUpdated, 
  mode, 
  existingProfile 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(existingProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we don't have an existing profile, fetch it
    if (!existingProfile && user && mode === 'edit') {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('farmer_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your profile. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, existingProfile, mode]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      location: profile?.location || '',
      land_size: profile?.land_size ? String(profile.land_size) : '',
      crop_type: profile?.crop_type || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    },
    values: {
      name: profile?.name || '',
      location: profile?.location || '',
      land_size: profile?.land_size ? String(profile.land_size) : '',
      crop_type: profile?.crop_type || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a profile",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Ensure all required fields are included and properly typed
      const formattedValues = {
        name: values.name,
        location: values.location,
        land_size: parseFloat(values.land_size),
        crop_type: values.crop_type,
        phone: values.phone,
        address: values.address,
        user_id: user.id,
      };
      
      if (mode === 'create' || !profile) {
        const { data, error } = await supabase
          .from('farmer_profiles')
          .insert(formattedValues)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProfile(data[0]);
          if (onProfileCreated) onProfileCreated(data[0]);
        }
        
        toast({
          title: "Profile Created",
          description: "Your profile has been successfully created.",
        });
      } else {
        // Update existing profile
        const { data, error } = await supabase
          .from('farmer_profiles')
          .update(formattedValues)
          .eq('user_id', user.id)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProfile(data[0]);
          if (onProfileUpdated) onProfileUpdated(data[0]);
        }
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to view or update your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>नाम (Name)</FormLabel>
                    <FormControl>
                      <Input placeholder="आपका नाम" {...field} />
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
                    <FormLabel>फोन नंबर (Phone Number)</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
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
                    <FormLabel>राज्य (State)</FormLabel>
                    <FormControl>
                      <Input placeholder="उत्तर प्रदेश" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पता (Address)</FormLabel>
                    <FormControl>
                      <Input placeholder="आपका पूरा पता" {...field} />
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
                    <FormLabel>भूमि का आकार (हेक्टेयर में) (Land Size in Hectares)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="2.5" {...field} />
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
                    <FormLabel>फसल प्रकार (Crop Type)</FormLabel>
                    <FormControl>
                      <Input placeholder="गेहूं, चावल, आदि" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  प्रोसेसिंग...
                </span>
              ) : (
                mode === 'create' ? 'प्रोफ़ाइल बनाएं (Create Profile)' : 'प्रोफ़ाइल अपडेट करें (Update Profile)'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FarmerProfile;
