import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/paragraph-sidebar';

export default function Layout({children}:{children: React.ReactNode}) {
  return (
    <SidebarProvider className="overflow-auto">  
      <AppSidebar side="left" variant="sidebar" className='pt-[48px]'/>
      <main>{children}</main>
    </SidebarProvider>
  )
}
