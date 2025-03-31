import { useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatPanel({ onSubmitPrompt }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { message: "Hi! Describe the app you'd like to build.", isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;
  
    const newMessages = [...messages, { message: input, isUser: true }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
  
    // Call the API
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
  
    const data = await res.json();
    const aiCode = data.code;
  
    setMessages([
      ...newMessages,
      { message: "Here’s your generated app 👇", isUser: false }
    ]);
    onSubmitPrompt(aiCode);
    setIsLoading(false);
  };
  
  

  return (
    <div className="h-full bg-black text-white p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg.message} isUser={msg.isUser} />
        ))}
     {isLoading && (
  <div className="flex justify-start mb-2">
    <div className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
      <svg
        className="w-4 h-4 animate-spin text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <span>Generating app for you...</span>
    </div>
  </div>
)}

      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your app..."
          className="flex-grow p-2 rounded-l-lg text-black bg-white outline-none "
        />
        <button onClick={handleSubmit} className="bg-blue-600 px-4 rounded-r-lg">Send</button>
      </div>
    </div>
  );
}
