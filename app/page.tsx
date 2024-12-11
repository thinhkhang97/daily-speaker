"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TextAnalysis from "@/components/TextAnalysis";

// const testingText = `Hello guys, today I'm gonna talk about my daily routine. I usually wake up at half-five o'clock. I cannot sleep more because I feel that is enough. I feel that's enough for my sleep and the people who live around my house also wake up and go to work at that time so it's kind of noisy to have a good sleep. After waking up, recently I have been running in the morning for a week because I want to lose my weight and improve my health. I usually run with my wife. She loves running and we have a goal to achieve a half marathon next year. So after we come home, we start cooking and prepare for walking or going to work. Recently my company has required staff to go to the office every day in a week. So if I need to go to the office in the morning, I need to repair the meal for lunch and some time for my dinner. So in the morning, we spend lots of time for exercising and cooking and then I go to work at 9 a.m. or 10 a.m. but it depends on my routine. So about an evening, I usually come home at 6 p.m. and had dinner before 7 o'clock because I am in a dia so I don't want to have dinner late. And at the weekend, we have some different routine because it's based on the time or the plan we have on the weekend. But I usually start at home to learn the new things or to try some new technology or researching. I and my wife also cook some delicious meals or go to some places to enjoy the weekend. So I think my routine kind of come on but I still enjoy routine with my wife.`;

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
