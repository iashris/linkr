
const mailjet = require ('node-mailjet')
.connect('1ea7153d9f23d59ba06fd223e2f20a15', 'a04c984af3162f5ba46abe48f53ac1f8')

const shootEmail = async (email,link) => {
    const request = await mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "hello@iashris.com",
            "Name": "Makersgully"
          },
          "To": [
            {
              "Email": email,
              "Name": email,
            }
          ],
          "Subject": "Reward link for you",
          "TextPart": "Reward link from Makersgully",
          "HTMLPart": `<p>Please find your link <a href="${link}">here</p>`,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
}
    

export default shootEmail;