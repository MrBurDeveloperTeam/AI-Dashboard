import { AIResponse } from '../types';
import { chatWithGemini, ChatHistory } from './geminiService';

export async function simulateChat(
  message: string, 
  predefinedResponses: AIResponse[], 
  activeModule: string,
  history: ChatHistory[] = []
): Promise<string> {
  const activeResponses = predefinedResponses.filter(r => 
    r.status === 'active' && 
    (!r.targetApp || r.targetApp.length === 0 || r.targetApp.includes('All') || r.targetApp.includes(activeModule))
  );
  
  const lowerMessage = message.toLowerCase();

  for (const response of activeResponses) {
    // Check if message matches any keywords
    if (response.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))) {
      return response.response;
    }
    // Check if message matches intent name
    if (lowerMessage.includes(response.intent.toLowerCase())) {
      return response.response;
    }
  }

  // If no predefined response found, fall back to Gemini
  return await chatWithGemini(history, message, activeModule);
}
