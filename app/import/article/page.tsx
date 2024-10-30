"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MultifunctionalSearchBar from "@/components/MultifunctionalSearchBar";

export default function ImportArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  
  const [article, setArticle] = useState(null);
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
    setImporting(true);
    try {
      const response = await fetch("/api/importArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: article!.title, content: article!.content }),
      });

      if (response.ok) {
        router.push("/"); // Replace with desired redirect URL after import
      } else {
        console.error("Failed to import article content.");
      }
    } catch (err) {
      console.error("Error importing article:", err);
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

      {loading && <p>網頁解析中...</p>}
      {error && <><h2 className="text-2xl">{error}</h2><BackToHomeBtn /><MultifunctionalSearchBar /></>}

      {article && (
        <Card className="max-w-md p-4">
          <CardHeader>
            <BackToHomeBtn />
            <h2 className="text-xl font-semibold">{article.title}</h2>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto border rounded-xl mx-6">
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full mt-8" onClick={handleImport} disabled={importing}>
              {importing ? "正在匯入..." : "匯入網頁內容"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
