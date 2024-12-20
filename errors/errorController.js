const { NODE_ENV } = require("../config/envVariables");
const expressError = require("./expressError.js");
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const castErrorHandler = (error) => {
  const msg = `Invalid value ${error.path}: ${error.value}`;
  return new expressError(msg, 400);
};
const duplicateKeyErrorHandler = (error) => {
  const name = error.keyValue.email;
  const msg = `There is aleardy a document in this Table with this email ${name}`;
  return new expressError(msg, 400);
};
const validationErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((value) => value.message);
  const errorMessage = errors.join(". ");
  const msg = `Invalid value ${errorMessage}`;
  return new expressError(msg, 400);
};
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (NODE_ENV === "development") devErrors(res, error);
  else if (NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    prodErrors(res, error);
  }
};
