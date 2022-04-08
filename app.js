const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');


const middleware = require('./middleware');

const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

const app = express();
const port = process.env.PORT;
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoDB = process.env.MONGODB_DB;

app.set('view engine', 'pug');
app.set("views","views");
// extended means it can accept only key-value pairs of strings or arrays
// if it set to true it means that it accept any data type
app.use(express.urlencoded({ extended:false}));
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);


app.get('/', middleware.authMiddleware ,(req, res, next) => {
    
    const payload = {
        pageTitle:'Home',
    }
    res.status(200).render("home", payload);    
})



    mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.eu6cp.mongodb.net/${mongoDB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(port, () => {
            console.log('Server is Up and running');
        });
    })
    .catch(err => {
        console.log("error connecting to the db"+ err);
    });



