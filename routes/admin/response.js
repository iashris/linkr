import express from "express";
const router = express.Router();
import checksum from "../../model/checksum";
import config from "../../config/config";
import db from "../../config/firebase";

const { verifychecksum } = checksum;

router.post("/", async (req, res) => {
  console.log("in response post");
  var paramlist = req.body;
  console.log(paramlist);
  if (verifychecksum(paramlist, config.merchant_key)) {
    console.log("true");
    if (paramlist.STATUS == "TXN_SUCCESS") {
      // Should be != made == for dev
      res.end("Ah shmucks! No links for you");
    } else {
      const order_id = paramlist.ORDERID;
      const doc_id = order_id.split("-IIP-")[0];
      const document = await db
        .collection("links")
        .doc(doc_id)
        .get();
      if (document.exists) {
        res.end(`<h2>Yay! Here's the link: ${document.data().link} </h2>`);
      } else {
        res.end("There is no such doc only.");
      }
    }
    //res.render("response.ejs", { restdata: "true", paramlist: paramlist });
  } else {
    console.log("false");
    res.end("There was something fishy. Please reach out to us.");
  }
  //vidisha
});

module.exports = router;
