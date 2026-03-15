
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveDataWidget from '@/components/LiveDataWidget';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Droplets, MapPin, ThermometerSnowflake, Umbrella, Wind } from 'lucide-react';
import LocationAccessPopup from '@/components/LocationAccessPopup';
import { useLanguage } from '@/contexts/LanguageContext';

const Weather = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const { language, translate } = useLanguage();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    // Check if we already have location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error or permission denied:", error);
          // Show popup to request location
          setShowLocationPopup(true);
        }
      );
    }
  }, []);

  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const handleLocationGranted = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleRequestLocation = () => {
    setShowLocationPopup(true);
  };

  // Weather-specific translations
  const weatherTranslations = {
    english: {
      weatherInformation: 'Weather Information',
      accurateForecasts: 'Accurate forecasts to plan your farming activities',
      farmingWeatherAdvisory: 'Farming Weather Advisory',
      basedOnCurrentWeather: 'Based on current weather conditions',
      rainfallAdvisory: 'Rainfall Advisory',
      rainfallDetails: 'Light rainfall expected in the next 24 hours. Consider delaying fertilizer application.',
      windAdvisory: 'Wind Advisory',
      windDetails: 'Moderate winds expected. Secure any protective coverings for sensitive crops.',
      temperatureAdvisory: 'Temperature Advisory',
      temperatureDetails: 'Temperature will remain moderate. Good conditions for most crop growth.',
      humidityAdvisory: 'Humidity Advisory',
      humidityDetails: 'High humidity levels expected. Monitor for fungal diseases in rice and wheat crops.',
      seasonalForecast: 'Seasonal Forecast',
      kharifSeason: 'Kharif Season',
      rabiSeason: 'Rabi Season',
      zaidSeason: 'Zaid Season',
      monsoonPrediction: 'Monsoon Prediction',
      monsoonDetails: 'The monsoon is expected to be normal this year with adequate rainfall across most regions. Plan paddy, cotton and maize planting accordingly.',
      winterForecast: 'Winter Forecast',
      winterDetails: 'Winter is expected to be colder than usual with moderate rainfall in northern regions. Wheat, mustard and gram crops will benefit from these conditions.',
      summerForecast: 'Summer Forecast',
      summerDetails: 'Summer is likely to be hotter than normal. Ensure adequate irrigation for vegetables and fruits. Consider mulching to reduce water loss.'
    }
  };

  // Use either the translation from context or our local translations
  const getTranslation = (key: string) => {
    if (language === 'english' && weatherTranslations.english[key as keyof typeof weatherTranslations.english]) {
      return weatherTranslations.english[key as keyof typeof weatherTranslations.english];
    }
    return translate(key);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'high-contrast' : ''}`}>
      <Header 
        toggleContrast={toggleContrast} 
        isHighContrast={isHighContrast}
      />
      
      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {getTranslation('weatherInformation')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {getTranslation('accurateForecasts')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <LiveDataWidget 
                widgetType="weather" 
                language={language}
                latitude={latitude}
                longitude={longitude}
                onRequestLocation={handleRequestLocation}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {getTranslation('farmingWeatherAdvisory')}
                </CardTitle>
                <CardDescription>
                  {getTranslation('basedOnCurrentWeather')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Umbrella className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('rainfallAdvisory')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('rainfallDetails')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <Wind className="text-green-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('windAdvisory')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('windDetails')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                    <ThermometerSnowflake className="text-amber-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('temperatureAdvisory')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('temperatureDetails')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                    <Droplets className="text-indigo-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('humidityAdvisory')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('humidityDetails')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {getTranslation('seasonalForecast')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="kharif">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="kharif">
                    {getTranslation('kharifSeason')}
                  </TabsTrigger>
                  <TabsTrigger value="rabi">
                    {getTranslation('rabiSeason')}
                  </TabsTrigger>
                  <TabsTrigger value="zaid">
                    {getTranslation('zaidSeason')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="kharif" className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Cloud className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('monsoonPrediction')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('monsoonDetails')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="rabi" className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Cloud className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('winterForecast')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('winterDetails')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="zaid" className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Cloud className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium">
                        {getTranslation('summerForecast')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTranslation('summerDetails')}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      <LocationAccessPopup 
        open={showLocationPopup} 
        onOpenChange={setShowLocationPopup}
        onLocationGranted={handleLocationGranted}
      />
    </div>
  );
};

export default Weather;
