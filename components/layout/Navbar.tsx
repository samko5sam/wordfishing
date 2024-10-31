"use client";

import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, HomeIcon, Loader2 } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex justify-between items-center p-2 min-h-[54px] bg-white/80 backdrop-blur-sm z-50 border-b">
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
        <ClerkLoading>
          <Loader2 className="animate-spin" />
        </ClerkLoading>
        <SignedOut>
          <SignInButton>
            <Button variant="default">登入</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="h-full flex items-center">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
