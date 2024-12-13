"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TextAnalysis from "@/components/TextAnalysis";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const [transcribedText, setTranscribedText] = useState("");

  const handleAudioRecorded = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {user ? (
          <div className="space-y-8">
            <div className="flex justify-center">
              <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transcription Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Transcription</h2>
                <div className="p-4 bg-gray-50 rounded-lg h-[calc(100%-2rem)]">
                  <div className="h-full overflow-auto">
                    {transcribedText ||
                      "Your transcription will appear here..."}
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              <div className="h-full">
                <TextAnalysis text={transcribedText} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4">Welcome to Daily Speak</h1>
            <p className="text-lg text-gray-600 mb-8">
              Practice your English speaking skills and get instant feedback on
              your pronunciation and grammar.
            </p>
            <Button size="lg" onClick={() => signInWithGoogle()}>
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
