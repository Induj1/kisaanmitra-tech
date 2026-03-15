
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Search, 
  Image, 
  Home, 
  Settings, 
  Info,
  ArrowRight,
  Star,
  CheckCircle,
  Shield,
  CreditCard,
  Award,
  MessageSquare,
  TrendingUp
} from "lucide-react";

// Add import of required icons as per lucide-react-icons constraint
import {
  Users as UsersIcon, TrendingUp as TrendingUpIcon, Languages, Headphones, // For stats highlights
  Calendar as CalendarIcon, BookOpen as BookOpenIcon, Search as SearchIcon, Image as ImageIcon, Home as HomeIcon, Settings as SettingsIcon, Info as InfoIcon, ArrowRight as ArrowRightIcon, Star as StarIcon, CheckCircle as CheckCircleIcon, Shield as ShieldIcon, CreditCard as CreditCardIcon, Award as AwardIcon, MessageSquare as MessageSquareIcon, MapPin, Cloud, Calculator
} from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=1400&q=80";

const featureList = [
  {
    icon: HomeIcon,
    title: "Personalized Dashboard",
    desc: "A single page for all your farm insights: weather, sensors, tasks, prices, and updates.",
  },
  {
    icon: SearchIcon,
    title: "Market Intelligence",
    desc: "Get daily crop prices & trends from the nearest mandi, all in your language.",
  },
  {
    icon: BookOpenIcon,
    title: "Ask an Expert",
    desc: "Connect with agri-experts for advice and AI-powered crop guidance, right from your dashboard.",
  },
  {
    icon: CalendarIcon,
    title: "Crop Calendar",
    desc: "Visualize, plan, and track each stage of your agricultural cycle.",
  },
  {
    icon: UsersIcon,
    title: "Community",
    desc: "Share experiences, troubleshoot farm issues, and stay connected with local farmers.",
  },
  {
    icon: SettingsIcon,
    title: "Smart Automation",
    desc: "Integrate IoT sensors for soil, weather, and livestock data, automatically tracked.",
  },
  {
    icon: InfoIcon,
    title: "Govt. Schemes",
    desc: "Easily access current government schemes for agriculture and farming.",
  },
];

const benefitsList = [
  {
    icon: CheckCircle,
    title: "Easier Farm Management",
    description: "Simplified planning, scheduling, and monitoring of all farm activities in one place"
  },
  {
    icon: TrendingUp,
    title: "Increased Crop Yield",
    description: "Optimize growing conditions using real-time data and expert recommendations"
  },
  {
    icon: Shield,
    title: "Risk Reduction",
    description: "Early warnings for weather events, pest outbreaks and market shifts"
  },
  {
    icon: CreditCard,
    title: "Financial Growth",
    description: "Better market timing, lower input costs, and higher profits through data-driven decisions"
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Punjab",
    quote: "KisaanMitra helped me increase my wheat yield by 15% through better planning and irrigation management.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Anita Sharma",
    location: "Gujarat",
    quote: "Now I get fair market prices for my crops. The price alerts and direct marketplace have made selling much easier.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Mohan Singh",
    location: "Maharashtra",
    quote: "The weather forecasts are surprisingly accurate, and the expert advice has helped me solve problems I've had for years.",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=300&q=80"
  }
];

const farmerImages = [
  "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80"
];

const allFeatures = [
  {
    icon: MapPin,
    title: "GIS Farm Planner",
    desc: "Precise land mapping and planning for your crops.",
    route: "/features/farm-planner",
  },
  {
    icon: CreditCard,
    title: "Marketplace",
    desc: "Buy seeds, fertilizers, and equipment using farm credits.",
    route: "/features/marketplace",
  },
  {
    icon: Cloud,
    title: "Weather & Mandi Updates",
    desc: "Get real-time weather and market price alerts.",
    route: "/features/weather",
  },
  {
    icon: MessageSquare,
    title: "Ask an Expert",
    desc: "AI-powered chatbot & expert network for crop advice.",
    route: "/features/ask-expert",
  },
  {
    icon: Calculator,
    title: "Subsidy Finder",
    desc: "Discover and apply for government schemes for your needs.",
    route: "/features/government-schemes",
  },
  {
    icon: Home,
    title: "Personalized Dashboard",
    desc: "Custom insights: weather, sensors, tasks, prices, and updates.",
    route: "/dashboard",
  },
  {
    icon: Search,
    title: "Market Intelligence",
    desc: "Get daily crop prices, trends, and mandi insights.",
    route: "/market-prices",
  },
  {
    icon: BookOpen,
    title: "Crop Calendar",
    desc: "Plan and track every stage of your agricultural cycle.",
    route: "/crop-calendar",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Discuss, troubleshoot, and connect with other farmers.",
    route: "/community",
  },
  {
    icon: Settings,
    title: "Smart Automation",
    desc: "Automate with IoT sensors: soil, weather, livestock data.",
    route: "/automation",
  },
  {
    icon: Info,
    title: "Govt. Schemes Info",
    desc: "Easy access to all agri-related government schemes.",
    route: "/features/government-schemes",
  },
];

