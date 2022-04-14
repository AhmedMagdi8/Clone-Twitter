const path = require('path');

require('dotenv').config();
const express = require('express');
const session = require('express-session');

const connectDB = require('./database');
const middleware = require('./middleware');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logoutRoutes');


const app = express();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set("views","views");
// extended means it can accept only key-value pairs of strings or arrays
// if it set to true it means that it accept any data type
app.use(express.urlencoded({ extended:false}));
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:true, // forces the session to be saved back to the storage even it's modified
    saveUninitialized: false // forces the session to not be saved as initialized when it don't set we don't want to save anything
}))
// Routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/logout", logoutRoutes);


app.get('/', middleware.authMiddleware ,(req, res, next) => {
    
    const payload = {
        pageTitle:'Home',
        userLoggedIn: req.session.user
    }
    res.status(200).render("home", payload);    
})



    connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log('Server is Up and running');
        });
    }).catch(e => {
        console.log("error connecting to the db");
    });


