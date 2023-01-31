const { mongoose, Schema } = require("mongoose");

const schema = mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Set name for contact'],
   },
   email: {
      type: String,
   },
   phone: {
      type: String,
   },
   favorite: {
      type: Boolean,
      default: false,
   },
   owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
}, {
   versionKey: false
})


const Contact = mongoose.model('contacts', schema)

module.exports = {
   Contact,
}

