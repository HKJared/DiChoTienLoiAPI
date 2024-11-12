const LogModel = require('../models/logModel');
const RecipeModel = require('../models/recipeModel');
const {  deleteFileFromCloudinary } = require('../utils/upload');

class RecipeController {
    static async createRecipe(req, res) {
        try {
            
        } catch (error) {
            console.log("Error executing createItem() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async getRecipes(req, res) {
        try {
            const items = await RecipeModel.getAllItems();

            return res.status(200).json({ items: items });
        } catch (error) {
            console.log("Error executing getItems() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async searchRecipes(req, res) {
        try {
            const keyword = req.query.keyword || '';
            const page = req.query.page || 1;
            const itemsPerPage = req.query.itemsPerPage || 20;
            const category_id = req.query.category_id || null;

            const recipes = await RecipeModel.search(keyword, page, itemsPerPage, category_id);

            return res.status(200).json({ recipes: recipes });
        } catch (error) {
            console.log("Error executing searchRecipes() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }
}

module.exports = RecipeController;