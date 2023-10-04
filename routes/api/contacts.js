import express from "express";
import Joi from "joi";
import contactsService from "../../models/contacts.js";

const router = express.Router();

const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const contactsPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});
router.get("/", async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);

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
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
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
    const { error } = contactsPutSchema.validate(req.body);
    if (error) {
      const error = new Error("Wrong content type");
      error.status = 404;
      throw error;
    }
    const result = await contactsService.updateContact(contactId, req.body);
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
