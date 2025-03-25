import { useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatPanel({ onSubmitPrompt }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { message: "Hi! Describe the app you'd like to build.", isUser: false },
  ]);

  const handleSubmit = () => {
    if (!input) return;
    const newMessages = [...messages, { message: input, isUser: true }];
    setMessages(newMessages);
    onSubmitPrompt(input);
    setInput("");
  };

  return (
    <div className="h-full bg-black text-white p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg.message} isUser={msg.isUser} />
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your app..."
          className="flex-grow p-2 rounded-l-lg text-black"
        />
        <button onClick={handleSubmit} className="bg-blue-600 px-4 rounded-r-lg">Send</button>
      </div>
    </div>
  );
}
