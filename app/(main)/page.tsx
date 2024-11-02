import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center flex-col justify-center">
      <h1 className="text-4xl font-semibold mb-2 text-blue-400 text-center">Word Fishing</h1>
      <MultifunctionalSearchBar />
      <div className="mt-8 flex space-x-4 justify-center">
        <Link href={`/list`} className="px-4 py-2 bg-gray-800 text-white rounded">我的學習庫</Link>
        <Link href={`/translator`} className="px-4 py-2 bg-gray-200 rounded">神奇翻譯器</Link>
      </div>
    </div>
  );
}
