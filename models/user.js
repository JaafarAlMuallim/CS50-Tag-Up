const mongoose = require('mongoose');
const passportMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80"
    },
    filename: {
        type: String,
        default: ""
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    icon: iconSchema,
    // this where the user posts history will go
    history: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
    // if he click on the "save" button on a post it will be saved here 
    saved: [{

        type: Schema.Types.ObjectId,
        ref: "Post"

    }],
    bio: {
        type: String,
        default: "Hey There."
    },
    posts: {
        fav: {
            type: Number,
            default: 0
        },
        posted: {
            type: Number,
            default: 0
        }
    }
});

userSchema.plugin(passportMongoose);
module.exports = mongoose.model("User", userSchema);