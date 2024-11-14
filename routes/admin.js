const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/warpAsync.js");
const adminControllers = require("../controllers/admin.js");


router.post(
  "/signup",
  wrapAsync(adminControllers.adminSignup)
);

router.post(
  "/signin",
  wrapAsync(adminControllers.adminSignin)
);

router.get("/logout", adminControllers.adminLogout);

module.exports = router;
