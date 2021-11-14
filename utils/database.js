const mongoose = require('mongoose');

const mongoDB = process.env.MONGOURI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to db '))
    .catch((err) => console.error(err))
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

module.exports = db