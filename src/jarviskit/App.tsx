import ChatBox from "./chat/ChatBox";
import EventBox from './components/EventBox';
import { AgentProvider } from './agent.context';



export default function AgUiApp() {

  return (
    <AgentProvider
      runtimeEndpoint="http://localhost:6789"
      namespace="demo_agent_space"
      agentName="custom_event_graph"
      agentConfig={{ token: 'abc.def.ghi', model: 'gpt-4o-mini' }}
      authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzEyMyIsImZ1bGxOYW1lIjoiTmdoaWEgUGhhbSIsImlhdCI6MTc1MjE0MTAzMSwiZXhwIjoxNzUyNzQ1ODMxfQ.IIP6CYSk21VNqpJhxAPf5RdyOwQjhRmoTaiWPKr8KDw"
    >
      <div className="flex flex-row gap-2 w-screen h-screen">
        <ChatBox threadId="custom_event_graph_001" />

        <div className="flex flex-col flex-grow">
          <EventBox />
        </div>
      </div>
    </AgentProvider>
  );
}