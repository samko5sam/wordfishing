/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth, useClerk } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import ContentCard from "@/components/ContentCard";
import { useFirebaseAuthStatus } from "@/components/FirebaseAuthProvider";
import { FullPageLoadingIndicator } from "@/components/layout/FullPageLoadingIndicator";

interface Lyrics {
  id: string;
  artist: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function LyricsPage() {
  const { userId } = useAuth();
  const { isAuthenticated } = useFirebaseAuthStatus();
  const clerk = useClerk();
  const [lyrics, setLyrics] = useState<Lyrics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLyrics = async () => {
    if (!userId) {
      console.log("請先登入");
      clerk.redirectToSignIn();
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const userContentRef = collection(db, "content", userId, "lyrics");
    const q = query(userContentRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      const lyricsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lyrics[];

      lyricsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setLyrics(lyricsList);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const onDeleteSuccess = () => {
    fetchLyrics();
  };
  useEffect(() => {
    fetchLyrics();
  }, [clerk, userId, isAuthenticated]);

  if (loading || !isAuthenticated) {
    return <FullPageLoadingIndicator />;
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
        <ContentCard
          key={lyric.id}
          contentType="lyrics"
          id={lyric.id}
          title={lyric.title}
          artist={lyric.artist}
          content={lyric.content}
          createdAt={lyric.createdAt}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}
