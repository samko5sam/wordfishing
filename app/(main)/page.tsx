import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-semibold mb-2 text-blue-400">Word Fishing</h1>
      <MultifunctionalSearchBar />
      <div className="mt-8 flex space-x-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded">我的學習庫</button>
        <button className="px-4 py-2 bg-gray-200 rounded">推薦新東西</button>
      </div>
    </div>
  );
}
