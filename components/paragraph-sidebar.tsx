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
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [textToProcess, setTextToProcess] = React.useState('');
  const { translatedText, translate, translationLoading } = useTranslate();
  const { addVocab } = useAddVocabulary()
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleTranslate = async () => {
    if (textToProcess.trim() === '') return;
    await translate(textToProcess, 'zh-hant');
  };

  const handleChatbot = () => {
    if (textToProcess.trim() === '') return
    sessionStorage.setItem("wordfishingInitialTextForChatbot", textToProcess);
    router.push("/chatbot")
  };

  const handleAddVocab = async () => {
    if (!textToProcess) return;
    if (!selectedFolder) return;
    try {
      await addVocab({
        folderId: selectedFolder,
        title: textToProcess,
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
        <SidebarMenu>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <Textarea
          placeholder="在此輸入內容來翻譯或是詢問AI學習助手"
          id="message"
          rows={10}
          value={textToProcess}
          onChange={(e) => setTextToProcess(e.target.value)}
        />
        <Button variant="outline" onClick={handleChatbot} disabled={translationLoading}>
          詢問AI學習助手
        </Button>
        <Button variant="default" onClick={handleTranslate} disabled={translationLoading}>
          {translationLoading ? '翻譯中...' : '翻譯'}
        </Button>
        
        {translatedText && (
          <Card>
            <CardContent className="p-5">
              <p>{translationLoading ? '翻譯中...' :""}</p>
              <p>{translatedText}</p>
            </CardContent>
          </Card>
        )}

        <br />
        <AvailableFolderSelector selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />

        <Button variant="default" onClick={handleAddVocab} disabled={!selectedFolder}>將翻譯加入單字庫</Button>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
