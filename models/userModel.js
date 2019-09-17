/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 22:15:25
 * @LastEditTime: 2019-09-11 22:15:25
 * @LastEditors: your name
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/user');
module.exports = mongoose.model('User', usersSchema);