const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controllers/stockHistory');
const isAuthenticated = require("../middleware/authenticate");

/**
 * @swagger
 * tags:
 *   name: StockHistory
 *   description: Endpoints for tracking product stock changes
 */

/**
 * @swagger
 * /api/stock-history:
 *   get:
 *     summary: Get all stock history records
 *     tags: [StockHistory]
 *     responses:
 *       200:
 *         description: List of stock history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockHistory'
 *   post:
 *     summary: Record a stock change
 *     tags: [StockHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - change
 *               - reason
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID (MongoDB ObjectId)
 *               change:
 *                 type: integer
 *                 description: The number of items added or removed
 *               reason:
 *                 type: string
 *                 enum: [restock, sale, correction, other]
 *                 description: Reason for stock change
 *     responses:
 *       201:
 *         description: Stock change recorded
 *       400:
 *         description: Invalid input
 */
router.get('/', stockHistoryController.getStockHistory);
router.post('/', isAuthenticated, stockHistoryController.addStockChange);

/**
 * @swagger
 * /api/stock-history/{id}:
 *   get:
 *     summary: Get a stock history record by ID
 *     tags: [StockHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock history ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock history record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockHistory'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a stock history record
 *     tags: [StockHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock history ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - change
 *               - reason
 *             properties:
 *               change:
 *                 type: integer
 *               reason:
 *                 type: string
 *                 enum: [restock, sale, correction, other]
 *     responses:
 *       200:
 *         description: Stock history updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a stock history record
 *     tags: [StockHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock history ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock history deleted and stock reverted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:id', stockHistoryController.getStockHistoryById);
router.put('/:id', isAuthenticated, stockHistoryController.updateStockHistory);
router.delete('/:id', stockHistoryController.deleteStockHistory);

module.exports = router;
