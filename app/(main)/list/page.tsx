"use client";

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
    } else {
      // Redirect to /list/articles by default
      router.replace('/list/articles');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
