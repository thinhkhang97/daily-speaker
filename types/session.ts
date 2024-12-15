export interface Session {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  versions: Version[];
}

export interface Version {
  id: string;
  session_id: string;
  version_number: number;
  audio_url: string;
  transcript: string;
  analysis: {
    improvements: Improvement[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface Improvement {
  id: string;
  version_id: string;
  original_text: string;
  suggested_text: string;
  explanation: string;
  created_at: Date;
  updated_at: Date;
}
