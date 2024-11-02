'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(pathname === '/list/lyrics' ? 'lyrics' : 'articles');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/list/${tab}`);
  };

  useEffect(() => {
    if (pathname === '/list') return;
    setActiveTab(pathname === '/list/lyrics' ? 'lyrics' : 'articles')
    localStorage.setItem("lastVisitedListTab", pathname === '/list/lyrics' ? 'lyrics' : 'articles');
  }, [pathname])

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-2 mb-6 border-b">
        <button
          onClick={() => handleTabChange('articles')}
          className={cn(
            'px-4 py-2 focus:outline-none',
            activeTab === 'articles'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          網頁
        </button>
        <button
          onClick={() => handleTabChange('lyrics')}
          className={cn(
            'px-4 py-2 focus:outline-none',
            activeTab === 'lyrics'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          歌詞
        </button>
      </div>
      {children}
    </div>
  );
}
