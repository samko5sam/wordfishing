"use client";

import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookA,
  Fish,
  Folder,
  LayoutGrid,
  Loader2,
  LogIn,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { ModeToggle } from "./ThemeToggle";

const NavbarIconLink = ({
  icon,
  text,
  tooltip,
  onClick,
}: {
  icon: React.ReactNode;
  text?: string;
  tooltip: string;
  onClick: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={onClick}
            className="flex items-center gap-2"
          >
            {icon}
            {text}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isDocsPage = pathname?.startsWith("/docs/");

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex justify-between items-center p-2 min-h-[54px] bg-white/80 backdrop-blur-sm z-50 border-b dark:bg-black/80">
      <div className="flex flex-row">
        {!isHomePage && (
          <>
            {isDocsPage && (
              <NavbarIconLink
                onClick={() => router.back()}
                icon={<ArrowLeft />}
                text="返回"
                tooltip="返回上一頁"
              />
            )}
            <NavbarIconLink
              onClick={() => router.push("/")}
              icon={<Search />}
              tooltip="搜尋"
            />
          </>
        )}
        {isHomePage && (
          <NavbarIconLink
            onClick={() => router.push("/")}
            icon={<Fish />}
            tooltip="Wordfishing"
          />
        )}
        <NavbarIconLink
          onClick={() => router.push("/list")}
          icon={<Folder />}
          tooltip="我的學習庫"
        />
        <NavbarIconLink
          onClick={() => router.push("/vocab")}
          icon={<BookA />}
          tooltip="單字庫"
        />
        <NavbarIconLink
          onClick={() => router.push("/tools")}
          icon={<LayoutGrid />}
          tooltip="更多應用"
        />
      </div>
      <div className="flex flex-row gap-2">
        <ModeToggle />
        <div className="flex-1 flex items-center min-w-9 justify-center">
          <ClerkLoading>
            <Loader2 className="animate-spin" />
          </ClerkLoading>
          <SignedOut>
            <SignInButton>
              <Button variant="default" className="hover-button">
                <span className="default-text">
                  <LogIn />
                </span>
                <span className="hover-text">登入</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};
