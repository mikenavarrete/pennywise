//for api
const path = require('path');
//brining in package for .dotevn file/session
require('dotenv').config();
//package for using express
const express = require('express')
//brining in package for handlebars
const exphbs = require('express-handlebars');
//package for using express sessions
const sessions = require('express-session')
//brought in helpers
const dateHelpers = require('./utils/auth');


//grabbing the routes from the homeRoute folder
const routes = require('./controllers')

//package for sequelize
const SequelizeStore = require('connect-session-sequelize')(sessions.Store)
//added sequelize package, which will grab data from the config folder, connection.js
const sequelize = require('./config/connection')

//middleware for express
const app = express()
//port
const PORT = process.env.PORT || 3001;

//custom helper for time and date for handlebar
const hbs = exphbs.create({
    helpers: dateHelpers,
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));


//middlewares for express to use on every request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//we are setting up a session that uses sequelize 
const sess = {
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

///added session middleware to make sure user is logged in before
app.use(sessions(sess));
app.use(routes)

// turn on connections and start server with provided port
sequelize.sync({ force: false }).then(() =>
    app.listen(PORT, () => console.log(`Listening on ${PORT}`)))