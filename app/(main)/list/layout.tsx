'use client';

import TabLayout from '@/components/TabLayout';
import { usePathname } from 'next/navigation';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();


  return (
    <TabLayout
      tabOptions={[
        { value: 'articles', label: '網頁' },
        { value: 'lyrics', label: '歌詞' },
        { value: 'text', label: '文章' },
      ]}
      initialTab={pathname?.split('/')[2] || 'lyrics'}
      prefix='list'
    >
      {children}
    </TabLayout>
  );
}
