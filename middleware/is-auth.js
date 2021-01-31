const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token
  if (!token){
    const err = new Error('Not authenticated')
    err.statusCode = 401;
    throw err;
  }
  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(token, 'brianandryansecret')
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