"use client";
import { useParams } from 'next/navigation'
import { LyricsImportPreview } from "@/components/ImportPreview";

export default function LyricsImportPage() {
  const { artist, song } = useParams();

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className='w-full max-w-md'>
        <h1 className="text-2xl font-semibold mb-4">匯入歌詞</h1>
      </div>
      <LyricsImportPreview artist={artist} song={song} />
    </div>
  );
}
