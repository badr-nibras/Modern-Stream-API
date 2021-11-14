const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
    miniature:{
        type: String,
        required: true
    },
    creator:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
    
})

var Event = mongoose.model('Event', EventSchema);


module.exports = Event;