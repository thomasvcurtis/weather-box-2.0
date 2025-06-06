import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBE9Wv9XXha1mNIXR06kjDcTtBlCerIECA",
  authDomain: "weather-box-b26bb.firebaseapp.com",
  projectId: "weather-box-b26bb",
  storageBucket: "weather-box-b26bb.firebasestorage.app",
  messagingSenderId: "889949773031",
  appId: "1:889949773031:web:35143add40cf34258a5642",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
