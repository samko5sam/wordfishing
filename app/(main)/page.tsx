import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center flex-col justify-center">
        <h1 className="text-4xl font-semibold mb-2 text-blue-500 dark:text-blue-300 text-center">Word Fishing</h1>
        <MultifunctionalSearchBar />
        <TooltipProvider>
          <div className="mt-8 flex space-x-4 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/list`} className="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-800 rounded">我的學習庫</Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">文章、歌詞、單字</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/tools`} className="px-2 py-2 bg-gray-200 dark:bg-gray-700 rounded dark:text-">
                  <LayoutGrid />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">更多應用</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex justify-center bg-gray-100 dark:bg-gray-800 py-4">
        <Link href="/privacy" className="mr-4">隱私權政策</Link>
        <Link href="/terms" className="mr-4">服務條款</Link>
      </div>
    </div>
  );
}
