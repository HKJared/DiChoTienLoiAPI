const multer = require('multer');
const path = require('path');
require('dotenv').config();


// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // Thư mục lưu trữ tạm thời
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Đổi tên tệp tạm thời
    }
});

const upload = multer({ storage: storage }).any();

module.exports = {
    upload
};