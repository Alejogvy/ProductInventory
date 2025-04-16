const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    enum: ['restock', 'sale', 'correction', 'other'],
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('StockHistory', stockHistorySchema);
