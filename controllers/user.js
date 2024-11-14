const { z } = require("zod");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middelware.js");
const jwt_userSecret = "coderUsers";

module.exports.signup = async (req, res, next) => {
  const validation = z.object({
    username: z.string().min(3),
    email: z.string().email().min(4),
    password: z.string().min(4),
  });

  const validateData = validation.safeParse(req.body);
  if (validateData.error) {
    req.flash("error", validateData.error.issues[0].message);
    res.redirect("/signup");
    return;
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 8);

  const foundUser = await User.findOne({ username: username });
  if (foundUser) {
    req.flash("error", "User is already created");
    res.redirect("/signup");
    return;
  }

  const newUser = new User({
    username: username,
    email: email,
    password: hashPassword,
  });

  await newUser.save();
  res.redirect("/login");
};

module.exports.signin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    req.flash("error", "user of this email are not found please signup");
    res.redirect("/login");
    return;
  }

  const pass = await bcrypt.compare(password, foundUser.password);
  if (pass) {
    const token = jwt.sign(
      {
        id: foundUser._id,
      },
      jwt_userSecret
    );
    res.cookie("access_token", token, { httpOnly: true }).redirect("/");
  } else {
    req.flash("error", "wrong password");
    res.redirect("/login");
    return;
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("access_token").redirect("/");
};

module.exports.signupPage = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signinPage = (req, res) => {
  res.render("user/login.ejs");
};
