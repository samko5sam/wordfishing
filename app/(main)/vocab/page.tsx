"use client";

import { AppSidebar } from "@/components/vocab-sidebar";
import { FolderIcon, FolderPlus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useAvailableFolders,
  useAddVocabularyFolder,
} from "@/hooks/use-vocabularies";
import Link from "next/link";
import { FullPageLoadingIndicator } from "@/components/layout/FullPageLoadingIndicator";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ContentActionDropdown } from "@/components/ContentActionDropdown";

export default function VocabularyPage() {
  const { availableFolders, fetchAvailableFolders } = useAvailableFolders();
  const { addVocabFolder } = useAddVocabularyFolder();
  const [inputText, setInputText] = useState("");

  const {
    isOpen: isDeleteDialogOpen,
    isLoading: isDeleting,
    openDialog,
    closeDialog,
  } = useConfirmationDialog();

  const vocabularyFolders = availableFolders.map((folder) => {
    return {
      title: folder.folderName,
      url: `/vocab/${folder.id}`,
    };
  });

  const vocabularyData = availableFolders.map((folder) => {
    return {
      id: folder.id,
      word: folder.folderName,
      folder: "",
    };
  });

  const handleCreateNewFolder = async () => {
    openDialog(() => {});
  };

  const handleConfirm = () => {
    // console.log(inputText)
    addVocabFolder(inputText);
    closeDialog();
    setInputText("");
    fetchAvailableFolders();
  };
  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <AppSidebar
        folders={[{ title: "全部", url: "/vocab", items: vocabularyFolders }]}
        className="border-r pt-[48px]"
      />
      <div className="flex-1 max-h-full overflow-y-scroll">
        <div className="p-4">
          <SidebarTrigger className="p-4" />
        </div>
        <div className="px-8">
          <h1 className="text-2xl font-bold mb-4">單字庫</h1>
          <div className="flex justify-end">
            <Button
              variant="default"
              className="mb-4"
              onClick={handleCreateNewFolder}
            >
              <FolderPlus /> 建立資料夾
            </Button>
          </div>
          <ConfirmationDialog
            isOpen={isDeleteDialogOpen}
            isLoading={isDeleting}
            onOpenChange={closeDialog}
            onConfirm={handleConfirm}
            title="新增資料夾"
            description="新增一個單字資料夾"
            confirmText="新增"
            cancelText="取消"
            variant="default"
            inputText={inputText}
            setInputText={setInputText}
          />
          {!vocabularyData.length && <FullPageLoadingIndicator />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vocabularyData.map((item) => (
              <FolderItem key={item.id} item={item} onDeleteSuccess={() => fetchAvailableFolders()} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FolderItem = ({
  item,
  onDeleteSuccess
}: {
  item: {
    id: string;
    word: string;
    definition?: string;
    folder: string;
  };
  onDeleteSuccess: any;
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <Link href={`/vocab/${item.id}`}>
          <h3 className="font-semibold text-xl mb-2 line-clamp-2">
            {item.word}
          </h3>
          <p className="mb-2 dark:text-gray-200">{item.definition}</p>
          {/* <span className="absolute bottom-2 text-gray-500 dark:text-gray-130 mt-2 mb-2 flex flex-row items-center gap-2">
            <FolderIcon size={16} /> {item.folder}
          </span> */}
        </Link>

        <div className="mt-2 text-xs text-gray-400 flex flex-row justify-between items-end">
          <span>
            <FolderIcon size={16} /> {item.folder}
          </span>
          <div>
            <ContentActionDropdown
              contentType="vocabFolder"
              documentId={item.id}
              onDeleteSuccess={onDeleteSuccess}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
