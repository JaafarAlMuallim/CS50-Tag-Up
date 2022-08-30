// setup
const express = require("express");
const multer = require("multer");
const router = express.Router();
const post = require("../controllers/posts")
const { isLoggedIn, validatePost, isAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../cloudinary");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(post.main))
    .post(isLoggedIn, upload.single("image"), validatePost, post.createPost)


router.get("/new", isLoggedIn, post.renderNewForm)

router.route("/:id")
    .get(wrapAsync(post.show))
    .put(isLoggedIn, isAuthor, upload.single("image"), validatePost, wrapAsync(post.update))
    .delete(isLoggedIn, isAuthor, wrapAsync(post.delete));

router.post("/:id/save", isLoggedIn, wrapAsync(post.fav))
router.post("/:id/unsave", isLoggedIn, wrapAsync(post.unfav))

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(post.renderUpdate));

module.exports = router;