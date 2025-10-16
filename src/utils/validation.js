import Joi from "joi";

// schema to validate a new meme object from request
// takes title and url
export const memeSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  url: Joi.string().uri().required(),
});
