
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureDetail from '@/components/FeatureDetail';
import { Calculator } from 'lucide-react';

const GovernmentSchemesDetail = () => {
  return (
    <PageLayout>
      <FeatureDetail
        title="Subsidy Finder"
        description="Discover and apply for government schemes for your needs"
        icon={Calculator}
        color="bg-red-100"
        iconColor="text-red-500"
        benefits={[
          "Find all applicable subsidies",
          "Simplify application process",
          "Track application status",
          "Get reminders for deadlines"
        ]}
        features={[
          "Eligibility checker",
          "Application assistance",
          "Document management",
          "Status tracking"
        ]}
      />
    </PageLayout>
  );
};

export default GovernmentSchemesDetail;
