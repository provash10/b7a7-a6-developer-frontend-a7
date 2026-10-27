import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  timeout: 120000, // 2 minutes
  retry: 1,
  onRequest({ options }: { options: any }) {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("devassess_token");
      if (!token) {
        const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
        if (match && match[1]) {
          token = match[1];
        }
      }
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
  },
});

export default apiClient;
