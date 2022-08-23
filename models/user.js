const mongoose = require('mongoose');
const passportMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    url: {
        type: String,
        default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    },
    filename: {
        type: String,
        default: ""
    }
})
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    icon: iconSchema,
    // this where the user post will go
    history: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    // his liked posts will go here 
    liked: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
});

userSchema.plugin(passportMongoose);
module.exports = mongoose.model("User", userSchema);