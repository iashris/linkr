import express from "express";
const router = express.Router();
import admin from "../config/firebase";
import config from "../config/config";
import checksum from "../model/checksum";
import {checkIfAuthenticated} from "../middlewares/auth";

const titleToId = title => {
  const id = title
    .toLowerCase()
    .replace(/\W/g, "-")
  return id;
};

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4();
}
function getTimeStamp() {
  return Math.floor(new Date().getTime());
}
router.get("/", function(req, res) {
  res.render("index.ejs", { app_url: config.app_url });
});

router.get("/r/:id", async (req, res) => {
  // TODO: Undo comment
  const { id } = req.params;
  const document = await admin.firestore()
    .collection("links")
    .doc(id)
    .get();
  if (!document.exists) {
    return res.end("Invalid Link");
  }
  const { price, title, description, name } = document.data();
  res.render("redeem.ejs", { price, title, id, description, name });

});

router.post("/r", async (req, res) => {
  console.log("Its starting");
  const { id, buyer, buyerName } = req.body;
  const document = await admin.firestore()
    .collection("links")
    .doc(id)
    .get();
  if (!document.exists) {
    return res.end("Invalid Link");
  }
  const { price, uid, email } = document.data();
  const transaction_id = guidGenerator() + guidGenerator();
  const newTransaction = admin.firestore().collection('transactions')
  .doc(id+"-IIP-"+transaction_id);
  const transaction_data = {
    buyer,
    email,
    uid,
    price,
    buyerName,
    status:'PENDING',
    time:getTimeStamp(),
  }
  await newTransaction.set(transaction_data,{merge:true})
  var paramObj = {
    ORDER_ID: id + "-IIP-" + transaction_id,
    CUST_ID: "GUEST",
    INDUSTRY_TYPE_ID: config.industry,
    CHANNEL_ID: "WEB",
    TXN_AMOUNT: price,
    MID: config.merchant_id,
    WEBSITE: config.website,
    PAYTM_MERCHANT_KEY: config.merchant_key
  };
  var paramarray = [];
  for (var name in paramObj) {
    if (name == "PAYTM_MERCHANT_KEY") {
      var PAYTM_MERCHANT_KEY = paramObj[name];
    } else {
      paramarray[name] = paramObj[name];
    }
  }

  paramarray["CALLBACK_URL"] = `${config.app_url}/complete`; // in case if you want to send callback
  checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, function(err, result) {
    console.log("Done!!!");
    return res.render("pgredirect.ejs", {
      restdata: result,
      paytm_url: config.paytm_url
    });
  });
  console.log("POST Order end");
});

router.post("/", checkIfAuthenticated, async (req, res) => {
  const {name,email,uid} = req.user;
  const { price, link, title, description } = req.body;
  const id = titleToId(title);
  const document = await admin.firestore()
    .collection("links")
    .doc(id)
    .get();
  const final_id = document.exists ? id + "-" + guidGenerator() : id;
  const ref = admin.firestore().collection("links").doc(final_id);
  const toSend = { price, link, title,description, time: getTimeStamp(), name,email, uid };
  console.log('Sending ',toSend)
  ref.set(toSend);
  res.send(final_id);
});

router.post("/updateProfile", checkIfAuthenticated, async (req, res) => {
  const {name,email,uid} = req.user;
  const { method, ID, phone } = req.body;
  const ref = await admin.firestore()
    .collection("users")
    .doc(uid);
  const toSend = { method, ID, name, email, uid, phone };
  console.log('Sending ',toSend)
  ref.set(toSend,{merge:true});
  res.send("OK");
});

router.post("/updateLink", checkIfAuthenticated, async (req, res) => {
  const {name,email,uid} = req.user;
  const {title,secret,price,editDocID,description} = req.body;
  const ref = await admin.firestore()
    .collection("links")
    .doc(editDocID);
  ref.set({title,secret,price,description},{merge:true});
  res.send("OK");
});

router.post("/deleteLink", checkIfAuthenticated, async (req, res) => {
  const {name,email,uid} = req.user;
  const {id} = req.body;
  const ref = admin.firestore()
    .collection("links")
    .doc(id);
  
  const requestedDoc = await ref.get();
  if(!requestedDoc.exists){
    res.end("BROKE")
  }
  const this_uid = requestedDoc.data().uid;
  if(this_uid===uid){
    ref.delete();
    res.send("OK");
  }
  else{
    console.log(id,this_uid,uid);
  }
});

router.post("/confirmPayment", checkIfAuthenticated, async (req, res) => {
  const {email} = req.user;
  let {uid,inr} = req.body;
  inr = Number(inr);
  if(email.indexOf("ashris")===-1){
    res.send("BROKE:AUTH");
    return;
  }
  if(!uid || !inr){
    res.send("BROKE:DATA");
    return;
  }
  console.log(uid,inr,'to be')
  const ref = admin.firestore()
    .collection("users")
    .doc(uid);
  await ref.set({
    payout: admin.firestore.FieldValue.increment(inr),
    balance: admin.firestore.FieldValue.increment(-1*inr)
  },{merge:true});
  res.send("OK")
});

// router.post("/getPayouts", checkIfAuthenticated, async (req, res) => {
//   const {name,email,uid} = req.user;
//   const ref = admin.firestore()
//     .collection("payouts")
//     .doc(uid);
//   const requestedDoc = await ref.get();
//   if(!requestedDoc.exists){
//     res.send(JSON.stringify({payouts:[]}));
//     return;
//   }
//   const payoutHistory = requestedDoc.data();
//   console.log('now we have',payoutHistory)
//   res.send(JSON.stringify(payoutHistory));
// });

router.post("/registerUser", checkIfAuthenticated, async (req, res) => {
  const {name,email,uid} = req.user;
  const ref = admin.firestore()
    .collection("users")
    .doc(uid);
  const requestedDoc = await ref.get();
  if(!requestedDoc.exists){
    //First time user
    res.send(JSON.stringify({payouts:[]}));
    return;
  }
  const payoutHistory = requestedDoc.data();
  console.log('now we have',payoutHistory)
  res.send(JSON.stringify(payoutHistory));
});


router.get("/activate", async (req, res) => {
  res.end("Alright!");
});

router.get("/privacy", function(req, res) {
  res.render("privacy.ejs");
});

router.get("/terms", function(req, res) {
  res.render("tos.ejs");
});

router.get("/links", async (req, res) => {
res.render('links.ejs')
});

router.get("/dashboard", function(req, res) {
  res.render("dashboard.ejs");
});

router.get("/transactions", function(req, res) {
  res.render("transactions.ejs");
});

export default router;
