
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureCard from '@/components/FeatureCard';
import { MapPin, CreditCard, Cloud, MessageSquare, Calculator, Home, Search, BookOpen, Users, Settings, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // Include all features, matching the extended list as on the home page
  const features = [
    {
      title: translate('farmPlanner') || "GIS Farm Planner",
      description: translate('planFarmActivities') || "Precise land mapping and planning for your crops.",
      icon: MapPin,
      color: "bg-green-50",
      buttonText: translate('learnMore') || "Learn More",
      route: "/features/farm-planner"
    },
    {
      title: translate('marketplace') || "Marketplace",
      description: translate('buyAndSellProducts') || "Buy seeds, fertilizers, and equipment using farm credits.",
      icon: CreditCard,
      color: "bg-blue-50",
      buttonText: translate('learnMore') || "Learn More",
      route: "/features/marketplace"
    },
    {
      title: translate('weather') || "Weather & Mandi Updates",
      description: translate('checkForecasts') || "Get real-time weather and market price alerts.",
      icon: Cloud,
      color: "bg-yellow-50",
      buttonText: translate('viewUpdates') || "View Updates",
      route: "/features/weather"
    },
    {
      title: translate('askExpert') || "Ask an Expert",
      description: translate('getAIAdvice') || "AI-powered chatbot & expert network for crop advice.",
      icon: MessageSquare,
      color: "bg-purple-50",
      buttonText: translate('askQuestions') || "Ask Questions",
      route: "/features/ask-expert"
    },
    {
      title: translate('government') || "Subsidy Finder",
      description: translate('findSchemes') || "Discover and apply for government schemes for your needs.",
      icon: Calculator,
      color: "bg-red-50",
      buttonText: translate('findSchemes') || "Find Schemes",
      route: "/features/government-schemes"
    },
    {
      title: "Personalized Dashboard",
      description: "Custom insights: weather, sensors, tasks, prices, and updates.",
      icon: Home,
      color: "bg-orange-50",
      buttonText: "Go to Dashboard",
      route: "/dashboard"
    },
    {
      title: "Market Intelligence",
      description: "Get daily crop prices, trends, and mandi insights.",
      icon: Search,
      color: "bg-cyan-50",
      buttonText: "Market Prices",
      route: "/market-prices"
    },
    {
      title: "Crop Calendar",
      description: "Plan and track every stage of your agricultural cycle.",
      icon: BookOpen,
      color: "bg-pink-50",
      buttonText: "Crop Calendar",
      route: "/crop-calendar"
    },
    {
      title: "Community",
      description: "Discuss, troubleshoot, and connect with other farmers.",
      icon: Users,
      color: "bg-teal-50",
      buttonText: "Community",
      route: "/community"
    },
    {
      title: "Smart Automation",
      description: "Automate with IoT sensors: soil, weather, livestock data.",
      icon: Settings,
      color: "bg-indigo-50",
      buttonText: "Automation",
      route: "/automation"
    },
    {
      title: "Govt. Schemes Info",
      description: "Easy access to all agri-related government schemes.",
      icon: Info,
      color: "bg-green-100",
      buttonText: "See Schemes",
      route: "/features/government-schemes"
    },
  ];

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              KisaanMitra {translate('features') || "Features"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {translate('personalizedAssistant') || "Your personalized farming assistant with every tool you need."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                buttonText={feature.buttonText}
                onClick={() => navigate(feature.route)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              {translate('dashboard') || "Dashboard"}
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Simple and Intuitive
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          Available in multiple languages
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          Simple interface with voice assistance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          Optimized for areas with low internet connectivity
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Works on Multiple Devices
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          Use on mobile, tablet, and computer
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          Basic features in offline mode
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>
                          SMS alerts for use with little or no internet
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Features;
