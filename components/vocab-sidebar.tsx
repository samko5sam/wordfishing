import * as React from "react"

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
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {!isFolderLoading ? <NavMain items={folders} /> : <div className="w-full flex justify-center mt-4"><Loader2 className="animate-spin" /></div>}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
