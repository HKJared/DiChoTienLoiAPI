const LogModel = require('../models/logModel');
const FamilyModel = require('../models/familyModel');
const { validateFamily } = require("../validators/familyValidator");

class FamilyController {
    // Tạo gia đình mới
    static async createFamily(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Tạo mới thông tin gia đình.', user_id);

            const { name, member_ids } = req.body;

            if (!name || !member_ids) {
                await LogModel.updateDetailLog('Thiếu thông tin cần thiết', log_id);
                return res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin (Tên nhóm gia đình, các thành viên)." });
            }

            // const checkValid = validateFamily(family);

            // if (!checkValid.isValid) {
            //     await LogModel.updateDetailLog(checkValid.errors, log_id);
            //     return res.status(400).json({ message: checkValid.errors });
            // }

            const family_group_id = await FamilyModel.createFamilyGroup(name, user_id);

            if (!family_group_id) {
                await LogModel.updateDetailLog('Tạo gia đình không thành công.', log_id);
                return res.status(400).json({ message: "Tạo gia đình không thành công, vui lòng thử lại." });
            }

            await FamilyModel.addFamilyMembers(family_group_id, member_ids);

            const new_family = await FamilyModel.getFamilyGroupById(family_group_id);
            new_family.members = await FamilyModel.getFamilyMembers(family_group_id)

            await LogModel.updateDetailLog('Tạo nhóm gia đình thành công.', log_id);
            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: "Tạo nhóm gia đình thành công.", new_family });
        } catch (error) {
            console.error("Error executing createFamily() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Lấy thông tin nhóm gia đình
    static async getFamilyGroup(req, res) {
        try {
            const user_id = req.user_id;

            const { id } = req.query;

            if (!id) {
                await LogModel.updateDetailLog('Thiếu id nhóm gia đình.', log_id);
                return res.status(400).json({ message: 'Thiếu id nhóm gia đình.' });
            }

            const family_group = await FamilyModel.getFamilyGroupById(id);
            family_group.members = await FamilyModel.getFamilyMembers(id);

            return res.status(200).json({ family_group });
        } catch (error) {
            console.error("Error executing getFamilies() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Lấy danh sách gia đình
    static async getFamiliesByUserId(req, res) {
        try {
            const user_id = req.user_id;

            const familiesAsLeader = await FamilyModel.getFamilyGroupsByLeaderId(user_id);
            const familiesAsMember = await FamilyModel.getFamilyGroupsByMemberId(user_id);


            return res.status(200).json({ familiesAsLeader, familiesAsMember });
        } catch (error) {
            console.error("Error executing getFamilies() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Tìm kiếm gia đình
    static async searchFamilies(req, res) {
        try {
            const keyword = req.query.keyword || '';
            const page = req.query.page || 1;
            const itemsPerPage = req.query.itemsPerPage || 20;

            const { families, totalCount } = await FamilyModel.search(keyword, page, itemsPerPage);

            return res.status(200).json({ families, totalCount });
        } catch (error) {
            console.error("Error executing searchFamilies() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Cập nhật thông tin gia đình
    static async updateFamily(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Cập nhật thông tin gia đình.', user_id);

            const { family_group_id, newData } = req.body;

            if (!family_group_id || !newData) {
                await LogModel.updateDetailLog('Thiếu id hoặc dữ liệu gia đình.', log_id);
                return res.status(400).json({ message: 'Thiếu id hoặc dữ liệu gia đình.' });
            }

            // const checkValid = validateFamily(newData);

            // if (!checkValid.isValid) {
            //     await LogModel.updateDetailLog(checkValid.errors, log_id);
            //     return res.status(400).json({ message: checkValid.errors });
            // }

            const family = await FamilyModel.getFamilyGroupById(family_group_id);

            if (!family) {
                await LogModel.updateDetailLog('Không tìm thấy thông tin gia đình.', log_id);
                return res.status(400).json({ message: 'Không tìm thấy thông tin gia đình.' });
            }

            if (user_id != family.group_leader) {
                await LogModel.updateDetailLog('Người dùng không có quyền cập nhật.', log_id);
                return res.status(403).json({ message: 'Bạn không có quyền cập nhật thông tin gia đình này.' });
            }

            const is_updated = await FamilyModel.updateFamilyGroup(family_group_id, newData);

            if (!is_updated) {
                await LogModel.updateDetailLog('Cập nhật thông tin gia đình không thành công.', log_id);
                return res.status(400).json({ message: "Cập nhật không thành công, vui lòng thử lại." });
            }

            const updated_family = await FamilyModel.getFamilyGroupById(family_group_id);

            await LogModel.updateDetailLog('Cập nhật thông tin gia đình thành công.', log_id);
            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: "Cập nhật thông tin gia đình thành công.", updated_family });
        } catch (error) {
            console.error("Error executing updateFamily() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Thêm thành viên vào nhóm gia đình
    static async addFamilyMembers(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('add-family-member', user_id);

            const { family_group_id, member_ids } = req.body;

            const family_group = await FamilyModel.getFamilyGroupById(family_group_id);

            if (user_id != family_group.group_leader) {
                await LogModel.updateStatusLog('Không phải trưởng nhóm gia đình.', log_id);
                return res.status(200).json({ message: "Không phải trưởng nhóm gia đình." });
            }

            if (!family_group_id || !member_ids || member_ids.length <= 0) {
                await LogModel.updateStatusLog('Thiếu dữ liệu cần thiết.', log_id);
                return res.status(200).json({ message: "Thiếu dữ liệu cần thiết." });
            }
            
            const is_add = await FamilyModel.addFamilyMembers(family_group_id, member_ids);
            if (!is_add) {
                await LogModel.updateStatusLog('Thêm không thành công.', log_id);
                return res.status(400).json({ message: "Thêm không thành công." });
            }

            await LogModel.updateStatusLog(log_id);
            return res.status(200).json({ message: "Thêm thành công." })
        } catch (error) {
            console.error("Error executing addFamilyMembers() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Xóa thành viên khỏi nhóm gia đình
    static async deleteFamilyMember(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('delete-family-member', user_id);

            const { family_group_id, member_id } = req.body;

            if (!family_group_id || !member_id) {
                await LogModel.updateStatusLog('Thiếu dữ liệu cần thiết', log_id);
                return res.status(200).json({ message: "Thiếu dữ liệu cần thiết" });
            }

            const family_group = await FamilyModel.getFamilyGroupById(family_group_id);

            if (user_id != family_group.group_leader) {
                await LogModel.updateStatusLog('Không phải trưởng nhóm gia đình.', log_id);
                return res.status(200).json({ message: "Không phải trưởng nhóm gia đình." });
            }
            
            const is_delete = await FamilyModel.removeFamilyMember(family_group_id, member_id);
            if (!is_delete) {
                await LogModel.updateStatusLog('Xóa không thành công.', log_id);
                return res.status(400).json({ message: "Xóa không thành công." });
            }

            await LogModel.updateStatusLog(log_id);
            return res.status(200).json({ message: "Xóa thành công." })
        } catch (error) {
            console.error("Error executing deleteFamilyMember() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }

    // Xóa thông tin gia đình
    static async deleteFamily(req, res) {
        try {
            const user_id = req.user_id;
            const log_id = await LogModel.createLog('Xóa thông tin gia đình.', user_id);

            const { family_group_id } = req.body;

            if (!family_group_id) {
                await LogModel.updateDetailLog('Không có id nhóm gia đình cần xóa.', log_id);
                return res.status(400).json({ message: 'Không có id nhóm gia đình cần xóa.' });
            }

            const family = await FamilyModel.getFamilyGroupById(family_group_id);

            if (!family) {
                await LogModel.updateDetailLog('Không tìm thấy thông tin nhóm gia đình cần xóa.', log_id);
                return res.status(400).json({ message: 'Không tìm thấy thông nhóm tin gia đình cần xóa.' });
            }

            if (user_id != family.group_leader) {
                await LogModel.updateDetailLog('Không phải trưởng nhóm.', log_id);
                return res.status(400).json({ message: 'Không phải trưởng nhóm.' });
            }

            const is_deleted = await FamilyModel.deleteFamilyGroup(family_group_id);

            if (!is_deleted) {
                await LogModel.updateDetailLog('Xóa thông tin gia đình không thành công.', log_id);
                return res.status(400).json({ message: "Xóa không thành công, vui lòng thử lại." });
            }

            await LogModel.updateDetailLog('Xóa nhóm gia đình thành công.', log_id);
            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: "Xóa nhóm gia đình thành công." });
        } catch (error) {
            console.error("Error executing deleteFamily() query:", error);
            return res.status(500).json({ message: "Có lỗi từ phía máy chủ." });
        }
    }
}

module.exports = FamilyController;