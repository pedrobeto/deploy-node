import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate';

import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import { string } from '@hapi/joi';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', celebrate({
    [Segments.BODY]: {
        email: Joi.string().required().email(),
    },
}), forgotPasswordController.create);

passwordRouter.post('/reset', celebrate({
    [Segments.BODY]: {
        token: Joi.string().required().uuid(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
}), resetPasswordController.create);

export default passwordRouter;
