// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8mTUfHQKseN67FPtRqSS-VukDLBchpEU",
  authDomain: "admin-dashboard-30e2d.firebaseapp.com",
  projectId: "admin-dashboard-30e2d",
  storageBucket: "admin-dashboard-30e2d.appspot.com",
  messagingSenderId: "375897161588",
  appId: "1:375897161588:web:635ad0648237231d527621",
};

// Initialize Firebase
export const firebaseClient = initializeApp(firebaseConfig);

export const databaseClient = getFirestore(firebaseClient);
