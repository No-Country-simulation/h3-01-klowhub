import { body, ValidationChain } from "express-validator";
import { PaymentMethod, Sector, Tool } from "../models/enum/enum";

/* 
{
  "firstName": "Roman",
  "lastName": "Polanski",
  "description": "Desarrollador con experiencia en automatización y análisis de datos.",
  "country": "Polonia",
  "sector": ["Seguridad y vigilancia", "Marketing digital"],
  "sectorsExperience": "Más de 5 años liderando proyectos de automatización en el sector de marketing digital.",
  "tools": ["Dropbox", "PostgreSQL", "Box"],
  "toolsExperience": "Dominio avanzado en análisis y visualización de datos utilizando MySQL y Power BI.",
  "portfolioLink": "https://romanpolanskiportfolio.com",
  "academicFormation": "Ingeniería en Sistemas de Información.",
  "certificationLink": "https://certificaciones.romanpolanski.com",
  "certificationFiles": ["cert_analista_datos.pdf", "cert_automatizacion.pdf"],
  "paymentMethod": "Paypal",
  "accountData": "12333215650",
  "isMentor": true
}
 */

export const validateUserPro: ValidationChain[] = [
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("lastName")
    .isString()
    .notEmpty()
    .withMessage("El apellido es obligatorio"),

  body("description")
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

  body("certificationFiles")
    .optional()
    .isArray()
    .withMessage("Los archivos de certificación deben ser un array")
    .custom((value) => value.every((file: string) => typeof file === "string"))
    .withMessage("Todos los archivos de certificación deben ser strings"),

  body("paymentMethod")
    .isString()
    .isIn(Object.values(PaymentMethod) as string[])
    .withMessage("El método de pago es inválido"),

  body("accountData")
    .isString()
    .notEmpty()
    .withMessage("Los datos de cuenta son obligatorios"),

  body("isMentor")
    .optional()
    .isBoolean()
    .withMessage("El valor de mentor debe ser un booleano"),
];


export const validateUpdateUserPro: ValidationChain[] = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un string"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("El apellido debe ser un string"),

  body("description")
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

  body("certificationFiles")
    .optional()
    .isArray()
    .withMessage("Los archivos de certificación deben ser un array")
    .custom((value) => value.every((file: string) => typeof file === "string"))
    .withMessage("Todos los archivos de certificación deben ser strings"),

  body("paymentMethod")
    .optional()
    .isString()
    .isIn(Object.values(PaymentMethod) as string[])
    .withMessage("El método de pago es inválido"),

  body("accountData")
    .optional()
    .isString()
    .withMessage("Los datos de cuenta deben ser un string"),

  body("isMentor")
    .optional()
    .isBoolean()
    .withMessage("El valor de mentor debe ser un booleano"),
];
