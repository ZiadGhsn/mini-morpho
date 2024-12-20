// Library for validation of incoming data from the body
const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const mongoose = require("mongoose");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

// Custom unique extension for unique strings
const uniqueExtension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.unique": "{{#label}} must be unique",
  },
  rules: {
    unique: {
      async validate(value, helpers) {
        // Simulated database check (replace with actual logic)
        if (await isValueInDatabase(value)) {
          return helpers.error("string.unique", { value });
        }
        return value;
      },
    },
  },
});

const isObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Our custom Validations
const Joi = BaseJoi.extend(extension, uniqueExtension);
let stringValidation = Joi.string().required().escapeHTML();
let stringValidationNotRequired = Joi.string().escapeHTML();
let stringValidationUnique = Joi.string().unique().required().escapeHTML();
const emailValidation = Joi.string().email().required().escapeHTML();
let numberValidation = Joi.number().required();
let numberValidationNotRequired = Joi.number();
let booleanValidation = Joi.boolean();
let objectIdValidation = Joi.string().hex().length(24).escapeHTML();
let objectIdValidationNotRequired = Joi.string().hex().length(24).escapeHTML();
let urlValidation = Joi.string().uri().escapeHTML();
let urlValidationRequired = Joi.string().uri().required().escapeHTML();
let dateValidationNotRequired = Joi.date();
const materialPropertiesValidation = Joi.object({
  materialName: stringValidationNotRequired,
  materialProperties: Joi.object().optional().unknown(true), // Allow an empty object
});

assetLibrarySchema = Joi.object({
  _id: Joi.string(),
  __v: Joi.string(),
  serial_number: stringValidation,
  project: Joi.string().custom(isObjectId, "ObjectId"),
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
categorySchema = Joi.object({
  _id: Joi.string(),
  __v: Joi.string(),
  name: stringValidation,
  description: stringValidation,
  production: Joi.string().custom(isObjectId, "ObjectId"),
  hasCollection: booleanValidation.default(false),
  imageUrl: urlValidation,
  price: Joi.string().escapeHTML(),
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
collectionSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  category: objectIdValidation,
  imageUrl: urlValidation,
  price: numberValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
commentSchema = Joi.object({
  content: stringValidationNotRequired,
  user: objectIdValidation,
  product_id: objectIdValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
customizedSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  iconUrl: urlValidation,
  model: objectIdValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
glbSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  url: urlValidation,
  multiUrls: Joi.array().items(urlValidation),
  imageUrl: urlValidation,
  price: numberValidation,
  sku: stringValidation,
  sizes: Joi.array().items(stringValidationNotRequired),
  width: Joi.array().items(stringValidationNotRequired),
  published: booleanValidation.default(false),
  project: objectIdValidation,
  category: objectIdValidation,
  collectionId: objectIdValidation,
  asset_library: objectIdValidation,
  hdr: Joi.object({
    url: urlValidationRequired,
    level: numberValidationNotRequired,
  }),
  url: urlValidation,
  level: numberValidationNotRequired,
  customizations: Joi.array().items(
    Joi.object({
      name: stringValidation,
      values: Joi.array().items(
        Joi.object({
          name: stringValidation,
          icon_id: Joi.string().hex().length(24).required(),
          materialDetails: Joi.array().items(objectIdValidationNotRequired),
        }),
      ),
    }),
  ),
  variants: Joi.array().items(
    Joi.object({
      title: stringValidationNotRequired,
      materials: Joi.array().items(objectIdValidationNotRequired),
      options: Joi.array().items(stringValidationNotRequired),
      price: numberValidationNotRequired,
      sku: stringValidationNotRequired,
    }),
  ),
  key: stringValidationNotRequired,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
hdrSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  url: urlValidationRequired,
  library: objectIdValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
mediaSchema = Joi.object({
  url: urlValidation,
  name: stringValidation,
  isMedia: booleanValidation.default(false),
  model: objectIdValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
materialSchema = Joi.object({
  name: stringValidation,
  active: booleanValidation,
  version: numberValidation,
  properties: Joi.object(),
});
materialLibrarySchema = Joi.object({
  project: objectIdValidationNotRequired,
  materials: Joi.array().items(objectIdValidation),
});
materialsSchema = Joi.object({
  library: objectIdValidationNotRequired,
  user: objectIdValidationNotRequired,
  material: Joi.array().items(materialSchema),
});
modelCustomizationSchema = Joi.object({
  model: objectIdValidation,
  meshes_name: Joi.array().items(stringValidationNotRequired),
  position: stringValidation,
  rotation: stringValidation,
  scaling: stringValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
productionSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  project: objectIdValidation,
  imageUrl: urlValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
projectSchema = Joi.object({
  _id: Joi.string(),
  __v: Joi.number(),
  name: stringValidation,
  description: stringValidation,
  industry: stringValidation,
  client: objectIdValidationNotRequired,
  type: stringValidation,
  portalUrl: urlValidation,
  type_of_integration: stringValidationNotRequired,
  artists: Joi.array().items(Joi.string().hex().length(24).escapeHTML()),
  template: Joi.string().hex().length(24).escapeHTML(),
  assetLibrary: objectIdValidationNotRequired,
  status: stringValidationNotRequired.valid(
    "request",
    "in-progress",
    "rejected",
    "canceled",
    "done",
  ),
  uiUrl: urlValidation,
  softDelete: booleanValidation.default(false),
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
roleSchema = Joi.object({
  role: stringValidation,
  lead: booleanValidation.default(false),
  isDeleted: booleanValidation.default(false),
  isMCX: booleanValidation.default(false),
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
templateSchema = Joi.object({
  name: stringValidation,
  id: objectIdValidation,
  description: stringValidation,
  previewUrl: urlValidationRequired,
  imageUrl: urlValidationRequired,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
textureSchema = Joi.object({
  name: stringValidation,
  description: stringValidation,
  imageUrl: urlValidationRequired,
  url: urlValidationRequired,
  customized_material: objectIdValidation,
  asset_library: objectIdValidation,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
userSchema = Joi.object({
  first_name: stringValidation,
  last_name: stringValidation,
  username: stringValidationUnique,
  email: emailValidation,
  password: stringValidation,
  role: objectIdValidation,
  phoneNumber: numberValidationNotRequired,
  country: stringValidationNotRequired,
  image_url: urlValidation,
  user_description: stringValidationNotRequired,
  portfolio_url: urlValidation,
  cv_url: urlValidation,
  user_position: stringValidationNotRequired,
  companyName: stringValidationNotRequired,
  industry: stringValidationNotRequired,
  companyWebsite: urlValidation,
  refreshToken: stringValidation,
  verified: booleanValidation.default(false),
  isDeleted: booleanValidation.default(false),
  resetLink: stringValidationNotRequired,
  createdAt: dateValidationNotRequired,
  updatedAt: dateValidationNotRequired,
});
userOtpSchema = Joi.object({
  userId: objectIdValidation,
  otp: stringValidationNotRequired,
  createdAt: dateValidationNotRequired,
  expiresAt: dateValidationNotRequired,
});
module.exports = {
  assetLibrarySchema,
  categorySchema,
  collectionSchema,
  commentSchema,
  customizedSchema,
  glbSchema,
  hdrSchema,
  materialLibrarySchema,
  materialsSchema,
  mediaSchema,
  modelCustomizationSchema,
  productionSchema,
  projectSchema,
  roleSchema,
  templateSchema,
  textureSchema,
  userSchema,
  userOtpSchema,
};
