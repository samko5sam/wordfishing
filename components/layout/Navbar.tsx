"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, HomeIcon } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex justify-between items-center p-2 min-h-[48px] bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="flex flex-row">
        {!isHomePage && (
          <>
            <Button 
              variant="ghost" 
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <HomeIcon />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft />
              返回
            </Button>
          </>
        )}
      </div>
      <div>
        <SignedOut>
          <SignInButton>
            <Button variant="default">登入</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}
