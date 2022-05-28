const path = require('path');

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./database');

const middleware = require('./middleware');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Api Routes for posts
const postsApiRoutes = require('./routes/api/posts');
const usersApiRoutes = require('./routes/api/users');
const chatsRoutes = require('./routes/api/chats');
const apiMessagesRoutes = require('./routes/api/messages');
const { join } = require('path');


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
app.use("/api/posts/", postsApiRoutes);
app.use("/api/users/", usersApiRoutes);
app.use("/api/chats/", chatsRoutes);
app.use("/api/messages/", apiMessagesRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/uploads", uploadRoutes);
app.use("/search", searchRoutes);
app.use("/messages", messagesRoutes);
app.use("/notifications", notificationRoutes);

app.get('/', middleware.authMiddleware ,(req, res, next) => {
    
    const payload = {
        pageTitle:'Home',
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payload);    
})



let io = require("./socket").getIo();
connectDB()
.then(() => {

    const server = app.listen(port, () => {
        console.log('Server is Up and running');
        io = require("./socket").createSocket(server);
        io.on("connection", socket => {

            socket.on("setup", userData => {
                socket.join(userData._id);
                socket.emit("connected");
            });

            socket.on("join room", room => {
                socket.join(room);
            });

            socket.on("typing", room => {
                // any one in this room will get the typing notification
                socket.in(room).emit("typing");
            });

            socket.on("stop typing", room => {
                socket.in(room).emit("stop typing");
            });

            socket.on("new message", newMessage => {
                let chat = newMessage.chat;
                if(!chat.users) return console.log("chat.ussers not found");
                
                chat.users.forEach(user => {
                    if(user._id == newMessage.sender._id) return;
                    socket.in(user._id).emit("message received", newMessage);

                })


            });

        });
        
    });        

}).catch(e => {
    console.log("error connecting to the db");
});


    
