export default function PreviewPanel({ code }) {
    return (
      <div className="h-full w-full bg-white p-2 border-l">
        <iframe
          srcDoc={code}
          sandbox="allow-scripts"
          className="w-full h-full border rounded"
        />
      </div>
    );
  }
  