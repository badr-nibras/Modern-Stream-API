const AWS = require("@aws-sdk/client-ivs");
const createError = require('http-errors')
const Stream = require('../models/streaming')
const User = require('../models/user')
const Video = require('../models/vod')
var ObjectId = require('mongodb').ObjectId
const db = require("../utils/database")

const VOD = db.collection("videos")

const createChannel = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.createChannel(req.body, async function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const publishStream = async (req, res, next) => {
    try {
        if (req.body.title === "") {
            res.send(createError.InternalServerError("You need to enter a title"))
        } else {
            const newStream = new Stream({
                title: req.body.title,
                description: req.body.description,
                url: req.body.playbackUrl,
                miniature: req.file.location,
                streamer: req.body.streamer,
                channelArn: req.body.channelArn,
                streamerId: req.body.streamerId,
                socketId: req.body.socketId,
                streamedWith: req.body.streamedWith,
            })
            await newStream.save((err, response) => {
                if (err) {
                    res.send(createError.InternalServerError(err))
                } else {
                    res.send("Stream published succussfuly");           // successful response
                }
            })
        }
    } catch (error) {
        res.send(createError.InternalServerError("You need to upload the miniature"))
    }

}
const deleteStream = async (req, res, next) => {

    try {
        const item = {
            socketId: req.body.socketId
        }
        const video = {
            url: req.body.videoUrl,
            streamInfo: {},
            channelArn: ''
        }


        if (req.body.socketId.length > 1) {
            video.streamInfo = await Stream.findOne(item);
            await VOD.insertOne(video);
            console.log(await Stream.deleteOne(item));

        }

    } catch (error) {
        console.log(error)
        return next(createError.InternalServerError())
    }
}
//////////////////////// SOS
const getChat = async (req, res, next) => {


    try {

        var response = '';
        var result;
        if (req.body.isLive === "true")
            result = await Stream.findOne({ socketId: req.body.id });
        else {
            var uid = req.body.id;
            var u_id = new ObjectId(uid);
            var video = await Video.findOne({ _id: u_id })
            video = video.toObject()
            result = video.streamInfo;
        }

        const messagesArray = await Promise.all(result.chat.map(async (msg) => {
            const user = await User.findOne({ "username": msg.sender })
            return "<div className='message'><p>@" + user.username + ": <span>" + msg.message + "</span></p></div>"
        }))
        messagesArray.forEach((msg) => response += msg)
        res.send(response);


    } catch (error) {
        console.log("error");
        return next(createError.InternalServerError())
    }

}

const getChannel = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.getChannel(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const deleteChannel = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.deleteChannel(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const getChannels = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.listChannels(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

//Gets information about the active (live) stream on a specified channel.
const getStream = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.getStream(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}
const getStreamByArn = async (req, res) => {
    try {
        var uArn = req.body.arn;
        var stream = await Stream.find({ channelArn: uArn }).sort({ date: -1 })
        res.send(stream)
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const stopStream = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.stopStream(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

//Gets summary information about live streams in your account, in the AWS region where the API request is processed.
const getStreams = async (req, res, next) => {
    try {
        var streams = await Stream.find().sort({ date: -1 })
        res.send(streams)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
    /*try {
        const ivs = new AWS.Ivs();
        ivs.listStreams(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
       res.send(createError.InternalServerError(error))
    }*/
}
const getStreamByUser = async (req, res, next) => {
    try {
        var uid = req.params.id;
        var u_id = new ObjectId(uid);
        var streams = await Stream.find({ streamerId: u_id }).sort({ date: -1 })
        res.send(streams)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }

}

const getVideoById = async (req, res, next) => {
    try {
        var uid = req.params.id;
        var u_id = new ObjectId(uid);
        var video = await Video.find({ _id: u_id })
        res.send(video)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }

}

const getStreamById = async (req, res, next) => {
    try {
        var uid = req.params.id;
        var u_id = new ObjectId(uid);
        var video = await Stream.find({ _id: u_id })
        res.send(video)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }

}

const createRecording = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.createRecordingConfiguration(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const getRecording = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.getRecordingConfiguration(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}


const deleteRecording = async (req, res, next) => {
    try {
        const ivs = new AWS.Ivs();
        ivs.deleteRecordingConfiguration(req.body, function (err, data) {
            if (err) res.send(createError.InternalServerError(err)); // an error occurred
            else {
                res.send(data);           // successful response
            }
        });
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

// Video On demande

const getVideos = async (req, res) => {
    try {
        var vod = await Video.find().sort({ date: -1 })
        res.send(vod)
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

const getVideosByArn = async (req, res) => {
    try {
        var uArn = req.body.arn;
        var vods = await Video.find({ channelArn: uArn })
        res.send(vods)
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

module.exports = {
    createChannel,
    publishStream,
    deleteStream,
    getChat,
    getChannel,
    deleteChannel,
    getChannels,
    getStream,
    getStreamByArn,
    getStreams,
    getStreamByUser,
    getVideoById,
    getStreamById,
    stopStream,
    createRecording,
    getRecording,
    deleteRecording,
    getVideos,
    getVideosByArn
}
