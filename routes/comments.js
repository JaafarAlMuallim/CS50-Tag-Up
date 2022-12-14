// Setup

const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isCommentAuthor } = require("../middleware");
const comment = require("../controllers/comments");
const wrapAsync = require("../utils/wrapAsync");


router.post("/", validateComment, isLoggedIn, wrapAsync(comment.createComment));

router.delete("/:commentId", isLoggedIn, isCommentAuthor, wrapAsync(comment.deleteComment))
module.exports = router;