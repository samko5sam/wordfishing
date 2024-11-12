"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import the Select component
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, doc } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { useAuth } from "@clerk/clerk-react";

const AddVocabulary = () => {
  const { userId } = useAuth();
  const [folderName, setFolderName] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>(""); // Add state for selected folder
  const [vocabInfo, setVocabInfo] = useState<string>("");
  const [availableFolders, setAvailableFolders] = useState<{
    folderName: any;
    id: any;
  }[]>([]);
  const router = useRouter();

  const fetchAvailableFolders = async () => {
    if (!userId) return;
    const querySnapshot = await getDocs(collection(db, "vocabularies", userId, "folders"));
    const folders: {
      folderName: any;
      id: any;
    }[] = [];
    querySnapshot.forEach((doc) => {
      folders.push({
        folderName: doc.data().folderName,
        id: doc.id
      });
    });
    setAvailableFolders(folders);
  };
  
  useEffect(() => {
    fetchAvailableFolders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleAddVocabulary = async () => {
    if (!userId) return;
    try {
      const selectedFolderDoc = availableFolders.find((folder) => folder.id === selectedFolder);
      if (!selectedFolderDoc) return;
      const docRef = await addDoc(collection(db, "vocabularies", userId, "vocab"), {
        folderRef: doc(db, "vocabularies", userId, "folders", selectedFolderDoc.id),
        title: vocabInfo,
        description: "",
        marked: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Document written with ID: ", docRef.id);
      setFolderName("");
      setVocabInfo("");
      
      // Optional: redirect or notify of success
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAddVocabularyFolder = async () => {
    if (!userId) return;
    try {
      const docRef = await addDoc(collection(db, "vocabularies", userId, "folders"), {
        folderName,
        createdAt: new Date().toISOString()
      });

      console.log("Vocabulary folder created with ID: ", docRef.id);
      setFolderName("");

      fetchAvailableFolders();
      
      // Optional: redirect or notify of success
    } catch (error) {
      console.error("Error adding vocabulary folder: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Vocabulary</h1>
      <div className="mb-4">
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder Name"
          type="text"
          className="w-full"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <Button onClick={handleAddVocabularyFolder}>
          Add Vocabulary Folder to Firebase
        </Button>
      </div>
      <div className="mb-4">
        <Select
          value={selectedFolder}
          onValueChange={(e) => {
            console.log(e);
            setSelectedFolder(e)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {availableFolders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.folderName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Input
          value={vocabInfo}
          onChange={(e) => setVocabInfo(e.target.value)}
          placeholder="Vocabulary Information"
          type="text"
          className="w-full"
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={handleAddVocabulary}>
          Add Vocabulary to Firebase
        </Button>
      </div>
      {/* <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Available Vocabulary Folders:</h2>
        <ul>
          {availableFolders.map((folder, index) => (
            <li key={folder.id}>{folder.folderName}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default AddVocabulary;
