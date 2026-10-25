export interface ActiveSession {
  email: string;
  name?: string;
  role: "ADMIN" | "RECRUITER" | "CANDIDATE";
}

// Create a client-side mock JWT for when backend is offline or for demo evaluations
export function createMockJwt(
  email: string,
  role: string,
  name?: string,
): string {
  try {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        email: email.toLowerCase().trim(),
        name: name || email.split("@")[0],
        role: role.toUpperCase(),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      }),
    );
    return `${header}.${payload}.mocksignature`;
  } catch {
    return "mock.token.signature";
  }
}

export function getActiveUserEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const fromStorage = localStorage.getItem("devassess_active_email");
    if (fromStorage) return fromStorage.toLowerCase().trim();

    const emailCookie = document.cookie.match(/(?:^|; )userEmail=([^;]*)/);
    if (emailCookie && emailCookie[1]) {
      return decodeURIComponent(emailCookie[1]).toLowerCase().trim();
    }

    const tokenMatch = document.cookie.match(
      /(?:^|; )(?:accessToken|token)=([^;]*)/,
    );
    if (tokenMatch && tokenMatch[1]) {
      const parts = tokenMatch[1].split(".");
      if (parts[1]) {
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
        );
        if (payload?.email) return payload.email.toLowerCase().trim();
      }
    }
  } catch {}
  return "";
}

export function setActiveSession(
  email: string,
  role: string,
  name?: string,
  realToken?: string,
) {
  if (typeof window === "undefined") return;
  const cleanEmail = email.toLowerCase().trim().replace(/[@.]/g, "_");
  const normalizedRole = role.toUpperCase();

  try {
    localStorage.setItem("devassess_active_email", email.toLowerCase().trim());
    if (realToken) {
      localStorage.setItem("devassess_token", realToken);
    }
  } catch {}

  const token = realToken || createMockJwt(email, normalizedRole, name);
  document.cookie = `accessToken=${token}; path=/; max-age=31536000;`;
  document.cookie = `token=${token}; path=/; max-age=31536000;`;
  document.cookie = `userRole=${normalizedRole}; path=/; max-age=31536000;`;
  document.cookie = `userEmail=${encodeURIComponent(email.toLowerCase().trim())}; path=/; max-age=31536000;`;
  document.cookie = `role_${cleanEmail}=${normalizedRole}; path=/; max-age=31536000;`;

  // notify active listeners
  window.dispatchEvent(
    new CustomEvent("devassess_role_change", {
      detail: { email, role: normalizedRole },
    }),
  );
}

export function clearActiveSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("devassess_active_email");
    localStorage.removeItem("devassess_token");
  } catch {}

  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `accessToken=; ${expire}`;
  document.cookie = `token=; ${expire}`;
  document.cookie = `userRole=; ${expire}`;
  document.cookie = `role=; ${expire}`;
  document.cookie = `userEmail=; ${expire}`;

  // Clear any role_* cookies
  try {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const name = c.split("=")[0].trim();
      if (name.startsWith("role_")) {
        document.cookie = `${name}=; ${expire}`;
      }
    }
  } catch {}

  window.dispatchEvent(
    new CustomEvent("devassess_role_change", {
      detail: { email: "", role: "" },
    }),
  );
}

export function getEffectiveRole(
  userEmail?: string,
  profileRole?: string,
): "ADMIN" | "RECRUITER" | "CANDIDATE" {
  if (typeof window === "undefined") return "CANDIDATE";

  // 1. Highest priority: Live database profile role from backend API
  if (profileRole) {
    const r = profileRole.toUpperCase();
    if (r === "ADMIN" || r === "RECRUITER" || r === "CANDIDATE") {
      return r;
    }
  }

  const email = (userEmail || getActiveUserEmail()).toLowerCase().trim();
  const cleanEmail = email ? email.replace(/[@.]/g, "_") : "";

  // 2. Email-specific cookie set by Admin
  if (cleanEmail) {
    try {
      const match = document.cookie.match(
        new RegExp(`(?:^|; )role_${cleanEmail}=([^;]*)`),
      );
      if (match && match[1]) {
        return match[1].toUpperCase() as "ADMIN" | "RECRUITER" | "CANDIDATE";
      }
    } catch {}
  }

  // 3. Check custom users in localStorage
  try {
    const stored = localStorage.getItem("devassess_custom_users");
    if (stored) {
      const customUsers = JSON.parse(stored);
      if (Array.isArray(customUsers)) {
        const found = customUsers.find(
          (u: any) =>
            email && u.email?.toLowerCase().trim() === email,
        );
        if (found?.role) {
          return found.role.toUpperCase() as "ADMIN" | "RECRUITER" | "CANDIDATE";
        }
      }
    }
  } catch {}

  // 4. Check general userRole cookie
  try {
    const match = document.cookie.match(/(?:^|; )userRole=([^;]*)/);
    if (match && match[1]) {
      return match[1].toUpperCase() as "ADMIN" | "RECRUITER" | "CANDIDATE";
    }
  } catch {}

  return "CANDIDATE";
}
