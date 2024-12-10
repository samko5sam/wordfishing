"use client";

import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ListPage() {
  const router = useRouter();
  useEffect(() => {
    // Check localStorage for last visited tab
    const lastVisitedTab = localStorage.getItem('lastVisitedListTab');
    if (lastVisitedTab === 'lyrics') {
      // Redirect to /list/lyrics
      router.replace('/list/lyrics');
    } else if (lastVisitedTab === 'text') {
      // Redirect to /list/articles by default
      router.replace('/list/text');
    } else {
      router.replace('/list/articles');
    }
  }, [router]);

  return (
    <FullPageLoadingIndicator />
  );
}
