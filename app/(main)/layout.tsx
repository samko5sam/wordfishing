import { Navbar } from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
}

export default function MainLayout({children}: Props) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  )
}
