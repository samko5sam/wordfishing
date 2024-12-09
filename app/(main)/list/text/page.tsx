/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ImportedText {
  id: string;
  title: string;
  content: string;
}

export default function TextPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [importedTexts, setImportedTexts] = useState<ImportedText[]>([]);

  const handleImport = () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("請填寫標題和內容！");
      return;
    }

    const newEntry: ImportedText = {
      id: `${Date.now()}`,
      title,
      content,
    };

    setImportedTexts((prev) => [...prev, newEntry]);
    setTitle("");
    setContent("");
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setImportedTexts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setImportedTexts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">匯入文字管理</h1>
      <div className="mb-6">
        <Input
          placeholder="請輸入標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full"
        />
        <Textarea
          placeholder="請輸入內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="p-4 w-full mb-4 resize-none whitespace-pre-wrap border rounded-md"
        />
        <Button
          size="lg"
          className="w-full bg-blue-500 text-white"
          onClick={handleImport}
        >
          匯入
        </Button>
      </div>

      {importedTexts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {importedTexts.map((text) => (
            <div
              key={text.id}
              className="border rounded-md p-4 shadow-md relative"
            >
              <Input
                value={text.title}
                onChange={(e) => handleTitleChange(text.id, e.target.value)}
                className="mb-2"
              />
              <p className="text-gray-700 whitespace-pre-wrap mb-4">
                {text.content}
              </p>
              <Button
                size="sm"
                className="absolute top-2 right-2 bg-red-500 text-white"
                onClick={() => handleDelete(text.id)}
              >
                刪除
              </Button>
            </div>
          ))}
        </div>
      )}

      {importedTexts.length === 0 && (
        <p className="text-gray-500 text-center">目前沒有匯入的文字。</p>
      )}
    </div>
  );
}
