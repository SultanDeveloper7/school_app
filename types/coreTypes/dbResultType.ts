export type DbResultType = {
  status: "success" | "error";
  code: string;
  errno: number | null;
  message: string;
};
