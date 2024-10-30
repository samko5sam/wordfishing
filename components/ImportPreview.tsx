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
  const [importing, setImporting] = useState(false);

  const decodedArtist = decodeURIComponent(artist?.toString()||"");
  const decodedSong = decodeURIComponent(song?.toString()||"");

  const handleImport = async () => {
    setImporting(true);
    const redirectUrl = "/"; // Set this as needed

    try {
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
  if (error) return <><h2 className="text-2xl">{error}</h2><BackToHomeBtn /><MultifunctionalSearchBar /></>;

  return (
    <Card className="max-w-md p-4">
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
        <Button size="lg" className="w-full mt-8" onClick={handleImport} disabled={importing}>{importing ? "正在匯入..." : "匯入歌詞"}</Button>
      </CardFooter>
    </Card>
  );
};
