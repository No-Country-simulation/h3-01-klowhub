import { Language, Platform, Sector, Tag, Tool } from "../models/enum/enum";

export interface CourseDTO {
    course: {
      id?: string,
      title?: string;
      description?: string;
      aboutLearn?: string;
      platform?: Platform;
      imageMain?: string;
      sector?: Sector;
      tags?: Tag[];
      tools?: Tool[];
      languages?: Language[];
      price?: number;
      ownerId?: string;
    };
    modules?: ModuleDataDTO[];
  }
  
  export interface ModuleDataDTO {
    id?: string,
    title?: string;
    detail?: string;
    lessons?: LessonDataDTO[];
  }

  export interface LessonDataDTO {
    id?: string,
    title?: string;
    detail?: string;
    lessonLink?: string;
    imageMain?: string
  }
  
