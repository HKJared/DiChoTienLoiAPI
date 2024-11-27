const express = require('express');
// const VerificationController = require('../../controllers/verificationController');
const uploadFiles = require('../../controllers/uploadController');
const UserController = require('../../controllers/userController');

const RecipeCategoryController = require('../../controllers/recipeCategoryController');

const authenticate = require('../../middlewares/authentication');
const authorize = require('../../middlewares/authorization');
const RecipeController = require('../../controllers/recipeController');

const apiRouter = express.Router();

apiRouter.get('/refresh-token', authenticate, UserController.refreshToken);
apiRouter.get('/info', authenticate, UserController.getUserInfo);
apiRouter.put('/change-password', authenticate, UserController.changePassword);
apiRouter.put('/change-avatar', authenticate, UserController.changeAvatar);
apiRouter.put('/update-info', authenticate, UserController.updateUser);


apiRouter.get('/recipe-categories', authenticate, RecipeCategoryController.getCategories);
apiRouter.get('/recipes', RecipeController.searchRecipes);
apiRouter.get('/recipe', authenticate, RecipeController.searchRecipes);
apiRouter.post('/recipe', authenticate, RecipeController.createRecipe);
apiRouter.put('/recipe', authenticate, RecipeController.updateRecipe);
apiRouter.delete('/recipe', authenticate, RecipeController.deleteRecipe);

// upload file
// apiRouter.post('/upload', authenticate, uploadFiles);

module.exports = apiRouter;