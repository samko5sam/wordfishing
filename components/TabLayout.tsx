import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TabOption {
  value: string;
  label: string;
}

interface TabLayoutProps {
  tabOptions: TabOption[];
  initialTab: string;
  onTabChange?: (tab: string) => void;
  children: React.ReactNode;
  type?: "full";
  prefix?: string;
}

export default function TabLayout({
  tabOptions,
  initialTab,
  onTabChange,
  children,
  type,
  prefix
}: TabLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
    router.push(`/${prefix ? `${prefix}/` : ""}${tab}`);
  };

  return (
    <div className={cn("container mx-auto p-4 flex flex-col flex-1 max-w-4xl overflow-auto", type === "full" && "h-full")}>
      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-2 mb-6 border-b">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              'px-4 py-2 focus:outline-none',
              activeTab === tab.value
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Select */}
      <div className="md:hidden mb-6">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇分頁">
              {tabOptions.find((tab) => tab.value === activeTab)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {type != "full" ? <div>{children}</div> : children}
    </div>
  );
}
