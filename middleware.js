const { postSchema, commentSchema } = require("./utils/schemas");
const Post = require("./models/post");
const Comment = require("./models/comment");
const AppError = require("./utils/error");

module.exports.validatePost = (req, res, next) => {

    const { error } = PostSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateComment = (req, res, next) => {

    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "Yout Must Be Signed Up/In");
        return res.redirect("/login");
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!req.user._id.equals(comment.author._id)) {
        req.flash("error", "You Do Not Have Premission To Do That");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!req.user._id.equals(post.author._id)) {
        req.flash("error", "You Do Not Have Premission To Do That");
        return res.redirect(`/post/${id}`)
    }
    next();
}
// //Add is Admin Later
// module.exports.isAdmin = async (req, res, next) => {
//     const user = await User.findById(req.user._id);
//     // const user = await User.findById(id);
//     if (user.role != "Admin") {
//         req.flash("error", "You Do Not Have Premission To Do That");
//         return res.redirect(`/Posts/menu`)
//     }
//     next();
// }