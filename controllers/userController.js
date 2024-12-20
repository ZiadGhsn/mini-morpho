const userSchema = require("../models/userModel");
const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById } = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");
exports.getAllUsers = async (req, res, next) => {
    const allUsers = await getAllModels(userSchema);
    if (!allUsers) {
        const error = new expressError("user not found", 400);
        return next(error);
      }
    return res.status(200).json(allUsers);
};
exports.getUserById = async (req,res,next) => {
    const { id } = req.params;
    const user = await getModelById(userSchema, id);
    if (!user) {
        const error = new expressError("User not found", 404);
        return next(error);
    }
    return res.json(user);
};
exports.updateUserById = async (req, res,next)=>{
  const { id } = req.params;
  const userTest = await updateModelById(userSchema,id, req.body);
  if (!userTest) {
    const error = new expressError("User Not Found", 404);
    next(error);
  }
  return res.json(userTest);
};
exports.deleteUserById = async (req, res,next) => {
    const { id } = req.params;
    let deletedUser = await deleteModelById(
      userSchema,
      id,
    );
    if (!deletedUser) {
        const error = new expressError("user not found", 400);
        return next(error);
      }
    return res.status(200).json({message:"User deleted Successfully"})
};