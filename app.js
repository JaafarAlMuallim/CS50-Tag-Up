// setup
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoSanitize = require("express-mongo-sanitize");

const passport = require("passport");
const localStrategy = require("passport-local");


const app = express();
const AppError = require("./utils/error");

const User = require("./models/user");

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const dbUrl = process.env.URL || 'mongodb://localhost:27017/PUp';
const secret = process.env.SECRET || "thisshouldbebetter"

// MONGO STORE SESSION BEFORE DEPLOYING
const config = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}

app.use(session(config));
app.use(flash());
app.use(mongoSanitize({ replaceWith: '_' }))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
const mongoose = require('mongoose');
main().then(() => {
    console.log("MONGOO CONNECTED");
})
    .catch(err => console.log("ERROR!"));

async function main() {
    mongoose.connect(dbUrl);
}
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error!"));
db.once("open", () => {
    console.log("Database connected");
});


const posts = require("./routes/posts");
const comments = require("./routes/comments");
const users = require("./routes/users");


app.use("/", users);
app.use("/posts", posts);
app.use("/posts/:id/comment", comments);

app.get("/addbio", async (erq, res, next) => {
    const user_one = await User.findById("6309fec84f1e1f320e578724")
    const user_two = await User.findById("6309d3c97a14144ffcc4b8ef")
    const user_three = await User.findById("6309cc5202fb66640a387c36")
    user_one.bio = "HELLO THERE, I AM ALICE NICE TO MEET Y'ALL";
    user_two.bio = "HELLO THERE, I AM COLT NICE TO MEET Y'ALL";
    user_three.bio = "HELLO THERE, I AM BOB NICE TO MEET Y'ALL";
    await user_one.save();
    await user_two.save();
    await user_three.save();
    res.send("DONE!!");
})

app.all("*", (req, res, next) => {

    next(new AppError("Page Not Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    if (!err.message) err.message = "Something Went Wrong!!";
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})