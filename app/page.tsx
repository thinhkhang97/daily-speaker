"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Session } from "@/types/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "./actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: `Practice Session ${sessions.length + 1}`,
      created_at: new Date(),
      updated_at: new Date(),
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

      setSessions([newSession, ...sessions]);
      router.push(`/sessions/${newSession.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {user ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Practice Sessions</h1>
              <Button onClick={createNewSession}>New Session</Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : sessions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    <CardHeader>
                      <CardTitle>{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No practice sessions yet. Start one now!
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Welcome to Daily Speak</h1>
            <p className="text-xl text-gray-600">
              Practice and improve your speaking skills with AI-powered feedback
            </p>
            <Button onClick={() => signInWithGoogle()} size="lg">
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
