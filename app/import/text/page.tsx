/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { createId } from "@paralleldrive/cuid2";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ImportTextPage() {
  const router = useRouter();
  const { userId } = useAuth();

  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // Handle import action
  const handleImport = async () => {
    if (!userId) {
      setError("請先登入");
      return;
    }

    if (!textInput.trim()) {
      setError("文字內容不可為空");
      return;
    }

    setImporting(true);
    try {
      const docId = createId();
      const redirectUrl = `/docs/text/${docId}`;

      // Create document data
      const textData = {
        content: textInput.trim(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      const userTextsRef = collection(db, "content", userId, "texts");
      const textDocRef = doc(userTextsRef, docId);
      await setDoc(textDocRef, textData);

      // Redirect to the text view page
      router.replace(redirectUrl);
    } catch (err) {
      console.error("Error importing text:", err);
      setError("儲存失敗");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">匯入文字內容</h1>
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      <Textarea
        placeholder="請輸入文字內容"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        rows={12}
        className="p-4 w-full max-w-lg mb-4 resize-none whitespace-pre-wrap border rounded-md"
      />

      <Button
        size="lg"
        className="w-full max-w-lg"
        onClick={handleImport}
        disabled={importing}
      >
        {importing ? "正在匯入..." : "匯入文字內容"}
      </Button>
    </div>
  );
}
