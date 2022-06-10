const Post = require('../models/postModel');
const User = require('../models/userModel');


exports.getProfile = (req, res, next) => {

    
    const payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }
    res.status(200).render('profilePage', payload);
}




exports.getProfileUsername = async (req, res, next) => {

    const payload = await getPayload(req.params.username, req.session.user);

    res.status(200).render("profilePage", payload);

}

exports.getProfileReplies = async (req, res, next) => {
    const payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "replies";
    res.status(200).render("profilePage", payload);

}

exports.getFollowers = async (req, res, next) => {
    const payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "followers";
    res.status(200).render("followers", payload);

}


exports.getFollowing = async (req, res, next) => {
    const payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "following";
    res.status(200).render("followers", payload);

}


async function getPayload(username, userLoggedIn) {

    let user = await User.findOne({username: username });

    if(!user) {
        user = await User.findById({username});
        if(!user) {
            return {
                pageTitle: "User not found!",
                userLoggedIn: userLoggedIn,
                userLoggedInClient: JSON.stringify(userLoggedIn),
            }
        }
    }
    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInClient: JSON.stringify(userLoggedIn),
        profileUser: user
    }

}
