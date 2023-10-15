import Contact from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAll = async (req, res) => {
  const {_id: owner} = req.user;
 const {page = 1, limit = 10} = req.query;
 const skip = (page-1)*limit;
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email subscription");
  res.json(result);
};

const getById = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOne({_id: contactId, owner});
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  console.log(req.user);
  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({_id:contactId, owner}, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};
const deleteById = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndDelete({_id:contactId, owner});
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json({
    message: "Delete success",
  });
};
const updateFavorite = async (req, res, next) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({_id:contactId, owner}, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateFavorite: ctrlWrapper(updateFavorite),
};
