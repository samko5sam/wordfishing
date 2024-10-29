import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
  return (
    <div className="w-full flex justify-end items-center p-2 min-h-16">
      <SignedOut>
        <SignInButton>
          <Button variant="default">登入</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
