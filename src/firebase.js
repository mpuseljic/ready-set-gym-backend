// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your server's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGHBeA3oJkj2YzdTtbmkev4lQTypwjPCk",
  authDomain: "readysetgym-9ca0d.firebaseapp.com",
  projectId: "readysetgym-9ca0d",
  storageBucket: "readysetgym-9ca0d.appspot.com",
  messagingSenderId: "830936713280",
  appId: "1:830936713280:web:51bab06b8a93eecd15f7a5",
  measurementId: "G-H1E4K5PXZT",
};

// Initialize Firebase app on the server
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
