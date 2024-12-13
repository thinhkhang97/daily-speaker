export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  versions: Version[];
}

export interface Version {
  id: string;
  sessionId: string;
  versionNumber: number;
  audioUrl: string;
  transcript: string;
  analysis: {
    improvements: Improvement[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Improvement {
  id: string;
  versionId: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}
