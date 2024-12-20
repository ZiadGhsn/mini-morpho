const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById ,getAllModelsByQuery} = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");
const assetSchema = require("../models/assetLibraryModel");
const userSchema = require("../models/userModel");
const productsSchema = require("../models/productModel");

exports.createAsset = async(req, res, next ) => {
  const inputs=req.body;
  const assetToBeCreated = await createModel(
    assetSchema,
    inputs,
  );
  return res.status(200).json(assetToBeCreated);
};

exports.getAllAssets = async (req, res, next ) => {
  let allAssets = await getAllModels(
    assetSchema,
  );
  if(!allAssets){
    const error = new expressError("Asset Not Found",404);
    next(error);
  };
  return res.status(200).json(allAssets);
};

exports.getAssetById = async (req, res, next )  => {
    const {id}=req.params;
    const assetToBeFound = await getModelById(
      assetSchema,
      id,
    );
    if(!assetToBeFound){
      const error = new expressError("Asset Not Found",404);
      next(error);
    };
    return res.json(assetToBeFound);
};

exports.updateAsset = async (req, res, next ) => {
  const {id}=req.params;
  let assetLibraryToBeUpdated= await updateModelById(
    assetSchema,
    id,
    req.body,
    {new : true},
  );
  if (!assetLibraryToBeUpdated) {
    const error = new expressError("Asset Not Found", 404);
    next(error);
  }
  return res.json(assetLibraryToBeUpdated);
};
exports.deleteAsset=async(req,res,next)=>{
  const {id} = req.params;
  const deleteAssetById = await deleteModelById(
    assetSchema,
    id
  );
  if (!deleteAssetById) {
    const error = new expressError("Asset Not Found", 404);
    next(error);
  }
  return res.json("Asset Successfully Deleted");
};

exports.getProductsByUser = async (req, res, next) => {
  const { userId } = req.params;
    const query = { User: userId }; // Filter by the `User` field
    const populatedKeys = "product"; // Populate the `product` field

    // Use the query to fetch products
    const products = await getAllModelsByQuery(assetSchema, query, populatedKeys);

    if (!products ) {
      const error = new expressError("No products found for this user.", 404);
      return next(error);
    }

    return res.status(200).json(products);
};

