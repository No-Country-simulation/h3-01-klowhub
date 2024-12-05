import { body, ValidationChain } from "express-validator";
import {
  Expertise,
  Language,
  PaymentMethod,
  Platform,
  Sector,
  Tool,
} from "../models/enum/enum";

export const validateUserPro: ValidationChain[] = [
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("lastName")
    .isString()
    .notEmpty()
    .withMessage("El apellido es obligatorio"),

  body("about")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("La descripción no debe exceder los 500 caracteres"),

  body("country")
    .optional()
    .isString()
    .withMessage("El país debe ser un string válido"),

  body("sector")
    .isArray({ min: 1 })
    .withMessage("El sector debe ser un array con al menos un elemento")
    .custom((value) =>
      value.every((sector: string) =>
        (Object.values(Sector) as string[]).includes(sector)
      )
    )
    .withMessage("El sector contiene valores no válidos"),

  body("sectorsExperience")
    .optional()
    .isString()
    .withMessage("La experiencia en sectores debe ser un string"),

  body("tools")
    .isArray({ min: 1 })
    .withMessage("Las herramientas deben ser un array con al menos un elemento")
    .custom((value) =>
      value.every((tool: string) =>
        (Object.values(Tool) as string[]).includes(tool)
      )
    )
    .withMessage("Las herramientas contienen valores no válidos"),

  body("toolsExperience")
    .optional()
    .isString()
    .withMessage("La experiencia en herramientas debe ser un string"),

  body("portfolioLink")
    .optional()
    .isURL()
    .withMessage("El enlace del portafolio debe ser una URL válida"),

  body("academicFormation")
    .optional()
    .isString()
    .withMessage("La formación académica debe ser un string"),

  body("certificationLink")
    .optional()
    .isURL()
    .withMessage("El enlace de certificación debe ser una URL válida"),

  body("paymentMethod")
    .isString()
    .isIn(
      Object.values(PaymentMethod).map((method) =>
        method.toUpperCase()
      ) as string[]
    ) // Asegúrate de validar correctamente
    .withMessage("El método de pago es inválido"),

  body("accountData")
    .isString()
    .notEmpty()
    .withMessage("Los datos de cuenta son obligatorios"),

  // Validación del mentor (opcional)
  body("mentor")
    .optional()
    .custom((mentor) => {
      // Validar que el objeto `mentor` tenga el esquema correcto
      if (typeof mentor !== "object") {
        throw new Error("El mentor debe ser un objeto válido");
      }

      const errors: string[] = [];

      // Validar cada campo del mentor
      if (
        !Array.isArray(mentor.expertiseArea) ||
        mentor.expertiseArea.length < 1
      ) {
        errors.push(
          "El área de experiencia debe ser un array con al menos un elemento válido"
        );
      } else if (
        !mentor.expertiseArea.every((area: string) =>
          (Object.values(Sector) as string[]).includes(area)
        )
      ) {
        errors.push("El área de experiencia contiene valores no válidos");
      }

      if (!Object.values(Expertise).includes(mentor.expertiseLevel)) {
        errors.push("El nivel de experiencia es inválido");
      }

      if (!Object.values(Platform).includes(mentor.platform)) {
        errors.push("La plataforma es inválida");
      }
      if (typeof mentor.mentoryCost !== "number" || mentor.mentoryCost <= 0) {
        errors.push("El costo de mentorías debe ser un número positivo");
      }

      if (!Array.isArray(mentor.language) || mentor.language.length < 1) {
        errors.push(
          "Los idiomas deben ser un array con al menos un elemento válido"
        );
      } else if (
        !mentor.language.every((lang: string) =>
          (Object.values(Language) as string[]).includes(lang)
        )
      ) {
        errors.push("Los idiomas contienen valores no válidos");
      }

      if (
        typeof mentor.aboutMentories !== "string" ||
        mentor.aboutMentories.length > 500
      ) {
        errors.push(
          "La descripción de las mentorías debe ser un string de hasta 500 caracteres"
        );
      }

      if (errors.length > 0) {
        throw new Error(errors.join(". "));
      }

      return true;
    }),
];

