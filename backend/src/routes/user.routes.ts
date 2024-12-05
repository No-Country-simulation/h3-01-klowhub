import passport from "passport";
import express from 'express';
import { getOneUser, deactivateUser, updateUser, getMyUser, getUserMembership, changeMembership } from '../controllers/user.controller'
import { idByParameterValidator, handleValidationErrors, updateUserValidator, uploadImageMdw, changeMembershipValidator } from '../middlewares'
import { imageController } from "../controllers";

const userRouter = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });
const multerMdw = uploadImageMdw.single('imageProfile')    // mdw de carga de imagen

// User básico
userRouter.route('/:id')
.get(authenticate, idByParameterValidator, handleValidationErrors, getOneUser)
.delete(authenticate, idByParameterValidator, handleValidationErrors, deactivateUser)
.patch(authenticate, updateUserValidator, handleValidationErrors, updateUser);

userRouter.route('/imageProfile/:id')
.patch(authenticate, idByParameterValidator, multerMdw, handleValidationErrors, imageController.imageRegisterUser)

userRouter.route('/myProfile/:id')
  .get(authenticate, idByParameterValidator, handleValidationErrors, getMyUser);

userRouter.route('/membership/:id')
  .get(authenticate, idByParameterValidator, handleValidationErrors, getUserMembership)
  .patch(authenticate, idByParameterValidator, changeMembershipValidator, handleValidationErrors, changeMembership)

export default userRouter;