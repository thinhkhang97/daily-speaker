"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TextAnalysis from "@/components/TextAnalysis";

export default function Home() {
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
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Voice Recording & Analysis
      </h1>
      <VoiceRecorder onRecordingComplete={handleAudioRecorded} />
      <TextAnalysis text={transcribedText} />
    </main>
  );
}
