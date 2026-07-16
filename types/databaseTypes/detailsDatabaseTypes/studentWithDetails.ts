import { ClassTableType } from "../classTableType";
import { ParentTableType } from "../parentTableType";
import { SchoolTableType } from "../schoolTableType";
import { StudentTableType } from "../studentTableType";

export type StudentWithDetails = Pick<
  StudentTableType,
  | "student_id"
  | "student_first_name"
  | "student_phone"
  | "student_birthdate"
  | "student_gender"
  | "student_class_id"
  | "student_created"
> &
  ParentTableType &
  Pick<ClassTableType, "class_name" | "school_id"> &
  Pick<SchoolTableType, "school_name">;