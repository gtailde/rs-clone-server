const User = require('./models/User');

async function checkEmail(email){
  const count = await User.countDocuments({ email: email });
  return count === 0;
};

module.exports = checkEmail;