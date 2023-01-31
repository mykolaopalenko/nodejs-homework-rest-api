function tryCatchWrapper(enpointFn) {
   return async (req, res, next) => {
     try {
       await enpointFn(req, res, next);
     } catch (error) {
       return next(error);
     }
   };
 }

 function HttpError(status, message){
   const err = new Error(message);
   err.status = status;
   return err;
 }

 const handleSaveErrors = (error, data, next) => {
   const { code, name } = error;
   error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
   next();
 };
 

 module.exports = {
   tryCatchWrapper,
   HttpError,
   handleSaveErrors,
 };