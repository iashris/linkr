import checksum from "../../model/checksum";
import config from "../../config/config";
import express from "express";
const router = express.Router();

router.get("/", function(req, res) {
  res.render("testtxn.ejs", { config });
});

router.post("/", function(req, res) {
  console.log("POST Order start");
  var paramlist = req.body;
  var paramarray = new Array();
  console.log(paramlist);
  for (var name in paramlist) {
    if (name == "PAYTM_MERCHANT_KEY") {
      var PAYTM_MERCHANT_KEY = paramlist[name];
    } else {
      paramarray[name] = paramlist[name];
    }
  }
  console.log(paramarray);
  paramarray["CALLBACK_URL"] = `${config.app_url}/complete`; // in case if you want to send callback
  console.log(PAYTM_MERCHANT_KEY);
  checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, function(err, result) {
    console.log(result);
    // res.render("pgredirect.ejs", { restdata: result });
  });

  console.log("POST Order end");
});
//vidisha
export default router;
