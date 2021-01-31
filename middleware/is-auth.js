const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token
  if (!token){
    const err = new Error('Not authenticated')
    err.statusCode = 401;
    throw err;
  }
  const decodedToken = jsonwebtoken.verify(token, 'brianandryansecret')
  if (!decodedToken){
    const err = new Error('Not authenticated')
    err.statusCode = 401;
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
}