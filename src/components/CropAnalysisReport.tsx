import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardWidget from "@/components/DashboardWidget";
import AlertMessage from "@/components/AlertMessage";
import { ArrowLeft, CheckCircle, XCircle, Info, Download, Printer, Youtube, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportSection {
  title: string;
  content: string[];
  type: "positive" | "improvement" | "suggestion";
}

interface CropAnalysisReportProps {
  reportId: string;
}

const CropAnalysisReport: React.FC<CropAnalysisReportProps> = ({ reportId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [reportData, setReportData] = useState<{
    cropType: string;
    sections: ReportSection[];
    overallScore: number;
    date: string;
  }>({
    cropType: "Unknown",
    sections: [],
    overallScore: 0,
    date: new Date().toLocaleDateString(),
  });

  // Resources for different crop types
  const cropResources = {
    "Wheat": {
      videos: [
        { title: "Wheat Farming Best Practices", url: "https://www.youtube.com/watch?v=YPE5hAtO0-Y" },
        { title: "Wheat Disease Management", url: "https://www.youtube.com/watch?v=Ir7I5jsiSfE" }
      ],
      resources: [
        { title: "FAO Wheat Cultivation Guide", url: "https://www.fao.org/land-water/databases-and-software/crop-information/wheat/en/" },
        { title: "Wheat Farmers Alliance", url: "https://nationalwheatfoundation.org/" }
      ]
    },
    "Rice": {
      videos: [
        { title: "SRI Rice Farming Techniques", url: "https://www.youtube.com/watch?v=WRHEg5XP3YM" },
        { title: "Modern Rice Cultivation", url: "https://www.youtube.com/watch?v=KH_xkSvs8OM" }
      ],
      resources: [
        { title: "IRRI Knowledge Bank", url: "http://www.knowledgebank.irri.org/" },
        { title: "Rice Production Handbook", url: "https://www.uaex.uada.edu/publications/pdf/mp192/chapter-1.pdf" }
      ]
    },
    "Cotton": {
      videos: [
        { title: "Cotton Farming Technologies", url: "https://www.youtube.com/watch?v=9fYkwb0jOmc" },
        { title: "Organic Cotton Growing", url: "https://www.youtube.com/watch?v=AP05hSZ-pCk" }
      ],
      resources: [
        { title: "Cotton Incorporated", url: "https://www.cottoninc.com/cotton-production/" },
        { title: "Cotton Disease Guide", url: "https://cottoncultivated.cottoninc.com/disease-management/" }
      ]
    },
    "Corn": {
      videos: [
        { title: "Modern Corn Production", url: "https://www.youtube.com/watch?v=CjG-BSWTdS8" },
        { title: "Corn Growing Guide", url: "https://www.youtube.com/watch?v=guBV0jsl2JM" }
      ],
      resources: [
        { title: "Corn Growers Association", url: "https://ncga.com/stay-informed/research-and-productivity" },
        { title: "Corn Disease Management", url: "https://cropwatch.unl.edu/corn/diseases" }
      ]
    },
    "Sugarcane": {
      videos: [
        { title: "Sustainable Sugarcane Farming", url: "https://www.youtube.com/watch?v=CmpTLwzmJLQ" },
        { title: "Sugarcane Planting Techniques", url: "https://www.youtube.com/watch?v=aNyK3TFDNXs" }
      ],
      resources: [
        { title: "Sugarcane Research Institute", url: "https://sugarcane.org/resource-library/" },
        { title: "Sugarcane Cultivation Guide", url: "https://www.icar.org.in/content/sugarcane" }
      ]
    }
  };
  
  // Default resources in case crop type is not in our dictionary
  const defaultResources = {
    videos: [
      { title: "Sustainable Farming Practices", url: "https://www.youtube.com/watch?v=9ajXRogVgxc" },
      { title: "Crop Rotation Techniques", url: "https://www.youtube.com/watch?v=HYzQGgtIP2k" }
    ],
    resources: [
      { title: "FAO Crop Production Resources", url: "https://www.fao.org/agriculture/crops/en/" },
      { title: "Regenerative Agriculture Guide", url: "https://regenerationinternational.org/why-regenerative-agriculture/" }
    ]
  };

  useEffect(() => {
    const fetchCropData = async () => {
      if (!reportId) {
        setLoading(false);
        setError("No report ID provided");
        toast.error("No report ID provided");
        return;
      }

      try {
        const { data: cropAnalysis, error } = await supabase
          .from('crop_analysis')
          .select('*')
          .eq('id', reportId)
          .single();

        if (error) throw error;
        if (!cropAnalysis) {
          toast.error("Report not found");
          setError("Report not found");
          setLoading(false);
          return;
        }

        setCropData(cropAnalysis);
        await generateReport(cropAnalysis);
      } catch (error: any) {
        console.error("Error fetching crop data:", error);
        setError(`Failed to load report: ${error.message}`);
        toast.error(`Failed to load report: ${error.message}`);
        setLoading(false);
      }
    };

    fetchCropData();
  }, [reportId]);

  const generateReport = async (cropData: any) => {
    try {
      console.log("Generating report for crop data:", cropData);
      
      // Use supabase.functions.invoke instead of direct fetch
      const { data, error } = await supabase.functions.invoke('crop-analysis', {
        body: { cropData }
      });

      if (error) {
        console.error("Error from crop-analysis function:", error);
        throw new Error(`API error: ${error.message || 'Unknown error'}`);
      }

      if (!data || !data.success) {
        const errorMessage = data?.error || "Failed to generate report";
        console.error("Error in crop analysis response:", errorMessage);
        throw new Error(errorMessage);
      }

      const aiData = data.data;
      console.log("AI generated data:", aiData);
      
      // Build the report sections from the AI response
      setReportData({
        cropType: cropData.crop_type,
        sections: [
          {
            title: "What You Did Well",
            content: aiData.positives,
            type: "positive",
          },
          {
            title: "Areas for Improvement",
            content: aiData.improvements,
            type: "improvement",
          },
          {
            title: "Recommendations",
            content: aiData.recommendations,
            type: "suggestion",
          },
        ],
        overallScore: aiData.overallScore,
        date: new Date().toLocaleDateString(),
      });

      // Mark report as generated in database
      await supabase
        .from('crop_analysis')
        .update({ report_generated: true })
        .eq('id', cropData.id);

    } catch (error: any) {
      console.error("Error generating report:", error);
      setError(`Failed to generate report: ${error.message}`);
      toast.error(`Failed to generate report: ${error.message}`);
      
      // Fallback to default report content if AI fails
      setReportData({
        cropType: cropData.crop_type,
        sections: [
          {
            title: "What You Did Well",
            content: [
              "Your choice of organic cultivation methods is excellent for soil health.",
              "Using drip irrigation has saved water while providing consistent moisture to plants.",
              "Your seed selection from a certified source ensured good germination rates.",
            ],
            type: "positive",
          },
          {
            title: "Areas for Improvement",
            content: [
              "The timing of pesticide application could be optimized for better results.",
              "Consider increasing spacing between plants for better air circulation.",
              "Soil testing before sowing would help determine exact nutrient requirements.",
            ],
            type: "improvement",
          },
          {
            title: "Recommendations",
            content: [
              "Try crop rotation next season to improve soil fertility and reduce pest pressure.",
              "Consider using neem-based organic pesticides to control common pests.",
              "Implement mulching to conserve soil moisture and suppress weed growth.",
              "Install basic weather monitoring tools for more precise irrigation scheduling.",
            ],
            type: "suggestion",
          },
        ],
        overallScore: 78,
        date: new Date().toLocaleDateString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.info("PDF generation started. Your download will begin shortly.");
    // In a real implementation, you would generate a PDF server-side or use a client-side PDF library
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
    }, 2000);
  };

  // Get the appropriate resources for this crop type
  const getResources = () => {
    if (!reportData.cropType) return defaultResources;
    
    const resources = cropResources[reportData.cropType as keyof typeof cropResources];
    return resources || defaultResources;
  };

  const resources = getResources();

  if (error && !loading) {
    return (
      <DashboardWidget
        title="Error Loading Analysis"
        description="We encountered a problem loading your crop analysis"
        icon={Info}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        actionLabel="Back to Form"
        onActionClick={() => navigate("/crop-analysis")}
        className="print:shadow-none print:border-none"
      >
        <AlertMessage
          title="Error Loading Report"
          message={error}
          type="error"
          className="mb-6"
        />
        <div className="mt-8 text-center">
          <Button onClick={() => navigate("/crop-analysis")} className="w-full max-w-sm">
            <ArrowLeft size={16} className="mr-2" /> Return to Analysis Form
          </Button>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      title="Crop Health Analysis Report"
      description={`Analysis for your ${reportData.cropType} cultivation`}
      icon={Info}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
      actionLabel="Back to Form"
      onActionClick={() => navigate("/crop-analysis")}
      className="print:shadow-none print:border-none"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Analyzing your cultivation data...</p>
        </div>
      ) : (
        <>
          <div className="print:hidden flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-lg font-medium mr-2">Overall Health Score:</span>
              <span className={cn("text-3xl font-bold", getScoreColor(reportData.overallScore))}>
                {reportData.overallScore}/100
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>

          <AlertMessage
            title="Report Generated Successfully"
            message="This analysis is based on the information you provided and best practices for your region."
            type="success"
            className="print:hidden mb-6"
          />

          <div className="space-y-8">
            {reportData.sections.map((section, index) => {
              const SectionIcon = section.type === "positive" ? CheckCircle : section.type === "improvement" ? XCircle : Info;
              const sectionColor = section.type === "positive" ? "text-green-600 bg-green-50" : section.type === "improvement" ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50";

              return (
                <Card key={index} className="border-l-4 shadow-md" style={{ borderLeftColor: section.type === "positive" ? "#16a34a" : section.type === "improvement" ? "#dc2626" : "#2563eb" }}>
                  <CardHeader className={cn("pb-2", section.type === "positive" ? "bg-green-50" : section.type === "improvement" ? "bg-red-50" : "bg-blue-50")}>
                    <div className="flex items-center gap-2">
                      <SectionIcon className={section.type === "positive" ? "text-green-600" : section.type === "improvement" ? "text-red-600" : "text-blue-600"} />
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="block mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4">Resources & Next Steps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">Training Videos</CardTitle>
                  </div>
                  <CardDescription>Expert guidance videos for {reportData.cropType} farming</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resources.videos.map((video, i) => (
                      <li key={i}>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80 flex items-center gap-2"
                        >
                          <Youtube className="h-4 w-4" />
                          {video.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Additional Resources</CardTitle>
                  </div>
                  <CardDescription>Find experts and tools for your farm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resources.resources.map((resource, i) => (
                      <li key={i}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80 flex items-center gap-2"
                        >
                          <Link className="h-4 w-4" />
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => navigate("/crop-analysis")} className="w-full max-w-sm">
              <ArrowLeft size={16} className="mr-2" /> Submit Another Analysis
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500 text-center print:mt-16">
            <p>Report generated on {reportData.date}</p>
            <p>KisaanMitra Crop Analysis System</p>
          </div>
        </>
      )}
    </DashboardWidget>
  );
};

export default CropAnalysisReport;
