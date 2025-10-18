
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  image?: string; // base64 data URL
}

export type ChatSession = ChatMessage[];
