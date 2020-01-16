

import express from "express";
const mailjet = require ('node-mailjet')
    .connect('1ea7153d9f23d59ba06fd223e2f20a15', 'a04c984af3162f5ba46abe48f53ac1f8')
const router = express.Router();
router.get("/", function(req, res) {
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "hello@iashris.com",
            "Name": "Ashris"
          },
          "To": [
            {
              "Email": "hello@iashris.com",
              "Name": "Ashris"
            }
          ],
          "Subject": "Greetings from Mailjet.",
          "TextPart": "My first Mailjet email",
          "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
    request
      .then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })
    
    
res.send("OK")    
});

export default router;