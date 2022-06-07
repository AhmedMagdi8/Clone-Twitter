const mongoose = require('mongoose');
require('dotenv').config();


async function connect() {
    const mongoUser = process.env.MONGODB_USER;
    const mongoPassword = process.env.MONGODB_PASSWORD;
    const mongoDB = process.env.MONGODB_DB;
    try {
        await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.eu6cp.mongodb.net/${mongoDB}?retryWrites=true&w=majority`)
        console.log("connected to database successfully");
    }
    catch(err) {
        console.log("error connecting to the db"+ err);
    };
}

module.exports = connect;