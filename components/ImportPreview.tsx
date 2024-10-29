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

export const LyricsImportPreview = ({
  artist,
  song
}: {
  artist: string|string[]|undefined;
  song: string|string[]|undefined;
}) => {
  const router = useRouter();
  const [lyrics, setLyrics] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const decodedArtist = decodeURIComponent(artist?.toString()||"");
  const decodedSong = decodeURIComponent(song?.toString()||"");

  const handleImport = async () => {
    const redirectUrl = "/"; // Set this as needed

    // Send a POST request to the importing page
    const response = await fetch('/api/importLyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artist, song, lyrics }),
    });

    if (response.ok) {
      // Redirect to the importing page
      router.push(redirectUrl);
    } else {
      console.error("Failed to initiate import");
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

  if (loading) return <p>歌詞載入中...</p>;
  if (error) return <><h2 className="text-2xl">{error}</h2><BackToHomeBtn /></>;

  return (
    <Card className="max-w-md p-4">
      <CardHeader>
        <BackToHomeBtn />
        <h2 className="text-xl font-semibold">
          {decodedArtist} - {decodedSong}
        </h2>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <p className="whitespace-pre-wrap">{lyrics}</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full mt-4" onClick={handleImport}>獲取歌詞</Button>
      </CardFooter>
    </Card>
  );
};
