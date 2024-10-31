/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { lyricsApiRoot } from "@/constants/Constants";
import { useRouter } from "next/navigation";
import MultifunctionalSearchBar from "./MultifunctionalSearchBar";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@clerk/nextjs";

export const LyricsImportPreview = ({
  artist,
  song
}: {
  artist: string|string[]|undefined;
  song: string|string[]|undefined;
}) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [lyrics, setLyrics] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [importing, setImporting] = useState(false);

  const decodedArtist = decodeURIComponent(artist?.toString()||"");
  const decodedSong = decodeURIComponent(song?.toString()||"");

  const handleImport = async () => {
    if (!userId) {
      setError("請先登入");
      return;
    }

    setImporting(true);
    const redirectUrl = `/docs/lyrics/${artist}/${song}`;

    try {
      // Create document ID using artist-song-userId format for user-specific access
      const docId = `${artist}-${song}`;

      // Create document data
      const lyricsData = {
        artist: decodedArtist,
        title: decodedSong,
        content: lyrics,
        userId, // Add userId to enable user-specific access
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const userLyricsRef = collection(db, 'content', userId, 'lyrics');
      const lyricsDocRef = doc(userLyricsRef, docId);
      await setDoc(lyricsDocRef, lyricsData);

      // Redirect after successful save
      router.replace(redirectUrl);
    } catch (error) {
      console.error("Failed to save lyrics:", error);
      setError("儲存失敗");
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    if (!artist || !song) return;

    const fetchLyrics = async () => {
      try {
        const response = await fetch(
          `${lyricsApiRoot}/v1/${artist}/${song}`
        );
        if (response.status === 404) {
          setError("🙇抱歉 找不到這首歌的歌詞！");
        } else {
          const data = await response.json();
          setLyrics(data.lyrics);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch lyrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, song]);

  const BackToHomeBtn = () => {
    return (
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-4" size="lg">
        ← 回主頁
      </Button>
    )
  }

  if (loading) return <>
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  </>;
  if (error) return <><h2 className="text-2xl">{error}</h2><MultifunctionalSearchBar /><BackToHomeBtn /></>;

  return (
    <Card className="max-w-md p-4 max-h-full">
      <CardHeader>
        <BackToHomeBtn />
        <h2 className="text-xl font-semibold">
          {decodedArtist} - {decodedSong}
        </h2>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto border rounded-xl mx-6">
        <p className="whitespace-pre-wrap mt-4">{lyrics}</p>
      </CardContent>
      <CardFooter>
        <Button 
          size="lg" 
          className="w-full mt-8" 
          onClick={handleImport} 
          disabled={importing || !userId}
        >
          {!userId ? "請先登入" : importing ? "正在匯入..." : "匯入歌詞"}
        </Button>
      </CardFooter>
    </Card>
  );
};
