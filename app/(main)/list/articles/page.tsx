'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { userId } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userId) {
        console.log("請先登入");
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setLoading(false);
        return;
      }

      const userContentRef = collection(db, 'content', userId, 'articles');
      const q = query(userContentRef, where('userId', '==', userId));
      
      try {
        const querySnapshot = await getDocs(q);
        const articlesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Article[];
        
        setArticles(articlesList);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">載入中...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">未找到文章，匯入文章以開始！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link key={article.id} href={`/docs/article/${article.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3">{article.content}</p>
              <div className="mt-2 text-xs text-gray-400">
                {new Date(article?.createdAt || "").toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
