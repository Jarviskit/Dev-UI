import { EventType } from "@ag-ui/core";
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

export interface UserMessagePayload {
  namespace: string;
  agentName: string;
  threadId: string;
  message: string;
  config: any;
}

export interface SendToolResponsePayload {
  namespace: string;
  agentName: string;
  toolCallId: string;
  response: object;
}

export interface AguiEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  order: number;
  data?: any;
}