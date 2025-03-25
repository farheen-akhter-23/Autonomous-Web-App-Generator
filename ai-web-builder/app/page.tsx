'use client';
import { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import PreviewPanel from "../components/PreviewPanel";

export default function Home() {
  const [code, setCode] = useState(`<html><body><h1 style="text-align:center;">👋 Waiting for your prompt...</h1></body></html>`);

  const handlePrompt = (prompt) => {
    // TEMP: Replace with AI code gen later
    const sample = `<html><body><h1 style="text-align:center;">Generated app for: "${prompt}"</h1></body></html>`;
    setCode(sample);
  };

  return (
    <div className="h-screen grid grid-cols-2">
      <ChatPanel onSubmitPrompt={handlePrompt} />
      <PreviewPanel code={code} />
    </div>
  );
}
