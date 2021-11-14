const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    players:{
        type: Number,
        required:false,
        default: 0
    },
    image:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;