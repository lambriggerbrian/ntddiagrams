var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var fs = require('fs');
const path = require('path');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
});

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                return callback(null, null);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};

var PostSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    chapter: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
});

var User = mongoose.model('User', UserSchema);
var Post = mongoose.model('Post', PostSchema);

Post.getPosts = function (callback) {
    Post.find()
        .exec(function (err, posts) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, posts);
            }
        });
};

Post.deletePost = function (id, callback) {
    Post.find({ id: id }, function (err, posts) {
        if (err) {
            return callback(err);
        } else {
            console.log(posts[0].filename);
            fs.unlink(path.join("public", "files", posts[0].filename), function (err) {
                if (err) {
                    return callback(err);
                } else {
                    Post.deleteOne({ id: id }, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            return callback();
                        }
                    });
                }
            });
        }
    });
}

module.exports = { 'User': User, 'Post': Post };
