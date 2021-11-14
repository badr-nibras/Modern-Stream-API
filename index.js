'use strict';
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const createError = require("http-errors")
const config = require('./config');
const passport = require('passport');
const cookieSession = require("cookie-session");

// Local environment configurations
dotenv.config();

require("./utils/database")

const app = express();


app.use(express.json());
app.use(cors({ 
  origin: process.env.UI_URL, 
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true 
}));
//app.use(express.static(__dirname + '/public'));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);



app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/auth');
app.use('/api/authentication', authRouter);

const userRouter = require("./routes/user");
app.use("/api/user", userRouter);

const Streaming = require('./routes/streaming');
app.use('/api/streaming', Streaming.routes);

const Tournement = require('./routes/tournement');
app.use('/api/tournement', Tournement);

const Games = require('./routes/games');
app.use('/api/games', Games);

const Events = require('./routes/events');
app.use('/api/events', Events);

// Error handling (Always comes after all valid routes)
app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`App is listening on port: ${port}`))


