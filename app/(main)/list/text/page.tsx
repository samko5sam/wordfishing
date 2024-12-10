"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";
import { FullPageLoadingIndicator } from "@/components/layout/FullPageLoadingIndicator";

interface Text {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function TextPage() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTexts = () => {
    setLoading(true);
    try {
      // 從 localStorage 中獲取已匯入的內容
      const storedTexts = JSON.parse(localStorage.getItem("importedTexts") || "[]");
      setTexts(storedTexts);
    } catch (error) {
      console.error("Error loading texts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSuccess = (id: string) => {
    // 刪除指定的文章
    const updatedTexts = texts.filter((text) => text.id !== id);
    setTexts(updatedTexts);
    localStorage.setItem("importedTexts", JSON.stringify(updatedTexts));
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  if (loading) {
    return <FullPageLoadingIndicator />;
  }

  if (texts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">未找到文章，匯入文章以開始！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {texts.map((text) => (
        <ContentCard
          key={text.id}
          contentType="articles"
          id={text.id}
          title={text.title}
          content={text.content}
          createdAt={text.createdAt}
          onDeleteSuccess={() => onDeleteSuccess(text.id)}
        />
      ))}
    </div>
  );
}
