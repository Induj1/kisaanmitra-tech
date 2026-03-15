
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestimonialCardProps {
  name: string;
  location: string;
  image: string;
  testimony?: string;
  quote?: string;
  englishQuote?: string;
  rating?: number;
  crop?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  image,
  testimony,
  quote,
  englishQuote,
  rating = 5,
  crop
}) => {
  const { language, translate } = useLanguage();
  
  // Use testimony if provided, otherwise use quote, and fall back to englishQuote only if current language is English
  const displayQuote = testimony || quote || (language === 'english' ? englishQuote : "");
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/64x64?text=Farmer";
              }}
            />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>
              {location} {crop && `• ${crop}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-noto mb-3">{displayQuote}</p>
        {rating && (
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 justify-end border-t pt-3">
        <span>{translate('userSince')}</span>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
