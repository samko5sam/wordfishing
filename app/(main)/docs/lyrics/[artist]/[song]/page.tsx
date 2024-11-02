'use client'

import { db } from '@/lib/firebase'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator'

interface PageProps {
  params: Promise<{
    artist: string
    song: string
  }>
}

interface LyricsData {
  content: string
  artist: string
  title: string
  userId: string
  language?: string
  createdAt?: string
  updatedAt?: string
}

export default function LyricsPage({ params }: PageProps) {
  const router = useRouter()
  const { userId } = useAuth()
  const [lyrics, setLyrics] = useState<LyricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap params using React.use()
  const { artist, song } = use(params)

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!userId) {
        setError("請先登入以查看歌詞")
        setLoading(false)
        return
      }

      try {
        // Try to fetch user-specific lyrics first
        const userLyricsRef = collection(db, 'content', userId, 'lyrics');
        const lyricsDocRef = doc(userLyricsRef, `${artist}-${song}`);
        const userDocSnap = await getDoc(lyricsDocRef);

        if (userDocSnap.exists()) {
          setLyrics(userDocSnap.data() as LyricsData)
        } else {
          // If not found, redirect to import page
          router.push(`/import/lyrics/${artist}/${song}`)
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error)
        setError("無法載入歌詞")
      } finally {
        setLoading(false)
      }
    }

    fetchLyrics()
  }, [artist, song, router, userId])

  if (loading) {
    return <FullPageLoadingIndicator />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl mb-4">{error}</h2>
        <Button onClick={() => router.push("/")} variant="ghost">
          回主頁
        </Button>
      </div>
    )
  }

  if (!lyrics) {
    return null // This will briefly show while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{lyrics.title}</h1>
      <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-6">{lyrics.artist}</h2>
      
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans">
          {lyrics.content}
        </pre>
      </div>
    </div>
  )
}
