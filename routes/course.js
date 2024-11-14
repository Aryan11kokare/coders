const express = require("express");
const router = express.Router({ mergeParams: true });
const { adminAuth, userAuth, isOwner } = require("../middelware.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/warpAsync.js");

const courseControllers = require("../controllers/course.js");

router.get("/", courseControllers.indexPage);

router.get("/course", wrapAsync(courseControllers.showCourse));

router.get("/create", courseControllers.createCoursePage);

router.get("/details/:id", wrapAsync(courseControllers.detailsOfCourse));

router.post("/course", adminAuth, wrapAsync(courseControllers.createCourse));

router.post(
  "/purchase/:id",
  userAuth,
  wrapAsync(courseControllers.purchseCourse)
);

router.get("/myCourses", userAuth, wrapAsync(courseControllers.myCourse));

//delete course route
router.delete(
  "/course/:id",
  isOwner,
  wrapAsync(courseControllers.deleteCourse)
);

module.exports = router;
