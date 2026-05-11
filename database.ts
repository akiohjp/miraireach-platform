export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          brand_color: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stores']['Row'], 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Database['public']['Tables']['stores']['Insert']>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}