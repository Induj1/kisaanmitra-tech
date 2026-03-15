
import React from 'react';
import PageLayout from './PageLayout';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureDetailProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  benefits: string[];
  features: string[];
  demoLink?: string;
  iconColor: string;
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({
  title,
  description,
  icon: Icon,
  color,
  benefits,
  features,
  demoLink,
  iconColor
}) => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className={`${color} rounded-lg p-8 mb-10`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className={`${iconColor} p-6 rounded-full w-24 h-24 flex items-center justify-center`}>
              <Icon size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg mb-6">{description}</p>
              {demoLink && (
                <Button 
                  onClick={() => navigate(demoLink)}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  {translate('tryDemo')}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 font-bold text-xl">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 font-bold text-xl">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mr-4"
          >
            Back
          </Button>
          
          {demoLink && (
            <Button onClick={() => navigate(demoLink)}>
              {translate('tryDemo')}
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FeatureDetail;
