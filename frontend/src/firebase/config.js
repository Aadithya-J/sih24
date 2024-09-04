import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnDFC-yUB-tPLTVa6amR0-9PjT1j9_tAI",
  authDomain: "jobnew-9abd2.firebaseapp.com",
  projectId: "jobnew-9abd2",
  storageBucket: "jobnew-9abd2.appspot.com",
  messagingSenderId: "947844583542",
  appId: "1:947844583542:web:5c0cf84675c1084e278f57",
  measurementId: "G-591HVX7J9K"
};

firebase.initializeApp(firebaseConfig);

const myFireStore = firebase.firestore();
const myAuth = firebase.auth();

export default { myFireStore, myAuth };