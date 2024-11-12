const pool = require('../configs/connectDB');

class RecipeCategoryModel {
    // Tạo danh mục công thức mới
    static async createCategory({ name, image_url, created_by }) {
        const queryString = `
            INSERT INTO recipe_categories (name, image_url, created_by, created_at)
            VALUES (?, ?, ?, NOW())
        `;

        try {
            const [result] = await pool.execute(queryString, [name, image_url, created_by]);
            return result.insertId; // Trả về id của danh mục vừa tạo
        } catch (error) {
            console.error('Error executing createCategory() query:', error);
            throw error;
        }
    }

    // Lấy thông tin danh mục theo id
    static async getCategoryById(categoryId) {
        const queryString = `
            SELECT id, name, image_url, created_by, created_at, updated_by, updated_at
            FROM recipe_categories
            WHERE id = ?
        `;

        try {
            const [rows] = await pool.execute(queryString, [categoryId]);
            return rows[0];
        } catch (error) {
            console.error('Error executing getCategoryById() query:', error);
            throw error;
        }
    }

    // Lấy thông tin danh mục theo tên
    static async getCategoryByName(categoryName) {
        const queryString = `
            SELECT id, name, image_url, created_by, created_at, updated_by, updated_at
            FROM recipe_categories
            WHERE name = ?
        `;

        try {
            const [rows] = await pool.execute(queryString, [categoryName]);
            return rows[0];
        } catch (error) {
            console.error('Error executing getCategoryById() query:', error);
            throw error;
        }
    }

    // Lấy danh sách tất cả các danh mục
    static async getAllCategories() {
        const queryString = `
            SELECT id, name, image_url
            FROM recipe_categories
        `;

        try {
            const [rows] = await pool.execute(queryString);
            return rows;
        } catch (error) {
            console.error('Error executing getAllCategories() query:', error);
            throw error;
        }
    }

    // Cập nhật danh mục công thức
    static async updateCategory({ id, name, image_url, updated_by }) {
        const queryString = `
            UPDATE recipe_categories
            SET name = ?, image_url = ?, updated_by = ?, updated_at = NOW()
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [name, image_url, updated_by, id]);
            return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error executing updateCategory() query:', error);
            throw error;
        }
    }

    // Xóa danh mục công thức
    static async deleteCategory(categoryId) {
        const queryString = `
            DELETE FROM recipe_categories
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [categoryId]);
            return result.affectedRows > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error executing deleteCategory() query:', error);
            throw error;
        }
    }
}

module.exports = RecipeCategoryModel;