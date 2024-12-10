"use client"
import { MoreVertical, Trash } from "lucide-react";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useVocabFolder } from "@/hooks/use-vocabularies";

interface ContentActionDropdownProps {
  contentType: 'articles' | 'lyrics' | 'vocabFolder' | 'text';
  documentId: string;
  onDeleteSuccess?: () => void;
}

export function ContentActionDropdown({
  contentType,
  documentId,
  onDeleteSuccess
}: ContentActionDropdownProps) {
  const { deleteFolder } = useVocabFolder();
  const { userId } = useAuth();
  const { toast } = useToast();
  const { 
    isOpen: isDeleteDialogOpen, 
    isLoading: isDeleting, 
    openDialog, 
    closeDialog, 
    handleConfirm 
  } = useConfirmationDialog();

  const contentTypeToText = {
    'articles': "文章",
    'lyrics': "歌詞",
    'vocabFolder': "資料夾",
    'text': '手動匯入文章'
  }

  const handleDelete = async () => {
    if (!userId) {
      toast({
        title: "請先登入",
        variant: "destructive"
      });
      return;
    }
    
    if (contentType === "vocabFolder"){
      try {
        await deleteFolder(documentId);
        onDeleteSuccess?.();
        toast({
          title: "成功刪除！",
          variant: "default"
        });
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "刪除失敗",
          description: "無法刪除內容",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      const contentRef = collection(db, 'content', userId, contentType);
      await deleteDoc(doc(contentRef, documentId));
      
      onDeleteSuccess?.();
      toast({
        title: "成功刪除！",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除內容",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = () => {
    openDialog(handleDelete);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="h-2 w-2" />
            <span className="sr-only">開啟選單</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive dark:text-red-500"
            onClick={openDeleteDialog}
          >
            <Trash className="mr-2 h-4 w-4" />
            刪除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onOpenChange={closeDialog}
        onConfirm={handleConfirm}
        title={`刪除${contentTypeToText[contentType]}`}
        description={`您確定要刪除這個${contentTypeToText[contentType]}嗎？此操作無法撤銷。`}
        confirmText="刪除"
        cancelText="取消"
        variant="destructive"
      />
    </>
  );
}
