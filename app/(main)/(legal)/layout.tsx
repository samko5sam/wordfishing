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

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    pathname === "/privacy" ? "privacy" : "terms"
  );

  const handleTabChange = (document: string) => {
    setActiveTab(document);
    router.push(`/${document}`);
  };

  useEffect(() => {
    setActiveTab(pathname === "/privacy" ? "privacy" : "terms");
  }, [pathname]);

  return (
    <div className="container mx-auto p-4 flex-1 flex flex-col max-w-4xl h-full">
      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-2 mb-6 border-b">
        <button
          onClick={() => handleTabChange("privacy")}
          className={cn(
            "px-4 py-2 focus:outline-none",
            activeTab === "privacy"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Privacy
        </button>
        <button
          onClick={() => handleTabChange("terms")}
          className={cn(
            "px-4 py-2 focus:outline-none",
            activeTab === "terms"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Terms of Service
        </button>
      </div>

      {/* Mobile Select */}
      <div className="md:hidden mb-6">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Documents">
              {activeTab === "privacy" ? "Privacy" : "Terms of Service"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="privacy">Privacy</SelectItem>
            <SelectItem value="terms">Terms of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
