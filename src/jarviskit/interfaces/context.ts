import { Socket } from "socket.io-client";
import { AguiEvent } from "./messages";
import { ThreadService } from "../services/thread.service";
import { Thread } from "./messages";

export interface JarvisKitProviderProps {
  runtimeEndpoint: string;
  namespace: string;
  agentName: string;

  authToken?: string;
  transports?: Array<'websocket' | 'polling'>;
  agentConfig: any;

  children: React.ReactNode;
}

export interface JarvisKitContextProps {
  socket: Socket | null;
  authToken: string | undefined;
  sessionId: string | undefined;
  namespace: string;
  agentName: string;

  agentState: any;
  setAgentState: (agentState: any) => void;

  agentConfig: any;
  setAgentConfig: (config: any) => void;

  threadService: ThreadService;
  
  isConnected: boolean;
  isStreaming: boolean;
  aguiEvents: AguiEvent[];
  prependCachedEvents: (events: AguiEvent[]) => void;
  onStreamEnded: (callback: () => Promise<void>) => void;
  onThreadChanged: (thread?: Thread) => void;
}