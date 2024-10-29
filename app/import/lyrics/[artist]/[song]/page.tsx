"use client";
import { useParams } from 'next/navigation'
import { LyricsImportPreview } from "@/components/ImportPreview";

export default function LyricsImportPage() {
  const { artist, song } = useParams();

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <LyricsImportPreview artist={artist} song={song} />
    </div>
  );
}
