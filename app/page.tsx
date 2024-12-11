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
    console.log("🚀 ~ handleAudioRecorded ~ audioBlob:", audioBlob);
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.text);
      console.log("🚀 ~ handleAudioRecorded ~ data.text:", data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {user ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
              <TextAnalysis text={transcribedText} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
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
