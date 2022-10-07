// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiu9mGYb-XLHUpLKXYZ3I5z673ayQpNSo",
  authDomain: "login-auth-3e436.firebaseapp.com",
  projectId: "login-auth-3e436",
  storageBucket: "login-auth-3e436.appspot.com",
  messagingSenderId: "75137968133",
  appId: "1:75137968133:web:f8532394cf204c0e3b946c",
  measurementId: "G-L01ZDS698Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);