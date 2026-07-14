import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const DEFAULT_API_URL = "http://127.0.0.1:9000/api/v1";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

function getApiOrigin() {
  const baseUrl =
    typeof window === "undefined" ? DEFAULT_API_URL : window.location.origin;

  return new URL(API_URL, baseUrl).origin;
}

export function getPublicAssetUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (/^(https?:|data:|blob:|\/\/)/.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getApiOrigin()}${normalizedPath}`;
}

export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  method: string;
  path: string;
  timestamp: string;
  errors?: unknown;
}

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  gender: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface AuthResponse {
  user: UserResponse;
  sessionId: string;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
}

export interface RegisterUserPayload {
  username: string;
  password: string;
  fullName: string;
  email: string;
  avatar?: File | null;
  phone?: string;
  gender?: string;
  address?: string;
}

export type ApiRequestConfig<D = unknown> = AxiosRequestConfig<D> & {
  skipAuthRefresh?: boolean;
};

type RetryRequestConfig<D = unknown> = InternalAxiosRequestConfig<D> & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  return /\/?auth\/(login|refresh)$/.test(url.split("?")[0]);
}

function notifyAuthExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("auth:expired"));
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post<ApiSuccessResponse<AuthResponse>>("/auth/refresh")
      .then(() => undefined)
      .catch((error) => {
        notifyAuthExpired();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  /*
   * Backend đọc access/refresh token từ httpOnly cookies.
   * Frontend không tự set Authorization vì không đọc được token này.
   */
  delete config.headers.Authorization;

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete?.("Content-Type");
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryRequestConfig | undefined;
    const status = error.response?.status;

    if (
      !config ||
      status !== 401 ||
      config._retry ||
      config.skipAuthRefresh ||
      isAuthEndpoint(config.url)
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      await refreshSession();
      return api.request(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export async function login(
  username: string,
  password: string,
  config?: ApiRequestConfig,
) {
  const requestConfig: ApiRequestConfig = {
    ...config,
    skipAuthRefresh: true,
  };

  return api.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/login",
    { username, password },
    requestConfig,
  );
}

export async function getMe(config?: ApiRequestConfig) {
  return api.get<ApiSuccessResponse<AuthResponse>>("/auth/me", config);
}

export async function registerUser(
  payload: RegisterUserPayload | FormData,
  config?: ApiRequestConfig,
) {
  const formData =
    payload instanceof FormData ? payload : buildRegisterFormData(payload);
  const requestConfig: ApiRequestConfig = {
    ...config,
    skipAuthRefresh: true,
  };

  return api.post<ApiSuccessResponse<UserResponse>>(
    "/users",
    formData,
    requestConfig,
  );
}

export async function logout(config?: ApiRequestConfig) {
  return api.post<ApiSuccessResponse<null>>(
    "/auth/logout",
    undefined,
    config,
  );
}

function appendOptionalField(formData: FormData, key: string, value?: string) {
  const normalizedValue = value?.trim();

  if (normalizedValue) {
    formData.append(key, normalizedValue);
  }
}

function buildRegisterFormData(payload: RegisterUserPayload) {
  const formData = new FormData();

  formData.append("username", payload.username.trim());
  formData.append("password", payload.password);
  formData.append("fullName", payload.fullName.trim());
  formData.append("email", payload.email.trim());
  appendOptionalField(formData, "phone", payload.phone);
  appendOptionalField(formData, "gender", payload.gender);
  appendOptionalField(formData, "address", payload.address);

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
}

export function getApiData<T>(response: AxiosResponse<ApiSuccessResponse<T>>) {
  return response.data.data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi trong quá trình xử lý yêu cầu";
}

export default api;
