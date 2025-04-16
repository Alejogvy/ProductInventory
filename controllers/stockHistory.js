const StockHistory = require('../models/stockHistory');
const Product = require('../models/productModel');

// Get all stock history
exports.getStockHistory = async (req, res) => {
  try {
    const history = await StockHistory.find().populate('product', 'name');
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error getting stock history', error: err });
  }
};

// Add a new stock change
exports.addStockChange = async (req, res) => {
  try {
    const { product, change, reason } = req.body;

    if (change === 0) {
      return res.status(400).json({ message: 'Stock change cannot be zero.' });
    }

    // Search for the product first
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newStock = productDoc.stock + change;

    if (newStock < 0) {
      return res.status(400).json({ message: 'Stock cannot go below zero' });
    }

    // Create history
    const newChange = new StockHistory({ product, change, reason });
    await newChange.save();

    // Update product stock
    const updatedProduct = await Product.findByIdAndUpdate(
      product,
      { $inc: { stock: change } },
      { new: true }
    );

    res.status(201).json({
      message: 'Stock change recorded and product updated',
      stockHistory: newChange,
      updatedProduct
    });
  } catch (err) {
    res.status(400).json({ message: 'Error recording stock change', error: err });
  }
};

// Get history by ID
exports.getStockHistoryById = async (req, res) => {
  try {
    const history = await StockHistory.findById(req.params.id).populate('product', 'name');
    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving history', error });
  }
};

// Update a history record
exports.updateStockHistory = async (req, res) => {
  try {
    const { change, reason } = req.body;
    const { id } = req.params;

    const existingHistory = await StockHistory.findById(id);
    if (!existingHistory) {
      return res.status(404).json({ message: 'History not found' });
    }

    const productDoc = await Product.findById(existingHistory.product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const changeDifference = change - existingHistory.change;
    const newStock = productDoc.stock + changeDifference;

    // Update history
    existingHistory.change = change;
    existingHistory.reason = reason;
    await existingHistory.save();

    // Update stock of the related product
    const updatedProduct = await Product.findByIdAndUpdate(
      existingHistory.product,
      { $inc: { stock: changeDifference } },
      { new: true }
    );

    res.status(200).json({
      message: 'Stock history updated',
      updatedHistory: existingHistory,
      updatedProduct
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock history', error });
  }
};

// Delete a history record
exports.deleteStockHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await StockHistory.findById(id);
    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }

    const productDoc = await Product.findById(history.product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newStock = productDoc.stock - history.change;

    if (newStock < 0) {
      return res.status(400).json({ message: 'Cannot delete this history entry because it would cause stock to go below zero' });
    }

    // Reverse the change in product stock
    await Product.findByIdAndUpdate(
      history.product,
      { $inc: { stock: -history.change } }
    );

    // Delete history log
    await StockHistory.findByIdAndDelete(id);

    res.status(200).json({ message: 'Stock history deleted and stock reverted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stock history', error });
  }
};
