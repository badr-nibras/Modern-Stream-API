const Tournement = require('../models/tournement')
const createError = require('http-errors')
var ObjectId = require('mongodb').ObjectId
const _ = require('lodash');


exports.create = async (req, res, next) => {
    try {
        if (req.body.title === "") {
            res.send(createError.InternalServerError("You need to give a title for this tournement"))
        } else if (req.body.type === "") {
            res.send(createError.InternalServerError("You need to select a type"))
        } else if (req.body.players === "") {
            res.send(createError.InternalServerError("You need to select the number of players"))
        } else if (req.body.team === "") {
            res.send(createError.InternalServerError("you need to select the number of players per team"))
        } else if (req.body.game === "") {
            res.send(createError.InternalServerError("You need to select a game"))
        } else {
            var newTournement = new Tournement({
                title: req.body.title,
                type: req.body.type,
                players: req.body.players,
                team: req.body.team,
                game: req.body.game,
                miniature: req.file.location,
                creator: req.body.creator,
                winner: "",
                rounds: []
            })
            if (req.body.players == 32) {
                newTournement.rounds = [
                    { round: "Round of 32" },
                    { round: "Round of 16" },
                    { round: "Quarter-Finals" },
                    { round: "Semi-Finals" },
                    { round: "Final" }
                ]
            } else if (req.body.players == 16) {
                newTournement.rounds = [
                    { round: "Round of 16" },
                    { round: "Quarter-Finals" },
                    { round: "Semi-Finals" },
                    { round: "Final" }
                ]
            } else if (req.body.players == 8) {
                newTournement.rounds = [
                        { round: "Quarter-Finals" },
                        { round: "Semi-Finals" },
                        { round: "Final" }
                    ]
            } else if (req.body.players == 4) {
                newTournement.rounds = [
                        { round: "Semi-Finals" },
                        { round: "Final" }
                    ]
            }
            newTournement.save((err, response) => {
                if (err) {
                    res.send(createError.InternalServerError(err))
                } else {
                    res.send("Tournement created successfully.")

                }
            })
        }
    } catch (error) {
        res.send(createError.InternalServerError("you need to select a miniature for your tournement"))
    }
}

exports.getTournement = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    res.send(tournoi)
                }
            }
        })
    }
    catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }

}

exports.allTournements = async (req, res) => {
    try {
        var tournements = await Tournement.find().sort({ date: -1 })
        res.send(tournements)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.myTournements = async (req, res) => {
    try {
        var tournements = await Tournement.find({
            creator: req.body.creator
        }).sort({ date: -1 })
        res.send(tournements)
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.delete = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.find({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    Tournement.find({
                        _id: Tid,
                        creator: req.body.creator
                    }).exec((err1, tournement) => {
                        if (err1) {
                            res.send(createError.InternalServerError(err1))
                        }
                        if (tournement) {
                            if (_.isEmpty(tournement)) {
                                res.send("You are not the Owner of this Tournement")
                            } else {
                                Tournement.deleteOne({
                                    _id: Tid
                                }).then(
                                    res.send(tournement)
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

exports.joinRound1 = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players > tournoi.round1Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $addToSet: {
                                    round1Participents: {
                                        player: req.body.player,
                                        playerId: req.body.playerId
                                    }
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send("you joined this tournement, Be ready")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.joinRound2 = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players / 2 > tournoi.round2Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $addToSet: {
                                    round2Participents: {
                                        player: req.body.player,
                                        playerId: req.body.playerId
                                    }
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send(req.body.player + " passed to the next round")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.joinRound3 = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players / 4 > tournoi.round3Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $addToSet: {
                                    round3Participents: {
                                        player: req.body.player,
                                        playerId: req.body.playerId
                                    }
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send(req.body.player + " passed to the next round")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.joinRound4 = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players / 8 > tournoi.round4Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $addToSet: {
                                    round4Participents: {
                                        player: req.body.player,
                                        playerId: req.body.playerId
                                    }
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send(req.body.player + " passed to the next round")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.joinRound5 = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players / 16 > tournoi.round5Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $addToSet: {
                                    round5Participents: {
                                        player: req.body.player,
                                        playerId: req.body.playerId
                                    }
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send(req.body.player + " passed to the next round")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.winner = async (req, res) => {
    try {
        var Tid = req.params.Tid;
        var t_id = ObjectId(Tid);
        Tournement.findOne({
            _id: t_id
        }).exec((err, tournoi) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (tournoi) {
                if (_.isEmpty(tournoi)) {
                    res.send("tournement doen't exist")
                } else {
                    if (tournoi.players > tournoi.round1Participents.length) {
                        Tournement.updateOne(
                            {
                                _id: t_id
                            },
                            {
                                $set: {
                                    winner: req.body.winner
                                }
                            }
                        ).exec((error, tournement) => {
                            if (error) {
                                res.send(createError.InternalServerError(err))
                            }
                            if (tournement) {
                                res.send(req.body.winner + " won the tournement")

                            }
                        })
                    } else {
                        res.send("this tournement is full")
                    }
                }
            }
        })


    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}