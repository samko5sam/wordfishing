"use client"

import { MoreVertical, Trash } from "lucide-react"
import { collection, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ContentActionDropdownProps {
  contentType: 'articles' | 'lyrics'
  documentId: string
  onDeleteSuccess?: () => void
}

export function ContentActionDropdown({
  contentType,
  documentId,
  onDeleteSuccess
}: ContentActionDropdownProps) {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!userId) {
      toast({
        title: "請先登入",
        variant: "destructive"
      })
      return;
    }
    if (!contentType) return;
    try {
      setIsDeleting(true)
      const contentRef = collection(db, 'content', userId, contentType)
      await deleteDoc(doc(contentRef, documentId))
      setIsDeleteDialogOpen(false)
      onDeleteSuccess?.()
      toast({
        title: "成功刪除！",
        variant: "default"
      })
    } catch (error) {
      console.error('Error deleting document:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">開啟選單</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive dark:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            刪除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>刪除{contentType === "article" ? "網頁" : "歌詞"}</DialogTitle>
            <DialogDescription>
              您確定要刪除這個{contentType === "article" ? "網頁" : "歌詞"}嗎？此操作無法撤銷。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "刪除中..." : "刪除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
