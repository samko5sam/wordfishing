// app/api/parseArticle/route.js

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import sanitizeHtml from 'sanitize-html';

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Validate the URL
    if (!url || !url.startsWith("http") || !/^https?:\/\//i.test(url)) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0"
      }
    });
    if (!response.ok) {
      console.log(response.status)
      return new Response(JSON.stringify({ error: "無法獲取網頁" }), { status: 500 });
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });

    // Use Readability to parse the article
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return new Response(JSON.stringify({ error: "網頁解析失敗" }), { status: 500 });
    }

    // Send parsed content back to the client
    return new Response(JSON.stringify({ title: article.title, content: sanitizeHtml(article.content) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error parsing article:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
