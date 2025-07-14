import { useState } from "react";
import { useChat } from "../hooks/use-chat";


export function InputBox() {
  const [message, setMessage] = useState('');
  const { isTyping, sendMessage } = useChat();
  
  return (
    <div className="flex flex-row gap-2 p-3 bg-gray-100">
      <input
        type="text"
        className={`flex-grow outline-none border-none ${isTyping ? 'bg-gray-200 cursor-not-allowed' : ''}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isTyping && message.trim()) {
            sendMessage(message);
            setMessage('');
          }
        }}
        disabled={isTyping}
        placeholder={isTyping ? "AI is typing..." : "Type your message..."} />
      <button 
        className={`px-4 py-2 rounded-md ${isTyping || !message.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
        onClick={() => sendMessage(message)}
        disabled={isTyping || !message.trim()}>
        Send
      </button>
    </div>
  );
}