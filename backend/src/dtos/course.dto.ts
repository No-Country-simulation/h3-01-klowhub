import { Platform, Sector, Tag } from "../models/enum/enum";

export interface CourseDTO {
    course: {
      title: string;
      detail: string;
      aboutLearn?: string;
      platform: Platform;
      image: string;
      sector: Sector;
      tags?: Tag[];
      price: number;
      ownerId: string;
    };
    modules: ModuleDataDTO[];
  }

  export interface LessonDataDTO {
    title: string;
    detail: string;
    lessonLink: string;
  }
  
  export interface ModuleDataDTO {
    title: string;
    detail: string;
    lessons: LessonDataDTO[];
  }
