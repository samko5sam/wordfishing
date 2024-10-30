// app/api/importArticle/route.js
import sanitizeHtml from 'sanitize-html';

let importedArticles = []; // Temporary in-memory storage for imported articles

export async function POST(request) {
  try {
    const { title, content } = await request.json();

    const sanitizedContent = sanitizeHtml(content);
    // Validate the article content
    if (!title || !sanitizedContent) {
      return new Response(JSON.stringify({ error: "Invalid article data" }), {
        status: 400,
      });
    }

    // Store the imported article
    importedArticles.push({ title, content: sanitizedContent });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error importing article:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
