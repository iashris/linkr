import admin from '../config/firebase';
const getAuthToken = (req, res, next) => {
  if (
    (req.get('authorization') &&
    req.get('authorization').split(' ')[0] === 'Bearer') || 
    (req.query.t)
  ) {
    req.authToken = req.query.t || req.get('authorization').split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};


export const checkIfAuthenticated = (req, res, next) => {
 getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken);
      req.user = userInfo;
      return next();
    } catch (e) {
        console.log(e,'oh noo')
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
  });
};