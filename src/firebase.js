// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDXsq4u3oUotsWNCHmSMrJYYVCSaPMJW-0',
    authDomain: 'auth-strapi.firebaseapp.com',
    projectId: 'auth-strapi',
    storageBucket: 'auth-strapi.appspot.com',
    messagingSenderId: '1082560209293',
    appId: '1:1082560209293:web:b5efbe988ee79fbd991dc4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
