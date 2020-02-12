
const mailjet = require ('node-mailjet')
.connect('1ea7153d9f23d59ba06fd223e2f20a15', 'a04c984af3162f5ba46abe48f53ac1f8')

export const rewardLink = async (email,link) => {
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
export const payoutMade = async (email,inr) => {
  console.log('Sending ',inr, email)
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
          "Subject": `Payout Received for ₹ ${inr}`,
          "TextPart": "Payout Received from Makersgully",
          "HTMLPart": `₹ ${inr} has been credited through your selected payout method. If it hasn't been reflected within 24 hours of this email, kindly get back to us.`,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
}
    