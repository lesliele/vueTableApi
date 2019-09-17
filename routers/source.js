/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 20:39:13
 * @LastEditTime: 2019-09-17 20:39:13
 * @LastEditors: your name
 */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/*', function (req, res, next) {
    let initPath = path.join(__dirname, '../uploads');
    res.sendFile(initPath + req.url.replace("/uploads", '/'));
})
module.exports = router;