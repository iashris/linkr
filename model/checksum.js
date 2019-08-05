"use strict";

import crypt from "./crypt";
import { log } from "util";
import { createHash } from "crypto";
const { gen_salt, encrypt, decrypt } = crypt;
//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
  var data = "";
  var tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach(function(key) {
    var n = params[key].includes("REFUND");
    var m = params[key].includes("|");
    if (n == true) {
      params[key] = "";
    }
    if (m == true) {
      params[key] = "";
    }
    if (key !== "CHECKSUMHASH") {
      if (params[key] === "null") params[key] = "";
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += params[key] + "|";
      }
    }
  });
  return data;
}

function genchecksum(params, key, cb) {
  var data = paramsToString(params);
  gen_salt(4, function(err, salt) {
    var sha256 = createHash("sha256")
      .update(data + salt)
      .digest("hex");
    var check_sum = sha256 + salt;
    var encrypted = encrypt(check_sum, key);
    params.CHECKSUMHASH = encrypted;
    cb(undefined, params);
  });
}
function genchecksumbystring(params, key, cb) {
  gen_salt(4, function(err, salt) {
    var sha256 = createHash("sha256")
      .update(params + "|" + salt)
      .digest("hex");
    var check_sum = sha256 + salt;
    var encrypted = encrypt(check_sum, key);

    var CHECKSUMHASH = encodeURIComponent(encrypted);
    CHECKSUMHASH = encrypted;
    cb(undefined, CHECKSUMHASH);
  });
}

function verifychecksum(params, key) {
  var data = paramsToString(params, false);
  //TODO: after PG fix on thier side remove below two lines
  if (params.CHECKSUMHASH) {
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace("\n", "");
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace("\r", "");

    var temp = decodeURIComponent(params.CHECKSUMHASH);
    var checksum = decrypt(temp, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = createHash("sha256")
      .update(data + salt)
      .digest("hex");
    if (hash === sha256) {
      return true;
    } else {
      log("checksum is wrong");
      return false;
    }
  } else {
    log("checksum not found");
    return false;
  }
}

function verifychecksumbystring(params, key, checksumhash) {
  var checksum = decrypt(checksumhash, key);
  var salt = checksum.substr(checksum.length - 4);
  var sha256 = checksum.substr(0, checksum.length - 4);
  var hash = createHash("sha256")
    .update(params + "|" + salt)
    .digest("hex");
  if (hash === sha256) {
    return true;
  } else {
    log("checksum is wrong");
    return false;
  }
}

function genchecksumforrefund(params, key, cb) {
  var data = paramsToStringrefund(params);
  gen_salt(4, function(err, salt) {
    var sha256 = createHash("sha256")
      .update(data + salt)
      .digest("hex");
    var check_sum = sha256 + salt;
    var encrypted = encrypt(check_sum, key);
    params.CHECKSUM = encodeURIComponent(encrypted);
    cb(undefined, params);
  });
}

function paramsToStringrefund(params, mandatoryflag) {
  var data = "";
  var tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach(function(key) {
    var m = params[key].includes("|");
    if (m == true) {
      params[key] = "";
    }
    if (key !== "CHECKSUMHASH") {
      if (params[key] === "null") params[key] = "";
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += params[key] + "|";
      }
    }
  });
  return data;
}
export default {
  genchecksum,
  verifychecksum,
  verifychecksumbystring,
  genchecksumbystring,
  genchecksumforrefund
};
