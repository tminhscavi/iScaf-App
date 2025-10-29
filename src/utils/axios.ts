/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface AxiosConfigOptions {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  tokenCookieName?: string;
  enableTokenRefresh?: boolean;
  refreshEndpoint?: string;
  onAuthFailure?: () => void;
}

class AxiosConfig {
  private static instances: Map<string, AxiosConfig> = new Map();
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private options: Required<AxiosConfigOptions>;

  private constructor(instanceName: string, options?: AxiosConfigOptions) {
    // Merge with defaults
    this.options = {
      baseURL:
        options?.baseURL || `${process.env.NEXT_PUBLIC_API_URL}/api` || '/api',
      timeout: options?.timeout || 30000,
      withCredentials:
        options?.withCredentials ?? process.env.NODE_ENV === 'production',
      tokenCookieName: options?.tokenCookieName || 'auth-token',
      enableTokenRefresh: options?.enableTokenRefresh ?? true,
      refreshEndpoint: options?.refreshEndpoint || '/auth/refresh',
      onAuthFailure: options?.onAuthFailure || this.defaultAuthFailureHandler,
    };

    this.axiosInstance = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeout,
      withCredentials: this.options.withCredentials,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(
    instanceName: string = 'default',
    options?: AxiosConfigOptions,
  ): AxiosConfig {
    if (!AxiosConfig.instances.has(instanceName)) {
      AxiosConfig.instances.set(
        instanceName,
        new AxiosConfig(instanceName, options),
      );
    }
    return AxiosConfig.instances.get(instanceName)!;
  }

  public static clearInstance(instanceName: string): void {
    AxiosConfig.instances.delete(instanceName);
  }

  public static clearAllInstances(): void {
    AxiosConfig.instances.clear();
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public updateToken(token: string): void {
    // Update the default authorization header
    this.axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`;
  }

  public clearToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // Add auth token if available
        const token = getCookie(this.options.tokenCookieName);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `🚀 Request: ${config.method?.toUpperCase()} ${config.url}`,
          );
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(this.handleError(error));
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `✅ Response: ${
              response.status
            } ${response.config.method?.toUpperCase()} ${response.config.url}`,
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle token refresh for 401 errors (only if enabled)
        if (
          this.options.enableTokenRefresh &&
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          // If already refreshing, queue the request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh the token
            const refreshResponse = await this.axiosInstance.post(
              this.options.refreshEndpoint,
            );
            const { token } = refreshResponse.data;

            // Process queued requests with new token
            this.processQueue(null, token);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Failed to refresh token
            this.processQueue(refreshError, null);
            this.options.onAuthFailure();
            return Promise.reject(this.handleError(error));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        return Promise.reject(this.handleError(error));
      },
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private defaultAuthFailureHandler(): void {
    // Clear auth data
    deleteCookie('auth-token');
    deleteCookie('user-data');

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  private handleError(error: AxiosError): ApiError {
    let message = 'An unexpected error occurred';
    let status = 500;
    let code = 'UNKNOWN_ERROR';

    if (error.response) {
      // Server responded with error status
      status = error.response.status;
      const errorData = error.response.data as any;

      if (errorData?.message) {
        message = errorData.message;
      } else if (typeof errorData === 'string') {
        message = errorData;
      } else {
        message = this.getStatusMessage(status);
      }

      code = errorData?.code || `HTTP_${status}`;
    } else if (error.request) {
      // Request was made but no response received
      message = 'Network error. Please check your connection.';
      code = 'NETWORK_ERROR';
    } else {
      // Something else happened
      message = error.message || message;
      code = 'REQUEST_ERROR';
    }

    console.error('🔥 API Error:', { message, status, code, error });

    return { message, status, code };
  }

  private getStatusMessage(status: number): string {
    const statusMessages: { [key: number]: string } = {
      400: 'Bad request. Please check your input.',
      401: 'Authentication required. Please log in.',
      403: "Access forbidden. You don't have permission.",
      404: 'Resource not found.',
      408: 'Request timeout. Please try again.',
      422: 'Validation error. Please check your data.',
      429: 'Too many requests. Please slow down.',
      500: 'Internal server error. Please try again later.',
      502: 'Service temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
    };

    return statusMessages[status] || `HTTP Error ${status}`;
  }

  // Helper methods for common HTTP operations
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T | any> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response?.data ?? response;
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T | any> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response?.data ?? response;
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T | any> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response?.data ?? response;
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T | any> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response?.data ?? response;
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T | any> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response?.data ?? response;
  }

  // Upload helper with progress tracking
  public async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  }

  // Download helper
  public async download(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Export default instance
export const apiClient = AxiosConfig.getInstance('default');
export const axiosInstance = apiClient.getAxiosInstance();

// Export helper methods for default instance
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
  upload: <T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ) => apiClient.upload<T>(url, formData, onUploadProgress),
  download: (url: string, filename?: string) =>
    apiClient.download(url, filename),
};

// Helper function to create additional instances
export const createApiInstance = (
  instanceName: string,
  options?: AxiosConfigOptions,
) => {
  const instance = AxiosConfig.getInstance(instanceName, options);
  return {
    client: instance,
    axiosInstance: instance.getAxiosInstance(),
    api: {
      get: <T = any>(url: string, config?: AxiosRequestConfig) =>
        instance.get<T>(url, config),
      post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        instance.post<T>(url, data, config),
      put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        instance.put<T>(url, data, config),
      patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        instance.patch<T>(url, data, config),
      delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
        instance.delete<T>(url, config),
      upload: <T = any>(
        url: string,
        formData: FormData,
        onUploadProgress?: (progressEvent: any) => void,
      ) => instance.upload<T>(url, formData, onUploadProgress),
      download: (url: string, filename?: string) =>
        instance.download(url, filename),
    },
  };
};
