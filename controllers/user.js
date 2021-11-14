const createError = require('http-errors')
const User = require("../models/user")
var ObjectId = require('mongodb').ObjectId
var nodemailer = require('nodemailer');
const { verifyPasswords, hashPassword } = require("../helpers/password");
const _ = require('lodash');



exports.refreshToken = async (req, res, next) => {
    try {
        var userIdValue
        const { refreshToken } = req.body
        if (!refreshToken) {
            next(createError.BadRequest("No refresh token was sent"))
            return
        }
        await verifyRefreshToken(refreshToken)
            .then((userId) => {
                userIdValue = userId
            })
            .catch((err) => {
                next(createError.Unauthorized(err))
            })
        if (userIdValue) {
            const accessToken = await signAccessToken(userIdValue)
            const refToken = await signRefreshToken(userIdValue)
            res.send({ accessToken: accessToken, refreshToken: refToken })
        }
    } catch (error) {
        next(createError.InternalServerError(error))
    }
}

exports.users = async (req, res, next) => {
    try {
        var users = await User.find()
        return res.send(users)
    } catch (error) {
        next(error)
    }
}

exports.addChannelArn = async (req, res,next) => {
    try {
        var id = req.params.id;
        await User.updateOne(
            {
                uid: id
            },
            {
                $addToSet: {
                    channelArn: req.body.channelArn
                }
            }

        )
        next("channel ARN added successfully")
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user_id = req.params.userId;
        if (req.payload.userId === user_id) {
            var user = req.body
            await User.updateOne({ 
                uid: user_id
            }, 
            { 
                $set: { 
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio,
                    facebook: user.facebook,
                    instagram :user.instagram,
                    paypal: user.paypal

                } 
            })
            return res.send("Updated")
        } else {
            return next(createHttpError.Unauthorized())
        }
    } catch (error) {
        console.log(error)
        return next(createError.InternalServerError())
    }
}

