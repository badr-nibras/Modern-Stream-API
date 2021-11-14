const Event = require('../models/event')
const createError = require('http-errors')
var ObjectId = require('mongodb').ObjectId
const _ = require('lodash');


exports.create = async (req, res, next) => {
    try {
            var newEvent = new Event({
                miniature: req.file.location,
                creator: req.body.creator
            })
            newEvent.save((err, response) => {
                if (err) {
                    res.send(createError.InternalServerError(err))
                } else {
                    res.send("Event published successfully.")

                }
            })
        
    } catch (error) {
        res.send(createError.InternalServerError("you need to select a miniature for your event"))
    }
}

exports.getEvent = async (req, res) => {
    try {
        var Eid = req.params.Eid;
        var E_id = ObjectId(Eid);
        Event.findOne({
            _id: E_id
        }).exec((err, event) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (event) {
                if (_.isEmpty(event)) {
                    res.send("event doen't exist")
                } else {
                    res.send(event)
                }
            }
        })
    }
    catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }

}

exports.allEvents = async (req, res) => {
    try {
        var events = await Event.find().sort({ date: -1 })
        res.send(events)
    } catch (error) {
        res.send(createError.InternalServerError(error))
    }
}

exports.myEvents = async (req, res) => {
    try {
        var events = await Event.find({
            creator: req.body.creator
        })
        res.send(events)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.delete = async (req, res) => {
    try {
        var Eid = req.params.Eid;
        var E_id = ObjectId(Eid);
        Event.find({
            _id: E_id
        }).exec((err, event) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (event) {
                if (_.isEmpty(event)) {
                    res.send(createError.InternalServerError("event doen't exist"))
                } else {
                    Event.find({
                        _id: E_id,
                        creator: req.body.creator
                    }).exec((err1, event) => {
                        if (err1) {
                            res.send(createError.InternalServerError(err1))
                        }
                        if (event) {
                            if (_.isEmpty(event)) {
                                res.send(createError.InternalServerError("You are not the Owner of this event"))
                            } else {
                                Event.deleteOne({
                                    _id: E_id
                                }).then(
                                    res.send("Event deleted successfully")
                                )
                            }
                        }
                    })
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}