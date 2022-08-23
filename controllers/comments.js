const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body.comment);
    post.comments.push(comment);
    comment.author = req.user._id;
    await comment.save();
    await post.save();
    req.flash("success", "Successfully Posted a Comment");
    res.redirect(`/posts/${id}`);
}

module.exports.deleteComment = async (req, res, next) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully Deleted a Comment");
    res.redirect(`/post/${id}`);
    // res.send("DELETE ROUTE");
}