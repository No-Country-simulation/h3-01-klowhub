import { check, ValidationChain } from "express-validator";

export const validateRegister: ValidationChain[] = [
  check("longName").notEmpty().withMessage("El campo longName es requerido"),
  check("email")
    .notEmpty()
    .withMessage("El campo email es requerido")
    .isEmail()
    .withMessage("Debe proveer un email válido"),
  check("password")
    .notEmpty()
    .withMessage("El campo password es requerido")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const validateLogin: ValidationChain[] = [
  check("email")
    .notEmpty()
    .withMessage("El campo email es requerido")
    .isEmail()
    .withMessage("Debe proveer un email válido"),

  check("password")
    .notEmpty()
    .withMessage("El campo password es requerido")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  check("device").optional(),

  check("app").optional(),

  check("country").optional(),

  check("ipAddress").optional(),
];

export const validateLogout: ValidationChain[] = [
  check("device").optional(),
  check("app").optional(),
];
