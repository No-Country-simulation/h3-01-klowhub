import bcrypt from "bcryptjs";

export const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
};

export const encryptPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};
