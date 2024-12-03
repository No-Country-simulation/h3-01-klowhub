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
