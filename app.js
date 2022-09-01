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
const helmet = require("helmet");
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

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/PUp';
const secret = process.env.SECRET || "thisshouldbebetter"

// MONGO STORE SESSION BEFORE DEPLOYING

const MongoStore = require('connect-mongo');

const config = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        crypto: secret,
        touchAfter: 24 * 60 * 60
    }),
    name: "__iwwuz",
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
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            // connectSrc: ["'self'", ...connectSrcUrls],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhwlc77xr/",
                "https://images.unsplash.com/",

            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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

app.all("*", (req, res, next) => {

    next(new AppError("Page Not Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    if (!err.message) err.message = "Something Went Wrong!!";
    res.status(statusCode).render("error", { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
})