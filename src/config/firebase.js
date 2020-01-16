import admin from "firebase-admin";
import serviceAccount from "./service-account";

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://makersgully.firebaseio.com"
});

export default admin;
