// Setup
const express = require("express");
const multer = require("multer");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const searches = require("../controllers/searches");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", users.renderHome);

router.route("/register")
    .get(users.renderRegister)
    .post(wrapAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.userLogin);

router.route("/profile")
    .get(isLoggedIn, users.showProfile)
    .put(isLoggedIn, users.updateProfile);

router.get("/profile/edit", isLoggedIn, users.renderEdit);

router.get("/profile/:id", users.renderProfile);

router.get("/history", isLoggedIn, wrapAsync(users.renderHistory));
router.get("/favorites", isLoggedIn, wrapAsync(users.renderFav));



router.patch("/profile/editImg", isLoggedIn, upload.single("icon"), wrapAsync(users.editImg));
router.patch("/profile/deleteImg", isLoggedIn, wrapAsync(users.deleteImg));
router.get("/search/", searches.searches)

router.get('/logout', users.logout);

module.exports = router;