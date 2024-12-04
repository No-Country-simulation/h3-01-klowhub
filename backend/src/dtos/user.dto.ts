import { Expertise, Language, PaymentMethod, Platform, Sector, Tool } from "../models/enum/enum";

export interface UserDTO {
  id?: string,
  longName: string;
  email: string;
  about?: string;
  imageProfile?: string;
}

export interface UserProDTO {
  id?: string;
  firstName: string;
  lastName: string;
  about?: string;
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
  userId?: string,
  mentor?: MentorDTO
}

export interface MentorDTO {
  id?: string,
  userProId: string;
  expertiseArea: Sector[];
  expertiseLevel: Expertise;
  platform: Platform[];
  mentoryCost: number;
  aboutMentories: string;
  language: Language[];
}