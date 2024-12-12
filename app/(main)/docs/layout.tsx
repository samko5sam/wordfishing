import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/paragraph-sidebar';
import { SelectionPopup } from "@/components/SelectionPopup";

export default function Layout({children}:{children: React.ReactNode}) {
  return (
    <SidebarProvider className="overflow-auto">  
      <AppSidebar side="left" variant="sidebar" className='pt-[48px]'/>
      <>{children}</>
      <SelectionPopup />
    </SidebarProvider>
  )
}
