export default function ChatBubble({ message, isUser }) {
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`px-4 py-2 rounded-lg max-w-xs ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {message}
        </div>
      </div>
    );
  }
  