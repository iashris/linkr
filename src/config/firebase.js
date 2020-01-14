import admin from "firebase-admin";
import serviceAccount from "./service-account";
var firebaseConfig = {
  apiKey: "AIzaSyCZgqIUN6CcwLrLOroo_mWv172W42me_Ds",
  authDomain: "makersgully.firebaseapp.com",
  databaseURL: "https://makersgully.firebaseio.com",
  projectId: "makersgully",
  storageBucket: "makersgully.appspot.com",
  messagingSenderId: "522214830535",
  appId: "1:522214830535:web:3d7123acc0515a5678a9e2",
  measurementId: "G-S4838SQV0F"
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://makersgully.firebaseio.com"
});

const db = admin.firestore();

// Initialize Firebase
export default db;
