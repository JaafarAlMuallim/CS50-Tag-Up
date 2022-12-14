const mongoose = require("mongoose");
const Comment = require("./comment")

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200,h_200");
})
imageSchema.virtual("scrolls").get(function () {
    return this.url.replace("/upload", "/upload/w_500,h_500");
})
const postSchema = new Schema({
    image: imageSchema,
    description: {
        type: String,
    },
    tags: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date: {
        type: Date
    },
    saves: {
        type: Number,
        default: 0
    }
})
postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
});
module.exports = mongoose.model("Post", postSchema);