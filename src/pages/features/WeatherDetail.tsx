
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureDetail from '@/components/FeatureDetail';
import { Cloud } from 'lucide-react';

const WeatherDetail = () => {
  return (
    <PageLayout>
      <FeatureDetail
        title="Weather & Mandi Updates"
        description="Get real-time weather and market price alerts"
        icon={Cloud}
        color="bg-blue-100"
        iconColor="text-blue-500"
        benefits={[
          "Stay ahead of weather changes",
          "Plan harvesting around forecasts",
          "Get market price alerts",
          "Optimize selling decisions"
        ]}
        features={[
          "Hyperlocal weather forecasts",
          "Crop-specific weather alerts",
          "Market price trends",
          "Real-time updates"
        ]}
      />
    </PageLayout>
  );
};

export default WeatherDetail;
