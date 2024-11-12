const pool = require('../configs/connectDB');

class MarketplaceItemModel {
    // Tạo mục mới
    static async createItem({ category_id, name, image_url, created_by }) {
        const queryString = `
            INSERT INTO marketplace_items (category_id, name, image_url, created_by, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;

        try {
            const [result] = await pool.execute(queryString, [category_id, name, image_url, created_by]);
            return result.insertId; // Trả về id của mục vừa tạo
        } catch (error) {
            console.error('Error executing createItem() query:', error);
            throw error;
        }
    }

    // Lấy thông tin mục theo id
    static async getItemById(itemId) {
        const queryString = `
            SELECT id, category_id, name, image_url, created_by, created_at, updated_by, updated_at
            FROM marketplace_items
            WHERE id = ?
        `;

        try {
            const [rows] = await pool.execute(queryString, [itemId]);
            return rows[0];
        } catch (error) {
            console.error('Error executing getItemById() query:', error);
            throw error;
        }
    }

    // Lấy danh sách tất cả các mục
    static async getAllItems() {
        const queryString = `
            SELECT id, category_id, name, image_url, list_units
            FROM marketplace_items
        `;

        try {
            const [rows] = await pool.execute(queryString);
            return rows;
        } catch (error) {
            console.error('Error executing getAllItems() query:', error);
            throw error;
        }
    }

    // Lấy danh sách mục theo category_id
    static async getItemsByCategoryId(category_id) {
        const queryString = `
            SELECT id, category_id, name, image_url, created_by, created_at, updated_by, updated_at
            FROM marketplace_items
            WHERE category_id = ?
            ORDER BY created_at DESC
        `;

        try {
            const [rows] = await pool.execute(queryString, [category_id]);
            return rows;
        } catch (error) {
            console.error('Error executing getItemsByCategoryId() query:', error);
            throw error;
        }
    }

    // Cập nhật mục
    static async updateItem({ id, category_id, name, image_url, updated_by }) {
        const queryString = `
            UPDATE marketplace_items
            SET category_id = ?, name = ?, image_url = ?, updated_by = ?, updated_at = NOW()
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [category_id, name, image_url, updated_by, id]);
            return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error executing updateItem() query:', error);
            throw error;
        }
    }

    // Xóa mục
    static async deleteItem(itemId) {
        const queryString = `
            DELETE FROM marketplace_items
            WHERE id = ?
        `;

        try {
            const [result] = await pool.execute(queryString, [itemId]);
            return result.affectedRows > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error executing deleteItem() query:', error);
            throw error;
        }
    }
}

module.exports = MarketplaceItemModel;