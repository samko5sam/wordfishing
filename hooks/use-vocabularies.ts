import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

interface Folder {
  folderName: any;
  id: any;
  createdAt: string;
}

export const useAvailableFolders = () => {
  const [availableFolders, setAvailableFolders] = useState<Folder[]>([]);
  const { userId } = useAuth();

  const fetchAvailableFolders = async () => {
    if (!userId) return;
    const querySnapshot = await getDocs(collection(db, 'vocabularies', userId, 'folders'));
    const folders: Folder[] = [];
    querySnapshot.forEach((doc) => {
      folders.push({
        folderName: doc.data().folderName,
        id: doc.id,
        createdAt: doc.data().createdAt
      });
    });
    
    folders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setAvailableFolders(folders);
  };

  useEffect(() => {
    fetchAvailableFolders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { availableFolders, fetchAvailableFolders };
};

export const useVocabFolder = () => {
  const [folderData, setFolderData] = useState<Folder|null>(null);
  const [folderLoading, setFolderLoading] = useState(true);
  const { userId } = useAuth();

  const fetchFolder = async (folderId: string) => {
    setFolderLoading(true);
    if (!userId) return;
    try {
      const userDocSnap = await getDoc(doc(db, 'vocabularies', userId, 'folders', folderId));
      if (userDocSnap.exists()) {
        setFolderData(userDocSnap.data() as Folder)
      }
    } catch (error) {
      console.error('Error fetching folder:', error)
    } finally {
      setFolderLoading(false)
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!userId) return;
    try {
      const contentRef = doc(db, 'vocabularies', userId, 'folders', folderId);
      await deleteDoc(contentRef);
    } catch (error) {
      throw error
    }
  }

  // useEffect(() => {
  //   fetchFolder();
  // }, [userId]);

  return { folderData, fetchFolder, folderLoading, deleteFolder };
};

export const useAddVocabularyFolder = () => {
  const { userId } = useAuth();
  const addVocabFolder = async (folderName: string) => {
    if (!userId) return;
    try {
      const docRef = await addDoc(collection(db, "vocabularies", userId, "folders"), {
        folderName,
        createdAt: new Date().toISOString()
      });

      console.log("Vocabulary folder created with ID: ", docRef.id);
      
      // Optional: redirect or notify of success
    } catch (error) {
      console.error("Error adding vocabulary folder: ", error);
    }
  };

  return {addVocabFolder}
}