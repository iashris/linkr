import admin from "firebase-admin";
import serviceAccount from "./service-account";
var firebaseConfig = {
  apiKey: "AIzaSyBz9mmAym3FYVm1L4NHtDQLloHr_fQ3Xtg",
  authDomain: "linkr-5278b.firebaseapp.com",
  databaseURL: "https://linkr-5278b.firebaseio.com",
  projectId: "linkr-5278b",
  storageBucket: "linkr-5278b.appspot.com",
  messagingSenderId: "364718390740",
  appId: "1:364718390740:web:abc35da231dd452e"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://linkr-5278b.firebaseio.com"
});

const db = admin.firestore();

// Initialize Firebase
export default db;
