import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

export interface Folder {
  folderName: string;
  id: string;
  createdAt: string;
  marked: boolean;
}

export interface Vocabulary {
  folderId?: string;
  title: string;
  description: string;
  marked: boolean;
  id: string;
  createdAt: string;
}

export const useAvailableFolders = () => {
  const [availableFolders, setAvailableFolders] = useState<Folder[]>([]);
  const [isFolderLoading, setIsFolderLoading] = useState(false);
  const { userId } = useAuth();

  const fetchAvailableFolders = async () => {
    if (!userId) return;
    setIsFolderLoading(true);
    const querySnapshot = await getDocs(collection(db, 'vocabularies', userId, 'folders'));
    const folders: Folder[] = [];
    querySnapshot.forEach((doc) => {
      folders.push({
        folderName: doc.data().folderName,
        marked: doc.data().marked,
        id: doc.id,
        createdAt: doc.data().createdAt
      });
    });
    
    folders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setAvailableFolders(folders);
    setIsFolderLoading(false);
  };

  useEffect(() => {
    fetchAvailableFolders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { availableFolders, fetchAvailableFolders, isFolderLoading };
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
        marked: false,
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

export const useAddVocabulary = () => {
  const { userId } = useAuth();
  const addVocab = async (vocabData: {
    folderId: string;
    title: string;
    description?: string;
  }) => {
    if (!userId || !vocabData.folderId) return;
    try {
      const docRef = await addDoc(collection(db, "vocabularies", userId, "vocab"), {
        folderRef: doc(db, "vocabularies", userId, "folders", vocabData.folderId),
        title: vocabData.title,
        description: vocabData.description,
        marked: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Vocabulary created with ID: ", docRef.id);
      
      // Optional: redirect or notify of success
    } catch (error) {
      console.error("Error adding vocabulary: ", error);
    }
  };

  return {addVocab}
}

export const useVocabulariesInFolder = () => {
  const [allVocabularies, setAllVocabularies] = useState<Vocabulary[]>([]);
  const [isVocabLoading, setIsVocabLoading] = useState(false);
  const { userId } = useAuth();

  const fetchAllVocabularies = async (folderId: string) => {
    if (!userId) return;
    setIsVocabLoading(true);
    const folderRef = doc(db, 'vocabularies', userId, 'folders', folderId);
    const querySnapshot = await getDocs(query(collection(db, 'vocabularies', userId, 'vocab'), where("folderRef", "==", folderRef)));
    const vocabularies: Vocabulary[] = [];
    querySnapshot.forEach((doc) => {
      vocabularies.push({
        title: doc.data().title,
        description: doc.data().description,
        marked: doc.data().marked,
        id: doc.id,
        createdAt: doc.data().createdAt
      });
    });
    
    vocabularies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setAllVocabularies(vocabularies);
    setIsVocabLoading(false);
  };

  return { allVocabularies, fetchAllVocabularies, isVocabLoading };
};
