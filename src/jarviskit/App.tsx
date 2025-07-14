import ChatBox from "./chat/ChatBox";
import EventBox from './components/EventBox';
import { AgentProvider } from './agent.context';



export default function AgUiApp() {
  const runtimeAuthToken = import.meta.env.VITE_JARVIS_KIT_AUTH_TOKEN;

  return (
    <AgentProvider
      runtimeEndpoint="http://localhost:6789"
      namespace="demo_agent_space"
      agentName="agent_with_client_tool_call"
      agentConfig={{ token: 'abc.def.ghi', model: 'gpt-4o-mini' }}
      authToken={runtimeAuthToken}
    >
      <div className="flex flex-row gap-2 w-screen h-screen">
        <ChatBox threadId="agent_with_client_tool_call_002" />

        <div className="flex flex-col flex-grow">
          <EventBox />
        </div>
      </div>
    </AgentProvider>
  );
}