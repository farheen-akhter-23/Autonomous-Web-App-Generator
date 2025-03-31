'use client';
import { useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import PreviewPanel from '../components/PreviewPanel';

export default function HomePage() {
  const [code, setCode] = useState<string>('');

  const handlePrompt = (generatedCode: string) => {
    setCode(generatedCode);
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      <ChatPanel onSubmitPrompt={handlePrompt} />
      <PreviewPanel code={code} />
    </div>
  );
}