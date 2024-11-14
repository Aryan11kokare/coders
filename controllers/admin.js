const { z } = require("zod");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.js");
const jwt = require("jsonwebtoken");
const jwt_adminSecret = "codersAdmin";

module.exports.adminSignup = async (req, res, next) => {
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

  const foundUser = await Admin.findOne({ email: email });
  if (foundUser) {
    req.flash("error", "User already created !");
    res.redirect("/signup");
    return;
  }

  const newUser = new Admin({
    username: username,
    email: email,
    password: hashPassword,
  });

  await newUser.save();
  res.redirect("/login");
};

module.exports.adminSignin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const foundUser = await Admin.findOne({ email: email });
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
      jwt_adminSecret
    );
    res.cookie("admin_token", token, { httpOnly: true }).redirect("/");
  } else {
    req.flash("error", "wrong password");
    res.redirect("/login");
    return;
  }
};
module.exports.adminLogout = (req, res) => {
  res.clearCookie("admin_token").redirect("/");
};
