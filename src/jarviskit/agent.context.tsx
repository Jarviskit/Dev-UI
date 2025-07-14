import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { EventType, BaseEvent } from "@ag-ui/core";
import { SingletonHooksContainer } from "react-singleton-hook";
import { Thread } from "./interfaces/messages";

export interface AgentProviderProps {
  runtimeEndpoint: string;
  namespace: string;
  agentName: string;

  authToken?: string;
  transports?: Array<'websocket' | 'polling'>;
  agentConfig: any;

  children: React.ReactNode;
}

export interface AguiEvent {
  id: string;
  type: EventType;
  timestamp: string;
  order: number;
  data?: any;
}

export interface AgentContextProps {
  socket: Socket | null;
  authToken: string | undefined;
  sessionId: string | undefined;
  namespace: string;
  agentName: string;

  agentState: any;
  setAgentState: (agentState: any) => void;

  agentConfig: any;
  setAgentConfig: (config: any) => void;
  
  isConnected: boolean;
  isStreaming: boolean;
  aguiEvents: AguiEvent[];
  prependCachedEvents: (events: AguiEvent[]) => void;
  onStreamEnded: (callback: () => Promise<void>) => void;
  onThreadChanged: (thread?: Thread) => void;
}

export const AgentContext = createContext<AgentContextProps | null>(null);

export function AgentProvider(props: AgentProviderProps) {
  const { children, runtimeEndpoint, authToken, transports} = props;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agentState, setAgentState] = useState<any>({});
  const [aguiEvents, setAguiEvents] = useState<AguiEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(props.agentConfig);
  const _onStreamEnded = useRef<() => Promise<void>>(() => Promise.resolve());
  const currentSessionId = useRef<string | undefined>(undefined);

  const eventBuffer = useRef(new Map<number, AguiEvent>());
  const expectedEventOrder = useRef<number | undefined>(undefined);

  // Utils
  const handleEvent = (eventType: EventType, data: BaseEvent & { order: number, runId?: string }) => {
    const newEvent: AguiEvent = {
      id: Date.now().toString(),
      type: eventType,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      order: data.order,
      data,
    };
    eventBuffer.current.set(data.order, newEvent);
    
    if (expectedEventOrder.current === undefined) {
      expectedEventOrder.current = 0;
    }

    if (data.type === EventType.RUN_STARTED) {
      setIsStreaming(true);
      currentSessionId.current = data.runId;
    }
    if (data.type === EventType.RUN_FINISHED || data.type === EventType.RUN_ERROR) {
      if (data.type === EventType.RUN_ERROR) {
        console.error('Run error:', data);
      }

      _onStreamEnded.current().then(() => {
        setIsStreaming(false);
        // setAguiEvents([]);
        currentSessionId.current = undefined;
      });
    }

    parseAguiEvents();
  };

  const parseAguiEvents = () => {
    if (expectedEventOrder.current === undefined) return;

    const newEvents: AguiEvent[] = [];
    while (eventBuffer.current.has(expectedEventOrder.current)) {
      const event = eventBuffer.current.get(expectedEventOrder.current)!;
      newEvents.push(event);
      eventBuffer.current.delete(expectedEventOrder.current);
      expectedEventOrder.current++;
    }

    if (newEvents.length > 0) {
      setAguiEvents(prev => [...prev, ...newEvents]);
    }
  };

  const prependCachedEvents = (events: any[]) => {
    for (const cachedEvent of events) {
      handleEvent(cachedEvent.type as EventType, cachedEvent);
    }
  };

  const setSessionId = (sessionId?: string) => {
    currentSessionId.current = sessionId;
  }

  const onThreadChanged = (thread?: Thread) => {
    setIsStreaming(false);
    setAguiEvents([]);
    setSessionId(thread?.currentSessionId);

    expectedEventOrder.current = undefined;
    eventBuffer.current = new Map<number, AguiEvent>();
  }

  // Hooks
  const onStreamEnded = (callback: () => Promise<void>) => {
    _onStreamEnded.current = callback;
  }

  // Effects
  useEffect(() => {
    const ioClient = io(runtimeEndpoint, {
      autoConnect: true,
      transports: transports || ['websocket'],
      auth: { token: authToken },
    });

    ioClient.on('connect', () => {
      console.log('Connected to runtime server:', ioClient.id);
      setIsConnected(true);
    });

    ioClient.on('disconnect', () => {
      console.log('Disconnected from runtime server');
      setIsConnected(false);
    });

    ioClient.on('error', (error: any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    ioClient.on('agui_event', (data: any) => handleEvent(data.type, data));

    setSocket(ioClient);
    
    return () => {
      ioClient.close();
    };
  }, []);

  return socket && <AgentContext.Provider
    value={{
      socket,
      namespace: props.namespace,
      agentName: props.agentName,
      sessionId: currentSessionId.current,
      authToken: authToken,

      agentState, setAgentState,
      agentConfig, setAgentConfig,
      
      isConnected,
      isStreaming,
      aguiEvents,
      prependCachedEvents,
      onStreamEnded,  
      onThreadChanged,
    }}
  >
    <SingletonHooksContainer />
    {children}
  </AgentContext.Provider>;
}

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentContext must be used within an AgentProvider");
  }
  return context;
};

export const useSocket = () => {
  const { socket } = useAgentContext();
  if (!socket) {
    throw new Error("useSocket must be used within an AgentProvider");
  }
  return socket;
};