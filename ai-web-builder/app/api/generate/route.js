import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a code generator that ONLY returns raw React component code with these strict rules:
1. NEVER include any explanations, comments, or markdown formatting
2. ALWAYS use perfect syntax with semicolons
3. MUST include all required React imports
4. MUST use Tailwind CSS for styling
5. MUST include 'export default' at the end
6. Format code with 2-space indentation
7. NEVER wrap code in backticks or code blocks
8. If the prompt isn't clear, create a button that toggles colors

Example response for "create a button":
import React, { useState } from 'react';

function ColorButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={() => setIsActive(!isActive)}
      className={'px-4 py-2 rounded ' + (isActive ? 'bg-blue-500' : 'bg-red-500') + ' text-white'}
    >
      Click me
    </button>
  );
}

export default ColorButton;`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    }),
  });

  const data = await res.json();
  let code = data.choices?.[0]?.message?.content;
  
  // Clean up any remaining markdown or explanations
  code = code.replace(/```(jsx|javascript)?/g, '').trim();
  code = code.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
  
  return NextResponse.json({ code });
}