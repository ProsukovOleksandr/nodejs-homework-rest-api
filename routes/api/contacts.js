import express from "express";
import Joi from "joi";
import Contact from "../../models/contacts.js";
import { isValidObjectId } from "mongoose";
const router = express.Router();

const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const contactsPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const contactsUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} is not valid id`);
      error.status = 404;
      throw error;
    }
    const result = await Contact.findById(contactId);

    if (!result) {
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      const error = new Error("All fields empty");
      error.status = 404;
      throw error;
    }
    const { error } = contactsAddSchema.validate(req.body);
    if (error) {
      const error = new Error("missing required name field");
      error.status = 404;
      throw error;
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} is not valid id`);
      error.status = 404;
      throw error;
    }

    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
    }

    res.json({
      message: "Delete success",
    });
  } catch {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} is not valid id`);
      error.status = 404;
      throw error;
    }

    const { error } = contactsPutSchema.validate(req.body);
    if (error) {
      const error = new Error("Wrong content type");
      error.status = 404;
      throw error;
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true, runValidators: true});
    if (!result) {
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} is not valid id`);
      error.status = 404;
      throw error;
    }
    const { error } = contactsUpdateFavoriteSchema.validate(req.body);
    if (error) {
      const error = new Error("missing field favorite");
      error.status = 404;
      throw error;
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true, runValidators: true});
    if (!result) {
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});
export default router;
