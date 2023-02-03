const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);


function tryCatchWrapper(enpointFn) {
   return async (req, res, next) => {
      try {
         await enpointFn(req, res, next);
      } catch (error) {
         return next(error);
      }
   };
}

function HttpError(status, message) {
   const err = new Error(message);
   err.status = status;
   return err;
}

const handleSaveErrors = (error, data, next) => {
   const { code, name } = error;
   error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
   next();
};


const sendEmail = async (data) => {
   const email = { ...data, from: EMAIL};
   await sgMail.send(email);
   return true;
};



module.exports = {
   tryCatchWrapper,
   HttpError,
   handleSaveErrors,
   sendEmail
};