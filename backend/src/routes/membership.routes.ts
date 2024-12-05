import passport from "passport";
import express from 'express';
import { getUserMembership, changeMembership} from '../controllers/user.controller'
import { changeMembershipValidator, idByParameterValidator, handleValidationErrors} from '../middlewares'

const userRouter = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

userRouter.route('/:id')
    .get(authenticate, idByParameterValidator, handleValidationErrors, getUserMembership)
    .put(authenticate, idByParameterValidator, changeMembershipValidator, handleValidationErrors, changeMembership)

export default userRouter;