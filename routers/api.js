/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 22:15:30
 * @LastEditTime: 2019-09-17 20:38:32
 * @LastEditors: Please set LastEditors
 */
var Config = require('../config');
var express = require('express');
var Users = require("../models/userModel");
var app = express();
var router = express.Router();
var multer  = require('multer');
var upload = multer({
    dest: Config.userImgDestination
});
var responseData = {};
var uploadFolder = Config.userImgDestination;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        let formatter = (file.originalname).split('.');
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now() + '.' +formatter[formatter.length - 1]);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
    storage: storage
});
router.post('/profile', upload.single('avatar'), function (req, res, next) {
    let file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    let domain = Config.domain;
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    handleResponse(1, domain + (file.path).replace(/\\/, "/"))
    res.json(responseData);
});
router.get('/user', function(req, res, next) {
    res.set("Content-Type", "application/json;charset=utf-8");
    let sortFiled = req.query.sort.split('|');
    let pageIndex = Number(req.query.pageIndex);
    let pageSize = Number(req.query.pageSize);
    let skipNum = (pageIndex - 1) * pageSize;
    let sortKey = sortFiled[0];
    let sortWay = sortFiled[1];
    let filter = (req.query.filter && String(req.query.filter)) || '';
    let querySearch = filter ? Users.find({
        $or: [{
                line1: new RegExp(filter, 'gmi')
            },
            {
                mobile: new RegExp(filter, 'gmi')
            },
            {
                email: new RegExp(filter, 'gmi')
            },
            {
                name: new RegExp(filter, 'gmi')
            }
        ]
    }): Users.find();
    querySearch.sort({
            [sortKey]: sortWay
        }).limit(pageSize).skip(skipNum).exec(function (err, adventure) {
        if (err) {
            handleResponse(0, '系统错误');
        } else {
            handleResponse(1, adventure);
            let rs = {};
            let formatData = adventure.map(item => {
                return Object.assign({}, {
                    age: item.age,
                    birthDate: item.birthDate,
                    email: item.email,
                    address: {
                        fax: item.fax,
                        line1: item.line1,
                        mobile: item.mobile
                    },
                    gender: item.gender,
                    isAdmin: item.isAdmin,
                    name: item.name,
                    userImg: item.userImg
                });
            });
            Users.countDocuments().exec(function (err, number) {
                if (err) {
                    handleResponse(0, '系统错误');
                } else {
                    rs = {
                        data: formatData,
                        total: number
                    }
                    res.json(rs);
                }
            });
        }
    })
});
router.post('/saveUserData', function(req, res, next) {
    let formData = req.body.data;
    let {
        age,
        fax,
        line1,
        mobile,
        birthDate,
        email,
        gender,
        name,
        isAdmin,
        userImg
    } = formData;
    Users.findOne({
        $or: [
            {
                mobile: mobile
            },
            {
                email: email
            },
            {
                name: name
            }
        ]
    }).exec(function (err, adventure) {
        if (err) {
            handleResponse(0, '系统错误');
        } else {
            if (adventure) {
                handleResponse(0, '已存在该用户，不得再次添加');
            } else {
                new Users({
                    userImg: userImg,
                    age: age,
                    fax: fax,
                    line1: line1,
                    mobile: mobile,
                    birthDate: birthDate,
                    email: email,
                    gender: gender,
                    name: name,
                    isAdmin: isAdmin
                }).save();
                handleResponse(1, '保存成功');
            }
        }
        res.json(responseData);
    });
});
function handleResponse(code, data) {
    responseData = {
        code: code,
        data: data,
        msg: code == 1 ? 'succ' : 'fail'
    }
}
module.exports = router;