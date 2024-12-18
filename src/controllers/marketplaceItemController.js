const LogModel = require('../models/logModel');
const MarketplaceItemModel = require('../models/marketplaceItemModel');
const { validateMarketplaceCategory } = require('../validators/marketplaceCategoryValidator');
// const {  deleteFileFromCloudinary } = require('../utils/upload');

class MarketplaceItemController {
    static async createItem(req, res) {
        try {
            
        } catch (error) {
            console.log("Error executing createItem() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async getItems(req, res) {
        try {
            const items = await MarketplaceItemModel.getAllItems();

            return res.status(200).json({ items: items });
        } catch (error) {
            console.log("Error executing getItems() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }
}

module.exports = MarketplaceItemController;