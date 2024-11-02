'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth, useClerk } from '@clerk/nextjs';
import { auth, db } from '@/lib/firebase';
import ContentCard from '@/components/ContentCard';

interface Lyrics {
  id: string;
  artist: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function LyricsPage() {
  const { userId } = useAuth();
  const clerk = useClerk();
  const user = auth.currentUser;
  const [lyrics, setLyrics] = useState<Lyrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!userId) {
        console.log("請先登入");
        clerk.redirectToSignIn();
        return;
      }

      
      if (!user) {
        setLoading(false);
        return;
      }

      const userContentRef = collection(db, 'content', userId, 'lyrics');
      const q = query(userContentRef, where('userId', '==', userId));
      
      try {
        const querySnapshot = await getDocs(q);
        const lyricsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lyrics[];
        
        setLyrics(lyricsList);
      } catch (error) {
        console.error('Error fetching lyrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLyrics();
  }, [clerk, userId, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">載入中...</div>;
  }

  if (lyrics.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">未找到歌詞，匯入歌詞以開始！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lyrics.map((lyric) => (
        <ContentCard key={lyric.id} contentType="lyrics" id={lyric.id} title={lyric.title} artist={lyric.artist} content={lyric.content} createdAt={lyric.createdAt} />
      ))}
    </div>
  );
}
