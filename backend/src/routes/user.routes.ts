import passport from "passport";
import express from 'express';
import { getOneUser, deactivateUser, updateUser } from '../controllers/user.controller'
import { idByParameterValidator, handleValidationErrors, updateUserValidator } from '../middlewares'

const userRouter = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

// User básico
userRouter.route('/:id')
    .get(authenticate, idByParameterValidator, handleValidationErrors, getOneUser)
    .delete(authenticate, idByParameterValidator, handleValidationErrors, deactivateUser)
    .put(authenticate, updateUserValidator, handleValidationErrors, updateUser);

export default userRouter;