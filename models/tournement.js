const mongoose = require('mongoose');


const TournementSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    type:{
        type: String,
    },
    players:{
        type: String,
    },
    team:{
        type: String,
    },
    miniature:{
        type: String,
    },
    rounds:{
        type: []
    },
    winner:{
        type: String,
    },
    round1Participents:{
        type: []
    },
    round2Participents:{
        type: []
    },
    round3Participents:{
        type: []
    },
    round4Participents:{
        type: []
    },
    round5Participents:{
        type: []
    },
    game:{
        type: String,
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

var Tournement = mongoose.model('Tournement', TournementSchema);


module.exports = Tournement;