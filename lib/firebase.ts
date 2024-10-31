// Firebase configuration object
// https://ilikekillnerds.com/2020/01/is-it-safe-okay-to-public-expose-your-firebase-api-key-to-the-public/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBapx4-5A1NYUJmlpKe1fPwiTw4b0_uw3w", // Open api key for the web
  authDomain: "wordfishingapp.firebaseapp.com",
  projectId: "wordfishingapp",
  storageBucket: "wordfishingapp.appspot.com",
  messagingSenderId: "271356110386",
  appId: "1:271356110386:web:347b142327636e734e7e2b"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getFirestoreDataTest = async () => {
  const docRef = doc(db, 'lyricsContent', 'dreamcatcher-boca')
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data())
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!')
  }
}

