import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AnalysisItem {
  original: string;
  better: string;
  why: string;
}

const TextAnalysis = ({
  text,
  sessionId,
  initialAnalysis,
  versionNumber,
}: {
  text: string;
  sessionId: string;
  versionNumber: number;
  initialAnalysis: AnalysisItem[];
}) => {
  const [analysis, setAnalysis] = useState<AnalysisItem[]>(initialAnalysis);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sessionId,
          versionNumber,
        }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Speech Analysis</h2>
      <div className="space-y-4 h-[calc(100%-2rem)]">
        <Button
          onClick={analyzeText}
          disabled={!text || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Speech"
          )}
        </Button>

        <div className="overflow-auto h-[calc(100%-4rem)]">
          {analysis.length > 0 && (
            <div className="space-y-6">
              {analysis.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-4">
                    <div className="text-sm text-gray-500 mb-1">Original</div>
                    <div className="text-gray-700">{item.original}</div>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <div className="text-sm text-gray-500 mb-1">Better</div>
                    <div className="text-gray-700">{item.better}</div>
                  </div>

                  <div className="text-sm text-gray-500 italic pl-4">
                    Why: {item.why}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
