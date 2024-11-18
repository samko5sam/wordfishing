import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type VocabularyFolder = {
  title: string;
  url: string;
};

type AppSidebarProps = {
  folders: VocabularyFolder[];
};

export function AppSidebar({ folders, ...props }: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={folders} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
