'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuth } from '@clerk/nextjs';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Lyrics {
  id: string;
  artist: string;
  title: string;
  lyrics: string;
  createdAt: string;
}

export default function LyricsPage() {
  const { userId } = useAuth();
  const [lyrics, setLyrics] = useState<Lyrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!userId) {
        console.log("請先登入");
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      
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
  }, [userId]);

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
        <Link key={lyric.id} href={`/docs/lyrics/${lyric.artist}/${lyric.title}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{lyric.title}</h3>
              <p className="text-sm text-gray-500 mb-2">by {lyric.artist}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{lyric.lyrics}</p>
              <div className="mt-2 text-xs text-gray-400">
                {new Date(lyric?.createdAt || "").toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
