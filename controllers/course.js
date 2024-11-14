const { z } = require("zod");
const Course = require("../models/course.js");
const User = require("../models/user.js");

module.exports.createCourse = async (req, res, next) => {
  const newCourse = new Course(req.body);
  newCourse.owner = req.user._id;
  await newCourse.save();
  res.redirect("/");
};

module.exports.showCourse = async (req, res) => {
  const allCourse = await Course.find({});
  res.render("course/courses.ejs", { allCourse });
};

module.exports.purchseCourse = async (req, res) => {
  const id = req.params.id;
  const foundUser = await User.findById(req.user._id);
  foundUser.courses.push(id);
  await foundUser.save();
  res.json(foundUser);
};

module.exports.detailsOfCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course/details.ejs", { course });
};

module.exports.deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.redirect("/course");
};

module.exports.myCourse = async (req, res) => {
  const allCourses = await Course.find({ _id: req.user.courses });
  res.json(allCourses);
};

module.exports.createCoursePage = (req, res) => {
  res.render("course/create.ejs");
};

module.exports.indexPage = (req, res) => {
  res.render("course/index.ejs");
};
