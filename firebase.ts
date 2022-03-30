// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAedNcUeHM_XfDV2BUeUb6F5nK-uffV8pA",
  authDomain: "todos-a21b5.firebaseapp.com",
  projectId: "todos-a21b5",
  storageBucket: "todos-a21b5.appspot.com",
  messagingSenderId: "354446860009",
  appId: "1:354446860009:web:4297386583758b6c9fda78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export {db}