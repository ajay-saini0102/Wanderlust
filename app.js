if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("@simonsmith/ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);


const DB_URL = process.env.DB_URL;
const store = MongoStore.create({
  mongoUrl : DB_URL,
  crypto :{
      secret: process.env.SECRET,
  },
  touchAfter: 24* 3600,
});
store.on("error", () => {
  console.log("Error in Mongo Session Store", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
  }
}

main().then((res)=>console.log("Database connect!")).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new ExpressError(401, "Page Not Found !"));
});


// ExpressError Handling
app.use((err, req, res, next)=>{
    let {statusCode= 500, message="Something went wrong"} = err;
    res.render("error.ejs", {err});
});

app.listen(3000, ()=>{
  console.log("The 3000 server is on");
});
