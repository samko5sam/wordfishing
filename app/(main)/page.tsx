import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center flex-col justify-center">
      <h1 className="text-4xl font-semibold mb-2 text-blue-400 text-center">Word Fishing</h1>
      <MultifunctionalSearchBar />
      <div className="mt-8 flex space-x-4 justify-center">
        <Link href={`/list/articles`} className="px-4 py-2 bg-gray-800 text-white rounded">我的學習庫</Link>
        <button className="px-4 py-2 bg-gray-200 rounded">推薦新東西</button>
      </div>
    </div>
  );
}
