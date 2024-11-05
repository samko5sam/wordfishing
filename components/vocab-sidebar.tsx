import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Vocabulary</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={folders} />
      </SidebarContent>
      <SidebarFooter>
        {/* <div className="p-1">
          <SidebarOptInForm />
        </div> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
