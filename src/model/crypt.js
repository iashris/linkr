"use strict";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash
} from "crypto";
import { log, inspect } from "util";

//var config = require('./pg').paytmnew;
const iv = "@@@@&&&&####$$$$";
var crypt = {
  encrypt: (data, custom_key) => {
    var key = custom_key;
    var algo = "256";
    switch (key.length) {
      case 16:
        algo = "128";
        break;
      case 24:
        algo = "192";
        break;
      case 32:
        algo = "256";
        break;
    }
    console.log(key);
    var cipher = createCipheriv("AES-" + algo + "-CBC", key, iv);
    //var cipher = crypto.createCipher('aes256',key);
    var encrypted = cipher.update(data, "binary", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  },

  decrypt: (data, custom_key) => {
    var key = custom_key;
    var algo = "256";
    switch (key.length) {
      case 16:
        algo = "128";
        break;
      case 24:
        algo = "192";
        break;
      case 32:
        algo = "256";
        break;
    }
    var decipher = createDecipheriv("AES-" + algo + "-CBC", key, iv);
    var decrypted = decipher.update(data, "base64", "binary");
    try {
      decrypted += decipher.final("binary");
    } catch (e) {
      log(inspect(e));
    }
    return decrypted;
  },

  gen_salt: function(length, cb) {
    randomBytes((length * 3.0) / 4.0, function(err, buf) {
      var salt;
      if (!err) {
        salt = buf.toString("base64");
      }
      //salt=Math.floor(Math.random()*8999)+1000;
      cb(err, salt);
    });
  },

  /* one way md5 hash with salt */
  md5sum: function(salt, data) {
    return createHash("md5")
      .update(salt + data)
      .digest("hex");
  },
  sha256sum: function(salt, data) {
    return createHash("sha256")
      .update(data + salt)
      .digest("hex");
  }
};

export default crypt;

(function() {
  var i;

  function logsalt(err, salt) {
    if (!err) {
      console.log("salt is " + salt);
    }
  }

  if (require.main === module) {
    var enc = crypt.encrypt("One97");
    console.log("encrypted - " + enc);
    console.log("decrypted - " + crypt.decrypt(enc));

    for (i = 0; i < 5; i++) {
      crypt.gen_salt(4, logsalt);
    }
  }
})();
