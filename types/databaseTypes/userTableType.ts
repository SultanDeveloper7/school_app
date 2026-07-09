export type UserTableType = {
    user_id: number;
    user_name: string;
    user_email: string;
    user_password: string;
    user_gender: "male" | "female";
    user_create: Date;
};  