"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setIsLoading } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (pathname !== "/") {
          router.push("/");
        }
        setIsLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!userData || !userData.approved) {
        await supabase.auth.signOut();
        router.push("/");
        setIsLoading(false);
        return;
      }

      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, setUser, setIsLoading]);

  return <>{children}</>;
}
