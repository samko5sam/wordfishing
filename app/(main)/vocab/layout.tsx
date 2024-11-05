'use client'
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const MyNextLayout = ({ children }: LayoutProps) => {
  return (
    <div className='flex-1 overflow-hidden flex'>
      <SidebarProvider className='flex-1 overflow-hidden'>
        <div className='min-h-[48px]'></div>
        {children}
      </SidebarProvider>
    </div>
  );
};

export default MyNextLayout;
