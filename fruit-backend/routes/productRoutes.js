const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyAdminToken } = require('./admin');

// Full CRUD for products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// only for admin
router.post('/', verifyAdminToken, productController.createProduct); //create
router.put('/:id', verifyAdminToken, productController.updateProduct); // update
router.delete('/:id', verifyAdminToken, productController.deleteProduct); //Delete

module.exports = router;
