import { Message } from "../../interfaces/messages";


export function AgentMessage(message: Message) {
  return <div className="flex justify-start">
    <div className={`px-4 py-2 rounded-lg max-w-[90%] ${message.role === 'admin' ? 'bg-gray-400 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
      <div>{message.content}</div>
      <div className="text-xs text-blue-600 border-t border-blue-600 pt-1 mt-2">
        <pre>{message.id}</pre>
      </div>
    </div>
  </div>
}