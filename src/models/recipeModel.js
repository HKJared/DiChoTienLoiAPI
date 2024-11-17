const pool = require('../configs/connectDB');
const diacritics = require('diacritics');

class RecipeModel {
    // Tạo công thức nấu ăn mới
    static async createRecipe({
        category_id,
        name,
        image_url,
        description,
        time,
        serving,
        cost_estimate,
        kcal,
        ingredients,
        instructions,
        created_by,
    }) {
        const queryString = `
            INSERT INTO recipes (category_id, name, image_url, description, time, serving, cost_estimate, kcal, ingredients, instructions, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const [result] = await pool.execute(queryString, [
                category_id,
                name,
                image_url,
                description,
                time,
                serving,
                cost_estimate,
                kcal,
                JSON.stringify(ingredients),
                JSON.stringify(instructions),
                created_by
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error executing createRecipe() query:', error);
            throw error;
        }
    }

    // Lấy thông tin công thức theo id từ admin
    static async getRecipeByAdmin(recipeId) {
        const queryString = `
            SELECT
                r.*,
                rc.name as category_name,
                u.fullname as user_fullname
            FROM
                recipes r
            JOIN
                recipe_categories rc ON rc.id = r.category_id
            JOIN
                users u ON u.id = r.created_by
            WHERE
                r.id = ?
        `;

        try {
            const [rows] = await pool.execute(queryString, [recipeId]);
            return rows[0];
        } catch (error) {
            console.error('Error executing getRecipeById() query:', error);
            throw error;
        }
    }

    // Lấy thông tin công thức theo id từ user
    static async getRecipeByUser(recipeId) {
        const queryString = `
            SELECT
                r.id, r.name, r.category_id, r.image_url, r.description, r.time, r.serving, r.cost_estimate, r.kcal, r.ingredients, r.instructions, r.total_views, r.total_saves, r.created_by,
                rc.name as category_name,
                u.fullname as user_fullname
            FROM
                recipes r
            JOIN
                recipe_categories rc ON rc.id = r.category_id
            JOIN
                users u ON u.id = r.created_by
            WHERE
                r.id = ?
        `;

        try {
            const [rows] = await pool.execute(queryString, [recipeId]);
            return rows[0];
        } catch (error) {
            console.error('Error executing getRecipeById() query:', error);
            throw error;
        }
    }

    // Lấy tất cả các công thức
    static async getAllRecipes() {
        const queryString = `
            SELECT *
            FROM recipes
        `;

        try {
            const [rows] = await pool.execute(queryString);
            return rows;
        } catch (error) {
            console.error('Error executing getAllRecipes() query:', error);
            throw error;
        }
    }

    // Cập nhật công thức
    static async updateRecipe(id, {
        category_id,
        name,
        image_url,
        description,
        time,
        serving,
        cost_estimate,
        kcal,
        ingredients,
        instructions
    }) {
        const queryString = `
            UPDATE recipes
            SET category_id = ?, name = ?, image_url = ?, description = ?, time = ?, serving = ?, cost_estimate = ?, kcal = ?, ingredients = ?, instructions = ?, is_approved = 0, approved_at = NULL
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [
                category_id,
                name,
                image_url,
                description,
                time,
                serving,
                cost_estimate,
                kcal,
                JSON.stringify(ingredients),
                JSON.stringify(instructions),
                id
            ]);
            return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error executing updateRecipe() query:', error);
            throw error;
        }
    }

    // Xóa công thức nấu ăn
    static async deleteRecipe(recipeId) {
        const queryString = `
            DELETE FROM recipes
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [recipeId]);
            return result.affectedRows > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error executing deleteRecipe() query:', error);
            throw error;
        }
    }

    // Tăng lượt xem công thức
    static async incrementViews(recipeId) {
        const queryString = `
            UPDATE recipes
            SET total_views = total_views + 1
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [recipeId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error executing incrementViews() query:', error);
            throw error;
        }
    }

    // Tăng lượt lưu công thức
    static async incrementSaves(recipeId) {
        const queryString = `
            UPDATE recipes
            SET total_saves = total_saves + 1
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [recipeId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error executing incrementSaves() query:', error);
            throw error;
        }
    }

    // Tìm kiếm công thức nấu ăn
    static async search(keywords, page, itemsPerPage, category_id) {
        // Loại bỏ dấu và chuyển toàn bộ chuỗi thành chữ thường
        const normalizedKeywords = diacritics.remove(keywords.toLowerCase())
            .split(/\s+/) // Tách chuỗi thành mảng từ khóa dựa trên khoảng trắng
            .filter(kw => kw.trim() !== ''); // Lọc ra các từ khóa không rỗng
    
        // Xử lý các từ khóa trong mảng keywords thành điều kiện LIKE
        const keywordConditions = normalizedKeywords
            .map(kw => `(
                LOWER(r.name) LIKE LOWER('%${kw}%') OR
                LOWER(r.description) LIKE LOWER('%${kw}%') OR
                LOWER(r.time) LIKE LOWER('%${kw}%') OR
                LOWER(r.serving) LIKE LOWER('%${kw}%') OR
                LOWER(r.kcal) LIKE LOWER('%${kw}%') OR
                LOWER(r.ingredients) LIKE LOWER('%${kw}%') OR
                LOWER(r.instructions) LIKE LOWER('%${kw}%') OR
                LOWER(rc.name) LIKE LOWER('%${kw}%')

            )`)
            .join(' OR ');
    
        // Nếu không có từ khóa hợp lệ, thiết lập điều kiện mặc định luôn đúng
        const keywordCondition = keywordConditions.length > 0 ? keywordConditions : '1=1';
    
        // Tính toán giá trị OFFSET cho phân trang
        const offset = (page - 1) * itemsPerPage;
    
        // Tạo chuỗi query SQL để lấy công thức nấu ăn
        const queryString = `
            SELECT
                r.id, r.name, r.category_id, r.image_url, r.time, r.serving, r.total_views, r.total_saves, r.created_by,
                rc.name as category_name,
                u.fullname as user_fullname
            FROM
                recipes r
            JOIN
                recipe_categories rc ON rc.id = r.category_id
            JOIN
                users u ON u.id = r.created_by
            WHERE
                r.is_approved = 1
                AND NOT EXISTS (
                    SELECT 1 FROM user_disables ud 
                    WHERE ud.user_id = r.created_by
                    AND ud.disable_end > NOW()
                    AND ud.is_active = 1
                )
                ${ category_id ? 'AND r.category_id = ' + category_id : '' }
                AND (${keywordCondition})
            LIMIT ${itemsPerPage} OFFSET ${offset}
        `;
    
        // Tạo chuỗi query SQL để đếm tổng số công thức nấu ăn
        const countQueryString = `
            SELECT COUNT(*) AS totalCount
            FROM
                recipes r
            JOIN
                recipe_categories rc ON rc.id = r.category_id
            JOIN
                users u ON u.id = r.created_by
            WHERE
                r.is_approved = 1
                AND NOT EXISTS (
                    SELECT 1 FROM user_disables ud 
                    WHERE ud.user_id = r.created_by
                    AND ud.disable_end > NOW()
                    AND ud.is_active = 1
                )
                ${ category_id ? 'AND r.category_id = ' + category_id : '' }
                AND (${keywordCondition})
        `;
        try {
            // Lấy danh sách công thức nấu ăn
            const [rows] = await pool.execute(queryString);
    
            // Đếm tổng số công thức nấu ăn
            const [countResult] = await pool.execute(countQueryString);
            const totalCount = countResult[0].totalCount;
    
            return {
                recipes: rows,
                totalCount: totalCount // Nếu bạn cũng muốn trả về tổng số công thức nấu ăn
            };
        } catch (error) {
            console.error('Error executing search() query:', error);
            throw error;
        }
    }
}

module.exports = RecipeModel;