const baseJoi = require("joi");


const sanitizeHtml = require("sanitize-html");
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean) {
                    return clean;
                }
                return helpers.error("string.escapeHTML", { value });
            },
        },
    },
});
const Joi = baseJoi.extend(extension);

module.exports.postSchema = Joi.object({
    post: Joi.object({
        description: Joi.string().required(),
        tags: Joi.string().required()
    }).required()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
    }).required()
});
