"use client";
import { useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function FirestoreTestPage() {
  const [userId, setUserId] = useState('');
  const [documentData, setDocumentData] = useState<any>(null);

  const handleGetDocument = async () => {
    try {
      const collectionRef = collection(db, 'content', userId, 'articles');
      const docSnapshot = await getDocs(collectionRef);

      if (docSnapshot.docs) {
        setDocumentData(docSnapshot.docs);
      } else {
        setDocumentData({ error: 'Document not found' });
      }
    } catch (error) {
      console.error('Error getting document:', error);
      setDocumentData({ error: 'Error getting document' });
    }
  };

  const handleWriteDocument = async () => {
    try {
      const docRef = doc(db, 'content', userId, 'articles', 'test');
      const data = { name: 'John Doe', email: 'john@example.com' };
      await setDoc(docRef, data);
      setDocumentData({ message: 'Document written successfully' });
    } catch (error) {
      console.error('Error writing document:', error);
      setDocumentData({ error: 'Error writing document' });
    }
  };

  return (
    <Card className="mx-auto my-10 max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Firestore Test Page</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="default" onClick={handleGetDocument}>
          Get Document
        </Button>
        <Button variant="default" onClick={handleWriteDocument}>
          Write Document
        </Button>
      </div>
      {documentData && (
        <div className="mt-4">
          <Textarea
            readOnly
            value={JSON.stringify(documentData, null, 2)}
            className="h-40 w-full"
          />
        </div>
      )}
    </Card>
  );
}
