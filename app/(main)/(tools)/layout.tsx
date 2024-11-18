"use client";

import TabLayout from "@/components/TabLayout";
import { usePathname } from "next/navigation";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();


  return (
    <TabLayout
      tabOptions={[
        { value: "chatbot", label: "AI 學習助手" },
        { value: "translator", label: "語言翻譯器" },
      ]}
      initialTab={pathname?.split('/')[1] || "chatbot"}
      type="full"
    >
      {children}
    </TabLayout>
  );
}
