export type PetState = 'Normal' | 'Hungry' | 'Unhappy' | 'Dirty' | 'Low Energy' | 'Audio';

export type MeowDialogueConfig = {
  Normal: string[];
  Hungry: string[];
  Unhappy: string[];
  Dirty: string[];
  'Low Energy': string[];
  Audio: string[];
  timingConfigs?: {
    [key in PetState]?: {
      messageDurationMinutes: number;
      messageIntervalMinutes: number;
      disabled?: boolean;
    };
  };
};

export type AIResponse = {
  id: string;
  intent: string;
  keywords: string[];
  response: string;
  status: 'active' | 'draft' | 'archived';
  targetApp: string[];
  createdAt: number;
  updatedAt: number;
};

export type QuickPromptConfig = {
  text: string;
  iconName: string;
};

export type SimulatorConfig = {
  title: string;
  subtitle: string;
  prompts: [QuickPromptConfig, QuickPromptConfig, QuickPromptConfig, QuickPromptConfig]; // exactly 4 prompts based on current design
  dialogSteps?: string[]; 
  postLoginDialogSteps?: string[];
};
