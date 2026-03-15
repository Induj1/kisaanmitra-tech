
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { createClient } from '@supabase/supabase-js';

// Extend the original Database type with our new tables
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      farmer_profiles: OriginalDatabase['public']['Tables']['farmer_profiles'];
      loan_applications: OriginalDatabase['public']['Tables']['loan_applications'];
      crop_analysis: OriginalDatabase['public']['Tables']['crop_analysis'];
      marketplace_listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          image_url: string | null;
          seller_name: string;
          seller_location: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          image_url?: string | null;
          seller_name: string;
          seller_location: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          image_url?: string | null;
          seller_name?: string;
          seller_location?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      marketplace_transactions: {
        Row: {
          id: string;
          product_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          credits_used: number | null;
          status: string;
          product_title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          buyer_id: string;
          seller_id: string;
          amount: number;
          credits_used?: number | null;
          status?: string;
          product_title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          buyer_id?: string;
          seller_id?: string;
          amount?: number;
          credits_used?: number | null;
          status?: string;
          product_title?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "marketplace_listings";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: OriginalDatabase['public']['Views'];
    Functions: {
      increment: {
        Args: {
          row_id: string;
          amount: number;
        };
        Returns: number;
      };
    };
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}

// Create a custom client type that includes our new tables
export type SupabaseClient = ReturnType<typeof createClient<Database>>;
