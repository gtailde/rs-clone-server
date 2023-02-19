const jwt = require('jsonwebtoken');
const { secret } = require("../config");


module.exports = function(req, res, next){
  if(req.method === 'OPTIONS'){
    next();
  }

  try{
    if(!req.headers.authorization){
      return res.json(false);
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
      return res.json(false);
    }
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;
    next();
  } catch(err) {
    console.log(err);
    return res.json(false);
  }
}