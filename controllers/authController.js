exports.getLogin = (req, res, next) => {
    
}


exports.postLogin = (req, res, next) => {
    
}


exports.getRegister = (req, res, next) => {
    res.status(200).render("register");   
}


exports.postRegister = (req, res, next) => {

    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let username = req.body.username.trim();
    let email = req.body.email.trim();
    let password = req.body.password;

    let payload = req.body;

    if(firstName && lastName && email && password && username) {
        
    } else {
        payload.errorMessage = "Make sure each field has a valid value."
        res.status(200).render("register",payload);
    }
    res.status(200).render("register");    
}




