const roleSchema = require("../models/roleModel");
const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById } = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");

exports.createRole = async (req,res) =>{
  const inputs =req.body;
  const newRole = await createModel(
    roleSchema,
    inputs,
  );
  return res.json(newRole);
};

exports.getAllRoles = async (req,res,next) =>{
  const allRoles = await getAllModels(roleSchema);
  if (!allRoles) {
    const error = new expressError("role not found", 400);
    return next(error);
  }
  return res.json(allRoles);
};
exports.getRoleById = async (req,res,next) =>{
    const {id}=req.params;
    const roleToBeFetched = await getModelById(
        roleSchema,
        id,
      );
      if (!roleToBeFetched) {
        const error = new expressError("Role Not Found", 404);
        next(error);
      };
      return res.json(roleToBeFetched);
};
exports.updateRoleById = async (req,res,next) =>{
  const {id} = req.params
  const roleToBeUpdated = await updateModelById(
    roleSchema,
    id,
    req.body,
  );
  if (!roleToBeUpdated) {
    const error = new expressError("Role Not Found", 404);
    next(error);
  }
  return res.json(roleToBeUpdated);
};
exports.deleteRole = async (req, res,next) => {
    const { id } = req.params;
    let roleToBeDeleted = await deleteModelById(
      roleSchema,
      id);
if (!roleToBeDeleted) {
        const error = new expressError("Role Not Found", 404);
        next(error);
      }
return res.status(200).json({message:"Role deleted Successfully"});
};