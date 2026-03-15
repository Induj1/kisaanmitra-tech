import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sprout, BugIcon, Droplets } from 'lucide-react';

const AskExpert = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'kannada'>('hindi');

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header 
        toggleContrast={toggleContrast} 
        isHighContrast={isHighContrast}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {language === 'english' 
                ? 'Ask Our Expert' 
                : language === 'hindi' 
                  ? 'हमारे विशेषज्ञ से पूछें' 
                  : 'ನಮ್ಮ ತಜ್ಞರನ್ನು ಕೇಳಿ'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'english' 
                ? 'Get expert advice for your farming questions' 
                : language === 'hindi' 
                  ? 'अपने कृषि प्रश्नों के लिए विशेषज्ञ सलाह प्राप्त करें' 
                  : 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ChatbotWidget widgetLanguage={language} />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 text-amber-500" size={20} />
                    {language === 'english' 
                      ? 'Farming Tips' 
                      : language === 'hindi' 
                        ? 'कृषि संबंधी सुझाव' 
                        : 'ಕೃಷಿ ಸಲಹೆಗಳು'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'english' 
                      ? 'Expert recommendations for your farm' 
                      : language === 'hindi' 
                        ? 'आपके खेत के लिए विशेषज्ञ अनुशंसाएँ' 
                        : 'ನಿಮ್ಮ ಕೃಷಿಗೆ ತಜ್ಞರ ಶಿಫಾರಸುಗಳು'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                      {language === 'english' 
                        ? 'Rotate crops to maintain soil health and prevent pest buildup.' 
                        : language === 'hindi' 
                          ? 'मिट्टी के स्वास्थ्य को बनाए रखने और कीटों के जमाव को रोकने के लिए फसलों का चक्रण करें।' 
                          : 'ಮಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಕೀಟಗಳ ಸಂಗ್ರಹವನ್ನು ತಡೆಯಲು ಬೆಳೆಗಳನ್ನು ತಿರುಗಿಸಿ.'}
                    </li>
                    <li className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                      {language === 'english' 
                        ? 'Implement drip irrigation to save water and improve yield.' 
                        : language === 'hindi' 
                          ? 'पानी बचाने और उपज में सुधार के लिए ड्रिप सिंचाई लागू करें।' 
                          : 'ನೀರನ್ನು ಉಳಿಸಲು ಮತ್ತು ಇಳುವರಿಯನ್ನು ಸುಧಾರಿಸಲು ಹನಿ ನೀರಾವರಿಯನ್ನು ಅಳವಡಿಸಿ.'}
                    </li>
                    <li className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                      {language === 'english' 
                        ? 'Use organic fertilizers to improve soil health long-term.' 
                        : language === 'hindi' 
                          ? 'दीर्घकालिक मिट्टी के स्वास्थ्य में सुधार के लिए जैविक उर्वरकों का उपयोग करें।' 
                          : 'ದೀರ್ಘಾವಧಿಯ ಮಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಸುಧಾರಿಸಲು ಸಾವಯವ ಗೊಬ್ಬರಗಳನ್ನು ಬಳಸಿ.'}
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'english' 
                      ? 'Popular Topics' 
                      : language === 'hindi' 
                        ? 'लोकप्रिय विषय' 
                        : 'ಜನಪ್ರಿಯ ವಿಷಯಗಳು'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="crops">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="crops">
                        <Sprout className="mr-1 h-4 w-4" />
                        {language === 'english' 
                          ? 'Crops' 
                          : language === 'hindi' 
                            ? 'फसलें' 
                            : 'ಬೆಳೆಗಳು'}
                      </TabsTrigger>
                      <TabsTrigger value="pests">
                        <BugIcon className="mr-1 h-4 w-4" />
                        {language === 'english' 
                          ? 'Pests' 
                          : language === 'hindi' 
                            ? 'कीट' 
                            : 'ಕೀಟಗಳು'}
                      </TabsTrigger>
                      <TabsTrigger value="soil">
                        <Sprout className="mr-1 h-4 w-4" />
                        {language === 'english' 
                          ? 'Soil' 
                          : language === 'hindi' 
                            ? 'मिट्टी' 
                            : 'ಮಣ್ಣು'}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="crops" className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Best crop rotation practices' 
                              : language === 'hindi' 
                                ? 'सर्वोत्तम फसल चक्र प्रथाएं' 
                                : 'ಉತ್ತಮ ಬೆಳೆ ತಿರುಗುವಿಕೆ ಅಭ್ಯಾಸಗಳು'}
                          </span>
                          <span className="text-gray-500">145 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Intercropping strategies' 
                              : language === 'hindi' 
                                ? 'अंतःफसल रणनीतियाँ' 
                                : 'ಅಂತರ ಬೆಳೆ ತಂತ್ರಗಳು'}
                          </span>
                          <span className="text-gray-500">98 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Seasonal crop selection' 
                              : language === 'hindi' 
                                ? 'मौसमी फसल चयन' 
                                : 'ಋತುವಿನ ಬೆಳೆ ಆಯ್ಕೆ'}
                          </span>
                          <span className="text-gray-500">117 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="pests" className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Natural pest control' 
                              : language === 'hindi' 
                                ? 'प्राकृतिक कीट नियंत्रण' 
                                : 'ನೈಸರ್ಗಿಕ ಕೀಟ ನಿಯಂತ್ರಣ'}
                          </span>
                          <span className="text-gray-500">132 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Identifying common pests' 
                              : language === 'hindi' 
                                ? 'सामान्य कीटों की पहचान' 
                                : 'ಸಾಮಾನ್ಯ ಕೀಟಗಳನ್ನು ಗುರುತಿಸುವುದು'}
                          </span>
                          <span className="text-gray-500">108 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Safe pesticide usage' 
                              : language === 'hindi' 
                                ? 'सुरक्षित कीटनाशक उपयोग' 
                                : 'ಸುರಕ್ಷಿತ ಕೀಟನಾಶಕ ಬಳಕೆ'}
                          </span>
                          <span className="text-gray-500">95 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="soil" className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Soil health management' 
                              : language === 'hindi' 
                                ? 'मिट्टी स्वास्थ्य प्रबंधन' 
                                : 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ನಿರ್ವಹಣೆ'}
                          </span>
                          <span className="text-gray-500">156 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Soil testing methods' 
                              : language === 'hindi' 
                                ? 'मिट्टी परीक्षण विधियां' 
                                : 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ವಿಧಾನಗಳು'}
                          </span>
                          <span className="text-gray-500">89 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                        <li className="flex justify-between p-2 border-b">
                          <span className="font-medium">
                            {language === 'english' 
                              ? 'Organic soil amendments' 
                              : language === 'hindi' 
                                ? 'जैविक मिट्टी संशोधन' 
                                : 'ಸಾವಯವ ಮಣ್ಣಿನ ತಿದ್ದುಪಡಿಗಳು'}
                          </span>
                          <span className="text-gray-500">124 {language === 'english' ? 'questions' : language === 'hindi' ? 'प्रश्न' : 'ಪ್ರಶ್ನೆಗಳು'}</span>
                        </li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AskExpert;
