const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.cookies.token
  if (!authHeader){
    const err = new Error('Not authenticated')
    err.statusCode = 401;
    throw err;
  }
  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(authHeader, 'brianandryansecret')
    // console.log("decoded token", decodedToken)
  } catch(err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken){
    const err = new Error('Not authenticated')
    err.statusCode = 401;
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
}