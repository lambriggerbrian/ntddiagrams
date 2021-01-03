'use strict';
var express = require('express');

// AWS Setup
var aws = require('aws-sdk');
const s3 = new aws.S3();
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-west-1';

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Homepage.');
});

/* GET image */
router.get('/get-s3', function (req, res, next) {
    const fileName = req.query['name'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName
    };
    s3.getObject(s3Params, function (err, data) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            res.writeHead(200, { 'Content-Type': data.ContentType });
            res.write(data.Body, 'binary');
            res.end(null, 'binary');
        }
    });
});

module.exports = router;