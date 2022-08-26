// Setup
const User = require("../models/user");
const Post = require("../models/post");
const { cloudinary } = require("../cloudinary");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, password, confirmation, email } = req.body;
        if (confirmation != password) {
            req.flash("error", "Password does not match the confirmation");
            return res.redirect("/register");
        }
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        user.icon = { url: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png", filename: "" }
        await user.save()
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome To P UP!");
            res.redirect("/posts/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}


module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}
module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome Back!");
    const url = req.session.returnTo || "/main";
    delete req.session.returnTo;
    res.redirect(url);
}
module.exports.showProfile = async (req, res) => {
    // const user = await User.findById(currentUser._id);
    // res.render("users/profile", { user });
    res.render("users/profile");
}
module.exports.renderEdit = (req, res) => {
    res.render("users/editProfile");
}
module.exports.updateProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, req.body)
    await user.save();
    if (req.file) {
        await cloudinary.uploader.destroy(user.icon.filename);
        const newIcon = { url: req.file.path, filename: req.file.filename };
        user.icon = newIcon;
    }
    if (req.body.deleteIcon.length) {
        await cloudinary.uploader.destroy(user.icon.filename);
        const newIcon = { url: req.file.path, filename: req.file.filename };
        user.icon = newIcon;
    }
    await user.save();
    req.flash("success", `Successfully Updated Your Profile`);
    res.redirect("/profile");
}


module.exports.editImg = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.icon.url != "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png") {
        await cloudinary.uploader.destroy(user.icon.filename);
    }
    const newIcon = { url: req.file.path, filename: req.file.filename };
    console.log(newIcon);
    user.icon = newIcon;
    await user.save();
    req.flash("success", `Successfully Updated Your Profile Icon`);
    res.redirect("/profile");
}
module.exports.deleteImg = async (req, res) => {
    const user = await User.findById(req.user._id);
    await cloudinary.uploader.destroy(user.icon.filename);
    const newIcon = { url: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png", filename: "" };
    user.icon = newIcon;
    await user.save();
    req.flash("success", `Successfully Updated Your Profile Icon to Default`);
    res.redirect("/profile")
}

module.exports.renderHistory = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.posts.posted == 0) {
        req.flash("error", `You Don't Have Posted Anything Yet`);
        return res.redirect(`/posts/`);
    }
    shared = []
    const allPosts = await Post.find();
    for (let post of allPosts) {
        if (req.user._id.equals(post.author._id)) {
            shared.push(post);
        }
    }
    console.log(shared);
    return res.render("users/history", { shared });

}

module.exports.renderFav = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.posts.fav == 0) {
        req.flash("error", `You Don't Have Any Favorited Posts Yet`);
        return res.redirect(`/posts/`);
    }
    let fav = [];
    const allPosts = await Post.find()
    for (let post of allPosts) {
        if (post.author.equals(req.user)) {
            fav.push(post);
        }
    }
    return res.render("users/saved", { fav });
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "See You Next Time");
        res.redirect('/main');
    });
}