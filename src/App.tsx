import ChatBox from "./dev-ui/chat/ChatBox";
import EventBox from './dev-ui/components/EventBox';
import { JarvisKitProvider } from './jarviskit/jarviskit.context';



export default function JarvisKitDevUI() {
  const runtimeAuthToken = import.meta.env.VITE_JARVIS_KIT_AUTH_TOKEN;

  return (
    <JarvisKitProvider
      runtimeEndpoint="http://localhost"
      namespace="demo_agent_space"
      agentName="candidate_agent"
      agentConfig={{ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODc0YjY2NDA0NDU5YzE1MDE1MTdiZiIsImZ1bGxOYW1lIjoiTmdoaWEgUGhhbSIsImlhdCI6MTc1MzY5NzEyNywiZXhwIjoxNzU2Mjg5MTI3fQ.xHVNIcXMY3mvWkmWx2jCM6We1gdRZ3Jgt4GRcWvimvU' }}
      authToken={runtimeAuthToken}
    >
      <div className="flex flex-row gap-2 w-screen h-screen">
        <ChatBox threadId="nghia_test_001" />

        <div className="flex flex-col flex-grow">
          <EventBox />
        </div>
      </div>
    </JarvisKitProvider>
  );
}