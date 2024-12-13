"use client";

import TextAnalysis from "@/components/TextAnalysis";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useState } from "react";
import { PencilIcon } from "lucide-react";

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("");
  const [title, setTitle] = useState("New Session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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
        <div className="space-y-8">
          <div className="flex justify-center items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
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
              <TextAnalysis text={transcribedText} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
