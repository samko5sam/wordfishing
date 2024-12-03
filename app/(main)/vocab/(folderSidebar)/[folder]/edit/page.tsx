"use client";
import { use, useEffect, useState } from 'react';
import { useVocabFolder, useVocabulariesInFolder, Vocabulary } from '@/hooks/use-vocabularies';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Edit2, SaveIcon, Trash2 } from 'lucide-react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator';

interface PageProps {
  params: Promise<{
    folder: string
  }>
}

export default function VocabEditPage({ params }: PageProps) {
  const { userId } = useAuth();
  const { toast } = useToast();
  const { 
    isOpen: isDeleteDialogOpen, 
    isLoading: isDeleting, 
    openDialog, 
    closeDialog, 
    handleConfirm 
  } = useConfirmationDialog();
  const { folderData, fetchFolder } = useVocabFolder();
  const { allVocabularies, fetchAllVocabularies, isVocabLoading } = useVocabulariesInFolder();
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string | null>(null);
  const { folder } = use(params)

  const handleVocabEdit = (vocab: Vocabulary) => {
    setEditingVocab(vocab);
  };

  const handleVocabSave = async () => {
    if (editingVocab && userId) {
      const vocabRef = doc(db, 'vocabularies', userId, 'vocab', editingVocab.id);
      await updateDoc(vocabRef, {
        title: editingVocab.title,
        description: editingVocab.description
      });
      setEditingVocab(null);
      fetchAllVocabularies(folder);
    }
  };

  const handleVocabDelete = async (vocab: Vocabulary) => {
    if (!userId) return;
    if (!vocab || !vocab.id) return;
    const vocabRef = doc(db, 'vocabularies', userId, 'vocab', vocab.id);
    await deleteDoc(vocabRef);
    toast({
      title: "成功刪除！",
      variant: "default"
    });
    fetchAllVocabularies(folder);
  };

  const openDeleteDialog = (vocab: Vocabulary) => {
    openDialog(() => handleVocabDelete(vocab));
  };

  const handleFolderNameEdit = async () => {
    if (editingFolderName && userId && folderData) {
      const vocabRef = doc(db, 'vocabularies', userId, 'folders', folder);
      await updateDoc(vocabRef, {
        folderName: editingFolderName
      });
      setEditingFolderName(null);
      fetchFolder(folder);
    }
  };

  useEffect(() => {
    fetchFolder(folder);
    fetchAllVocabularies(folder)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex-1 h-full overflow-y-auto pb-24">
      <div className="py-4 pl-4">
        <SidebarTrigger className="p-4" />
      </div>
      <div className='flex flex-row justify-center'>
        <div className="max-w-3xl flex-1">
          <div className="flex justify-between items-center mb-8">
            {editingFolderName !== null ? (
              <div className="space-y-2">
                <Input
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  className='text-3xl font-bold'
                />
                <div className='space-x-2'>
                  <Button onClick={handleFolderNameEdit}><SaveIcon /></Button>
                  <Button
                    variant="destructive"
                    onClick={() => setEditingFolderName(null)}
                  >
                    <Cross2Icon />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold">編輯 {folderData?.folderName}</h1>
                <Button onClick={() => setEditingFolderName(folderData?.folderName || '')} variant="outline">
                  <Edit2 />
                </Button>
              </>
            )}
          </div>
          <div className="space-y-4">
            {allVocabularies.map((vocab: Vocabulary) => (
              <Card key={vocab.id} className="p-4">
                {editingVocab?.id === vocab.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingVocab.title}
                      onChange={(e) =>
                        setEditingVocab({ ...editingVocab, title: e.target.value })
                      }
                      className='text-base'
                    />
                    <Input
                      value={editingVocab.description}
                      onChange={(e) =>
                        setEditingVocab({ ...editingVocab, description: e.target.value })
                      }
                      className='text-base'
                    />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={handleVocabSave}><SaveIcon /></Button>
                      <Button
                        variant="destructive"
                        onClick={() => setEditingVocab(null)}
                      >
                        <Cross2Icon />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className='flex-1'>{vocab.title}</div>
                    <div className='flex-1'>{vocab.description}</div>
                    <div className="space-x-2">
                      <Button onClick={() => handleVocabEdit(vocab)}><Edit2 /></Button>
                      <Button
                        variant="destructive"
                        onClick={() => openDeleteDialog(vocab)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onOpenChange={closeDialog}
        onConfirm={handleConfirm}
        title={`刪除單字`}
        description={`您確定要刪除這個單字嗎？此操作無法撤銷。`}
        confirmText="刪除"
        cancelText="取消"
        variant="destructive"
      />

      {isVocabLoading && <FullPageLoadingIndicator />}
    </div>
  );
}
