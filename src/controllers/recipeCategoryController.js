const LogModel = require('../models/logModel');
const RecipeCategoryModel = require('../models/recipeCategoryModel');
const {  deleteFileFromCloudinary } = require('../utils/upload');

class RecipeCategoryController {
    static async createCategory(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = req.log_id;

            const newCategory = req.body.new_category;

            // const check_category = validaterecipeCategory(newCategory);

            // if (!check_category.isValid) {
            //     deleteFileFromCloudinary(newCategory.image_url);

            //     await LogModel.updateDetailLog(check_category.errors, log_id);

            //     return res.status(400).json({ message: "Danh mục mua sắm đã tồn tại." });
            // }

            const old_category = await RecipeCategoryModel.getCategoryByName(newCategory.name);

            if (old_category) {
                deleteFileFromCloudinary(newCategory.image_url);

                await LogModel.updateDetailLog(`Danh mục mua sắm "${ newCategory.name }" đã tồn tại.`, log_id);

                return res.status(400).json({ message: "Danh mục mua sắm đã tồn tại." });
            }

            const newCategoryId = await RecipeCategoryModel.createCategory({
                name: newCategory.name,
                image_url: newCategory.image_url,
                created_by: user_id
            });

            if (!newCategoryId) {
                deleteFileFromCloudinary(newCategory.image_url);

                await LogModel.updateDetailLog(`Thêm vào database không thành công.`, log_id);

                return res.status(400).json({ message: "Tạo danh mục không thành công." });
            }

            const new_category = await RecipeCategoryModel.getCategoryById(newCategoryId);

            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: "Tạo danh mục thành công.", new_category: new_category });
        } catch (error) {
            console.log("Error executing createCategory() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await RecipeCategoryModel.getAllCategories();

            return res.status(200).json({ categories: categories });
        } catch (error) {
            console.log("Error executing createCategory() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }
}

module.exports = RecipeCategoryController;