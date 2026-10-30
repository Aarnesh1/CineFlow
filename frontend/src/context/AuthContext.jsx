import {
  createContext,
  useContext,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("cineflow_token")
  );

  const [user, setUser] = useState(null);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;

    // Supports common JWT response property names.
    const receivedToken =
      data.accessToken ??
      data.access_token ??
      data.token ??
      data.jwt;

    if (!receivedToken) {
      throw new Error(
        "Login succeeded, but no JWT was found in the response. Check the backend response format."
      );
    }

    localStorage.setItem("cineflow_token", receivedToken);
    setToken(receivedToken);

    return data;
  }


async function register(name, email, password) {
  const response = await api.post("/auth/register", {
    displayName: name.trim(),
    email: email.trim(),
    password: password,
  });

  return response.data;
}
async function updateProfile(displayName) {
  const response = await api.put("/users/me", {
    displayName: displayName.trim(),
  });

  const data = response.data;

  setUser({
    id: data.userId ?? data.id,
    name: data.displayName ?? data.name,
    email: data.email,
  });

  return data;
}


async function changePassword(currentPassword, newPassword) {
  await api.put("/users/me/password", {
    currentPassword,
    newPassword,
  });
}

  function logout() {
    localStorage.removeItem("cineflow_token");
    setToken(null);
    setUser(null);
  }

  async function fetchCurrentUser() {
    const response = await api.get("/users/me");
    setUser(response.data);
    return response.data;
  }

const value = {
  token,
  user,
  isAuthenticated: Boolean(token),
  register,
  login,
  fetchCurrentUser,
  updateProfile,
  changePassword,
  logout,
};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}