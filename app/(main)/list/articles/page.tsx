'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth, useClerk } from '@clerk/nextjs';
import ContentCard from '@/components/ContentCard';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { userId } = useAuth();
  const clerk = useClerk();
  const user = auth.currentUser;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userId) {
        console.log("請先登入");
        clerk.redirectToSignIn();
        return;
      }
      
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
  }, [clerk, userId, user]);

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
        <ContentCard key={article.id} contentType="article" id={article.id} title={article.title} content={article.content} createdAt={article.createdAt} />
      ))}
    </div>
  );
}
