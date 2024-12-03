'use client'

import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator'
import { useVocabFolder, useVocabulariesInFolder } from '@/hooks/use-vocabularies'
import VocabListItem from './VocabListItem'
import { FolderOpen } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

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

  const {allVocabularies, isVocabLoading, fetchAllVocabularies} = useVocabulariesInFolder();

  useEffect(() => {
    if (!userId) {
      setError("請先登入以查看單字庫")
      return
    }
    fetchFolder(folder);
    fetchAllVocabularies(folder);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, folder])

  const toggleMarked = async (vocabId: string, currentMarked: boolean) => {
    if (!userId) return;
    
    try {
      const vocabRef = doc(db, 'vocabularies', userId, 'vocab', vocabId);
      await updateDoc(vocabRef, {
        marked: !currentMarked
      });
      
      // Refresh the vocabulary list
      await fetchAllVocabularies(folder);
    } catch (error) {
      console.error('Error toggling marked status:', error);
    }
  };

  const handleEditVocabularies = () => {
    router.push(`/vocab/${folder}/edit`);
  };

  const handleQuiz = () => {
    router.push(`/quiz?folder=${folder}`);
  };

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
    <div className="flex-1 h-full overflow-y-auto pb-24">

      <div className="py-4 pl-4">
        <SidebarTrigger className="p-4" />
      </div>
      <div className='flex flex-row justify-center px-8'>
        <div className='max-w-3xl flex-1'>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{folderData?.folderName}</h1>
            <div className="space-x-2">
              <Button onClick={handleQuiz} variant="default" disabled={allVocabularies.length < 4}>測驗{allVocabularies.length < 4 && allVocabularies.length > 0 && "（單字不夠）"}</Button>
              <Button onClick={handleEditVocabularies} variant="outline">編輯</Button>
            </div>
          </div>
          <div className='flex flex-col gap-y-4'>
            {allVocabularies.map((vocab) => (
              <VocabListItem 
                key={vocab.id} 
                vocab={vocab} 
                toggleMarked={() => toggleMarked(vocab.id, vocab.marked)} 
              />
            ))}
          </div>
          {!allVocabularies.length && (
            <div className="flex flex-col items-center justify-center h-full">
              <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h1 className="text-xl font-semibold text-gray-500">尚未新增單字</h1>
              <p className="text-gray-400 mt-2">閱讀文章或歌詞來新增單字吧！</p>
            </div>
          )}
        </div>
      </div>

      {isVocabLoading && <FullPageLoadingIndicator />}
    </div>
  )
}
