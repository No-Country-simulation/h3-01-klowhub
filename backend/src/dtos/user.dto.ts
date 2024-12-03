import { PaymentMethod, Sector, Tool } from "../models/enum/enum";

export interface UserDTO {
  longName: string;
  email: string;
}

export interface UserProDTO {
  firstName: string;
  lastName: string;
  description?: string;
  country?: string;
  sector: Sector[];
  sectorsExperience?: string;
  tools: Tool[];
  toolsExperience?: string;
  portfolioLink?: string;
  academicFormation?: string;
  certificationLink?: string;
  certificationFiles?: string[];
  paymentMethod: PaymentMethod;
  accountData: string;
  imageProfile?: string;
  isMentor?: boolean  // si quiere ser mentor el front enviara un true, sino no lo envia
}