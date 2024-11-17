const LogModel = require('../models/logModel');
const RecipeModel = require('../models/recipeModel');
const {  deleteFileFromCloudinary } = require('../utils/upload');
const { validateRecipe } = require("../validators/recipeValidator");

class RecipeController {
    static async createRecipe(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Đăng tải công thức nấu ăn.', user_id);

            const recipe = req.body.recipe;

            const checkValid = validateRecipe(recipe);

            if (!checkValid.isValid) {
                await LogModel.updateDetailLog(checkValid.errors, log_id);

                return res.status(400).json({ message: checkValid.errors });
            }

            const recipe_id = await RecipeModel.createRecipe({
                category_id : recipe.category_id,
                name: recipe.name,
                image_url: recipe.image_url,
                description: recipe.description,
                time: recipe.time,
                serving: recipe.serving,
                cost_estimate: recipe.cost_estimate,
                kcal: recipe.kcal,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                created_by: user_id,
            });

            if (!recipe_id) {
                await LogModel.updateDetailLog('Đăng tải công thức nấu ăn không thành công.', log_id);

                return res.status(400).json({ message: "Đăng tải công thức nấu ăn không thành công, vui lòng thử lại hoặc tải lại trang." });
            }

            const new_recipe = await RecipeModel.getRecipeByUser(recipe_id);

            await LogModel.updateDetailLog('Đăng tải công thức nấu ăn thành công.', log_id);
            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: "Đăng tải công thức nấu ăn thành công, chúng tôi sẽ thông báo cho bạn khi công thức nấu ăn được phê duyệt.", new_recipe: new_recipe });
        } catch (error) {
            console.log("Error executing createRecipe() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async getRecipes(req, res) {
        try {
            const items = await RecipeModel.getAllItems();

            return res.status(200).json({ recipes: items });
        } catch (error) {
            console.log("Error executing getRecipes() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async getRecipeByUser(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Xem chi tiết công thức nấu ăn.', user_id);

            const recipe_id = req.query.recipe_id;

            if (!recipe_id) {
                await LogModel.updateDetailLog('Không có id của công thức nấu ăn được gửi.', log_id);

                return res.status(400).json({ message: 'Không có id của công thức nấu ăn được gửi.' });
            }

            const recipe = await RecipeModel.getRecipeByUser(recipe_id);

            if (!recipe) {
                await LogModel.updateDetailLog(`Không tìm thấy công thức nấu ăn có id: ${ recipe_id }.`, log_id);

                return res.status(400).json({ message: 'Không tìm thấy công thức nấu ăn.' });
            }

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ recipe: recipe });
        } catch (error) {
            console.log("Error executing getRecipeByUser() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async searchRecipes(req, res) {
        try {
            const keyword = req.query.keyword || '';
            const page = req.query.page || 1;
            const itemsPerPage = req.query.itemsPerPage || 20;
            const category_id = req.query.category_id || null;

            const {recipes, totalCount} = await RecipeModel.search(keyword, page, itemsPerPage, category_id);

            return res.status(200).json({ recipes: recipes, totalCount: totalCount });
        } catch (error) {
            console.log("Error executing searchRecipes() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async updateRecipe(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Cập nhật công thức nấu ăn.', user_id);

            const { recipe_id, newData } = req.body;

            if (!recipe_id || !newData ) {
                await LogModel.updateDetailLog('Không có id công thức nấu ăn hoặc dữ liệu muốn cập nhật.', log_id);

                return res.status(400).json({ message: 'Không có id công thức nấu ăn hoặc dữ liệu muốn cập nhật.' });
            }

            const checkValid = validateRecipe(newData);

            if (!checkValid.isValid) {
                deleteFileFromCloudinary(newData.image_url);
                await LogModel.updateDetailLog(checkValid.errors, log_id);

                return res.status(400).json({ message: checkValid.errors });
            }

            const recipe = await RecipeModel.getRecipeByUser(recipe_id);

            if (!recipe) {
                deleteFileFromCloudinary(newData.image_url);
                await LogModel.updateDetailLog('Không tìm thấy công thức nấu ăn cần chỉnh sửa.', log_id);

                return res.status(400).json({ message: 'Không tìm thấy công thức nấu ăn cần chỉnh sửa.' });
            }

            if (user_id != recipe.created_by) {
                deleteFileFromCloudinary(newData.image_url);
                await LogModel.updateDetailLog('Không phải chủ của công thức nấu ăn.', log_id);

                return res.status(400).json({ message: 'Bạn không phải chủ của công thức nấu ăn này.' });
            }

            if (!newData.image_url) { // nếu không có image_url mới thì sử dụng image_url cũ
                newData.image_url = recipe.image_url
            }

            const is_updated = await RecipeModel.updateRecipe(recipe_id, newData);

            if (!is_updated) {
                await LogModel.updateDetailLog('Cập nhật công thức nấu ăn không thành công.', log_id);

                return res.status(400).json({ message: "Cập nhật công thức nấu ăn không thành công, vui lòng thử lại hoặc tải lại trang." });
            }

            if (newData.image_url != recipe.image_url) { // nếu không sử dụng đường dẫn cũ
                deleteFileFromCloudinary(recipe.image_url);
            }

            const new_recipe = await RecipeModel.getRecipeByUser(recipe_id);

            await LogModel.updateDetailLog('Cập nhật công thức nấu ăn thành công.', log_id);
            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: "Cập nhật công thức nấu ăn thành công, chúng tôi sẽ thông báo cho bạn khi công thức nấu ăn được phê duyệt.", new_recipe: new_recipe });
        } catch (error) {
            console.log("Error executing updateRecipe() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    static async deleteRecipe(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Đăng tải công thức nấu ăn', user_id);

            const { recipe_id } = req.body;

            if (!recipe_id ) {
                await LogModel.updateDetailLog('Không có id công thức nấu ăn.', log_id);

                return res.status(400).json({ message: 'Không có id công thức nấu ăn muốn xóa.' });
            }

            const recipe = await RecipeModel.getRecipeByUser(recipe_id);

            if (!recipe) {
                await LogModel.updateDetailLog('Không tìm thấy công thức nấu ăn cần xóa.', log_id);

                return res.status(400).json({ message: 'Không tìm thấy công thức nấu ăn cần xóa.' });
            }

            const is_deleted = await RecipeModel.deleteRecipe(recipe_id);

            if (!is_deleted) {
                await LogModel.updateDetailLog('Xóa công thức nấu ăn không thành công.', log_id);

                return res.status(400).json({ message: "Xóa công thức nấu ăn không thành công, vui lòng thử lại hoặc tải lại trang." });
            }
            
            deleteFileFromCloudinary(recipe.image_url);

            await LogModel.updateDetailLog('Cập nhật công thức nấu ăn thành công.', log_id);
            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: "Xóa công thức nấu ăn thành công." });
        } catch (error) {
            console.log("Error executing deleteRecipe() query:", error);
            return res.status(200).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }
}

module.exports = RecipeController;