exports.info = async (req, res, next) => {
    try {
        var id = req.params.userId
        var user = await User.find(
            { uid: id }
        )
        return res.send(user)
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.uploadProfilePic = async (req, res) => {
    try {
        var id = req.body.id;
        await User.updateOne(
            {
                uid: id
            },
            {
                $set: {
                    photoUrl: req.file.location
                }
            }

        )
        res.send("Image Uploaded successfully")
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.uploadCoverPic = async (req, res) => {
    try {
        var id = req.body.id;
        await User.updateOne(
            {
                uid: id
            },
            {
                $set: {
                    coverUrl: req.file.location
                }
            }

        )
        next("Image Uploaded successfully")
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.putStreamKey = async (req, res) => {
    try {
        var id = req.body.id;
        await User.updateOne(
            {
                uid: id
            },
            {
                $set: {
                    streamKey: req.body.streamKey
                }
            }

        )
        res.send("streamKey added successfully")
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        User.findOne({
            email: req.body.email
        }).exec(async (err, user) => {
            if (err) {
                next(createError.InternalServerError(err));
            }
            else
                if (user) {
                    var seq = Math.floor(1000 + Math.random() * 9000);
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, 
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
                    var mailOptions = {
                        from: process.env.EMAIL,
                        to: req.body.email,
                        subject: 'Verification Code',
                        text: 'your Verification code is :' + seq.toString()
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.send(createError.InternalServerError(error));
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.send({ 'code': seq });
                        }
                    });
                }
                else {
                    next(createError.Unauthorized("User does not exist !!"))
                }
        }
        );
    } catch (error) {
        next(createError.InternalServerError(err));
    }

}

exports.changePass = async (req, res) => {
    try {
      User.findOne({
        uid: req.body.id
      }).exec(async (err, user) => {
        if (err) {
          res.send(createError.InternalServerError(err))
        }
        if (!user) {
          res.send("You dont have an account yet")
        } else {
          var passwordIsValid = req.body.password === req.body.confirmPass
          if (!passwordIsValid) {
            res.send("passwords didn't match")
          } else {
            const hashedPass = await hashPassword(req.body.password);
            await User.updateOne(
                {
                    uid: req.body.id
                },
                {
                    $set: {
                        password: hashedPass
                    }
                }
            )
            res.send("password changed")
          }
        }
      })
    } catch (error) {
      res.send(createError.InternalServerError(error))
    }
  }

  exports.changePassword = async (req, res) => {
    try {
      User.findOne({
        email: req.body.email
      }).exec(async (err, user) => {
        if (err) {
          res.send(createError.InternalServerError(err))
        }
        if (!user) {
          res.send("You dont have an account yet")
        } else {
          var passwordIsValid = req.body.password === req.body.confirmPass
          if (!passwordIsValid) {
            res.send("passwords didn't match")
          } else {
            const hashedPass = await hashPassword(req.body.password);
            await User.updateOne(
                {
                    email: req.body.email
                },
                {
                    $set: {
                        password: hashedPass
                    }
                }
            )
            res.send("password changed")
          }
        }
      })
    } catch (error) {
      res.send(createError.InternalServerError(error))
    }
  }

exports.follow = async (req, res) => {
    try {
        var id = req.params.userId;
        var cid = req.body.id;
        await User.updateOne(
            {
                uid: id
            },
            {
                $addToSet: {
                    followings: {
                        channel: req.body.username,
                        channelId: cid
                    }
                }
            }
        )
        await User.updateOne(
            {
                uid: cid
            },
            {
                $addToSet: {
                    followers: {
                        follower: req.body.myname,
                        followerId: id
                    }
                }
            }
        )
        res.send("You started following" + " " + req.body.username)
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.unfollow = async (req, res) => {
    try {
        var id = req.params.userId;
        var cid = req.body.channelId;
        await User.find(
            {
                uid: id
            }
        ).exec((err, follow) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (follow) {
                User.find(
                    {
                        followings: {
                            $elemMatch: {
                                channel: req.body.channel,
                                channelId: cid
                            }
                        }
                    }
                ).exec((err, follow) => {
                    if (err) {
                        res.send(createError.InternalServerError(err))
                    }
                    if (follow) {
                        if (_.isEmpty(follow)) {
                            next("You are not following this user")
                        } else {
                            User.updateOne(
                                {
                                    uid: cid
                                },
                                {
                                    $pull: {
                                        followers: {
                                            followerId: id
                                        }
                                    }
                                },
                                { multi: true }
                            ).exec((err, unfollow) => {
                                if (err) {
                                    next(createError.InternalServerError(err))
                                }
                            })
                            User.updateOne(
                                {
                                    uid: id
                                },
                                {
                                    $pull: {
                                        followings: {
                                            channelId: cid
                                        }
                                    }
                                },
                                { multi: true }
                            ).exec((err, unfollow) => {
                                if (err) {
                                    next(createError.InternalServerError(err))
                                }
                            })
                            res.send("You are no longer following" + " " + req.body.channel)
                        }
                    }
                })
            }
        }
        )
    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}

exports.checkFollowing = async (req, res) => {
    try {
        var id = req.params.userId;
        var cid = req.body.channelId;
        await User.find(
            {
                uid: id
            }
        ).exec((err, follow) => {
            if (err) {
                next(createError.InternalServerError(err))
            }
            if (follow) {
                if (_.isEmpty(follow)) {
                    res.send(false)
                } else {
                    User.find(
                        {
                            followings: {
                                $elemMatch: {
                                    channel: req.body.channel,
                                    channelId: cid
                                }
                            }
                        }
                    ).exec((err, follow) => {
                        if (err) {
                            next(createError.InternalServerError(err))
                        }
                        if (follow) {
                            if (_.isEmpty(follow)) {
                                res.send(false)
                            } else {
                                res.send(true)
                            }
                        }
                    })
                }
            }
        })

    } catch (error) {
        console.log(error)
        next(createError.InternalServerError(error))
    }
}