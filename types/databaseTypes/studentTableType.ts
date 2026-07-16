export type StudentTableType = {
  student_id: number;
  student_first_name: string;
  student_phone: number;
  student_birthdate: Date;
  student_gender: "male" | "female";
  parent_id: number;
  student_class_id: number;
  student_created: Date;
};
