"use client";

import TabLayout from "@/components/TabLayout";
import { usePathname } from "next/navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TabLayout
      tabOptions={[
        { value: "privacy", label: "Privacy" },
        { value: "terms", label: "Terms of Service" },
      ]}
      initialTab={pathname?.split('/')[1] || "privacy"}
    >
      {children}
    </TabLayout>
  );
}
