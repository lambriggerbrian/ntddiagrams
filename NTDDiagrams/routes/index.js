'use strict';
var express = require('express');
var fs = require('fs');
var dt = require('./route_modules/datetime.js');
var schema = require('../models/schema.js');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.username) {
        schema.Post.getPosts(function (err, posts) {
            for (var i in posts) { 
                //console.log(posts[i].path);
                if (!fs.existsSync(posts[i].path)) {
                    //posts[i].path = './images/900x800.png';
                }
            }
            res.render('index', { posts: posts });
        });
    } else {
        res.render('index', { posts: [] });
    }
});

/* GET date page. */
router.get('/date', function (req, res) {
    res.render('date', { date: dt.myDateTime().toString() });
});

/* GET login page */
router.get('/login', function (req, res) {
    res.render('login', {});
});

/* POST login page*/
router.post('/login', function (req, res) {
    schema.User.authenticate(req.body.username, req.body.password, function (e, user) {
        if (e) {
            var err = new Error('Wrong Email or Password');
            res.redirect('/login');
        } else if (!user) {
            res.render('login', { message: "Wrong Email or Password" });
        } else {
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.admin = user.admin;
            return res.redirect('/');
        }
    });
});

/* Get logout page */
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.destroy(function (e) {
            if (e) {
                return next(e);
            } else {
                return res.redirect('/');
            }
        });
    };
});

module.exports = router;
