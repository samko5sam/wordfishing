"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { TRANSLATE_TEXT_LIMIT } from "@/constants/Constraint";
import { TranslationMessage } from "@/components/ui/TranslationMessage";

const TranslateTestPage = () => {
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("detect");
  const [targetLanguage, setTargetLanguage] = useState("zh-Hant");
  const [languages, setLanguages] = useState<string[]>([]);
  const {translate, translatedText, translationLoading} = useTranslate();
  const [showTranslation, setShowTranslation] = useState(true);

  const handleTranslate = () => {
    if (text.length <= TRANSLATE_TEXT_LIMIT){
      translate(text, targetLanguage, sourceLanguage === "detect" ? undefined : sourceLanguage);
      setShowTranslation(true);
    } else {
      setShowTranslation(false);
    }
  }

  const handleSourceLanguageChange = (language: string) => {
    setSourceLanguage(language);
  };

  const handleTargetLanguageChange = (language: string) => {
    setTargetLanguage(language);
  };

  const fetchAvailableLanguages = async () => {
    const cachedLanguages = sessionStorage.getItem("translatorLanguages");
    if (cachedLanguages) {
      const languages = JSON.parse(cachedLanguages);
      setLanguages(languages);
      return;
    }
    console.log("Fetch available languages");
    try {
      const response = await fetch("/api/translate");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLanguages(Object.keys(data.translation));
        sessionStorage.setItem(
          "translatorLanguages",
          JSON.stringify(Object.keys(data.translation))
        );
      } else {
        console.error("Failed to fetch available languages");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAvailableLanguages();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-2xl font-bold mb-6">語言翻譯器</h1>
      <Card className="p-8 m-3 flex-1">
        <h1 className="mb-2">翻譯</h1>
        <div className="mb-4 flex flex-row gap-4 items-center">
          <Select
            disabled={!languages.length}
            onValueChange={handleSourceLanguageChange}
            value={sourceLanguage}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="來源語言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="detect" value="detect">
                自動偵測
              </SelectItem>
              {languages.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowRight />
          <Select
            disabled={!languages.length}
            onValueChange={handleTargetLanguageChange}
            value={targetLanguage}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="翻譯語言" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="請輸入要翻譯的文字"
          className="mb-4"
        />
        <Button
          onClick={handleTranslate}
          className="mb-4"
          disabled={!languages.length}
        >
          翻譯
        </Button>
        <div className={translationLoading ? "overflow-hidden" : "overflow-y-auto"}>
          {translationLoading ? <div><Loader2 className="animate-spin" /></div> : <>{
            showTranslation ? <p style={{wordBreak: "break-word"}}>{translatedText}</p> : <TranslationMessage />
          }</>}
        </div>
      </Card>
    </div>
  );
};

export default TranslateTestPage;
