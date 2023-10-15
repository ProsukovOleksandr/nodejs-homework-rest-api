import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const authenticate = async (req, res, next) => {
  const { authorization = ""} = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};
export default ctrlWrapper(authenticate);
