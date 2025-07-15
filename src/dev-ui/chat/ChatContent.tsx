import { useRef, useEffect } from "react";
import { UserMessage } from "./messages/UserMessage";
import { AgentMessage } from "./messages/AgentMessage";
import { TypingIndicator } from "./messages/TypingIndicator";
import * as toolMessage from "../helpers/ToolMessage";
import {
  useJarvisKitChat,
  useJarvisKitAction,
  useJarvisKitToolMessageRenderer,
  useJarvisKitStream
} from "../../jarviskit/hooks";

interface ChatContentProps {
  isTyping: boolean;
}

export function ChatContent({ isTyping }: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isToolMessage, renderToolMessage } = useJarvisKitToolMessageRenderer();
  const { messages } = useJarvisKitChat();
  const streamingContent = useJarvisKitStream();

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useJarvisKitAction({
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
          default:
            return null;
        }
      })}
      {isTyping && <TypingIndicator />}
      {streamingContent}
      <div ref={messagesEndRef} />
    </div>
  );
} 