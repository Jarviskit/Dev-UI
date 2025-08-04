import { ChatContent } from "./ChatContent";
import { InputBox } from "./InputBox";
import * as toolMessage from "../helpers/ToolMessage";
import { useEffect, useState } from "react";
import { ToolResponseMode } from "../../jarviskit/interfaces/hook-interfaces";
import {
  useJarvisKitChat,
  useJarvisKitAction,
  useJarvisKitCustomEvent
} from "../../jarviskit/hooks";

interface ChatBoxProps {
  threadId: string;
}

export default function ChatBox(props: ChatBoxProps) {
  const {
    threadId,
    setThreadId,
    isTyping,
  } = useJarvisKitChat();
  const [instructions, setInstructions] = useState<string[]>([]);

  useEffect(() => {
    if(setThreadId) { 
      setThreadId(props.threadId);
    }
  }, [props.threadId, setThreadId]);

  useJarvisKitAction<any, {}>({
    name: "scan_cv_tool",
    responseMode: ToolResponseMode.Client,
    render: (props) => toolMessage.render(props, {
      "name": "Pham Dai Nghia",
      "experiences": "20 năm",
      "skills": ["Python", "Java", "C#"],
      "education": "Đại học Bách Khoa Hà Nội"
    })
  })

  useJarvisKitCustomEvent({
    event: 'progress_event',
    render: (event: any) => {
      return <div className="bg-gray-100 text-gray-800 p-2 rounded-lg w-full border flex flex-row gap-3 items-center">
        <div className="p-1 bg-blue-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="text-sm text-gray-500 flex-grow">{event.message}</div>
      </div>
    }
  })

  useJarvisKitCustomEvent({ 
    event: 'alert_event',
    render: (event: any) => {
      return <div className="bg-gray-100 text-gray-800 p-2 rounded-lg w-full border flex flex-row gap-3 items-center">
        <div className="p-1 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <div className="text-sm text-gray-500 flex-grow">{event.message}</div>
      </div>
    }
  })

  useJarvisKitCustomEvent({
    event: 'suggest_next_action',
    handler: (rawValue: any) => {
      if (rawValue.message) {
        setInstructions(rawValue.message);
      }
    }
  })

  useEffect(() => {
    console.log('suggest_next_action', instructions);
  }, [instructions]);

  
  return <div className="flex flex-col gap-2 w-[600px] h-full border-r-1 border-gray-300 shrink-0">
    <div className="flex flex-row gap-2 bg-gray-900 px-3 py-5 text-white text-lg font-bold w-full">
      <div className="w-[350px]">JarvisKit Demo UI</div>
      <div className="flex flex-row gap-2 w-full">
        <input
          type="text"
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-md text-xs text-right"
          value={threadId || ''}
          onChange={(e) => setThreadId(e.target.value)}
        />
      </div>
    </div>

    <ChatContent isTyping={isTyping} />
    {instructions && <div className="flex flex-row gap-2 text-gray-800 text-sm font-bold w-full px-2 overflow-x-auto">
      {instructions.map((instruction, index) => (
        <div key={index} className="flex flex-row gap-2 bg-gray-100 px-2 py-1 rounded-md cursor-pointer">
          <div className="text-sm text-gray-500 flex-grow">{instruction}</div>
        </div>
      ))}
    </div>}
    
    <InputBox />
  </div>;
}