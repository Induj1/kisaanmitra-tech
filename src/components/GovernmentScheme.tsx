
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LucideIcon } from 'lucide-react';

interface GovernmentSchemeProps {
  title: string;
  description: string;
  englishDescription: string;
  benefits: string;
  eligibility: string;
  logo: string;
  link: string;
  icon?: LucideIcon;
  color?: string;
}

const GovernmentScheme: React.FC<GovernmentSchemeProps> = ({
  title,
  description,
  englishDescription,
  benefits,
  eligibility,
  logo,
  link,
  icon: Icon,
  color = "bg-gray-50 dark:bg-gray-800"
}) => {
  const { language, translate } = useLanguage();
  
  // Show description based on current language
  const displayDescription = language === 'english' ? englishDescription : description;
  
  return (
    <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-2 hover:border-green-500 dark:hover:border-green-600 group bg-white dark:bg-gray-800`}>
      <CardHeader className={`pb-4 ${color}`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg ${Icon ? 'bg-white dark:bg-gray-700' : 'bg-transparent'} shadow-sm`}>
            {Icon ? (
              <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
            ) : (
              <img 
                src={logo} 
                alt={title} 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";
                }}
              />
            )}
          </div>
          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </div>
        </div>
        <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</CardTitle>
        <CardDescription className="font-noto text-base text-gray-700 dark:text-gray-300">
          {displayDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 flex-grow space-y-4 bg-white dark:bg-gray-800">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-start gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">{translate('benefits')}:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{benefits}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">{translate('eligibility')}:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{eligibility}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-5 px-6 bg-gray-50 dark:bg-gray-700/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-600">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg group-hover:shadow-xl transition-all"
          size="lg"
          onClick={() => window.open(link, '_blank')}
        >
          {translate('apply')} 
          <ExternalLink size={16} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GovernmentScheme;
