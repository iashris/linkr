import express from "express";
import { checkIfAuthenticated } from "../../middlewares/auth";
const router = express.Router();

router.get("/", function(req, res) {
    res.render("admin.ejs",{user:req.user});
  
});

export default router;
