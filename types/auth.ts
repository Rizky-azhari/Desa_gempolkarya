import { UserRole } from "@/lib/roles";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Aktif" | "Nonaktif";
  fixed: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
}
