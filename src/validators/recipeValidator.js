// Thông điệp lỗi
const ERROR_MESSAGES = {
    INVALID_RECIPE: 'Không tìm thấy công thức nấu ăn.',
    INVALID_CATEGORY_ID: 'Không có mã phân loại công thức nấu ăn.',
    INVALID_NAME: 'Tên món ăn không hợp lệ. Phải là một chuỗi không rỗng và tối đa 255 ký tự.',
    INVALID_IMAGE_URL: 'URL hình ảnh không hợp lệ.',
    INVALID_DESCRIPTION: 'Mô tả không hợp lệ. Phải là một chuỗi tối đa 1000 ký tự.',
    INVALID_TIME: 'Thời gian không hợp lệ. Phải là số nguyên dương.',
    INVALID_SERVING: 'Số lượng khẩu phần không hợp lệ. Phải là số nguyên lớn hơn hoặc bằng 1.',
    INVALID_COST_ESTIMATE: 'Chi phí dự kiến không hợp lệ. Phải là số lớn hơn hoặc bằng 10,000.',
    INVALID_KCAL: 'Số kcal không hợp lệ. Phải là số nguyên dương.',
    INVALID_INGREDIENTS: 'Nguyên liệu không hợp lệ. Phải là một mảng chứa ít nhất một phần tử.',
    INVALID_INSTRUCTIONS: 'Hướng dẫn không hợp lệ. Phải là một mảng chứa ít nhất một phần tử.',
};

// Kiểm tra name có hợp lệ hay không
function isValidName(name) {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 255;
}

// Kiểm tra image_url có hợp lệ hay không
function isValidImageUrl(imageUrl) {
    return !imageUrl || typeof imageUrl === 'string' ;
}

// Kiểm tra description có hợp lệ hay không
function isValidDescription(description) {
    return typeof description === 'string' && description.length <= 1000;
}

// Kiểm tra time có hợp lệ hay không
function isValidTime(time) {
    return Number.isInteger(time) && time >= 0;
}

// Kiểm tra serving có hợp lệ hay không
function isValidServing(serving) {
    return Number.isInteger(serving) && serving >= 1;
}

// Kiểm tra cost_estimate có hợp lệ hay không
function isValidCostEstimate(costEstimate) {
    return typeof costEstimate === 'number' && costEstimate >= 10000;
}

// Kiểm tra kcal có hợp lệ hay không
function isValidKcal(kcal) {
    return Number.isInteger(kcal) && kcal >= 0;
}

// Kiểm tra ingredients có hợp lệ hay không
function isValidIngredients(ingredients) {
    return Array.isArray(ingredients) && ingredients.length > 0;
}

// Kiểm tra instructions có hợp lệ hay không
function isValidInstructions(instructions) {
    return Array.isArray(instructions) && instructions.length > 0;
}

// Hàm validate toàn bộ recipe
function validateRecipe(recipe) {
    const errors = [];
    if (!recipe) {
        errors.push(ERROR_MESSAGES.INVALID_RECIPE);
        return { isValid: false, errors: errors.join(' ') };
    }
    // console.log(1)
    if (!recipe.name || !isValidName(recipe.name)) {
        errors.push(ERROR_MESSAGES.INVALID_NAME);
    }
    // console.log(2)
    if (!isValidImageUrl(recipe.image_url)) {
        errors.push(ERROR_MESSAGES.INVALID_IMAGE_URL);
    }
    // console.log(3)
    if (!recipe.description || !isValidDescription(recipe.description)) {
        errors.push(ERROR_MESSAGES.INVALID_DESCRIPTION);
    }
    // console.log(4)
    if (!recipe.time || !isValidTime(recipe.time)) {
        errors.push(ERROR_MESSAGES.INVALID_TIME);
    }
    // console.log(5)
    if (!recipe.serving || !isValidServing(recipe.serving)) {
        errors.push(ERROR_MESSAGES.INVALID_SERVING);
    }
    // console.log(6)
    if (!recipe.cost_estimate || !isValidCostEstimate(recipe.cost_estimate)) {
        errors.push(ERROR_MESSAGES.INVALID_COST_ESTIMATE);
    }
    // console.log(7)
    if (!recipe.kcal || !isValidKcal(recipe.kcal)) {
        errors.push(ERROR_MESSAGES.INVALID_KCAL);
    }
    // console.log(8)
    if (!recipe.ingredients || !isValidIngredients(recipe.ingredients)) {
        errors.push(ERROR_MESSAGES.INVALID_INGREDIENTS);
    }
    // console.log(9)
    if (!recipe.instructions || !isValidInstructions(recipe.instructions)) {
        errors.push(ERROR_MESSAGES.INVALID_INSTRUCTIONS);
    }
    // console.log(10)

    if (errors.length > 0) {
        return { isValid: false, errors: errors.join(' ') };
    }

    return { isValid: true, errors: '' };
}


module.exports = {
    ERROR_MESSAGES,
    isValidName,
    isValidImageUrl,
    isValidDescription,
    isValidTime,
    isValidServing,
    isValidCostEstimate,
    isValidKcal,
    isValidIngredients,
    isValidInstructions,
    validateRecipe,
};