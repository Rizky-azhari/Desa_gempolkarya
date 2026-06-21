"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@/lib/roles";
import { createClient } from "@/utils/supabase/client";

interface RoleContextProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoaded: boolean;
  userEmail: string;
  userName: string;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin_desa");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadRole() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || "");
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, name")
            .eq("id", user.id)
            .single();

          if (profile) {
            setCurrentRole(profile.role as UserRole);
            setUserName(profile.name || "");
          }
        }
      } catch (e) {
        console.error("Failed to load user role from Supabase:", e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadRole();

    // Listen for update events to refresh context
    const handleRefresh = () => {
      loadRole();
    };
    window.addEventListener("local-stats-updated", handleRefresh);
    
    return () => {
      window.removeEventListener("local-stats-updated", handleRefresh);
    };
  }, []);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole: () => {}, isLoaded, userEmail, userName }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
