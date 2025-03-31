'use client';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { DownloadIcon } from './icons';

export function ExportButton({ code }: { code: string }) {
  const handleExport = async () => {
    const zip = new JSZip();
    
    // Basic project structure
    zip.file('src/App.jsx', code);
    zip.file('src/styles.css', `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);
    zip.file('package.json', JSON.stringify({
      name: "generated-app",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start"
      },
      dependencies: {
        "next": "^14",
        "react": "^18",
        "react-dom": "^18",
        "tailwindcss": "^3"
      }
    }, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'my-app.zip');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      <DownloadIcon className="w-4 h-4" />
      Export
    </button>
  );
}