const router = require("express").Router();
const controller = require("../../controllers/assetLibraryController");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");

router.post("/create", controller.createAsset);
router.get("/get-all", controller.getAllAssets);
router.get("/get-by-id/:id", controller.getAssetById);
router.put("/update-by-id/:id", controller.updateAsset);
router.delete("/delete-by-id/:id", controller.deleteAsset);
router.get("/get-Asset-by-ProductId/:id", controller.getAssetsByProductId);
router.get("/get-Asset-by-UserId/:id", controller.getAssetByUser);
router.post("/add-product-to-asset", controller.addProductToAsset);
module.exports = router;
