const { Schema, model } = require("mongoose")
const Joi = require("joi")
const { handleSaveErrors } = require("../helpers")
const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;


const userSchema = new Schema({
   password: {
      type: String,
      required: [true, 'Set password for user'],
      minlenth: 6,
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegexp,
   },
   subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
   },
   token: String
}, { versionKey: false })

userSchema.post("save", handleSaveErrors);

const registerAndLoginSchema = Joi.object({
   password: Joi.string().min(6).required().messages({
     "any.required": `Set password for user`,
   }),
   email: Joi.string().pattern(emailRegexp).required().messages({
     "any.required": `Email is required`,
   }),
 });


 const schemas = {
   registerAndLoginSchema
 }

 const User = model("user", userSchema)

 module.exports = {
   User,
   schemas,
 }