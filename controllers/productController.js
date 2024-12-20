const productsSchema = require("../models/productModel");
const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById } = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");
const assetLibraryModel = require("../models/assetLibraryModel");

exports.createProduct = async (req, res, next) => {
    const newProduct = await createModel(
        productsSchema,
        {...req.body},
    );
    return res.json(newProduct);
};
exports.getAllProducts= async (req, res, next) => {
    let productToBeRetrieved = await getAllModels(productsSchema)
    if (!productToBeRetrieved) {
        const error = new expressError("no Product was found", 400);
        return next(error);
      }
    return res.status(200).json(productToBeRetrieved);
};
exports.getProductById = async(req,res,next)=>{
    const {id}=req.params;
    let productToBeRetrieved = await getModelById(
        productsSchema,
        id,
    );
    if (!productToBeRetrieved) {
        const error = new expressError("no Product was found", 400);
        return next(error);
      }
      return res.status(200).json(productToBeRetrieved);
};
exports.getProductWithAsset = async (req, res) => {
    const { id } = req.params;
    const populatedKeys="asset_library";
    let productToBeRetrieved = await getModelById(
      productsSchema,
      id,
      populatedKeys,
    )
    if (!productToBeRetrieved) {
        const error = new expressError("no Product was found", 400);
        return next(error);
      }
    return res.status(200).json(productToBeRetrieved)
};

exports.updateProductById = async (req,res,next) =>{
  const {id} = req.params;
  const productToBeUpdated =await updateModelById(
    productsSchema,
    id,
    req.body,
  );
  if (!productToBeUpdated) {
    const error = new expressError("Product Not Found", 404);
    next(error);
  }
  return res.json(productToBeUpdated);
};
exports.deleteProductById = async (req, res) => {
    const { id } = req.params;
    let productToBeDeleted = await deleteModelById(
      productsSchema,
      id
    );
    if (!productToBeDeleted) {
        const error = new expressError("no Product was found", 400);
        return next(error);
      }
    return res.status(200).json({message:"Product Deleted Successfully"})
};
