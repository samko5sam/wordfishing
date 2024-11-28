'use client'
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@clerk/clerk-react';
import { useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const MyNextLayout = ({ children }: LayoutProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      clerk.redirectToSignIn();
      return;
    }
  }, [clerk, userId])
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
