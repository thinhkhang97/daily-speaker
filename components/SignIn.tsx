"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

export default function SignIn() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {user ? (
        <>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.email}
          </p>
          <Button
            onClick={handleSignOut}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </>
      ) : (
        <Button onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>
      )}
    </div>
  );
}
