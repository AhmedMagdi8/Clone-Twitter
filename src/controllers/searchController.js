const Post = require('../models/postModel');
const User = require('../models/userModel');


exports.getSearch = (req, res, next) => {

    const payload = getPayload(req.session.user);
    res.status(200).render('searchPage', payload);
}

exports.getSelectedTab = (req, res, next) => {

    const payload = getPayload(req.session.user);
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render('searchPage', payload);
}


function getPayload(userLoggedIn) {
            return {
                pageTitle: "Search",
                userLoggedIn: userLoggedIn,
                userLoggedInClient: JSON.stringify(userLoggedIn),
            }
}