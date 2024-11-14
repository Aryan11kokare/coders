const Admin = require("./models/admin.js");
const Course = require("./models/course.js");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const jwt_adminSecret = process.env.ADMIN_SECRETE;
const jwt_userSecret = process.env.USER_SECRETE;

module.exports.allCheckAuth = async (req, res, next) => {
  if (req.cookies) {
    const token = req.cookies.access_token;
    if (token) {
      const verifyed = jwt.verify(token, jwt_userSecret);
      const foundUser = await User.findById(verifyed.id);
      req.user = foundUser;
    }
  }
  res.locals.currUser = req.user;
  next();
};

module.exports.allCheckAuth2 = async (req, res, next) => {
  if (req.cookies) {
    const token = req.cookies.admin_token;
    if (token) {
      const verifyed = jwt.verify(token, jwt_adminSecret);
      const foundUser = await Admin.findById(verifyed.id);
      req.admin = foundUser;
    }
  }
  res.locals.currAdmin = req.admin;
  next();
};

module.exports.adminAuth = async (req, res, next) => {
  if (!req.cookies.admin_token) {
    req.flash("error", "only admins can create the course !");
    return res.redirect(`/create`);
  }

  const token = req.cookies.admin_token;
  if (!token) {
    res.json("token not found");
    return;
  }

  const verifyed = jwt.verify(token, jwt_adminSecret);
  const foundUser = await Admin.findById(verifyed.id);

  if (foundUser) {
    req.user = foundUser;
    next();
  } else {
    res.json("wrong token");
  }
};

module.exports.userAuth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.json("token not found");
    return;
  }

  const verifyed = jwt.verify(token, jwt_userSecret);
  const foundUser = await User.findById(verifyed.id);

  if (foundUser) {
    req.user = foundUser;
    next();
  } else {
    res.json("wrong token");
  }
};

module.exports.isOwner = async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course.owner.equals(res.locals.currAdmin._id)) {
    req.flash("error", "you dont have to permission!");
    return res.redirect(`/details/${course._id}`);
  }
  next();
};
