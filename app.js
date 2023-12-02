require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const session = require('express-session');



const mainRoutes = require('./routes/main')
const adminRoutes = require('./routes/admin');


const app = express();


// statically serving public folder using express
app.use(express.static('public'));

//parse the data from forms using middleware with express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//for creating cookie for user login and logout using session
app.use(cookieParser());

app.use(methodOverride("_method"))

//session for user using mongoStore

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))

// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main'); // default layout fro all ejs files
app.set('view engine', 'ejs');


//routes
app.use(mainRoutes)
app.use(adminRoutes)




// connect mongo
const connecting = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Database connnected");

        app.listen(process.env.PORT || 3000);

    } catch (error) {
        console.log(error);

    }

}

connecting();