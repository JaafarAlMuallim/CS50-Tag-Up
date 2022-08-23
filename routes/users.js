// Setup
const express = require("express");
const multer = require("multer");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

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
router.patch("/profile/editImg", isLoggedIn, upload.single("icon"), users.editImg);
router.patch("/profile/deleteImg", isLoggedIn, users.deleteImg);

router.get('/logout', users.logout);

module.exports = router;