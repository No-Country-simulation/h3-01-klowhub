import { Platform, Sector, Tag } from "../models/enum/enum";

export interface LessonData {
    title: string;
    detail: string;
    lessonLink: string;
  }
  
  export interface ModuleData {
    title: string;
    detail: string;
    lessons: LessonData[];
  }
  
  export interface CourseData {
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
    modules: ModuleData[];
  }
