import { useEffect, useRef } from 'react';
import { useAgentContext } from '../agent.context';
import { useChat } from '../hooks/use-chat';


export default function EventBox() {
  // const socket = useSocket();
  const { aguiEvents, isStreaming, sessionId, namespace, agentName } = useAgentContext();
  const { threadId, thread } = useChat();
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollTop = eventsEndRef.current.scrollHeight;
    }
  }, [aguiEvents]);

  const getEventColor = (eventType: string) => {
    const eventColors = {
      'RUN_STARTED': 'text-purple-400',
      'RUN_FINISHED': 'text-purple-400',
      'TEXT_MESSAGE_START': 'text-blue-400',
      'TEXT_MESSAGE_CONTENT': 'text-blue-400',
      'TEXT_MESSAGE_END': 'text-blue-400',
      'STATE_SNAPSHOT': 'text-orange-400',
      'TOOL_CALL_START': 'text-green-400',
      'TOOL_CALL_END': 'text-green-400',
      'ERROR': 'text-red-400'
    }
    
    return eventColors[eventType as keyof typeof eventColors] || 'text-gray-400';
  };


  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-grow p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">AG-UI Events</h2>
        </div>
        
        <div ref={eventsEndRef} className="h-full overflow-y-auto space-y-2">
          {aguiEvents.map((event, index) => (
            <div key={index} className="bg-white p-3 rounded shadow-sm border-l-4 border-gray-300">
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className={`font-semibold text-sm ${getEventColor(event.type)}`}>
                    {event.type}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {event.timestamp}
                  </div>
                </div>
                {event.data && (
                  <div className="text-xs text-gray-600 mt-1 w-full">
                    <pre className="w-full text-wrap overflow-x-auto">{JSON.stringify(event.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {aguiEvents.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No events yet
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded min-h-[300px]">
        <h2 className="text-lg font-bold mb-4">Agent State</h2>
        <div className="text-sm text-gray-600">Space Name: {namespace}</div>
        <div className="text-sm text-gray-600">Agent Name: {agentName}</div>
        <div className="text-sm text-gray-600">Streaming: {isStreaming ? 'Yes' : 'No'}</div>
        <div className="text-sm text-gray-600">Thread ID: {threadId || 'N/A'}</div>
        <div className="text-sm text-gray-600">Session ID: {sessionId || 'N/A'}</div>
        <div className="text-sm text-gray-600">Received Events: {aguiEvents.length}</div>
        <pre className="w-full text-wrap overflow-x-auto text-xs bg-gray-100 p-2 rounded-md">{JSON.stringify(thread, null, 2)}</pre>
        <div className="text-sm text-gray-600">

        </div>
      </div>
    </div>
  );
} 