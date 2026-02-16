import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
    apiKey: "AIzaSyAcFbugHulO4Jf7hkrSqolQRG_gQiGXc6A",
    authDomain: "gingerjournal-6e4ab.firebaseapp.com",
    projectId: "gingerjournal-6e4ab",
    storageBucket: "gingerjournal-6e4ab.appspot.com",
    messagingSenderId: "103389693685",
    appId: "1:103389693685:web:8f4a4b8b8c1a6c9f2b1e3c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
