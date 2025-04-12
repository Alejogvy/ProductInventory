const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - color
 *         - category
 *         - stock
 *         - supplier
 *       properties:
 *         id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         color:
 *           type: string
 *         category:
 *           type: string
 *         stock:
 *           type: integer
 *         supplier:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "Lenovo Laptop"
 *         description: "14-inch laptop with 8GB RAM"
 *         price: 599.99
 *         color: "Black"
 *         category: "607d1a6f8c1b2c1a885fb7e9"
 *         stock: 10
 *         supplier: "Lenovo Inc."
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    await getProducts(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

/**
 * @swagger
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    await getProductById(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching the product', error: err });
  }
});

/**
 * @swagger
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
router.post('/', createProduct, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error creating the product', error: err });
  }
});

/**
 * @swagger
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation or update error
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, color, category, stock, supplier } = req.body;
    if (!name || !description || !price || !color || !category || !stock || !supplier) {
        return res.status(400).json({ message: 'name, description, price, and color are required' });
    }
    await updateProduct(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

/**
 * @swagger
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
     await deleteProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
