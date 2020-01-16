import express from "express";
const router = express.Router();
import checksum from "../../model/checksum";
import config from "../../config/config";
import admin from "../../config/firebase";
import shootEmail from "../../config/emailer";

const { verifychecksum } = checksum;

router.post("/", async (req, res) => {
  console.log("in response post");
  var paramlist = req.body;
  const order_id = paramlist.ORDERID;
  const doc_id = order_id.split("-IIP-")[0]; 
  const transactionRef = admin.firestore().collection('transactions').doc(order_id);
  const transactionDetails = await transactionRef.get();
  await transactionRef.set({status: paramlist.STATUS, reason:paramlist.RESPMSG},{merge:true})
  const document = await admin.firestore()
    .collection("links")
    .doc(doc_id)
    .get();
  if (!document.exists) {
    res.render("complete-failure.ejs", {
      title: order_id,
      reason:
        "URL is not configured properly. Kindly get in touch with us if your money was deducted, we shall refund it."
    });
  }
  const { title, link } = document.data();
  console.log(paramlist);
  if (verifychecksum(paramlist, config.merchant_key)) {
    if (paramlist.STATUS != "TXN_SUCCESS") {
      // Should be != made == for dev
      res.render("complete-failure.ejs", {
        title,
        reason: "Reason: " + paramlist.RESPMSG
      });
    } else {
      const buyer = transactionDetails.data().buyer;
      if(buyer){
        await shootEmail(buyer,link);
      }
      res.render("complete-success.ejs", { title, link });

    }
    //res.render("response.ejs", { restdata: "true", paramlist: paramlist });
  } else {
    console.log("false");
    res.render("complete-failure.ejs", {
      title,
      reason: "Checksum could not be verified. Kindly get in touch with us."
    });
  }
});

//TODO register result somewhere
export default router;
