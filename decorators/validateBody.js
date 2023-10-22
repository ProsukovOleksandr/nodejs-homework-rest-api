import HttpError from "../helpers/HttpError.js";

const ValidateBody = (schema) => {
  const func = (req, res, next) => {
   
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

export default ValidateBody;