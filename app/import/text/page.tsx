"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ImportTextPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
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

  const handleImport = () => {
    if (!title.trim()) {
      alert("請輸入標題！");
      return;
    }

    // 保存到 localStorage
    const importedTexts = JSON.parse(localStorage.getItem("importedTexts") || "[]");
    const newText = { title, content, id: Date.now() };
    localStorage.setItem("importedTexts", JSON.stringify([...importedTexts, newText]));

    alert("匯入成功！");
    router.push("/list/text");
  };

  return (
    <div>
      <h1>輸入標題並匯入</h1>
      <textarea value={content} readOnly rows={10} cols={50} />
      <div>
        <input
          type="text"
          placeholder="輸入標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleImport}>匯入</button>
      </div>
    </div>
  );
}
