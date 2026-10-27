import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  timeout: 120000, // 2 minutes
  retry: 0,
  onRequest({ options }: { options: any }) {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("devassess_token");

      // Ignore mock tokens when talking to real backend
      if (token && (token.includes(".mocksignature") || token.includes("mock.token"))) {
        token = null;
      }

      if (!token) {
        const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
        if (match && match[1]) {
          const cookieVal = decodeURIComponent(match[1]);
          if (!cookieVal.includes(".mocksignature")) {
            token = cookieVal;
          }
        }
      }

      if (!token) {
        const matchToken = document.cookie.match(/(?:^|; )token=([^;]*)/);
        if (matchToken && matchToken[1]) {
          const cookieVal = decodeURIComponent(matchToken[1]);
          if (!cookieVal.includes(".mocksignature")) {
            token = cookieVal;
          }
        }
      }

      if (token) {
        options.headers = options.headers || {};
        if (typeof options.headers.set === "function") {
          options.headers.set("Authorization", `Bearer ${token}`);
        } else if (Array.isArray(options.headers)) {
          options.headers.push(["Authorization", `Bearer ${token}`]);
        } else {
          options.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
  },
});

export default apiClient;
