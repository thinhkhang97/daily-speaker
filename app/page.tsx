"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Session } from "@/types/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  const createNewSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: `Practice Session ${sessions.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    };
    setSessions([...sessions, newSession]);
    router.push(`/sessions/${newSession.id}`);
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
