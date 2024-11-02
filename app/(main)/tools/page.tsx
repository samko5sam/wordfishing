import { Bot, Languages } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex gap-6 p-6 flex-wrap justify-center max-w-4xl">
        <Link href="/translator" className="w-40 h-40 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex flex-col items-center justify-center">
          <Languages className="mb-2" size={64} />
          <span className="text-lg font-medium">神奇翻譯器</span>
        </Link>
        <Link href="/chatbot" className="w-40 h-40 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex flex-col items-center justify-center">
          <Bot className="mb-2" size={64} />
          <span className="text-lg font-medium">學習助手</span>
        </Link>
      </div>
    </div>
  );
}
