const mongoose = require('mongoose');


const VideoSchema = new mongoose.Schema({
    owner:{
        type: Object,
        required:true
    },
    url:{
        type: String,
        required: true
    }
    
    
})

var Video = mongoose.model('Video', VideoSchema);


module.exports = Video;