"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ImportTextPage() {
  const { userId } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 從 sessionStorage 讀取輸入的內容
    const importedContent = sessionStorage.getItem("importedContent");
    if (importedContent) {
      setContent(importedContent);
    } else {
      alert("未檢測到需要匯入的文字！");
      router.push("/");
    }
  }, [router]);


  const handleImport = async () => {
    if (!userId) {
      setError("請先登入");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("標題和內容不能為空！");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const docId = `${userId}-${Date.now()}`;
      const textData = {
        title: title.trim(),
        content: content.trim(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userTextsRef = collection(db, "content", userId, "text");
      const textDocRef = doc(userTextsRef, docId);

      await setDoc(textDocRef, textData);

      setTitle("");
      setContent("");
      alert("匯入成功！");
    } catch (err) {
      console.error("匯入文字內容時發生錯誤：", err);
      setError("匯入失敗，請稍後重試");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-4">
        <h1 className="text-2xl font-semibold mb-4">匯入文字內容</h1>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">標題</label>
          <Input
            type="text"
            placeholder="輸入標題..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">內容</label>
          <Textarea
            placeholder="輸入文字內容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button
          className="w-full"
          onClick={handleImport}
          disabled={importing}
        >
          {importing ? "正在匯入..." : "匯入文字內容"}
        </Button>
      </div>
    </div>
  );
}
