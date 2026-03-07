import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCebzDHCQ-c7cbg0xaqxhfi3zuOaIgVvys",
  authDomain: "tourism-app-898c0.firebaseapp.com",
  projectId: "tourism-app-898c0",
  storageBucket: "tourism-app-898c0.firebasestorage.app",
  messagingSenderId: "942938383708",
  appId: "1:942938383708:web:d1e86088ff29f06d858d99",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();