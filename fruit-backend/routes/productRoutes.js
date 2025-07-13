const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Full CRUD for products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);    // Create
router.put('/:id', productController.updateProduct);  // Update
router.delete('/:id', productController.deleteProduct); // Delete

module.exports = router;
