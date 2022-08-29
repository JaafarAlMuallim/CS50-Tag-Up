// Setup
const User = require("../models/user");
const Post = require("../models/post");


/* find people or tags searches for*/

module.exports.searches = async (req, res, next) => {
    let { q } = req.query;
    if (q[0] == "#") {
        q = q.substring(1);
        const users = "";
        const posts = await Post.find({ description: { $regex: '.*' + q + '.*' } });
        return res.render("users/showSearch", { users,posts });
    } else if (q[0] == "@") {
        q = q.substring(1);
        const posts = "";
        const users = await User.find({ username: { $eq: q } });
        return res.render("users/showSearch", { users,posts });
    }

}