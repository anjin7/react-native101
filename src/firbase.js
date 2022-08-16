// import * as firebase from "firebase/app";
// import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW80rAhXQjoV21B9MsoHFjp4e_tlmZlCU",
  authDomain: "nwtter-2f877.firebaseapp.com",
  projectId: "nwtter-2f877",
  storageBucket: "nwtter-2f877.appspot.com",
  messagingSenderId: "500567874727",
  appId: "1:500567874727:web:ef550ba27cac64bb71cf82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
