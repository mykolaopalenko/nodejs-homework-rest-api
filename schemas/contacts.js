const Joi = require("joi");

const addContactSchema = Joi.object({
   name: Joi.string().required().messages({
      "any.required": `missing required name field`,
   }),
   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
      "any.required": `missing required email field`,
   }),
   phone: Joi.string()
      .trim()
      .required()
      .messages({
         "any.required": `missing required phone field`,
      }),
}).required();

const updateContactSchema = Joi.object({
   name: Joi.string().optional(),
   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
   phone: Joi.string().optional(),
}).or('name', 'email', 'phone')

module.exports = { addContactSchema, updateContactSchema };