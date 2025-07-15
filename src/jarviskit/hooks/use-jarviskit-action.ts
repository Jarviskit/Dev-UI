import { useCallback, useEffect } from "react";
import { Message } from "../interfaces/messages";
import { ToolResponseMode, ToolStatus, UseAgentActionProps } from "../interfaces/hook-interfaces";
import { getThreadService } from "../services/thread.service";
import { useJarvisKitContext } from "../jarviskit.context";

const registeredActions = new Map<string, UseAgentActionProps<any, any>>();

export function useJarvisKitAction<T, K>(props: UseAgentActionProps<T, K>): void {
  const { name, render } = props;

  useEffect(() => {
    registeredActions.set(name, props);
    
    return () => {
      registeredActions.delete(name);
    };
  }, [name, render]);
}

export function useJarvisKitToolMessageRenderer( ) {
  const { namespace, agentName, authToken } = useJarvisKitContext();
  if (!namespace || !agentName) {
    throw new Error('Agent space and agent name are required');
  }

  const isToolMessage = useCallback((message: Message): boolean => {
    return message.toolCallId !== null && message.toolName !== null;
  }, []);

  const renderToolMessage = useCallback((message: Message): React.ReactNode | null => {
    if (!isToolMessage(message)) {
      return null;
    }

    const action = registeredActions.get(message.toolName!);
    if (!action) {
      return null;
    }

    const args = message.toolInput || {};
    const results = message.toolResults || {};

    // Executing: render the tool message to show what the tool going to do
    if (message.toolStatus === ToolStatus.Executing) {
      return action.render({
        args: typeof args === 'string' ? JSON.parse(args as string) : args,
        results: undefined,
        status: ToolStatus.Executing,
        message,
        respond: async (toolResults: object) => {
          if (action.responseMode !== ToolResponseMode.Client) {
            console.error('Respond function is not available for response mode: ', action.responseMode);
            return;
          }

          await getThreadService(authToken).sendToolResponse({
            namespace,
            agentName,
            toolCallId: message.toolCallId as string,
            response: toolResults
          });
        }
      });
    }

    // Completed: render the tool message to show the results of the tool
    if (message.toolStatus === ToolStatus.Completed) {
      return action.render({
        args: typeof args === 'string' ? JSON.parse(args as string) : args,
        results: typeof results === 'string' ? JSON.parse(results as string) : results,
        status: ToolStatus.Completed,
        message
      });
    }

    return null;
  }, [isToolMessage]);

  return {
    isToolMessage,
    renderToolMessage
  };
}