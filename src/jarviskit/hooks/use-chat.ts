import { useEffect, useState } from "react";
import { useAgentContext } from "../agent.context";
import { getThreadService } from "../services/thread.service";
import { Message, Thread } from "../interfaces/messages";
import { singletonHook } from "react-singleton-hook";

interface UseChatReturn {
  threadId: string | undefined;
  setThreadId: (threadId: string) => void;
  messages: Array<Message & any>;
  sendMessage: (message: string) => void;
  isTyping: boolean;
  thread: Thread | undefined;
}


export function _useChat(): UseChatReturn {
  const {
    socket,
    namespace,
    agentName,
    agentConfig,
    prependCachedEvents,
    onStreamEnded,
    onThreadChanged,
    sessionId,
    authToken,
  } = useAgentContext();

  const [threadId, setThreadId] = useState<string | undefined>();
  const [thread, setThread] = useState<Thread | undefined>();
  const [messages, setMessages] = useState<Array<Message & any>>([
    {
      role: "agent",
      type: "agent",
      content: "Hello, I'm the agent. How can I help you today?"
    }
  ]);

  const sendMessage = async (message: string) => {
    if (!threadId) return;

    await getThreadService(authToken).sendMessage({
      namespace,
      agentName,
      threadId,
      message,
      config: agentConfig,
      userId: "123123", // TODO: remove this in production
    })
  };

  // Check if the last message is from user (AI should be typing)
  // const isTyping = thread?.mode === "agent" && messages.length > 0 && messages[messages.length - 1].role === "user";
  const isTyping = false;


  const getThread = async () => {
    if (!threadId) return;

    // Get thread details
    getThreadService(authToken).getThread(threadId)
      .then((data) => {
        setThread(data.data);
      })
      .catch((error) => console.error("Failed to load thread:", error));
  }

  // Socket event handling
  useEffect(() => {
    if (!socket || !threadId) return;

    const handleMessage = (data: Message) => setMessages(prevMessages => [...prevMessages, data]);

    socket.on("message", handleMessage);
    socket.emit("join_thread", { threadId });

    return () => {
      socket.off("message", handleMessage);
      socket.emit("leave_thread", { threadId });
    };
  }, [socket, threadId]);

  // Load thread details and messages
  useEffect(() => {
    getThread();
  }, [threadId]);

  useEffect(() => {
    onThreadChanged(thread);

    if (!thread) {
      setMessages([])
      return;
    };

    // Fetch all messages from the thread
    getThreadService(authToken).getThreadMessages(thread.id)
      .then((data) => {
        setMessages(data.data.filter((message: Message) => {
          if (!thread.currentSessionId) return true;

          return message.sessionId != thread.currentSessionId
        }))
      })
      .catch((error) => console.error("Failed to load thread messages:", error));
    
    // If the thread is locked, fetch the cached events
    if (thread?.currentSessionId) {
      getThreadService(authToken).getCachedEvents(thread.id, thread.currentSessionId)
        .then((data) => prependCachedEvents(data.data))
        .catch((error) => console.error("Failed to load cached events:", error));
    }
  }, [thread]);
  
  useEffect(() => {
    // On stream ended, sync messages with the server to hide the typing indicator, stream content component
    // and show the final message
    if (!threadId) return;

    onStreamEnded(async () => {
      await getThread();

      const response = await getThreadService(authToken).getThreadMessages(threadId);
      const currentSessionMessages = response.data.filter((message: Message) => message.sessionId === sessionId);
      setMessages(prevMessages => [...prevMessages, ...currentSessionMessages]);
    })
  }, [sessionId, threadId])

  return {
    threadId,
    setThreadId,
    thread,
    messages,
    sendMessage,
    isTyping
  };
} 

export const useChat = singletonHook({} as UseChatReturn, _useChat);