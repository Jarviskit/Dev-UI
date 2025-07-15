import { RenderProps, ToolStatus } from "../../jarviskit/interfaces/hook-interfaces";
import { AgentMessage } from "../chat/messages/AgentMessage";


export const render = (props: RenderProps<any, any>, mockResponse?: any) => {
  if (props.status === ToolStatus.Calling) {
    return <div>Calling</div>
  }


  return <>
    {/* If the tool has a content, show the agent message */}
    { props.message.content && props.message.content.length > 0 && <AgentMessage {...props.message} />}

    {/* Show the tool call component */}
    <div className="flex flex-col gap-2 bg-gray-100 border border-gray-200 p-3 rounded-md">
      <div className="font-semibold py-2">
        {props.message.toolName}
      </div>
      <div className="text-sm bg-green-200 p-3 rounded-md text-xs flex flex-row gap-2">
        <div className="flex-grow">Status: {props.status}</div>
        <div>{props.message.toolCallId}</div>
      </div>
      <div className="text-xs bg-blue-200 p-3 rounded-md">
        <pre>{JSON.stringify(props.args, null, 2)}</pre>
      </div>
      
      {/* Show the results if the tool has completed */}
      {props.status === ToolStatus.Completed && (
        <div className="bg-white p-3 rounded-md text-xs">
          <pre>{JSON.stringify(props.results, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-row gap-2">
        {props.status === ToolStatus.Executing && (
          <button className="bg-blue-500 text-blue-500 px-4 py-0 rounded-md" onClick={() => props.respond(mockResponse)}>
            Send response
          </button>
        )}
      </div>
    </div>
  </>
}