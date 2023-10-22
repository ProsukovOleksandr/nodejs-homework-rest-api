import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import gravatar from  "gravatar";
import Jimp from "jimp"
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import path from "path";
import fs from "fs/promises"
const avatarsDir = path.join( "public", "avatars");

const signup = async (req, res) => {
  const {email, password, subscription } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} is already in use`);
  }
  const { path: tmpUpload, filename } = req.file;

  await Jimp.read(tmpUpload)
    .then((avatar) => {
      return avatar.cover(250, 250).quality(60).write(tmpUpload);
    })
    .catch((err) => {
      throw err;
    });
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("public", "avatars", filename);
  await User.findOneAndUpdate({email}, { avatarURL });

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword, subscription, avatarURL });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "23h" });
await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription
  })
};

const signout = async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id, {token:""});
  res.json({
    message:"Signout success!"
  })
}
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, filename } = req.file;

  await Jimp.read(tmpUpload)
    .then((avatar) => {
      return avatar.cover(250, 250).quality(60).write(tmpUpload);
    })
    .catch((err) => {
      throw err;
    });

  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("public", "avatars",filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout), 
  updateAvatar: ctrlWrapper(updateAvatar)
};
