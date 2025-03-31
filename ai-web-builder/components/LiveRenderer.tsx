'use client';
import { useEffect, useRef, useState } from 'react';
import * as Babel from '@babel/standalone';
import * as ReactDOMClient from 'react-dom/client';
import React from 'react';

export default function LiveRenderer({ code, onReady }: { code: string; onReady: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ReactDOMClient.Root | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let isMounted = true;
    let currentRoot = rootRef.current;
    let timeoutId: NodeJS.Timeout;

    const cleanUp = (immediate = false) => {
      if (currentRoot) {
        if (immediate) {
          currentRoot.unmount();
        } else {
          // Schedule unmount for next tick
          setTimeout(() => {
            if (isMounted && currentRoot) {
              currentRoot.unmount();
            }
          }, 0);
        }
      }
    };

    const renderComponent = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        setError(null);
        
        if (!code.trim()) {
          if (mountRef.current) {
            mountRef.current.innerHTML = '<div class="p-4 text-gray-500">Waiting for code generation...</div>';
          }
          return;
        }

        // Process the code
        let processedCode = code.replace(/```(jsx|javascript)?/g, '').trim();
        
        if (!processedCode.includes('import React')) {
          processedCode = `import React from 'react';\n${processedCode}`;
        }

        if (!processedCode.includes('export default')) {
          if (processedCode.match(/function\s+(\w+)|const\s+(\w+)\s*=/)) {
            processedCode += '\n\nexport default App;';
          } else {
            processedCode = `const App = () => {\n${processedCode}\n};\n\nexport default App;`;
          }
        }

        // Transform with Babel
        const transformed = Babel.transform(processedCode, {
          presets: ['react', 'env'],
          filename: 'App.jsx'
        }).code;

        // Create new root
        currentRoot = ReactDOMClient.createRoot(mountRef.current!);
        rootRef.current = currentRoot;

        // Execute the code
        const exports = {};
        const module = { exports };
        const require = (mod: string) => mod === 'react' ? React : null;

        new Function('module', 'exports', 'require', 'React', transformed)(
          module,
          exports,
          require,
          React
        );

        const Component = module.exports?.default || module.exports;
        if (!Component) throw new Error('No valid component was exported');

        currentRoot.render(React.createElement(Component));
        onReady();

      } catch (error: any) {
        if (isMounted) {
          setError(error.message);
          if (mountRef.current) {
            mountRef.current.innerHTML = `
              <div class="p-4 bg-red-50 text-red-600 rounded-lg">
                <h3 class="font-bold mb-1">Render Error</h3>
                <pre class="text-sm whitespace-pre-wrap">${error.message}</pre>
              </div>
            `;
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Schedule cleanup and render for next tick
    timeoutId = setTimeout(() => {
      cleanUp(true);
      renderComponent();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      cleanUp();
    };
  }, [code, onReady]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
      
      {error && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-50 text-red-600 border-b border-red-200 z-10">
          <h3 className="font-bold mb-1">Render Error</h3>
          <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-20">{error}</pre>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full p-4 overflow-auto bg-white"
      />
    </div>
  );
}