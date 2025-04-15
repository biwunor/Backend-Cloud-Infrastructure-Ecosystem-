import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAc75lzWPr4e0AY43V_k0Dy_Ofz4A4FOFY",
  authDomain: "urban-waste-help-6cb52.firebaseapp.com",
  projectId: "urban-waste-help-6cb52",
  storageBucket: "urban-waste-help-6cb52.firebasestorage.app",
  messagingSenderId: "489957749468",
  appId: "1:489957749468:web:9b150e6e013c5597157a19",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export default app;