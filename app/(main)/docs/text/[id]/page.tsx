"use client";

import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { useAuth } from '@clerk/nextjs';
import sanitizeHtml from 'sanitize-html';
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator';
import { SidebarTriggerForDocs } from '../../SidebarTriggerForDocs';

interface ArticleContent {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function ArticleViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      if (!userId) {
        setError("請先登入");
        return;
      }

      try {
        const userTextsRef = collection(db, 'content', userId, 'text'); // 路徑改為 'text'
        const textDocRef = doc(userTextsRef, id.toString());
        const docSnap = await getDoc(textDocRef);

        if (docSnap.exists()) {
          setArticle(docSnap.data() as ArticleContent);
        } else {
          setError("找不到此文章");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("載入文章時發生錯誤");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, userId]);

  const BackToHomeBtn = () => {
    return (
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-4" size="lg">
        ← 回主頁
      </Button>
    );
  };

  if (loading) return <FullPageLoadingIndicator />;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl mb-4 mt-8">{error}</h2>
      <BackToHomeBtn />
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <SidebarTriggerForDocs />
      <h1 className="text-2xl font-semibold">{article?.title}</h1>
      <div className="text-sm text-gray-500">
        更新於: {new Date(article?.updatedAt || "").toLocaleDateString()}
      </div>
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article?.content || "") || "" }}
        className="mt-4"
      />
    </div>
  );
}
