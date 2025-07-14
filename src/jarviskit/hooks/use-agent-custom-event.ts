import { useEffect } from "react";
import { AguiEvent } from "../agent.context";


interface UseAgentCustomEventProps {
  event: string;
  render?: (eventValue: any) => React.ReactNode;
}

const registeredCustomEvents = new Map<string, UseAgentCustomEventProps>();
export const useAgentCustomEvent = (props: UseAgentCustomEventProps) => {
  const { event } = props;
  useEffect(() => {
    registeredCustomEvents.set(event, props);

    return () => {
      registeredCustomEvents.delete(event);
    };
  }, []);

  return null;
}

export function useAgentCustomEventRenderer(): (event: AguiEvent) => React.ReactNode | null {
  return (event: AguiEvent) => {
    const { render } = registeredCustomEvents.get(event.data.name) || {};

    return render ? render(event.data.value) : null;
  }
}