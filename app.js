if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const app = express();

const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const courseRoutes = require("./routes/course.js");
const { allCheckAuth, allCheckAuth2 } = require("./middelware.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_ATLAS_URL);
}

const sessionOptions = {
  secret: "MYsuperSEcreta",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());
app.use(allCheckAuth);
app.use(allCheckAuth2);
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(courseRoutes);

app.all("*", (req, res, next) => {
  next(res.render("error.ejs"));
});

app.use((err, req, res, next) => {
  let { statusCode = 400, message = "Something went wrong!" } = err;
  res.status(statusCode).render("allerror.ejs",{message});
});

app.listen(8080, () => {
  console.log("app listen on port 8080");
});
