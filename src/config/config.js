const env = "prod"; // or 'prod'
const config = {
  merchant_id: {
    test: "UfyFNY83625002043673",
    prod: "LQueuN49311857341333"
  },
  merchant_key: {
    test: "998zXGxp0Zdw2_Or",
    prod: "&1OQPC5iERW6b5IU"
  },
  paytm_url: {
    test: "https://securegw-stage.paytm.in/order/process",
    prod: "https://securegw.paytm.in/order/process"
  },
  hostname: {
    test: "securegw-stage.paytm.in",
    prod: "securegw.paytm.in"
  }
};
const merchant_id = config.merchant_id[env];
const merchant_key = config.merchant_key[env];
const paytm_url = config.paytm_url[env];
const hostname = config.hostname[env];
const app_url = process.env.APP_URL || "http://localhost:3000";
const website = "DEFAULT";
const industry = "Retail";

module.exports = {
  merchant_id,
  merchant_key,
  paytm_url,
  website,
  industry,
  hostname,
  app_url
};
