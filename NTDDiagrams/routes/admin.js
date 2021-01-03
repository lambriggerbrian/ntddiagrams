'use strict';
var express = require('express');
var fs = require('fs');
var upload = require('./upload');
var schema = require('../models/schema.js')

// AWS Setup
var aws = require('aws-sdk');
const s3 = new aws.S3();
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-west-1';

var router = express.Router();

/* GET create post form */
router.get('/post', function (req, res, next) {
    res.render('post');
});

/* POST create post form */
router.post('/post', function (req, res, next) {
    if (process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        upload.none()(req, res, (err) => {
            var record = {
                name: req.body.name,
                chapter: req.body.chapter,
                filename: req.body.filename,
                caption: req.body.caption,
            };
            schema.Post.create(record, function (e, post) {
                if (e) {
                    return next(e);
                } else {
                    return res.redirect('/');
                }
            });
        })
    } else {
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.log("No Post");
                console.log(err);
                res.redirect('/');
            } else {
                var record = {
                    name: req.body.name,
                    filename: req.file.filename,
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
    } 
});

/* GET register page */
router.get('/register', function (req, res, next) {
    res.render('register', {});
});

/* POST register page */
router.post('/register', function (req, res, next) {
    if (req.body.username && (req.body.password === req.body.passwordConf)) {
        var record = {
            username: req.body.username,
            password: req.body.password,
            admin: (req.body.admin != null)
        };
        schema.User.create(record, function (e, user) {
            if (e) {
                console.log(e);
                return res.redirect('/');
            } else {
                return res.redirect('/');
            }
        });
    } else {
        var response = {};
        if (req.body.password !== req.body.confirmPassword) { response.passwordError = ' Passwords must match' };
        res.render('/admin/register', response);
    }
})

/* GET db page */
router.get('/db', function (req, res, next) {
    req.db.collection('usercollection', function (e, collection) {
        collection.find().toArray(function (e, records) {
            res.render('db', { 'userlist': records });
        });
    });
});

/* GET delete page */
router.get('/delete', function (req, res, next) {
    schema.Post.findByIdAndRemove(req.query.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});

/* GET signed s3 request */
router.get('/sign-s3', (req, res, next) => {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'private'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        } else {
            const returnData = {
                signedRequest: data,
                url: 'https://+'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
            };
            res.write(JSON.stringify(returnData));
            res.end();
        }
    });
});


module.exports = router;
