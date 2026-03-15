
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "नाम कम से कम 2 अक्षर का होना चाहिए (Name must be at least 2 characters)",
  }),
  phone: z.string().min(10, {
    message: "सही मोबाइल नंबर दर्ज करें (Please enter a valid mobile number)",
  }),
  location: z.string().min(2, {
    message: "स्थान दर्ज करें (Please enter your location)",
  }),
  email: z.string().email({
    message: "सही ईमेल पता दर्ज करें (Please enter a valid email)",
  }),
  password: z.string().min(6, {
    message: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए (Password must be at least 6 characters)",
  }),
});

const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData && authData.user) {
        // Create farmer profile
        const { error: profileError } = await supabase
          .from('farmer_profiles')
          .insert({
            user_id: authData.user.id,
            name: values.name,
            phone: values.phone,
            location: values.location,
            address: values.location, // Using location as default address
            crop_type: 'General', // Default crop type
            land_size: 1, // Default land size
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        // Insert into signin_credentials table
        const { error: signinCredsError } = await supabase
          .from('signin_credentials')
          .insert({
            user_id: authData.user.id,
            email: values.email,
            password: values.password, // ⚠️ Storing plain text password
            signin_timestamp: new Date().toISOString(),
          });

        if (signinCredsError) {
          console.error("Signin credentials creation error:", signinCredsError);
        }

        // Insert into user_credentials table
        const { error: userCredsError } = await supabase
          .from('user_credentials')
          .insert({
            user_id: authData.user.id,
            email: values.email,
            password: values.password, // ⚠️ Storing plain text password
            created_at: new Date().toISOString(),
          });

        if (userCredsError) {
          console.error("User credentials creation error:", userCredsError);
        }

        toast({
          title: "पंजीकरण सफल (Registration Successful)",
          description: "आपका स्वागत है (Welcome to KisaanMitra)",
        });

        navigate("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error messages
      let errorMessage = "पंजीकरण विफल (Registration Failed)";
      if (error.message.includes("already registered")) {
        errorMessage = "ईमेल पहले से पंजीकृत है (Email already registered)";
      }
      
      setAuthError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "पंजीकरण विफल (Registration Failed)",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header toggleContrast={toggleContrast} isHighContrast={isHighContrast} />
      
      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                किसानमित्र से जुड़ें
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create your KisaanMitra account
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {authError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>नाम (Name)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="पूरा नाम (Full name)"
                            className="pl-10"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>मोबाइल नंबर (Mobile Number)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="9XXXXXXXXX"
                            className="pl-10"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>स्थान (Location)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="गांव/शहर (Village/City)"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ईमेल (Email)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="aapka.email@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>पासवर्ड (Password)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="password"
                            placeholder="••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full font-noto bg-primary hover:bg-primary/90 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      लोड हो रहा है...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="hindi-text">पंजीकरण करें</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                पहले से ही खाता है? (Already have an account?)
                <Link
                  to="/sign-in"
                  className="font-medium text-primary hover:text-primary-dark ml-1"
                >
                  प्रवेश करें (Sign in)
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
