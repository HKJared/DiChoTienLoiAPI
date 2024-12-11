const { upload } = require('../utils/upload');

// Hàm upload được export từ module
async function uploadFiles(req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.error('Upload Error:', err); // Log lỗi upload
            return res.status(500).json({ message: 'Error processing files.' });
        }

        const files = req.files;
        const keys = req.body.keys; // Các key từ body, nếu chỉ có một key thì sẽ là string

        // Kiểm tra nếu chỉ có một key, chuyển nó thành mảng
        let keyArray = Array.isArray(keys) ? keys : [keys];
        if (!keys) {
            keyArray = [];
        }

        if (files.length !== keyArray.length) {
            return res.status(400).json({ message: 'Đã có lỗi xảy ra trong quá trình upload ảnh, vui lòng thử lại.' });
        }

        try {
            // Khởi tạo object để chứa các cặp key-url
            let uploadedUrls = {};

            files.forEach((file, index) => {
                try {
                    // Tạo URL dựa trên tên file
                    uploadedUrls[keyArray[index]] = `/images/${file.filename}`;
                } catch (fileError) {
                    console.error(`Error processing file ${file.originalname}:`, fileError); // Log lỗi xử lý file
                }
            });

            return res.status(200).json(uploadedUrls);
        } catch (error) {
            console.error('Error in uploadFiles function:', error); // Log lỗi tổng quát
            return res.status(500).json({ message: 'Error uploading files.' });
        }
    });
}

module.exports = uploadFiles;