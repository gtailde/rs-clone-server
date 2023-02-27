const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, default: "" },
  password: { type: String, required: true },
  roles: [{ type: String, ref: 'Role' }],
  email: { type: String, default: "" },
  img: {
    profile: [{
      imgs: {type: String},
      likes: {type: String, default: '0'},
      saved: {type: String, default: '0'}
    }],
    others: [{
      imgs: {type: String},
      likes: {type: String, default: '0'},
      saved: {type: String, default: '0'}
    }],
  }
});

module.exports = mongoose.model('User', User);