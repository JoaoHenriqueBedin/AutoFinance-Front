/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://autofinance.azurewebsites.net/auth/login";

export function isTokenExpired(token: string): boolean {
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

export async function login(username: string, senha: string) {
  try {
    const response = await axios.post(
      API_URL,
      { username, password: senha },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token } = response.data;

    //localStorage
    localStorage.setItem("authToken", token);

    return token;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Usuário ou senha inválidos.");
    }
    throw new Error("Erro ao realizar login. Tente novamente.");
  }
}

export function logout() {
  localStorage.removeItem("authToken");
}

export function getToken(): string | null {
  const token = localStorage.getItem("authToken");
  if (token && isTokenExpired(token)) {
    logout();
    return null;
  }
  return token;
}

export async function forgotPassword(email: string) {
  try {
    const response = await axios.post(
      "https://autofinance.azurewebsites.net/auth/forgot-password",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("E-mail não encontrado.");
    }
    throw new Error("Erro ao enviar e-mail de recuperação. Tente novamente.");
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await axios.post(
      "https://autofinance.azurewebsites.net/auth/reset-password",
      { token, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error("Token inválido ou expirado.");
    }
    throw new Error("Erro ao redefinir senha. Tente novamente.");
  }
}
