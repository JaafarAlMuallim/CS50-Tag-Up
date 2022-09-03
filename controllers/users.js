// Setup
const User = require("../models/user");
const Post = require("../models/post");
const { cloudinary } = require("../cloudinary");


// render home page

module.exports.renderHome = (req, res) => {
    res.render("home");
}

// render register form
module.exports.renderRegister = (req, res) => {
    res.render("users/register", { layout: "boilerplate", title: "Register" });
}
/* register new users and his password and hash it using the plugin in the model
then login automatically and show the main page*/

module.exports.register = async (req, res, next) => {
    try {
        const { username, password, confirmation, email } = req.body;
        if (confirmation != password) {
            req.flash("error", "Password does not match the confirmation");
            return res.redirect("/register");
        }
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        user.icon = { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80", filename: "" }
        await user.save()
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome To Tag-Up!");
            res.redirect("/profile/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

//  render login form 
module.exports.renderLogin = (req, res) => {
    res.render("users/login", { layout: "boilerplate", title: "Login" });
}
// return user either to the main or the page he was looking for if any
module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome Back!");
    const url = req.session.returnTo || "/posts/";
    delete req.session.returnTo;
    res.redirect(url);
}

/* show profile info of the current user (username, email, shared posts, saved posts, and his icon) 
    which also contains a form to change the icon*/
module.exports.showProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate("history");
    res.render("users/profile", { layout: "boilerplate", title: "Profile", user });
}

// show profile of the searches user and his post 
module.exports.renderProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("history");
    if (!user) {
        req.flash("error", "No Such User");
        return res.redirect("/posts/")
    }
    if (req.user?._id == id) {
        return res.redirect("/profile/");
    }
    return res.render("users/showProfile", { layout: "boilerplate", title: `${user.username} Profile`, user });
}

/* render the edit form of the profile */
module.exports.renderEdit = (req, res) => {
    return res.render("users/editProfile", { layout: "boilerplate", title: "Edit Profile" });
}

/* changing info using the form edit profile form */
module.exports.updateProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, req.body)
    await user.save();
    req.flash("success", `Successfully Updated Your Profile`);
    res.redirect("/profile");
}

/* updating profile if he has added new icon or removed the previous one */
module.exports.editImg = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.icon.url != "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80") {
        await cloudinary.uploader.destroy(user.icon.filename);
    }
    const newIcon = { url: req.file.path, filename: req.file.filename };
    user.icon = newIcon;
    await user.save();
    req.flash("success", `Successfully Updated Your Profile Icon`);
    res.redirect("/profile");
}
module.exports.deleteImg = async (req, res) => {
    const user = await User.findById(req.user._id);
    await cloudinary.uploader.destroy(user.icon.filename);
    const newIcon = {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80",
        filename: ""
    };
    user.icon = newIcon;
    await user.save();
    req.flash("success", `Successfully Updated Your Profile Icon to Default`);
    res.redirect("/profile")
}
/* populate the posts history from the user and show it in the page */
module.exports.renderHistory = async (req, res) => {
    let user = await User.findById(req.user._id);
    if (user.posts.posted == 0) {
        req.flash("error", `You Have Not Posted Anything Yet`);
        return res.redirect(`/posts/`);
    }
    user = await user.populate("history");
    return res.render("users/history", { layout: "boilerplate", title: "History", user });
}
/* populate the saved posts from the user and show it in the page */
module.exports.renderFav = async (req, res, next) => {
    let user = await User.findById(req.user._id);
    if (user.posts.fav == 0) {
        req.flash("error", `You Have Not Saved Any Posts Yet`);
        return res.redirect(`/posts/`);
    }
    user = await user.populate("saved");
    return res.render("users/saved", { layout: "boilerplate", title: "Saved", user });
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "See You Next Time");
        res.redirect('/posts/');
    });
}