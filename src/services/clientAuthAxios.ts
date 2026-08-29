import axios, { InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];


const clientAuthAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BACKEND as string,
  timeout: 10000,
});

clientAuthAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("tokenAuthUser");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

clientAuthAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 429 status code and ensure we do not infinitely loop on /refresh-token
    if (
      error.response?.status === 429 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh-token')
    ) {
      // If a refresh process is already underway, queue the pending request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return clientAuthAxios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL_BACKEND}/users/refresh-tokens`,
          {}, // body vacío
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

        // 1. Update localStorage
        localStorage.setItem('tokenAuthUser', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // 2. Dispatch event to sync React Context automatically
        window.dispatchEvent(
          new CustomEvent('onTokensRefreshed', {
            detail: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            },
          })
        );

        // 3. Update active instance default headers & current request headers
        clientAuthAxios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. Resolve queued requests
        processQueue(null, newAccessToken);
        return clientAuthAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default clientAuthAxios;