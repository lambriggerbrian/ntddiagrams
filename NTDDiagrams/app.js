﻿'use strict';
const debug = require('debug');
const express = require('express');
const session = require('express-session');
const connect = require('connect');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// MongoDB Setup
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
mongoose.connect("mongodb://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_URL+":"+process.env.DB_PORT+"/"+process.env.DB_NAME, function (e, client) {
    if (!e) {
        console.log("Mongoose connected");
    }
});
var db = mongoose.connection;

var routes = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
}));

app.use(function (req, res, next) {
    res.locals = {
        username: req.session.username,
        admin: req.session.admin,
    };
    return next();
});

app.use('/', routes);

app.use('/user', function (req, res, next) {
    if (req.session.username) {
        return next();
    } else {
        var err = new Error('Not Authorized');
        err.status = 401;
        return next(err);
    }
});

app.use('/user', user);

app.use('/admin', function (req, res, next) {
    if (req.session.username && req.session.admin) {
        return next();
    } else {
        var err = new Error('Not Authorized');
        err.status = 401;
        return next(err);
    }
}, admin);

app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
