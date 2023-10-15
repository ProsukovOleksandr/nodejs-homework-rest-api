import express from "express";
import {
  contactsAddSchema,
  contactsPutSchema,
  contactsUpdateFavoriteSchema,
} from "../../models/contacts.js";
import contactsController from "../../controllers/contacts-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import isValidId from "../../middlewares/isValidId.js";
import authenticate from "../../middlewares/authenticated.js";
import ValidateBody from "../../decorators/validateBody.js";
const router = express.Router();

const contactAddValidate = ValidateBody(contactsAddSchema);
const contactPutValidate = ValidateBody(contactsPutSchema);
const updateFavoriteValidate = ValidateBody(contactsUpdateFavoriteSchema);

router.use(authenticate);

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post( "/", isEmptyBody, contactAddValidate, contactsController.addContact);

router.delete("/:contactId", isValidId, contactsController.deleteById);

router.put("/:contactId", isValidId,isEmptyBody,contactPutValidate,contactsController.updateById);

router.patch("/:contactId/favorite",isValidId,isEmptyBody,updateFavoriteValidate,contactsController.updateFavorite);
export default router;
