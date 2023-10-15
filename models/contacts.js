import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from "joi";
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    }
  },
  { versionKey: false }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
export const contactsPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const contactsUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);
export default Contact;
