"use client";

import TextAnalysis from "@/components/TextAnalysis";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useState, useEffect } from "react";
import { PencilIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Improvement } from "@/types/session";

interface Session {
  id: string;
  title: string;
  transcription: string;
}

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const [transcribedText, setTranscribedText] = useState("");
  const [title, setTitle] = useState("New Session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestVersionNumber, setLatestVersionNumber] = useState(1);
  const [improvements, setImprovements] = useState<Improvement[]>([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!params?.id) return;

      try {
        // Fetch session data
        const sessionResponse = await fetch(`/api/sessions/${params.id}`);
        if (!sessionResponse.ok) {
          throw new Error("Session not found");
        }
        const session: Session = await sessionResponse.json();
        setTitle(session.title);
        setTranscribedText(session.transcription);

        // Fetch latest version
        const versionResponse = await fetch(
          `/api/sessions/${params.id}/latest-version`
        );
        const versionData = await versionResponse.json();
        setLatestVersionNumber((versionData.version_number || 0) + 1);
        setTranscribedText(versionData.transcript || "");

        // If there's a latest version, fetch its improvements
        if (versionData.id) {
          const improvementsResponse = await fetch(
            `/api/versions/${versionData.id}/improvements`
          );
          if (improvementsResponse.ok) {
            const improvementsData = await improvementsResponse.json();
            setImprovements(improvementsData.improvements);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setError("Session not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [params?.id]);

  const handleAudioRecorded = async (audioBlob: Blob) => {
    if (!params?.id) return;

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.text);

      // Save the updated transcription to the session
      await fetch(`/api/sessions/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription: data.text,
        }),
      });
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleTitleUpdate = async (newTitle: string) => {
    if (!params?.id) return;
    try {
      await fetch(`/api/sessions/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });
    } catch (error) {
      console.error("Error updating title:", error);
      // Optionally, you could add error handling UI here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">
            The requested session could not be found.
          </p>
          <Button>
            <Link href="/" className="inline-block px-4 py-2 transition-colors">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button variant="outline" className="w-16">
              V{latestVersionNumber}
            </Button>
          </div>
          <div className="flex justify-center items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={async () => {
                  setIsEditingTitle(false);
                  await handleTitleUpdate(title);
                }}
                autoFocus
                className="text-2xl font-bold text-center bg-transparent border-none focus:outline-none focus:ring-2 rounded px-2 py-1"
                placeholder="Enter session title..."
              />
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
            <button
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <PencilIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="flex justify-center">
            <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transcription Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">Transcription</h2>
              <div className="p-4 bg-gray-50 rounded-lg h-[calc(100%-2rem)]">
                <div className="h-full overflow-auto">
                  {transcribedText || "Your transcription will appear here..."}
                </div>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="h-full">
              <TextAnalysis
                text={transcribedText}
                sessionId={params?.id || ""}
                versionNumber={latestVersionNumber}
                initialAnalysis={improvements.map((improvement) => ({
                  original: improvement.original_text,
                  better: improvement.suggested_text,
                  why: improvement.explanation,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
