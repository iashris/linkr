import express from "express";
import { checkIfAuthenticated } from "../../middlewares/auth";
const router = express.Router();

router.get("/", function(req, res) {
    console.log(req.session);
    res.render("admin.ejs");
  
});

export default router;
