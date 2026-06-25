import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  config.headers.set("Accept", "application/json");
  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);

interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
}

const api = instance as unknown as ApiClient;

export default api;