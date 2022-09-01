// Setup
const User = require("../models/user");
const Post = require("../models/post");
const mongoSanitize = require('mongo-sanitize');


/* find people or tags searches for*/

module.exports.searches = async (req, res, next) => {
    let { q } = mongoSanitize(req.query);
    if (q[0] == "#") {
        const users = "";
        const posts = await Post.find({ tags: { $regex: q, $options: 'i' } });
        return res.render("users/showSearch", { users, posts });
    } else if (q[0] == "@") {
        q = q.substring(1);
        const posts = "";
        const users = await User.find({ username: { $regex: '.*' + q + '.*', $options: 'i' } });
        return res.render("users/showSearch", { users, posts });
    } else {
        const users = ""
        const posts = ""
        return res.render("users/showSearch", { users, posts });
    }

}