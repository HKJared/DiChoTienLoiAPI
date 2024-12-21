const express = require('express');
// const VerificationController = require('../../controllers/verificationController');
const uploadFiles = require('../../controllers/uploadController');
const UserController = require('../../controllers/userController');

const RecipeCategoryController = require('../../controllers/recipeCategoryController');

const authenticate = require('../../middlewares/authentication');
const authorize = require('../../middlewares/authorization');
const RecipeController = require('../../controllers/recipeController');
const FamilyController = require('../../controllers/familyController');

const apiRouter = express.Router();

apiRouter.get('/refresh-token', authenticate, UserController.refreshToken);
apiRouter.get('/info', authenticate, UserController.getUserInfo);
apiRouter.put('/change-password', authenticate, UserController.changePassword);
apiRouter.put('/change-avatar', authenticate, UserController.changeAvatar);
apiRouter.put('/update-info', authenticate, UserController.updateUser);


apiRouter.get('/recipe-categories', authenticate, RecipeCategoryController.getCategories);
apiRouter.get('/recipes', RecipeController.searchRecipes);
apiRouter.get('/recipe', authenticate, RecipeController.getRecipeByUser);
apiRouter.post('/recipe', authenticate, RecipeController.createRecipe);
apiRouter.put('/recipe', authenticate, RecipeController.updateRecipe);
apiRouter.delete('/recipe', authenticate, RecipeController.deleteRecipe);


apiRouter.post('/family-group', authenticate, FamilyController.createFamily);
apiRouter.get('/family-groups', authenticate, FamilyController.getFamiliesByUserId);
apiRouter.get('/family-group', authenticate, FamilyController.getFamilyGroup);
apiRouter.post('/family-members', authenticate, FamilyController.addFamilyMembers);
apiRouter.put('/family-group', authenticate, FamilyController.updateFamily);
apiRouter.delete('/family-member', authenticate, FamilyController.deleteFamilyMember);
apiRouter.delete('/family-group', authenticate, FamilyController.deleteFamily);

apiRouter.get('/user-username-or-phone-number', authenticate, UserController.getUserByUsername);

// upload file
apiRouter.post('/upload', authenticate, uploadFiles);

module.exports = apiRouter;