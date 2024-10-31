import { Navbar } from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
}

export default function MainLayout({children}: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mt-[48px] flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
