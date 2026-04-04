
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
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "सही ईमेल पता दर्ज करें (Please enter a valid email)",
  }),
  password: z.string().min(6, {
    message: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए (Password must be at least 6 characters)",
  }),
});

const SignIn = () => {
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
    
    // Listen for auth changes
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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }

      if (data && data.user) {
        // Update signin_credentials table with sign-in timestamp
        // Check if record exists first, then update or insert accordingly
        const { data: existingRecords, error: checkError } = await supabase
          .from('signin_credentials')
          .select('user_id')
          .eq('user_id', data.user.id);

        if (checkError) {
          console.error("Error checking signin credentials:", checkError);
        }

        if (existingRecords && existingRecords.length > 0) {
          // Record exists, update it
          const { error: updateError } = await supabase
            .from('signin_credentials')
            .update({
              email: values.email,
              password: values.password, // ⚠️ Storing plain text password
              signin_timestamp: new Date().toISOString(),
            })
            .eq('user_id', data.user.id);

          if (updateError) {
            console.error("Signin credentials update error:", updateError);
          }
        } else {
          // Record doesn't exist, insert it
          const { error: insertError } = await supabase
            .from('signin_credentials')
            .insert({
              user_id: data.user.id,
              email: values.email,
              password: values.password, // ⚠️ Storing plain text password
              signin_timestamp: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Signin credentials insert error:", insertError);
          }
        }

        toast({
          title: "लॉगिन सफल (Login Successful)",
          description: "आपका स्वागत है (Welcome back)",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      let errorMessage = "लॉगिन विफल (Login Failed)";
      if (error.message === "Invalid login credentials") {
        errorMessage = "अमान्य ईमेल या पासवर्ड (Invalid email or password)";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "ईमेल पुष्टि नहीं हुई (Email not confirmed)";
      }
      
      setAuthError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "लॉगिन विफल (Login Failed)",
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
                किसानमित्र में आपका स्वागत है
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your KisaanMitra account
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
                      <span className="hindi-text">प्रवेश करें</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                खाता नहीं है? (Don't have an account?)
                <Link
                  to="/sign-up"
                  className="font-medium text-primary hover:text-primary-dark ml-1"
                >
                  अभी पंजीकरण करें (Register now)
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

export default SignIn;
