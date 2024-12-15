"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Session } from "@/types/session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithGoogle } from "./actions/auth";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  const createNewSession = async () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: `Practice Session ${sessions.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    };

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSession,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      setSessions([...sessions, newSession]);
      router.push(`/sessions/${newSession.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center">
        {user ? (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Practice Sessions</h1>

            <Button onClick={createNewSession} className="w-48">
              New Session
            </Button>

            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <h2 className="text-xl">{session.title}</h2>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No practice sessions yet. Start one now!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Welcome to Daily Speak</h1>
            <Button onClick={() => signInWithGoogle()} className="w-48">
              Sign in
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
