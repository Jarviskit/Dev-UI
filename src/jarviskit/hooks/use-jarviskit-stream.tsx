import { useEffect, useState } from "react";
import { useJarvisKitContext } from "../jarviskit.context";
import { Message } from "../interfaces/messages";
import { useJarvisKitToolMessageRenderer } from "./use-jarviskit-action";
import { useJarvisKitCustomEventHandler, useJarvisKitCustomEventRenderer } from "./use-jarviskit-custom-event";
import { ToolStatus } from "../interfaces/hook-interfaces";
import { EventType } from "@ag-ui/core";
import { AgentMessage } from "../../dev-ui/chat/messages/AgentMessage";

export function useJarvisKitStream() {
  const { aguiEvents, isStreaming } = useJarvisKitContext(); 
  const [messages, setMessages] = useState<Array<Message & any>>([]);
  const { renderToolMessage } = useJarvisKitToolMessageRenderer();
  const customEventRenderer = useJarvisKitCustomEventRenderer();
  const customEventHandler = useJarvisKitCustomEventHandler();
  const [processedEventCount, setProcessedEventCount] = useState(0);

  const convertAguiEventsToMessages = () => {
    const convertedMessages: Array<Message & any> = messages || [];

    for (const event of aguiEvents.slice(processedEventCount)) {
      if (event.type === EventType.TEXT_MESSAGE_START) {
        convertedMessages.push({
          id: event.data.messageId,
          role: 'agent',
          content: '',
        });

      } else if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
        const message = convertedMessages.find((m) => m.id === event.data.messageId);
        if (message) message.content += event.data.delta;

      } else if (event.type === EventType.TOOL_CALL_START) {
        const message = convertedMessages[convertedMessages.length - 1];
        message.toolCallId = event.data.toolCallId;
        message.toolName = event.data.toolCallName;
        message.toolStatus = ToolStatus.Calling;
        
      } else if (event.type === EventType.TOOL_CALL_ARGS) {
        const message = convertedMessages[convertedMessages.length - 1];
        message.toolInput = message.toolInput ? message.toolInput + event.data.delta : event.data.delta;

      } else if (event.type === EventType.TOOL_CALL_END) {
        const message = convertedMessages[convertedMessages.length - 1];
        message.toolStatus = ToolStatus.Executing;

      } else if (event.type === EventType.TOOL_CALL_RESULT) {
        const message = convertedMessages[convertedMessages.length - 1];
        message.toolResults = event.data.content;
        message.toolStatus = ToolStatus.Completed;

      } else if (event.type === EventType.CUSTOM) {
        // Checking for render strategy
        if (!event.data.value) continue;

        customEventHandler(event);
        
        if (event.data.value.strategy === 'replace') {
          // Find the last custom event with the same name and replace it's content with the new one
          const lastCustomEvent = convertedMessages.filter((m) => m.type === 'custom' && m.event === event.data.name).pop();

          if (lastCustomEvent) {
            lastCustomEvent.content = customEventRenderer(event);
          } else {
            // If there is no last custom event then this is the first custom event with this name
            convertedMessages.push({ type: 'custom', event: event.data.name, content: customEventRenderer(event) });
          }
        } else if (event.data.value.strategy === 'append') {
          convertedMessages.push({ type: 'custom', event: event.data.name, content: customEventRenderer(event) });
        }
      }
    }

    setMessages(convertedMessages);
    setProcessedEventCount(aguiEvents.length);
  };

  const isToolMessage = (message: Message): boolean => {
    return message.toolCallId !== null && message.toolName !== null;
  }

  useEffect(() => {
    convertAguiEventsToMessages();
  }, [aguiEvents]);

  useEffect(() => {
    // Reset the messages when the streaming is stopped
    if (!isStreaming) {
      setProcessedEventCount(0);
      setMessages([]);
    }
  }, [isStreaming]);

  if (!isStreaming) return;

  return (<div className="flex flex-col gap-2 p-1 rounded-lg animate-gradient">
    <div className="flex flex-col gap-2 bg-white rounded-lg">
      {messages.map((message, index) => {
        // Tool message
        if (isToolMessage(message)) {
          const toolComponent = renderToolMessage(message);
          if (toolComponent) {
            return <div key={index}>{toolComponent}</div>;
          }
        }

        // Custom event
        if (message.type === 'custom') {
          return message.content && <div key={index} className="flex flex-col gap-2 bg-white rounded-lg">
            {message.content}
          </div>;
        }

        // Agent text message
        return <div key={index}>
          <AgentMessage {...message} />
        </div>
      })}
    </div>
  </div>);
}

