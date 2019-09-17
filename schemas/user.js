/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 22:15:30
 * @LastEditTime: 2019-09-11 22:15:30
 * @LastEditors: your name
 */
var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userImg: String,
    age: Number,
    fax: String,
    line1: String,
    mobile: String,
    birthDate: Date,
    email: String,
    gender: String,
    name: String,
    isAdmin: Boolean
});