
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveDataWidget from '@/components/LiveDataWidget';
import ChatbotWidget from '@/components/ChatbotWidget';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MapPin, Tractor, MessageSquare } from 'lucide-react';

const Demo = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'kannada'>('english');

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const getTitleByLanguage = () => {
    switch (language) {
      case 'english':
        return 'Try KisaanMitra Demo';
      case 'hindi':
        return 'किसानमित्र डेमो आज़माएं';
      case 'kannada':
        return 'ಕಿಸಾನ್ಮಿತ್ರ ಡೆಮೋ ಪ್ರಯತ್ನಿಸಿ';
      default:
        return 'Try KisaanMitra Demo';
    }
  };

  const getDescriptionByLanguage = () => {
    switch (language) {
      case 'english':
        return 'Experience the core features of KisaanMitra before signing up.';
      case 'hindi':
        return 'साइन अप करने से पहले किसानमित्र की मुख्य सुविधाओं का अनुभव करें।';
      case 'kannada':
        return 'ಸೈನ್ ಅಪ್ ಮಾಡುವ ಮೊದಲು ಕಿಸಾನ್ಮಿತ್ರದ ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನುಭವಿಸಿ.';
      default:
        return 'Experience the core features of KisaanMitra before signing up.';
    }
  };

  const chatTranslations = {
    title: {
      english: "AI Farmer Assistant",
      hindi: "AI किसान सहायक",
      kannada: "AI ರೈತ ಸಹಾಯಕ"
    },
    placeholder: {
      english: "Type here or click the mic icon to speak...",
      hindi: "यहां टाइप करें या माइक आइकन पर क्लिक करके बोलें...",
      kannada: "ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ..."
    },
    greeting: {
      english: "Hello! I'm your agricultural assistant. You can ask me about crops, weather, or government schemes.",
      hindi: "नमस्ते! मैं आपका कृषि सहायक हूँ। आप मुझसे फसल, मौसम, या सरकारी योजनाओं के बारे में पूछ सकते हैं।",
      kannada: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನೀವು ನನ್ನನ್ನು ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು."
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header 
        toggleContrast={toggleContrast} 
        isHighContrast={isHighContrast} 
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{getTitleByLanguage()}</h1>
          <p className="text-gray-600 dark:text-gray-400">{getDescriptionByLanguage()}</p>
        </div>
        
        <Tabs defaultValue="assistant" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Weather Updates</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Tractor size={18} />
              <span>Farming Tools</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="py-4">
            <ChatbotWidget 
              widgetLanguage={language}
              translations={chatTranslations}
            />
          </TabsContent>
          
          <TabsContent value="weather" className="py-4">
            <LiveDataWidget 
              widgetType="weather"
              language={language}
            />
          </TabsContent>
          
          <TabsContent value="tools" className="py-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">Farming Tools Calculator</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This tool calculates the optimal resources needed for your farm based on crop type and land size.
                Sign up to access the full version with customized recommendations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Wheat (1 acre)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Seeds required:</span>
                      <span className="font-medium">40-45 kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fertilizer (NPK):</span>
                      <span className="font-medium">120:60:40 kg/ha</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Water requirement:</span>
                      <span className="font-medium">4-5 irrigations</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expected yield:</span>
                      <span className="font-medium">15-20 quintals</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Rice (1 acre)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Seeds required:</span>
                      <span className="font-medium">20-25 kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fertilizer (NPK):</span>
                      <span className="font-medium">120:60:60 kg/ha</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Water requirement:</span>
                      <span className="font-medium">Continuous flooding</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expected yield:</span>
                      <span className="font-medium">20-25 quintals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
