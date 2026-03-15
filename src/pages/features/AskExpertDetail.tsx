
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureDetail from '@/components/FeatureDetail';
import { MessageSquare } from 'lucide-react';

const AskExpertDetail = () => {
  return (
    <PageLayout>
      <FeatureDetail
        title="Ask an Expert"
        description="AI-powered chatbot & expert network for crop advice"
        icon={MessageSquare}
        color="bg-purple-100"
        iconColor="text-purple-500"
        benefits={[
          "Get quick answers to farming questions",
          "Learn best practices from experts",
          "Troubleshoot crop issues",
          "Access agricultural knowledge"
        ]}
        features={[
          "24/7 AI assistance",
          "Connect with agricultural experts",
          "Community knowledge sharing",
          "Personalized recommendations"
        ]}
      />
    </PageLayout>
  );
};

export default AskExpertDetail;
