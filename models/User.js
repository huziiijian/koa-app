const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// 生成users数据表模板，'users'指的是数据库储存的表名，UserSchema代表储存构造类型
module.exports = User = mongoose.model('users', UserSchema);
