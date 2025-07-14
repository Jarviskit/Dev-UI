import { useRef, useEffect } from "react";
import { UserMessage } from "./messages/UserMessage";
import { AgentMessage } from "./messages/AgentMessage";
import { InterruptionMessage } from "./messages/InterruptionMessage";
import { TypingIndicator } from "./messages/TypingIndicator";
import { useAgentAction, useToolMessageRenderer } from "../hooks/use-agent-action";
import * as toolMessage from "../helpers/ToolMessage";
import { StreamingContent } from "./messages/StreamingContent";
import { useChat } from "../hooks/use-chat";

interface ChatContentProps {
  isTyping: boolean;
}

export function ChatContent({ isTyping }: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isToolMessage, renderToolMessage } = useToolMessageRenderer();
  const { messages } = useChat();

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useAgentAction({
    name: "generate_job_description_tool",
    render: toolMessage.render
  })

  return (
    <div className="flex flex-col gap-2 p-3 flex-grow overflow-y-auto">
      {messages && messages.map((message, index) => {
        switch (message.role) {
          case "user":
            return <UserMessage key={index} {...message} />
          case "agent":
            // Tool message
            if (isToolMessage(message)) {
              const toolComponent = renderToolMessage(message);

              if (toolComponent) {
                return toolComponent;
              }
            }

            // Agent text message
            return <AgentMessage key={index} {...message}/>
          case "interruption":
            return <InterruptionMessage key={index} {...message} />
          default:
            return null;
        }
      })}
      {isTyping && <TypingIndicator />}
      <StreamingContent />
      <div ref={messagesEndRef} />
    </div>
  );
} 