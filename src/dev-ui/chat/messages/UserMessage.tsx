import { Message } from "../../../jarviskit/interfaces/messages";

export function UserMessage(message: Message) {
  return <div className="flex justify-end">
    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[90%]">
      {message.content}
      <div className="text-xs text-orange-200 border-t border-orange-200 pt-1 mt-2">
        <pre>{message.id}</pre>
      </div>
    </div>
  </div>
}