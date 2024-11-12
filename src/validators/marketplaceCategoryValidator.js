// Kiểm tra name có tồn tại và độ dài tối đa là 255 ký tự
function isValidName(name) {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 255;
}

// Kiểm tra image_url có đúng định dạng URL
function isValidImageUrl(imageUrl) {
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}([\/\w\-]*)*\/?$/;
    return !imageUrl || (typeof imageUrl === 'string' && (imageUrl === '' || urlPattern.test(imageUrl)));
}

// Hàm validate toàn bộ marketplace category
function validateMarketplaceCategory(category) {
    let errors = '';

    if (!isValidName(category.name)) {
        errors += 'Tên không hợp lệ. Phải là một chuỗi không rỗng và tối đa 255 ký tự. ';
    }
    if (!isValidImageUrl(category.image_url)) {
        errors += 'URL hình ảnh không hợp lệ. ';
    }

    return {
        isValid: errors == '',
        errors
    };
}

module.exports = {
    isValidName,
    isValidImageUrl,
    validateMarketplaceCategory,
};