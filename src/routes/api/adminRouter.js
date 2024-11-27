const express = require('express');

const authorize = require('../../middlewares/authorization');
const authenticate = require('../../middlewares/authentication');

const RoleController = require('../../controllers/roleController');
const LogController = require('../../controllers/logController');
const UserController = require('../../controllers/userController');
const MarketplaceCategoryController = require('../../controllers/marketplaceCategoryController');
const RecipeCategoryController = require('../../controllers/recipeCategoryController');
const RecipeModel = require('../../models/recipeModel');

const apiRouter = express.Router();

apiRouter.post('/login', UserController.adminLogin);
apiRouter.get('/refresh-token', authenticate, UserController.refreshToken);
apiRouter.get('/info', (req, res, next) => {
    authorize(req, res, 'admin', next);
}, UserController.getAdminInfo);

apiRouter.get('/role-permissions', (req, res, next) => {
    authorize(req, res, 'admin', next);
}, RoleController.getRolePermissions);

apiRouter.post('/marketplace-category', (req, res, next) => {
    authorize(req, res, 'marketplace-category-create', next);
}, MarketplaceCategoryController.createCategory);

apiRouter.post('/recipe-category', (req, res, next) => {
    authorize(req, res, 'recipe-category-create', next);
}, RecipeCategoryController.createCategory);

apiRouter.put('/approve-recipe', (req, res, next) => {
    authorize(req, res, 'recipe-approve', next);
}, RecipeModel.approveRecipe);

apiRouter.get('/old-logs', (req, res, next) => {
    authorize(req, res, 'admin-creation', next);
}, LogController.getOldLogs);

module.exports = apiRouter;