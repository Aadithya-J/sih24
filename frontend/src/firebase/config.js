import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIFT3gkD1qIDlK3X2wUS2dRLZnzatQlMM",
  authDomain: "yatharth-24.firebaseapp.com",
  projectId: "yatharth-24",
  storageBucket: "yatharth-24.appspot.com",
  messagingSenderId: "658651371540",
  appId: "1:658651371540:web:ee19d8a89bd758412baf01",
  measurementId: "G-T9D9ZTJKS8"
};

firebase.initializeApp(firebaseConfig);

const myFireStore = firebase.firestore();
const myAuth = firebase.auth();

export default { myFireStore, myAuth };