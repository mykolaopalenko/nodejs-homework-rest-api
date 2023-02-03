const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid")
const { User } = require("../models/user");
const { HttpError, sendEmail } = require("./../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../public", "avatars");


const register = async (req, res) => {
   const { email, password } = req.body
   const verificationToken = nanoid()

   const user = await User.findOne({ email })
   if (user) {
      throw HttpError(409, "Email in use")
   }


   const hashPassword = await bcrypt.hash(password, 10)
   const avatarURL = gravatar.url(email);
   const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
   })


   const mail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="http://${BASE_URL}/api/users/verify/${verificationToken}">Click to verify</a>`
   }

   await sendEmail(mail);

   res.status(201).json({
      email: newUser.email,
   })
}


const verify = async (req, res) => {
   const { verificationToken } = req.params
   const user = await User.findOne({ verificationToken })
   if (!user) {
      throw HttpError(404, "User not found")
   }
   await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })

   res.json({
      message: 'Verification successful'
   })
}

const resendEmail = async (req, res) => {
   const { email } = req.body
   const user = await User.findOne({ email })

   if (!user) {
      throw HttpError(404, "user not found")
   }
   if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
   }
   const mail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="http://${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify</a>`
   }

   await sendEmail(mail)

   res.json({
      message: "Verification email sent"
   })
}

const login = async (req, res) => {
   const { email, password } = req.body

   const user = await User.findOne({ email })
   if (!user) {
      throw HttpError(401, "Email or password is wrong")
   }

   if (!user.verify) {
      throw HttpError(401, "Email not verify")
   }

   const passwordCompare = await bcrypt.compare(password, user.password)
   if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong")
   }
   const payload = {
      id: user._id,
   };

   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

   await User.findByIdAndUpdate(user._id, { token });
   res.json({
      "token": token,
      "user": {
         "email": user.email,
         "subscription": user.subscription,
      }
   });
}


const logout = async (req, res) => {
   const { _id } = req.user;
   await User.findByIdAndUpdate(_id, { token: null });
   res.json({
      message: "Logout success",
   });
}


const getCurrent = async (req, res) => {
   const { email, subscription } = req.user
   res.json({
      email,
      subscription,
   })

}


const updateAvatar = async (req, res) => {
   const { _id: userId } = req.user;
   const { path: tempUpload, originalname } = req.file;

   const filename = `${userId}_${originalname}`;
   const resultUpload = path.join(avatarsDir, filename);
   await fs.rename(tempUpload, resultUpload);

   try {
      const avatar = await Jimp.read(resultUpload);
      avatar.resize(250, 250).quality(70).write(resultUpload);
   } catch (error) {
      throw HttpError(400);
   }

   const imageAvatar = await Jimp.read(resultUpload);
   const resizeAvatar = imageAvatar.resize(250, 250);
   resizeAvatar.write(resultUpload);

   const avatarURL = path.join("avatars", filename);
   await User.findByIdAndUpdate(userId, { avatarURL });

   res.json({
      avatarURL,
   });
};


module.exports = {
   register,
   login,
   getCurrent,
   logout,
   updateAvatar,
   verify,
   resendEmail
}