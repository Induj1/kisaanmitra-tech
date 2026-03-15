
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureDetail from '@/components/FeatureDetail';
import { MapPin } from 'lucide-react';
import MapPlanner from '@/components/MapPlanner';
import { useLanguage } from '@/contexts/LanguageContext';

const FarmPlannerDetail = () => {
  const { translate } = useLanguage();

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <FeatureDetail
          title="GIS Farm Planner"
          description="Precise land mapping and planning for your crops"
          icon={MapPin}
          color="bg-green-100"
          iconColor="text-green-500"
          benefits={[
            "Optimize land usage",
            "Plan better crop rotations",
            "Make data-driven decisions",
            "Increase overall yield"
          ]}
          features={[
            "Interactive field mapping",
            "Crop rotation planning",
            "Soil analysis integration",
            "Custom plot management"
          ]}
        />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Try the GIS Planner</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our GIS Farm Planner uses your location to analyze soil conditions, climate data, 
            and historical crop performance to recommend the best crops for your specific area.
          </p>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <MapPlanner />
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Share your location to get started</li>
              <li>Our system analyzes soil quality, climate, and historical data for your area</li>
              <li>View recommended crops ranked by suitability</li>
              <li>Plan your growing season based on scientific recommendations</li>
            </ol>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FarmPlannerDetail;
