import CourseModel from "./Course.model";
import CourseModuleModel from "./CourseModule.model";
import DeviceSession from "./DeviceSession.model";
import LessonModel from "./Lesson.model";
import UserModel from "./User.model";
import UserProModel from "./UserPro.model";
import MentorModel from "./Mentor.model";

// DeviceSession con User
UserModel.hasMany(DeviceSession, { foreignKey: "userId" });
DeviceSession.belongsTo(UserModel, { foreignKey: "userId" });

// Course con User
UserModel.hasMany(CourseModel, { foreignKey: "ownerId" });
CourseModel.belongsTo(UserModel, { foreignKey: "ownerId" });

// CourseModule con Course
CourseModel.hasMany(CourseModuleModel, { foreignKey: "courseId" });
CourseModuleModel.belongsTo(CourseModel, { foreignKey: "courseId" });

// Lesson con CourseModule
CourseModuleModel.hasMany(LessonModel, { foreignKey: "courseModuleId" });
LessonModel.belongsTo(CourseModuleModel, { foreignKey: "courseModuleId" });

// UserPro con User
UserModel.hasOne(UserProModel, { foreignKey: "userId" });
UserProModel.belongsTo(UserModel, { foreignKey: "userId" });

// Mentor con UserPro
UserProModel.hasOne(MentorModel, { foreignKey: "userProId" });
MentorModel.belongsTo(UserProModel, { foreignKey: "userProId" });

export {
  CourseModel,
  CourseModuleModel,
  LessonModel,
  DeviceSession,
  UserModel,
  UserProModel,
  MentorModel,
};
