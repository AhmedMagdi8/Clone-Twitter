const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.getLogin = (req, res, next) => {
  res.status(200).render("login");
};

exports.getLogout = (req, res, next) => {
    res.redirect("/login");
};
   
exports.postLogin = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    let user;

    if (username && password) {

    try {
       user = await User.findOne({
        $or: [{ username: username }, { email: username }],
      });
    } catch (err) {
        res.status(200).render("login", {
            errorMessage: "Something went wrong",
        });
    }

    if (user) {
        const pepper = process.env.PEPPER;

        const result = await bcrypt.compare(password + pepper, user.password);

        if (result) {
          req.session.user = user;
          return res.status(200).redirect("/");
        }
      }
    }
    res.status(200).render("login", {
        errorMessage: "Invalid credentials",
    });

  }


exports.getRegister = (req, res, next) => {
  res.status(200).render("register");
};

exports.postRegister = async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  const saltRounds = process.env.SALT_ROUNDS;
  const pepper = process.env.PEPPER;

  const payload = req.body;
  payload.password = await bcrypt.hash(password + pepper, Number(saltRounds));

  if (firstName && lastName && email && password && username) {
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (!user) {
        User.create({ ...payload })
          .then((user) => {
            req.session.user = user;
            console.log("user Created successfully" + user);
            return res.redirect("/");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        res.status(200).render("register", {
          errorMessage: "Username or email already exists",
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("register", payload);
  }
};
