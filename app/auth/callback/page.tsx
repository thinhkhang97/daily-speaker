"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (!error) {
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
}
