
export type CampaignResult = {
  objectives: string;
  contentIdeas: string[];
  ctas: string[];
  adCopies: {
    variation: string;
    text: string;
  }[];
};

export interface PitchResult {
  elevatorPitch: string;
  valueProposition: string;
  differentiators: string[];
  callToAction: string;
}

export interface LeadResult {
  score: number;
  reasoning: string;
  probabilityOfConversion: number;
  recommendedActions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export enum ToolType {
  CAMPAIGN = 'CAMPAIGN',
  PITCH = 'PITCH',
  LEAD = 'LEAD'
}
