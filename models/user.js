const mongoose = require('mongoose');


// To review: (Rotoo) removed required option from some fields because they are not present in other signin methods
const UserSchema = new mongoose.Schema({
  provider: {
    type: String
  },
  uid: {
    type: String
  },
  name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  bio: {
    type: String
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  paypal: {
    type: String
  },
  password: {
    type: String
  },
  photoUrl: {
    type: String
  },
  coverUrl:{
    type: String
  },
  streamKey: {
    type: String
  },
  channelArn:{
    type: []
  },
  followers: {
    type: []
  },
  followings: {
    type: []
  },
  date: {
    type: Date,
    default: Date.now
  }

})

var User = mongoose.model('User', UserSchema);


module.exports = User;