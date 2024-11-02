import { Navbar } from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
}

export default function MainLayout({children}: Props) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="min-h-[48px]"></div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
