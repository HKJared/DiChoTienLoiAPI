const express = require('express');

const authenticate = require('../../middlewares/authentication');
const authorize = require('../../middlewares/authorization');

const RoleController = require('../../controllers/roleController');
const UserController = require('../../controllers/userController');
const LogController = require('../../controllers/logController');
const MarketplaceCategoryController = require('../../controllers/marketplaceCategoryController');
const MarketplaceItemController = require('../../controllers/marketplaceItemController');
const RecipeCategoryController = require('../../controllers/recipeCategoryController');
const RecipeController = require('../../controllers/recipeController');

const apiRouter = express.Router();


apiRouter.post('/login', UserController.login);

apiRouter.get('/marketplace-categories', MarketplaceCategoryController.getCategories);
apiRouter.get('/marketplace-items', MarketplaceItemController.getItems);

apiRouter.get('/recipes', RecipeController.searchRecipes);

// apiRouter.post('/phone-verification', VerificationController.createPhoneVerification);
// apiRouter.put('/phone-verification', VerificationController.phoneVerification);




module.exports = apiRouter;