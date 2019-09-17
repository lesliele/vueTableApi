/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 22:15:25
 * @LastEditTime: 2019-09-17 20:40:33
 * @LastEditors: Please set LastEditors
 */
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
// 对请求类型做出解析
app.use(express.json());
var urlencodeds = bodyParser.urlencoded({
    extended: false
});
// 挂载中间件
app.use(urlencodeds);
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
        /让options请求快速返回/
    } else {
        next();
    }
});
app.use('/uploads', require('./routers/source'));
app.use('/api', require('./routers/api'));
mongoose.connect('mongodb://localhost:27018/tableData', err => {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(9008);
    }
});