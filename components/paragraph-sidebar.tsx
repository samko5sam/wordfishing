"use client"
import * as React from "react";
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarRail } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/hooks/use-translate";
import { AvailableFolderSelector } from "./AvailableFolderSelector";
import { useAddVocabulary } from "@/hooks/use-vocabularies";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [textToTranslate, setTextToTranslate] = React.useState('');
  const { translatedText, translate, translationLoading } = useTranslate();
  const { addVocab } = useAddVocabulary()
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (textToTranslate.trim() === '') return;
    await translate(textToTranslate, 'zh-hant');
  };

  const handleAddVocab = async () => {
    if (!textToTranslate) return;
    if (!selectedFolder) return;
    try {
      await addVocab({
        folderId: selectedFolder,
        title: textToTranslate,
        description: translatedText
      })
      toast({
        title: "已成功新增單字",
        variant: "default"
      })
    } catch (error) {
      console.log(error);
    }
  }

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
          {translationLoading ? '翻譯中...' : '翻譯'}
        </Button>
        
        <Card>
          <CardContent className="p-5">
          <p>{translationLoading ? '翻譯中...' :""}</p>
          {translatedText && (
            <p>{translatedText}</p>
          )}
          </CardContent>
        </Card>

        <AvailableFolderSelector selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />

        <Button variant="default" onClick={handleAddVocab}>加入單字庫</Button>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
