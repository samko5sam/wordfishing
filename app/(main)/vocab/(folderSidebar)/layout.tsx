"use client";

import { AppSidebar } from "@/components/vocab-sidebar";
import { useAvailableFolders } from "@/hooks/use-vocabularies";

export default function VocabFolderSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { availableFolders, isFolderLoading } = useAvailableFolders();

  const vocabularyFolders = availableFolders.map((folder) => {
    return {
      title: folder.folderName,
      url: `/vocab/${folder.id}`,
    };
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <AppSidebar
        folders={[{ title: "全部資料夾", url: "/vocab", items: vocabularyFolders }]}
        className="border-r pt-[48px]"
        isFolderLoading={isFolderLoading}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
