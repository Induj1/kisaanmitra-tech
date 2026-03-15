export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crop_analysis: {
        Row: {
          additional_notes: string | null
          created_at: string
          crop_type: string
          cultivation_method: string
          fertilizers: string | null
          harvest_outcome: string
          id: string
          land_size: string
          pesticides: string | null
          problems: string
          report_generated: boolean | null
          seed_source: string
          seed_type: string
          sowing_date: string
          user_id: string | null
          watering_method: string
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          crop_type: string
          cultivation_method: string
          fertilizers?: string | null
          harvest_outcome: string
          id?: string
          land_size: string
          pesticides?: string | null
          problems: string
          report_generated?: boolean | null
          seed_source: string
          seed_type: string
          sowing_date: string
          user_id?: string | null
          watering_method: string
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          crop_type?: string
          cultivation_method?: string
          fertilizers?: string | null
          harvest_outcome?: string
          id?: string
          land_size?: string
          pesticides?: string | null
          problems?: string
          report_generated?: boolean | null
          seed_source?: string
          seed_type?: string
          sowing_date?: string
          user_id?: string | null
          watering_method?: string
        }
        Relationships: []
      }
      farmer_profiles: {
        Row: {
          address: string
          created_at: string
          credit_score: number
          crop_type: string
          id: string
          land_size: number
          location: string
          name: string
          phone: string
          profile_image: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          credit_score?: number
          crop_type: string
          id?: string
          land_size: number
          location: string
          name: string
          phone: string
          profile_image?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          credit_score?: number
          crop_type?: string
          id?: string
          land_size?: number
          location?: string
          name?: string
          phone?: string
          profile_image?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount: number
          approved_at: string | null
          created_at: string
          credit_score_at_application: number
          id: string
          purpose: string
          rejected_reason: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          created_at?: string
          credit_score_at_application: number
          id?: string
          purpose: string
          rejected_reason?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          created_at?: string
          credit_score_at_application?: number
          id?: string
          purpose?: string
          rejected_reason?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          price: number
          seller_id: string
          seller_location: string
          seller_name: string
          status: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          price: number
          seller_id: string
          seller_location: string
          seller_name: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          price?: number
          seller_id?: string
          seller_location?: string
          seller_name?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      marketplace_transactions: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          credits_used: number | null
          id: string
          product_id: string
          product_title: string | null
          seller_id: string
          status: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          credits_used?: number | null
          id?: string
          product_id: string
          product_title?: string | null
          seller_id: string
          status?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          credits_used?: number | null
          id?: string
          product_id?: string
          product_title?: string | null
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: { row_id: string; amount: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
