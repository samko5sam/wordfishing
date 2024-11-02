"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    pathname === "/chatbot" ? "chatbot" : "translator"
  );

  const handleTabChange = (tool: string) => {
    setActiveTab(tool);
    router.push(`/${tool}`);
  };

  useEffect(() => {
    setActiveTab(pathname === "/chatbot" ? "chatbot" : "translator");
  }, [pathname]);

  return (
    <div className="container mx-auto p-4 flex-1 flex flex-col max-w-4xl h-full overflow-auto">
      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-2 mb-6 border-b">
        <button
          onClick={() => handleTabChange("chatbot")}
          className={cn(
            "px-4 py-2 focus:outline-none",
            activeTab === "chatbot"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          AI 學習助手
        </button>
        <button
          onClick={() => handleTabChange("translator")}
          className={cn(
            "px-4 py-2 focus:outline-none",
            activeTab === "translator"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          語言翻譯器
        </button>
      </div>

      {/* Mobile Select */}
      <div className="md:hidden mb-6">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇工具">
              {activeTab === "chatbot" ? "AI 學習助手" : "語言翻譯器"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chatbot">AI 學習助手</SelectItem>
            <SelectItem value="translator">語言翻譯器</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {children}
    </div>
  );
}
