import { NavMain } from "@/components/vocab-nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Loader2 } from "lucide-react";
import { SearchForm } from "./sidebar-search-form";
import { useEffect, useState } from "react";

type VocabularyFolder = {
  title: string;
  url: string;
  items: {
    title: string;
    url: string;
  }[]
};

type AppSidebarProps = {
  folders: VocabularyFolder[];
  isFolderLoading: boolean;
};

export function AppSidebar({ folders, isFolderLoading, ...props }: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  const [filteredFolders, setFilteredFolders] = useState<VocabularyFolder[]>(folders);

  const handleSearch = (query: string) => {
    if (query === '') {
      console.log(folders)
      setFilteredFolders(folders);
    } else {
      const filtered = folders[0].items.filter(folder => folder.title.toLowerCase().includes(query.toLowerCase()));
      const newFolders = folders.map(folder => ({
        ...folder,
        items: folder.items.filter(item => filtered.some(filteredItem => filteredItem.title === item.title))
      }));
      console.log(newFolders)
      setFilteredFolders(newFolders);
    }
  }

  useEffect(() => {
    setFilteredFolders(folders);
    console.log("Folders changed")
  }, [folders])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm onSearch={handleSearch} />
      </SidebarHeader>
      <SidebarContent>
        {!isFolderLoading ? (
          <NavMain items={filteredFolders} />
        ) : (
          <div className="w-full flex justify-center mt-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
