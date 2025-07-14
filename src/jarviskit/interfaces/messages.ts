import { ToolStatus } from "./hook-interfaces";

export interface Message {
  id: string;
  thread: string;
  content: string;
  role: 'agent' | 'user' | 'admin' | 'developer'| 'interruption';
  toolCallId: string | null;
  toolName: string | null;
  toolInput: object | null;
  toolResults: object | null;
  toolStatus: ToolStatus;
  metadata: object | null;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

export interface Thread {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentSessionId: string;
}