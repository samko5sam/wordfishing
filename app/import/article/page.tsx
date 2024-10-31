"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@clerk/nextjs";
// import { sanitizeTitle } from "@/lib/sanitize";
import { createId } from "@paralleldrive/cuid2";
import sanitizeHtml from 'sanitize-html';

export default function ImportArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const url = searchParams.get("url");
  
  const [article, setArticle] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // Fetch the article content on load
  useEffect(() => {
    const fetchArticleContent = async () => {
      if (!url) return;
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/parseArticle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();
        if (response.ok) {
          setArticle(data);
        } else {
          setError(data.error || "🙇抱歉 發生錯誤！");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("🙇抱歉 發生錯誤！");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleContent();
  }, [url]);

  // Handle import button click
  const handleImport = async () => {
    if (!userId) {
      setError("請先登入");
      return;
    }

    setImporting(true);
    try {
      // Create document ID using title-userId format
      // const sanitizedTitle = sanitizeTitle(article!.title);
      const docId = createId();
      const redirectUrl = `/docs/article/${docId}`;

      // Create document data
      const articleData = {
        title: article!.title,
        content: article!.content,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceUrl: url
      };

      // Save to Firestore in user's sub-collection
      const userArticlesRef = collection(db, 'content', userId, 'articles');
      const articleDocRef = doc(userArticlesRef, docId);
      await setDoc(articleDocRef, articleData);

      // Redirect to the article view page
      router.replace(redirectUrl);
    } catch (err) {
      console.error("Error importing article:", err);
      setError("儲存失敗");
    } finally {
      setImporting(false);
    }
  };

  const BackToHomeBtn = () => {
    return (
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-4" size="lg">
        ← 回主頁
      </Button>
    )
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className='w-full max-w-md'>
        <h1 className="text-2xl font-semibold mb-4">匯入網頁內容</h1>
      </div>

      {loading && <>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </>}
      {error && <><h2 className="text-2xl">{error}</h2><Button variant="link" onClick={() => window.location.reload()}>重試</Button><MultifunctionalSearchBar /><BackToHomeBtn /></>}

      {article && (
        <Card className="max-w-md p-4 max-h-full">
          <CardHeader>
            <BackToHomeBtn />
            <h2 className="text-xl font-semibold">{article.title}</h2>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto border rounded-xl mx-6 p-0">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}></div>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full mt-8" 
              onClick={handleImport} 
              disabled={importing || !userId}
            >
              {!userId ? "請先登入" : importing ? "正在匯入..." : "匯入網頁內容"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
