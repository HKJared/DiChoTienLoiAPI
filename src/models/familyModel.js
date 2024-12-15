const pool = require('../configs/connectDB');

class FamilyModel {
    // Tạo nhóm gia đình mới
    static async createFamilyGroup(name, group_leader) {
        const queryString = `
            INSERT INTO family_groups (name, group_leader)
            VALUES (?, ?)
        `;
        try {
            const [result] = await pool.execute(queryString, [name, group_leader]);
            return result.insertId; // Trả về ID của nhóm vừa tạo
        } catch (error) {
            console.error('Error executing createFamilyGroup() query:', error);
            throw error;
        }
    }

    // Lấy thông tin nhóm gia đình theo ID
    static async getFamilyGroupById(familyId) {
        const queryString = `
            SELECT *
            FROM family_groups
            WHERE id = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [familyId]);
            return rows[0]; // Trả về nhóm đầu tiên (nếu tồn tại)
        } catch (error) {
            console.error('Error executing getFamilyGroupById() query:', error);
            throw error;
        }
    }

    // Lấy danh sách các nhóm gia đình mà user_id là trưởng nhóm
    static async getFamilyGroupsByLeaderId(leader_id) {
        const queryString = `
            SELECT *
            FROM family_groups
            WHERE group_leader = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [leader_id]);
            return rows; // Trả về danh sách các nhóm mà user_id là trưởng nhóm
        } catch (error) {
            console.error('Error executing getFamilyGroupsByLeaderId() query:', error);
            throw error;
        }
    }

    // Lấy danh sách các nhóm gia đình mà user_id là thành viên
    static async getFamilyGroupsByMemberId(user_id) {
        const queryString = `
            SELECT fg.*
            FROM family_groups fg
            JOIN family_members fm ON fg.id = fm.family_id
            WHERE fm.user_id = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [user_id]);
            return rows; // Trả về danh sách các nhóm mà user_id là thành viên
        } catch (error) {
            console.error('Error executing getFamilyGroupsByMemberId() query:', error);
            throw error;
        }
    }

    // Thêm nhiều thành viên vào nhóm
    static async addFamilyMembers(family_id, user_ids) {
        // Kiểm tra mảng user_ids có hợp lệ không
        if (!Array.isArray(user_ids) || user_ids.length === 0) {
            throw new Error('user_ids phải là một mảng và không được rỗng.');
        }
    
        // Tạo danh sách các giá trị (family_id, user_id) để chèn
        const values = user_ids.map(user_id => [family_id, user_id]);
    
        // Tạo chuỗi giá trị `(?, ?), (?, ?), ...` cho câu lệnh SQL
        const placeholders = values.map(() => `(?, ?)`).join(', ');
    
        const queryString = `
            INSERT INTO family_members (family_id, user_id)
            VALUES ${placeholders}
        `;
    
        // Làm phẳng mảng values thành một mảng 1 chiều để truyền vào execute
        const flattenedValues = values.flat();
    
        try {
            const [result] = await pool.execute(queryString, flattenedValues);
            return result.affectedRows === user_ids.length; // Kiểm tra xem có thêm đủ số thành viên hay không
        } catch (error) {
            console.error('Error executing addFamilyMembers() query:', error);
            throw error;
        }
    }

    // Lấy danh sách thành viên của nhóm
    static async getFamilyMembers(family_id) {
        const queryString = `
            SELECT fm.user_id, u.fullname, u.email
            FROM family_members fm
            JOIN users u ON u.id = fm.user_id
            WHERE fm.family_id = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [family_id]);
            return rows; // Trả về danh sách thành viên
        } catch (error) {
            console.error('Error executing getFamilyMembers() query:', error);
            throw error;
        }
    }

    // Thêm công thức chia sẻ vào nhóm
    static async shareRecipeToFamily(family_id, shared_by, detail) {
        const queryString = `
            INSERT INTO family_recipes (family_id, shared_by, detail)
            VALUES (?, ?, ?)
        `;
        try {
            const [result] = await pool.execute(queryString, [
                family_id,
                shared_by,
                JSON.stringify(detail)
            ]);
            return result.insertId; // Trả về ID của công thức vừa chia sẻ
        } catch (error) {
            console.error('Error executing shareRecipeToFamily() query:', error);
            throw error;
        }
    }

    // Lấy danh sách công thức chia sẻ trong nhóm
    static async getFamilyRecipes(family_id) {
        const queryString = `
            SELECT fr.id, fr.detail, fr.is_approved, fr.approved_at, fr.created_at, u.fullname as shared_by_name
            FROM family_recipes fr
            JOIN users u ON u.id = fr.shared_by
            WHERE fr.family_id = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [family_id]);
            return rows; // Trả về danh sách công thức
        } catch (error) {
            console.error('Error executing getFamilyRecipes() query:', error);
            throw error;
        }
    }

    // Thêm lịch mua sắm chia sẻ vào nhóm
    static async shareShoppingCalendar(family_id, shared_by, detail) {
        const queryString = `
            INSERT INTO family_shopping_calendars (family_id, shared_by, detail)
            VALUES (?, ?, ?)
        `;
        try {
            const [result] = await pool.execute(queryString, [
                family_id,
                shared_by,
                JSON.stringify(detail)
            ]);
            return result.insertId; // Trả về ID của lịch vừa chia sẻ
        } catch (error) {
            console.error('Error executing shareShoppingCalendar() query:', error);
            throw error;
        }
    }

    // Lấy danh sách lịch mua sắm trong nhóm
    static async getShoppingCalendars(family_id) {
        const queryString = `
            SELECT fsc.id, fsc.detail, fsc.is_approved, fsc.approved_at, fsc.created_at, u.fullname as shared_by_name
            FROM family_shopping_calendars fsc
            JOIN users u ON u.id = fsc.shared_by
            WHERE fsc.family_id = ?
        `;
        try {
            const [rows] = await pool.execute(queryString, [family_id]);
            return rows; // Trả về danh sách lịch mua sắm
        } catch (error) {
            console.error('Error executing getShoppingCalendars() query:', error);
            throw error;
        }
    }

    // Xóa thành viên khỏi nhóm
    static async removeFamilyMember(family_id, user_id) {
        const queryString = `
            DELETE FROM family_members
            WHERE family_id = ? AND user_id = ?
        `;
        try {
            const [result] = await pool.execute(queryString, [family_id, user_id]);
            return result.affectedRows > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error executing removeFamilyMember() query:', error);
            throw error;
        }
    }

    // Cập nhật nhóm gia đình mới
    static async updateFamilyGroup(family_group_id, newData) {
        const { name } = newData; console.log(name)
        const queryString = `
            UPDATE family_groups SET name = ?
            WHERE id = ?
        `;
        try {
            const [result] = await pool.execute(queryString, [name, family_group_id]);
            return result.affectedRows > 0; // Trả về ID của nhóm vừa tạo
        } catch (error) {
            console.error('Error executing createFamilyGroup() query:', error);
            throw error;
        }
    }

    static async deleteFamilyGroup(family_id) {
        const queryString = `
            DELETE FROM family_groups
            WHERE id = ?
        `;
        try {
            const [result] = await pool.execute(queryString, [family_id]);
            return result.affectedRows > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error executing deleteFamilyGroup() query:', error);
            throw error;
        }
    }
}

module.exports = FamilyModel;