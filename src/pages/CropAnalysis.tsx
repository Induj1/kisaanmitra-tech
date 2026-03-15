
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CropAnalysisForm from "@/components/CropAnalysisForm";
import CropAnalysisReport from "@/components/CropAnalysisReport";

const CropAnalysis: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isReportPage = location.pathname.includes("/report");
  const reportId = searchParams.get('id');

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {isReportPage ? (
            reportId ? (
              <CropAnalysisReport reportId={reportId} />
            ) : (
              <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
                <h2 className="text-xl font-semibold text-red-600 mb-2">No Report ID Provided</h2>
                <p className="mb-4">Please submit a crop analysis form to generate a report.</p>
                <button 
                  onClick={() => window.location.href = "/crop-analysis"}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  Go to Analysis Form
                </button>
              </div>
            )
          ) : (
            <CropAnalysisForm />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CropAnalysis;
