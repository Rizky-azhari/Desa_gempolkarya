import { UserRole } from "@/lib/roles";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          status: "Aktif" | "Nonaktif";
          fixed: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: UserRole;
          status?: "Aktif" | "Nonaktif";
          fixed?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: UserRole;
          status?: "Aktif" | "Nonaktif";
          fixed?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      village_profile: {
        Row: {
          id: string;
          name: string;
          slogan: string | null;
          address: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          service_hours: string | null;
          history: string | null;
          vision: string | null;
          mission: string[] | null;
          geography: string | null;
          north_boundary: string | null;
          south_boundary: string | null;
          east_boundary: string | null;
          west_boundary: string | null;
          area_size: string | null;
          population_total: number;
          family_total: number;
          rt_total: number;
          rw_total: number;
          male_total: number;
          female_total: number;
          latitude: number | null;
          longitude: number | null;
          map_embed_url: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["village_profile"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["village_profile"]["Row"]>;
      };
    };
  };
}
