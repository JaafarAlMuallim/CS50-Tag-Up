const Joi = require("joi");

module.exports.postSchema = Joi.object({
    Post: Joi.object({
        description: Joi.string().required(),
        tags: Joi.string().required()
    }).required()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        // rating: Joi.number().required().min(1).max(5)
    }).required()
});

// module.exports.userSchema = Joi.object({
//     user: Joi.object({
//         phone: Joi.string().min(10).max(10).required(10)
//     }).required()
// });