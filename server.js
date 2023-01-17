const mongoose = require("mongoose");
const { app } = require("./app")
const dotenv = require("dotenv")

mongoose.set('strictQuery', false);
dotenv.config()

const { HOST_URI } = process.env

async function main() {
   try {
      await mongoose.connect(HOST_URI)
      app.listen(3000, () => {
         console.log("Database connection successful")
      })
   } catch (error) {
      console.log("Error while connecting to mongodb", error.message)
      process.exit(1)
   }
}

main()



// const schema = mongoose.Schema({
//    name: {
//       type: String,
//       required: [true, 'Set name for contact'],
//    },
//    email: {
//       type: String,
//    },
//    phone: {
//       type: String,
//    },
//    favorite: {
//       type: Boolean,
//       default: false,
//    },
// }, {
//    versionKey: false
// })

// const Contact = mongoose.model('contacts', schema)

// // const saveContact = await Contact.create({
// //    name: "Yana",
// //    email: "rr@re.com",
// //    phone: "234234234"
// // })

// // console.log("new contact", saveContact)

// // const contacts = await Contact.findById("63c523a646aa69d5aef5887b")
// // const contacts = await Contact.findByIdAndUpdate("63c523a646aa69d5aef5887b",
// //    { name: "Yana Opalenko" },
// //    { new: true })


// // console.log("contacts", contacts)
