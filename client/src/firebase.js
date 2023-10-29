// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-77d9b.firebaseapp.com",
  projectId: "mern-estate-77d9b",
  storageBucket: "mern-estate-77d9b.appspot.com",
  messagingSenderId: "683383261582",
  appId: "1:683383261582:web:524570969aa7229072fcdf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
