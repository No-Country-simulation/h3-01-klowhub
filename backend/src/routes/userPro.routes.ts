import passport from "passport";
import express from 'express';
import { getUserProByUserId, registerUserPro, updateUserPro } from '../controllers/userPro.controller'
import { idByParameterValidator, handleValidationErrors, validateUserPro, updateUserValidator } from '../middlewares'
import { uploadImageMdw } from '../middlewares'

const userRouter = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });
const multerMdw = uploadImageMdw.single('imageProfile')    // mdw de carga de imagen

// User PRO -> el id es del user básico asociado a su perfil PRO
userRouter.route('/:id')
    .post(authenticate, idByParameterValidator, validateUserPro, uploadImageMdw.single('imageProfile'), handleValidationErrors, registerUserPro)
    .get(authenticate, idByParameterValidator, handleValidationErrors, getUserProByUserId)
    .patch(authenticate, idByParameterValidator, updateUserValidator, handleValidationErrors, updateUserPro)

export default userRouter;