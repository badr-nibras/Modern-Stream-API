const Game = require('../models/game')
const createError = require('http-errors')
var ObjectId = require('mongodb').ObjectId
const _ = require('lodash');

exports.upload = async (req, res, next) => {
    try {
        console.log(req.body);
        res.send("Uploaded")
    } catch (error) {
        res.status(400).send("Could not upload the image");
    }
}

exports.create = async (req, res, next) => {
    try {
        const newGame = new Game({
            title: req.body.title,
            image: req.file.location,
            description: req.body.description,
        });
        if(newGame.title == "") {
            res.send(createError.InternalServerError("Title is required !"));
        } else if(newGame.description == "") {
            res.send(createError.InternalServerError("Description is required !"));
        }
        newGame.save((err, response) => {
            if (err) {
                res.send(createError.InternalServerError(err));
            } else {
                res.send("Game created !");
            }
        })
    } catch (error) {
        res.send(createError.InternalServerError("Image is required"))
    }
}

exports.getGame = async (req, res) => {
    try {
        var id = req.params.id;
        var game_id = ObjectId(id);
        Game.findOne({
            _id: game_id
        }).exec((err, game) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            }
            if (game) {
                if (_.isEmpty(game)) {
                    res.send("Game doesn't exist")
                } else {
                    res.send(game)
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.allGames = async (req, res) => {
    try {
        var Games = await Game.find();
        res.send(Games);
    } catch (error) {
        console.log(error);
        res.send(createError.InternalServerError(error));
    }
}

exports.deleteGame = async (req, res) => {
    try {
        var id = req.params.id;
        var game_id = ObjectId(id);
        Game.find({
            _id: game_id
        }).exec((err, game) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            } else {
                if (_.isEmpty(game)) {
                    res.send("Game doesn't exist")
                } else {
                    Game.deleteOne({
                        _id: game_id
                    }).then(
                        res.send(game)
                    )
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}

exports.updateGame = async (req, res) => {
    try {
        var id = req.params.id;
        var game_id = ObjectId(id);
        Game.findByIdAndUpdate({
            _id: game_id
        }, {
            title: req.body.title,
            description: req.body.description,
        }).then((err, game) => {
            if (err) {
                res.send(createError.InternalServerError(err))
            } else {
                res.send(game)
            }
        })
    } catch (error) {
        console.log(error)
        res.send(createError.InternalServerError(error))
    }
}