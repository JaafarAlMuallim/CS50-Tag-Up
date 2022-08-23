const Post = require("../models/post");
const { cloudinary } = require("../cloudinary");


module.exports.renderNewForm = (req, res, next) => {
    res.render("new");
}
module.exports.main = async (req, res, next) => {
    const posts = await Post.find();
    console.log(posts);
    return res.render("posts/main", { posts });

}
module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.image = { url: req.file.url, filename: req.file.filename };
    post.date = Date.now();
    await post.save();
    req.flash("success", `Successfully Added The Post`);
    return res.redirect(`/posts/${post._id}`);
}
module.exports.show = async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: "comments",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!post) {
        req.flash("error", "Cannot Find This Post");
        res.redirect("/posts/main");
    }
    let diff = (Math.abs(Date.now() - post.date)) / (1000 * 60 * 60 * 24);
    return res.render("posts/show", { post: post, diff: Math.ceil(diff) });
}
module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post, { runValidators: true });
    if (req.file) {
        await cloudinary.uploader.destroy(post.image.filename);
        post.image = { url: req.file.url, filename: req.file.filename }
    }
    await post.save();
    req.flash("success", `Successfully Updated This Post`);
    return res.redirect(`/posts/${id}`);
}
module.exports.renderUpdate = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash("error", "Cannot find this Post");
        res.redirect("/posts/main");
    }
    return res.render("posts/edit", { post })
}
module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", `Successfully Deleted The Post`);
    return res.redirect("/posts/main");
}
