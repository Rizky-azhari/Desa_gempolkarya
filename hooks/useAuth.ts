"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthSession, getLoggedInUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function checkUser() {
    try {
      const activeUser = await getLoggedInUser();
      setUser(activeUser);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const activeUser = await getLoggedInUser();
      setUser(activeUser);
      router.push("/dashboard");
      return { success: true, user: activeUser };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };
}
