import axios, { AxiosRequestConfig } from "axios";

export class HttpReq {
  public static async get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axios.get<T>(url, options);
    return data;
  }

  public static async post<T>(url: string, body: unknown, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axios.post<T>(url, body, options);
    return data;
  }
}
