'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ExportButton } from './ExportButton';

const LiveRenderer = dynamic(() => import('./LiveRenderer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
    </div>
  )
});

type Props = {
  code: string;
};

export default function PreviewPanel({ code }: Props) {
  const [isRaw, setIsRaw] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">App Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRaw(!isRaw)}
            className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isRaw ? 'View Render' : 'View Code'}
          </button>
          
          {isPreviewReady && !isRaw && (
            <ExportButton code={code} />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {isRaw ? (
          <pre className="h-full p-4 overflow-auto text-sm text-gray-800 bg-gray-50 font-mono whitespace-pre-wrap">
            {code || '// Generated code will appear here...'}
          </pre>
        ) : (
          <>
            <LiveRenderer 
              code={code} 
              onReady={() => setIsPreviewReady(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}