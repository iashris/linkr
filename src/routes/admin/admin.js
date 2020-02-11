import express from "express";
import { checkIfAuthenticated } from "../../middlewares/auth";
import admin from "../../config/firebase";
const router = express.Router();

router.get("/", async (req, res) => {
    const allUsers = await admin.firestore()
    .collection('users')
    .where("balance",">=",500)
    .get();
    const uzrs = allUsers.docs.map(doc => doc.data());
    res.render("admin.ejs", {uzrs});
});

export default router;
