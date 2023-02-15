const mongoose = require('mongoose');

module.exports = async function checkEmail(email){
  const User = mongoose.model('User', { email: String });
  const count = await User.countDocuments({ email: email });
  return count === 0;
};

