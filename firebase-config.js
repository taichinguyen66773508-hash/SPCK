import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Thay bằng config thực tế của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCVJ2M0YqFRJAy1ufra085Pm2zwoqH9cuk",
  authDomain: "cuoijsi13.firebaseapp.com",
  projectId: "cuoijsi13",
  storageBucket: "cuoijsi13.firebasestorage.app",
  messagingSenderId: "824690218543",
  appId: "1:824690218543:web:dd8c01910dd14fecec58da",
  measurementId: "G-DLNMGSWJV8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);