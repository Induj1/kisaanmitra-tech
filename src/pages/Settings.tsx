
import UserSettings from "@/components/UserSettings";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/PageLayout";
import { supabase } from '@/integrations/supabase/client';

// Define the FarmerProfile type to match the one expected by UserSettings
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

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  
  useEffect(() => {
    // Fetch the user profile from Supabase when component mounts
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(data as FarmerProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = () => {
    // This function is called after the profile is updated
    // We can trigger a refresh of the profile data
    if (user) {
      supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data as FarmerProfile);
          }
        });
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <UserSettings 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate} 
        />
      </div>
    </PageLayout>
  );
};

export default Settings;
