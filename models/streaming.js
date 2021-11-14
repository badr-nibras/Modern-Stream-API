const mongoose = require('mongoose');


const StreamSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    streamer: {
        type: String,
        required: true
    },
    streamerId: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
    },
    miniature: {
        type: String,
    },
    streamedWith:{
        type: String,
    },
    channelArn: {
        type: String,
    },
    chat:{
        type: Array
    },
    date: {
        type: Date,
        default: Date.now
    }

})

var Stream = mongoose.model('Stream', StreamSchema);


module.exports = Stream;