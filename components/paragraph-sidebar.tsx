"use client"
import * as React from "react";
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarRail } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/hooks/use-translate";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [textToTranslate, setTextToTranslate] = React.useState('');
  const { translatedText, translate, translationLoading } = useTranslate();

  const handleTranslate = async () => {
    if (textToTranslate.trim() === '') return;
    await translate(textToTranslate, 'zh-hant');
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu></SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <Textarea
          placeholder="Type stuff to translate here"
          id="message"
          rows={10}
          value={textToTranslate}
          onChange={(e) => setTextToTranslate(e.target.value)}
        />
        <Button variant="default" onClick={handleTranslate} disabled={translationLoading}>
          {translationLoading ? 'Translating...' : '翻譯'}
        </Button>
        
          <Card>
            <CardContent className="p-5">
            <p>{translationLoading ? 'Translating...' :""}</p>
            {translatedText && (
              <p>{translatedText}</p>
            )}
            </CardContent>
          </Card>
        <Button variant="default">加入單字庫</Button>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
