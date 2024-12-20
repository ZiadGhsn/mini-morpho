const {
    assetLibrarySchema,
    categorySchema,
    collectionSchema,
    commentSchema,
    customizedSchema,
    glbSchema,
    hdrSchema,
    mediaSchema,
    modelCustomizationSchema,
    productionSchema,
    projectSchema,
    roleSchema,
    materialLibrarySchema,
    materialsSchema,
    templateSchema,
    textureSchema,
    userSchema,
    userOtpSchema,
  } = require("./schema");
  const ExpressError = require("../errors/expressError");
  
  validateAssetLibrarySchema = (req, res, next) => {
    const { error } = assetLibrarySchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateCategorySchema = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateCollectionSchema = (req, res, next) => {
    const { error } = collectionSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateMaterialsSchema = (req, res, next) => {
    const { error } = materialsSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateMaterialLibrarySchema = (req, res, next) => {
    const { error } = materialLibrarySchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateCommentSchema = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateCustomizedSchema = (req, res, next) => {
    const { error } = customizedSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateGlbSchema = (req, res, next) => {
    const { error } = glbSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateHdrSchema = (req, res, next) => {
    const { error } = hdrSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateMediaSchema = (req, res, next) => {
    const { error } = mediaSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateModelCustomizationSchema = (req, res, next) => {
    const { error } = modelCustomizationSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateProductionSchema = (req, res, next) => {
    const { error } = productionSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateProjectSchema = (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateRoleSchema = (req, res, next) => {
    const { error } = roleSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateTemplateSchema = (req, res, next) => {
    const { error } = templateSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateTextureSchema = (req, res, next) => {
    const { error } = textureSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateUserSchema = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  validateUserOtpSchema = (req, res, next) => {
    const { error } = userOtpSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e1) => e1.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  
  module.exports = {
    validateAssetLibrarySchema,
    validateCategorySchema,
    validateCollectionSchema,
    validateCommentSchema,
    validateCustomizedSchema,
    validateGlbSchema,
    validateHdrSchema,
    validateMediaSchema,
    validateModelCustomizationSchema,
    validateProductionSchema,
    validateProjectSchema,
    validateMaterialsSchema,
    validateRoleSchema,
    validateMaterialLibrarySchema,
    validateTemplateSchema,
    validateTextureSchema,
    validateUserSchema,
    validateUserOtpSchema,
  };
  