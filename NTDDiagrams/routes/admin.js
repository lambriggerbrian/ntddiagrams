'use strict';
var express = require('express');
var fs = require('fs');
var upload = require('./upload');
var schema = require('../models/schema.js')

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('Homepage.');
});

/* GET create post form */
router.get('/post', function (req, res) {
    res.render('post');
});

/* POST create post form */
router.post('/post', function (req, res) {
        upload(req, res, (err) => {
            if (err) {
                console.log("No Post");
                console.log(err);
                res.redirect('/');
            } else {
                var record = {
                    name: req.body.name,
                    chapter: req.body.chapter,
                    filename: req.file.filename,
                    caption: req.body.caption,
                };
                schema.Post.create(record, function (e, post) {
                    if (e) {
                        return next(e);
                    } else {
                        return res.redirect('/');
                    }
                });
            }
        });
});

/* GET register page */
router.get('/register', function (req, res) {
    res.render('register', {});
});

/* POST register page */
router.post('/register', function (req, res) {
    if (req.body.email && req.body.username && (req.body.password === req.body.passwordConf)) {
        var record = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin,
        };
        schema.User.create(record, function (e, user) {
            if (e) {
                return next(e);
            } else {
                return res.redirect('/');
            }
        });
    } else {
        var response = {};
        if (req.body.password !== req.body.confirmPassword) { response.passwordError = ' Passwords must match' };
        res.render('register', response);
    }
})

/* GET db page */
router.get('/db', function (req, res) {
    req.db.collection('usercollection', function (e, collection) {
        collection.find().toArray(function (e, records) {
            res.render('db', { 'userlist': records });
        });
    });
});

/* GET delete page */
router.get('/delete', function (req, res) {
    schema.Post.deletePost(req.query.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
