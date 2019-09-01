import express from "express";
const router = express.Router();
import db from "../config/firebase";
import config from "../config/config";
import checksum from "../model/checksum";
const titleToId = title => {
  const id = title
    .toLowerCase()
    .replace(/\W/g, "-")
    .substring(0, 15);
  return id;
};

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4();
}
function getTimeStamp() {
  return Math.floor(new Date().getTime() / 1000);
}
router.get("/", function(req, res) {
  res.render("index.ejs", { app_url: config.app_url });
});

router.get("/r/:id", async (req, res) => {
  // TODO: Undo comment
  const { id } = req.params;
  const document = await db
    .collection("links")
    .doc(id)
    .get();
  if (!document.exists) {
    return res.end("Invalid Link");
  }
  const { price, title } = document.data();
  res.render("redeem.ejs", { price, title, id });

  //res.render("redeem.ejs", { price: 600, title: "Hello Ramanto Magazine", id: "bollywood" });
});

router.post("/r", async (req, res) => {
  console.log("Its starting");
  const { id } = req.body;
  const document = await db
    .collection("links")
    .doc(id)
    .get();
  if (!document.exists) {
    return res.end("Invalid Link");
  }
  const { price } = document.data();

  var paramObj = {
    ORDER_ID: id + "-IIP-" + guidGenerator() + guidGenerator(),
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

router.post("/", async (req, res) => {
  const { price, link, paytm, title } = req.body;
  const id = titleToId(title);
  const document = await db
    .collection("links")
    .doc(id)
    .get();
  const final_id = document.exists ? id + "-" + guidGenerator() : id;
  const ref = db.collection("links").doc(final_id);
  ref.set({ price, link, paytm, title, time: getTimeStamp(), user: "guest" });
  res.send(final_id);
});

export default router;
