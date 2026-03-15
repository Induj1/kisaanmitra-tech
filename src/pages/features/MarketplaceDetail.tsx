
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FeatureDetail from '@/components/FeatureDetail';
import { CreditCard } from 'lucide-react';

const MarketplaceDetail = () => {
  return (
    <PageLayout>
      <FeatureDetail
        title="Marketplace"
        description="Buy seeds, fertilizers, and equipment using farm credits"
        icon={CreditCard}
        color="bg-amber-100"
        iconColor="text-amber-500"
        benefits={[
          "Access quality agricultural inputs",
          "Save money with farm credits",
          "Connect directly with sellers",
          "Build trusted trading network"
        ]}
        features={[
          "Direct farmer-to-farmer trading",
          "Quality-verified products",
          "Secure payments",
          "Local delivery options"
        ]}
      />
    </PageLayout>
  );
};

export default MarketplaceDetail;
