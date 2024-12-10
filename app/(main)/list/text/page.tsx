/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth, useClerk } from "@clerk/nextjs";
import ContentCard from "@/components/ContentCard";
import { useFirebaseAuthStatus } from "@/components/FirebaseAuthProvider";
import { FullPageLoadingIndicator } from "@/components/layout/FullPageLoadingIndicator";

interface Text {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function TextsPage() { // Updated component name
  const { userId } = useAuth();
  const { isAuthenticated } = useFirebaseAuthStatus();
  const clerk = useClerk();
  const [texts, setTexts] = useState<Text[]>([]); // Updated variable name
  const [loading, setLoading] = useState(true);

  const fetchTexts = async () => { // Updated function name
    if (!userId) {
      console.log("請先登入");
      clerk.redirectToSignIn();
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const userContentRef = collection(db, "content", userId, "text"); // Updated Firestore path
    const q = query(userContentRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      const textsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Text[]; // Updated variable name and type

      setTexts(textsList);
    } catch (error) {
      console.error("Error fetching texts:", error); // Updated log message
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSuccess = () => {
    fetchTexts(); // Updated function call
  };
  
  useEffect(() => {
    fetchTexts(); // Updated function call
  }, [clerk, userId, isAuthenticated]);

  if (loading || !isAuthenticated) {
    return <FullPageLoadingIndicator />;
  }

  if (texts.length === 0) { // Updated condition
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">未找到文字內容，匯入文字以開始！</p> {/* Updated message */}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {texts.map((text) => ( // Updated iteration variable
        <ContentCard
          key={text.id}
          contentType="articles" // Updated content type
          id={text.id}
          title={text.title}
          content={text.content}
          createdAt={text.createdAt}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}
