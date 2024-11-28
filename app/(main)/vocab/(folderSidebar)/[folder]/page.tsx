'use client'

import { db } from '@/lib/firebase'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator'
import { useVocabFolder } from '@/hooks/use-vocabularies'

interface PageProps {
  params: Promise<{
    folder: string
  }>
}

export default function FolderPage({ params }: PageProps) {
  const router = useRouter()
  const { userId } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap params using React.use()
  const { folder } = use(params)
  const { folderData, folderLoading, fetchFolder } = useVocabFolder();

  useEffect(() => {
    if (!userId) {
      setError("請先登入以查看單字庫")
      return
    }
    fetchFolder(folder);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, folder])

  if (folderLoading) {
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

  if (!folder) {
    return null // This will briefly show while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{folderData?.folderName}</h1>
      
    </div>
  )
}
