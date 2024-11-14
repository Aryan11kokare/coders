const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const userControllers = require("../controllers/user.js");

router.post("/signup", wrapAsync(userControllers.signup));

router.post("/signin", wrapAsync(userControllers.signin));

router.get("/logout", userControllers.logout);

router.get("/signup", userControllers.signupPage);

router.get("/login", userControllers.signinPage);

module.exports = router;
