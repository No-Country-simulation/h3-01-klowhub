import { body, param, ValidationChain } from "express-validator";
import { Membership } from "../models/enum/enum";

export const updateUserValidator: ValidationChain[] = [
  body("longName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un string")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido"),
  body("password")
    .optional()
    .isString()
    .withMessage("La contraseña debe ser un string")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const idByParameterValidator: ValidationChain[] = [
  param("id")
    .isString()
    .withMessage("El ID debe ser un string")
    .isLength({ min: 10, max: 10 })
    .withMessage("El ID debe tener exactamente 10 caracteres"),
];

export const changeMembershipValidator: ValidationChain[] = [
  body("membership")
    .isString()
    .isIn(Object.values(Membership))
    .withMessage("La membresía proporcionada no es válida"),
];
