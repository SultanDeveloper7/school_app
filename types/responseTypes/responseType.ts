export type ResponseType<T> = {
  status: "Success" | "Error";
  message: string | null;
  code: string | null;
  data: T;
};