// Lista de campos permitidos para actualizar (se ajusta a tus necesidades)
const allowedFields = [
  'firstName', 'lastName', 'about', 'country', 'sector', 'sectorsExperience',
  'tools', 'toolsExperience', 'portfolioLink', 'academicFormation', 
  'certificationLink', 'paymentMethod', 'accountData', 'mentor'
];

export const validateUserProUpdate: ValidationChain[] = [
  // Validación de campos individuales, todos opcionales
  body("firstName").isString().optional(),
  body("lastName").isString().optional(),
  body("about")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("La descripción no debe exceder los 500 caracteres"),
  body("country")
    .optional()
    .isString()
    .withMessage("El país debe ser un string válido"),
  body("sector")
    .optional()
    .isArray({ min: 1 })
    .withMessage("El sector debe ser un array con al menos un elemento")
    .custom((value) =>
      value.every((sector: string) =>
        (Object.values(Sector) as string[]).includes(sector)
      )
    )
    .withMessage("El sector contiene valores no válidos"),
  body("sectorsExperience")
    .optional()
    .isString()
    .withMessage("La experiencia en sectores debe ser un string"),
  body("tools")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Las herramientas deben ser un array con al menos un elemento")
    .custom((value) =>
      value.every((tool: string) =>
        (Object.values(Tool) as string[]).includes(tool)
      )
    )
    .withMessage("Las herramientas contienen valores no válidos"),
  body("toolsExperience")
    .optional()
    .isString()
    .withMessage("La experiencia en herramientas debe ser un string"),
  body("portfolioLink")
    .optional()
    .isURL()
    .withMessage("El enlace del portafolio debe ser una URL válida"),
  body("academicFormation")
    .optional()
    .isString()
    .withMessage("La formación académica debe ser un string"),
  body("certificationLink")
    .optional()
    .isURL()
    .withMessage("El enlace de certificación debe ser una URL válida"),
  body("paymentMethod")
    .optional()
    .isString()
    .isIn(
      Object.values(PaymentMethod).map((method) =>
        method.toUpperCase()
      ) as string[]
    )
    .withMessage("El método de pago es inválido"),
  body("accountData")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Los datos de cuenta son obligatorios"),

  // Validación del mentor (opcional)
  body("mentor")
    .optional()
    .custom((mentor) => {
      if (typeof mentor !== "object") {
        throw new Error("El mentor debe ser un objeto válido");
      }

      const errors: string[] = [];

      // Validaciones dentro de mentor
      if (
        !Array.isArray(mentor.expertiseArea) ||
        mentor.expertiseArea.length < 1
      ) {
        errors.push(
          "El área de experiencia debe ser un array con al menos un elemento válido"
        );
      } else if (
        !mentor.expertiseArea.every((area: string) =>
          (Object.values(Sector) as string[]).includes(area)
        )
      ) {
        errors.push("El área de experiencia contiene valores no válidos");
      }

      if (!Object.values(Expertise).includes(mentor.expertiseLevel)) {
        errors.push("El nivel de experiencia es inválido");
      }

      if (!Object.values(Platform).includes(mentor.platform)) {
        errors.push("La plataforma es inválida");
      }

      if (typeof mentor.mentoryCost !== "number" || mentor.mentoryCost <= 0) {
        errors.push("El costo de mentorías debe ser un número positivo");
      }

      if (!Array.isArray(mentor.language) || mentor.language.length < 1) {
        errors.push(
          "Los idiomas deben ser un array con al menos un elemento válido"
        );
      } else if (
        !mentor.language.every((lang: string) =>
          (Object.values(Language) as string[]).includes(lang)
        )
      ) {
        errors.push("Los idiomas contienen valores no válidos");
      }

      if (
        typeof mentor.aboutMentories !== "string" ||
        mentor.aboutMentories.length > 500
      ) {
        errors.push(
          "La descripción de las mentorías debe ser un string de hasta 500 caracteres"
        );
      }

      if (errors.length > 0) {
        throw new Error(errors.join(". "));
      }

      return true;
    }),

  // Validación para asegurarse de que solo se envíen los campos permitidos
  body()
    .custom((value, { req }) => {
      const invalidFields = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key)
      );

      if (invalidFields.length > 0) {
        throw new Error(`Los campos no permitidos son: ${invalidFields.join(', ')}`);
      }

      return true;
    })
];