const Index = () => {
  const [weather, setWeather] = useState({
    temperature: 25,
    condition: "Sunny",
    humidity: 60,
    windSpeed: 10,
  });

  const [marketPrices, setMarketPrices] = useState([
    { crop: "Wheat", price: 2000, unit: "₹/Quintal" },
    { crop: "Rice", price: 2500, unit: "₹/Quintal" },
    { crop: "Corn", price: 1800, unit: "₹/Quintal" },
  ]);

  const [expertAdvice, setExpertAdvice] = useState([
    {
      expert: "Dr. Sharma",
      advice: "Use organic fertilizers for better yield.",
    },
    {
      expert: "Mr. Patel",
      advice: "Monitor soil moisture regularly.",
    },
  ]);

  const [isInView, setIsInView] = useState(false);
  const { translate } = useLanguage();

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 300);

    // Simulate fetching weather data
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: "Cloudy",
        humidity: 75,
        windSpeed: 15,
      });
    }, 2000);

    // Simulate fetching market prices
    setTimeout(() => {
      setMarketPrices([
        { crop: "Wheat", price: 2100, unit: "₹/Quintal" },
        { crop: "Rice", price: 2600, unit: "₹/Quintal" },
        { crop: "Corn", price: 1900, unit: "₹/Quintal" },
      ]);
    }, 3000);

    // Simulate fetching expert advice
    setTimeout(() => {
      setExpertAdvice([
        {
          expert: "Dr. Sharma",
          advice: "Use organic fertilizers for better yield and soil health.",
        },
        {
          expert: "Mr. Patel",
          advice: "Monitor soil moisture regularly to prevent water stress.",
        },
      ]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] flex flex-col justify-center items-center"
        style={{
          background: `linear-gradient(75deg, rgba(0,0,0,0.75) 0%, rgba(22,96,63,0.7) 100%), url(${heroImage}) center/cover no-repeat`
        }}
      >
        {/* Overlay text */}
        <div className="z-10 text-white text-center px-4 max-w-3xl mx-auto py-12">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-br from-yellow-300 via-primary to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
              KisaanMitra
            </h1>
            <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl font-semibold">
              Empowering Indian Farmers with Smart Tools, Data & Community.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
              Your digital companion for every step of the farming journey—crop planning, expert guidance, local market prices, and real-time weather.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white font-medium text-lg py-6 px-8">
                <Link to="/sign-up">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-medium text-lg py-6 px-8">
                <Link to="/features">See All Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Farmer Images Gallery */}
        <motion.div 
          className="z-20 mt-10 flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {farmerImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Indian farmer"
              className="rounded-xl border-4 border-white shadow-xl w-28 h-28 sm:w-32 sm:h-32 object-cover hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ))}
        </motion.div>

        {/* Highlighted Stats Section */}
        <div className="w-full absolute left-0 right-0 bottom-[-96px] z-30 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col items-center p-6 border-4 border-primary/20">
              <UsersIcon className="text-primary" size={32} />
              <p className="text-3xl font-bold text-primary mt-2">50,000+</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-1 text-base">Farmers Served</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col items-center p-6 border-4 border-green-400/40">
              <TrendingUpIcon className="text-green-600" size={32} />
              <p className="text-3xl font-bold text-green-600 mt-2">15%</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-1 text-base">Avg. Yield Increase</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col items-center p-6 border-4 border-blue-400/40">
              <Languages className="text-blue-600" size={32} />
              <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-1 text-base">Indian Languages</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col items-center p-6 border-4 border-yellow-500/50">
              <Headphones className="text-yellow-500" size={32} />
              <p className="text-3xl font-bold text-yellow-500 mt-2">24/7</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium mt-1 text-base">Expert Support</p>
            </div>
          </div>
        </div>
        
        {/* Fancy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* --- Adjust for space taken by floating/absolute stats --- */}
      <div className="pt-44" /> 

      {/* Features grid */}
      <section className="pb-20 px-4 bg-gradient-to-br from-[#fff7ed] via-[#d3e4fd]/40 to-[#dafdf9]/70 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-primary mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">All-in-one platform built for India's farmers. Explore the full range below:</p>
          </div>
          {/* Features Grid */}
          <div className="grid gap-7 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {allFeatures.map((f, idx) => (
              <motion.div
                key={f.title}
                className="rounded-xl p-7 bg-white dark:bg-gray-800 border border-primary/10 shadow-lg flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.06 + 0.1 }}
                onClick={() => f.route && window.location.assign(f.route)}
                tabIndex={0}
                role="button"
                aria-label={f.title}
              >
                <div className="mb-4 p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                  <f.icon size={30} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white text-center">{f.title}</h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm text-center flex-grow">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main features section with tabs */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-[#fff7ed] via-[#d3e4fd]/40 to-[#dafdf9]/70 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-primary mb-4">How KisaanMitra Helps You</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is designed to support every aspect of modern farming, from planning to selling, with technology that's easy to use.
            </p>
          </div>
          
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-10">
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features">
              <motion.div 
                className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
                variants={staggerChildrenVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {featureList.map((f, idx) => (
                  <motion.div
                    key={f.title}
                    variants={fadeInUpVariants}
                    className="glass-morphism rounded-2xl p-6 border shadow-xl flex flex-col h-full"
                  >
                    <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow w-16 h-16 flex items-center justify-center">
                      <f.icon size={28} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{f.title}</h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm flex-grow">{f.desc}</p>
                    <Link to="/features" className="mt-4 text-primary flex items-center text-sm font-medium hover:underline">
                      Learn more <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="benefits">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefitsList.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="p-3 rounded-full bg-primary/10 h-fit">
                      <benefit.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                  <Link to="/sign-up">Start Growing Smarter</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="inline-block text-yellow-500 mr-1" fill="#EAB308" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic flex-grow">"{testimonial.quote}"</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Farming?</h2>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
              Join thousands of farmers who are growing smarter, earning better, and farming sustainably with KisaanMitra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold py-6 px-8">
                <Link to="/sign-up">Join Now - It's Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-bold py-6 px-8">
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 'Current Insights' Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Live Agricultural Insights</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get a taste of the real-time data KisaanMitra provides to help you make better farming decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weather Card */}
          <motion.div 
            className="rounded-2xl glass-morphism p-6 shadow-md bg-white/80 dark:bg-gray-800/80 border backdrop-blur-md flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
              alt="Weather"
              className="w-14 h-14 mb-3"
              loading="lazy"
            />
            <h3 className="font-medium text-lg">Weather Update</h3>
            <div className="flex flex-wrap justify-center gap-2 text-sm mt-2 text-gray-700 dark:text-gray-200">
              <span className="font-semibold">🌡 {weather.temperature}°C, {weather.condition}</span>
              <span>| 💧 Humidity: {weather.humidity}% | 💨 {weather.windSpeed} km/h</span>
            </div>
          </motion.div>
          
          {/* Market Prices Card */}
          <motion.div 
            className="rounded-2xl glass-morphism p-6 shadow-md bg-white/80 dark:bg-gray-800/80 border backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3176/3176291.png"
              alt="Market"
              className="w-14 h-14 mb-3 mx-auto"
              loading="lazy"
            />
            <h3 className="font-medium text-lg text-center">Market Prices</h3>
            <ul className="mt-2 mb-1">
              {marketPrices.map((item, idx) => (
                <li key={item.crop + idx} className="flex justify-between text-sm">
                  <span className="font-bold">{item.crop}</span>
                  <span>
                    ₹{item.price} <span className="text-gray-500">{item.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Expert Advice Card */}
          <motion.div 
            className="rounded-2xl glass-morphism p-6 shadow-md bg-white/80 dark:bg-gray-800/80 border backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3456/3456598.png"
              alt="Expert"
              className="w-14 h-14 mb-3 mx-auto"
              loading="lazy"
            />
            <h3 className="font-medium text-lg text-center">Expert Advice</h3>
            <ul className="mt-2">
              {expertAdvice.map((item, idx) => (
                <li key={idx} className="mb-2 text-sm">
                  <span className="font-semibold">{item.expert}:</span> {item.advice}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
            <Link to="/sign-up">Access Full Data</Link>
          </Button>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get answers to common questions about KisaanMitra
            </p>
          </div>
          
          <motion.div 
            className="space-y-4"
            variants={staggerChildrenVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeInUpVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">How much does KisaanMitra cost?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The basic features of KisaanMitra are completely free for all farmers. Premium features like advanced analytics and priority support are available through affordable subscription plans.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUpVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Do I need internet access to use all features?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Many features work offline, with data syncing when you reconnect. However, real-time updates like weather forecasts and market prices require internet connectivity.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUpVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">How accurate is the weather prediction?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our weather data comes from multiple reliable sources and provides hyperlocal forecasts with over 90% accuracy for 5-day predictions, becoming more precise as you add your own farm sensors.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUpVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Can I connect my existing farm sensors?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, KisaanMitra supports integration with most popular farm sensor systems. The platform is designed to work with a wide range of agricultural IoT devices.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
