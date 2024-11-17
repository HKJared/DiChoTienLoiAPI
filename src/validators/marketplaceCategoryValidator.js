// Thông điệp lỗi
const ERROR_MESSAGES = {
    INVALID_NAME: 'Tên không hợp lệ. Phải là một chuỗi không rỗng và tối đa 255 ký tự.',
    INVALID_IMAGE_URL: 'URL hình ảnh không hợp lệ.',
};

// Kiểm tra name có tồn tại và độ dài tối đa là 255 ký tự
function isValidName(name) {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 255;
}

// Kiểm tra image_url có đúng định dạng URL
function isValidImageUrl(imageUrl) {
    return typeof imageUrl === 'string';
}

// Hàm validate toàn bộ marketplace category
function validateMarketplaceCategory(category) {
    const errors = [];

    if (!isValidName(category.name)) {
        errors.push(ERROR_MESSAGES.INVALID_NAME);
    }
    if (!isValidImageUrl(category.image_url)) {
        errors.push(ERROR_MESSAGES.INVALID_IMAGE_URL);
    }

    return {
        isValid: errors.length === 0,
        errors: errors.join(' '),
    };
}

module.exports = {
    ERROR_MESSAGES,
    isValidName,
    isValidImageUrl,
    validateMarketplaceCategory,
};