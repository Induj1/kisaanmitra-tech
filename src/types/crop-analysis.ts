
export interface CropAnalysisData {
  id?: string;
  user_id?: string;
  crop_type: string;
  land_size: string;
  sowing_date: string;
  cultivation_method: string;
  watering_method: string;
  seed_type: string;
  seed_source: string;
  fertilizers?: string;
  pesticides?: string;
  problems: string;
  harvest_outcome: string;
  additional_notes?: string;
  created_at?: string;
  report_generated?: boolean;
}

export interface CropAnalysisReport {
  cropType: string;
  sections: {
    title: string;
    content: string[];
    type: "positive" | "improvement" | "suggestion";
  }[];
  overallScore: number;
  date: string;
}
