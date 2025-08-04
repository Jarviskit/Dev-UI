import { useEffect } from "react";
import { AguiEvent } from "../interfaces/messages";


interface UseJarvisKitCustomEventProps {
  event: string;
  render?: (eventValue: any) => React.ReactNode;
  handler?: (eventValue: any) => void;
}

const registeredCustomEvents = new Map<string, UseJarvisKitCustomEventProps>();

export const useJarvisKitCustomEvent = (props: UseJarvisKitCustomEventProps) => {
  const { event } = props;
  useEffect(() => {
    registeredCustomEvents.set(event, props);

    return () => {
      registeredCustomEvents.delete(event);
    };
  }, []);

  return null;
}

export function useJarvisKitCustomEventRenderer(): (event: AguiEvent) => React.ReactNode | null {
  return (event: AguiEvent) => {
    const { render } = registeredCustomEvents.get(event.data.name) || {};

    return render ? render(event.data.value) : null;
  }
}

export function useJarvisKitCustomEventHandler(): (event: AguiEvent) => void {
  return (event: AguiEvent) => {
    const { handler } = registeredCustomEvents.get(event.data.name) || {};

    return handler ? handler(event.data.value) : null;
  }
}