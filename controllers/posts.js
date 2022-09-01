const Post = require("../models/post");
const User = require("../models/user");
const { cloudinary } = require("../cloudinary");

// render form from the views directory
module.exports.renderNewForm = (req, res, next) => {
    return res.render("posts/new", { layout: "boilerplate", title: "New Post" });
}
// render form page the views directory
module.exports.main = async (req, res, next) => {
    const posts = await Post.find();
    return res.render("posts/main", { layout: "boilerplate", title: "Tag-Up", posts });

}

/* Create New Post and Save it by the author name,
Post should consist of image and description and tags
Date is to save the post and show when it was uploaded in the show page
increment number of posted photos of the user then redirect 
to the show page of the post
*/
module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    const user = await User.findById(req.user._id);
    post.image = { url: req.file.path, filename: req.file.filename };
    post.date = Date.now();
    post.author = req.user._id;
    user.posts.posted += 1;
    user.history.push(post._id);
    await user.save();
    await post.save();
    req.flash("success", `Successfully Added The Post`);
    return res.redirect(`/posts/${post._id}`);
}

/* render show page after populating the comments and the author of the post
if the post is still in the database and not delete
and show when the post was uploaded (Same day or after)
*/
module.exports.show = async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: "comments",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!post) {
        req.flash("error", "Cannot Find This Post");
        res.redirect("/posts");
    }
    let diff = (Math.abs(Date.now() - post.date)) / (1000 * 60 * 60 * 24);
    return res.render("posts/show", { layout: "boilerplate", title: "Show Post", post, diff: Math.ceil(diff) });
}

/* update the post either by updating the image, description or tags
and if the image was updated destroy the saved image 
*/
module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post, { runValidators: true });
    if (req.file) {
        await cloudinary.uploader.destroy(post.image.filename);
        post.image = { url: req.file.path, filename: req.file.filename }
    }
    await post.save();
    req.flash("success", `Successfully Updated This Post`);
    return res.redirect(`/posts/${id}`);
}

/* Favourite post */
module.exports.fav = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);
    post.saves++;
    user.posts.fav++;
    user.saved.push(post._id);
    await post.save();
    await user.save();
    req.flash("success", "Post Saved in Favorites");
    return res.redirect(`/posts/${id}`);
}

module.exports.unfav = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id).populate("saved");
    post.saves--;
    user.posts.fav--;
    // user.saved.push(post._id);
    await user.updateOne({ $pull: { saved: id } });
    await post.save();
    await user.save();
    req.flash("success", "Post Remove from Favorites");
    return res.redirect(`/posts/${id}`);
}

// render form page the views directory
module.exports.renderUpdate = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash("error", "Cannot find this Post");
        res.redirect("/posts/");
    }
    return res.render("posts/edit", { layout: "boilerplate", title: "Update Post", post })
}

/* delete the whole post and decrement the number of posted photos 
of the author 
*/
module.exports.delete = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    await user.updateOne({ $pull: { history: post._id } });
    await cloudinary.uploader.destroy(post.image.filename);
    user.posts.posted--;
    await user.save();
    req.flash("success", `Successfully Deleted The Post`);
    return res.redirect("/posts");
}

