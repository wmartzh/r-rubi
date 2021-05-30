const router = require("express").Router();
const productController = require("../controllers/productController");

router.post("/", productController.create);
router.get("/", productController.getAll);
router.put("/:productId", productController.update);

module.exports = router;
