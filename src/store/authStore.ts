import { create } from "zustand";

type AuthStorageMode = "local" | "session" | null;

type AuthState = {
  token: string | null;
  storageMode: AuthStorageMode;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setToken: (token: string, remember: boolean) => void;
  logout: () => void;
};

const LOCAL_TOKEN_KEY = "dummyjson_access_token_local";
const SESSION_TOKEN_KEY = "dummyjson_access_token_session";

function readStoredToken(): { token: string | null; mode: AuthStorageMode } {
  if (typeof window === "undefined") return { token: null, mode: null };

  const localToken = window.localStorage.getItem(LOCAL_TOKEN_KEY);
  if (localToken) return { token: localToken, mode: "local" };

  const sessionToken = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (sessionToken) return { token: sessionToken, mode: "session" };

  return { token: null, mode: null };
}

export const useAuthStore = create<AuthState>((set) => {
  const initial = readStoredToken();

  return {
    token: initial.token,
    storageMode: initial.mode,
    isAuthenticated: Boolean(initial.token),
    rememberMe: initial.mode === "local",

    setToken: (token, remember) => {
      if (typeof window === "undefined") return;

      if (remember) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
      } else {
        window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      }

      set({
        token,
        storageMode: remember ? "local" : "session",
        isAuthenticated: true,
        rememberMe: remember,
      });
    },

    logout: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }

      set({
        token: null,
        storageMode: null,
        isAuthenticated: false,
        rememberMe: false,
      });
    },
  };
});
