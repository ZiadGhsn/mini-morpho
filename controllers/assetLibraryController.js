const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById ,getAllModelsByQuery} = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");
const assetSchema = require("../models/assetLibraryModel");
const userSchema = require("../models/userModel");
const productsSchema = require("../models/productModel");

exports.createAsset = async (req, res, next) => {
    const inputs = req.body;
    inputs.User = req.user;
    const assetToBeCreated = await createModel(assetSchema, inputs);
    return res.status(200).json(assetToBeCreated);
};

exports.getAllAssets = async (req, res, next ) => {
  const populatedKeys="product"
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

exports.getAssetsByProductId = async (req, res, next) => {
    const { id } = req.params;
    const product = await getModelById(productsSchema, id);
    if (!product) {
      const error = new expressError("product not found.", 404);
      return next(error);
    }
    const query = { product: id }; 

    const populatedKeys = "product"; // Assuming `product` is a field in the assetSchema
    const products = await getAllModelsByQuery(assetSchema, query, populatedKeys);

    if (!products || products.length === 0) {
      const error = new expressError("No products found for this user.", 404);
      return next(error);
    }
    return res.status(200).json(products);
};

exports.getAssetByUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await getModelById(userSchema, id);
  if (!user) {
    const error = new expressError("User not found", 404);
    return next(error);
  }
  const query = { user: id };
  const populatedKeys = "product";
  const assets = await getAllModelsByQuery(assetSchema, query, populatedKeys);
  if (!assets || assets.length === 0) {
    const error = new expressError("No assets found for this user.", 404);
    return next(error);
  }
  return res.status(200).json(assets);
};

exports.addProductToAsset = async (req, res) => {
    const { assetId, productId } = req.body; // Assume assetId and productId are passed in the request body
    const userId = req.user; // Extract the user ID from the authenticated user

    // Find the asset and verify ownership
    const asset = await findOne(assetSchema,
      { _id: assetId, User: userId });
    if (!asset) {
      const error = new expressError("asset not found", 404);
      return next(error);
      }
    const product = await getModelById(productsSchema,productId);
    if (!product) {
      const error = new expressError("product not found", 404);
        return next(error);
        }
    if (asset.product.includes(productId)) {
      return res.status(400).json({ message: "Product already added to this asset" });
    }

    asset.product.push(productId);
    await asset.save();

    return res.status(200).json({ message: "Product added to asset successfully", asset });
};