import ChatBox from "./dev-ui/chat/ChatBox";
import EventBox from './dev-ui/components/EventBox';
import { JarvisKitProvider } from './jarviskit/jarviskit.context';



export default function JarvisKitDevUI() {
  const runtimeAuthToken = import.meta.env.VITE_JARVIS_KIT_AUTH_TOKEN;

  return (
    <JarvisKitProvider
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
    </JarvisKitProvider>
  );
}