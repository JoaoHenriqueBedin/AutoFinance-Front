/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://autofinance.azurewebsites.net/auth/login";

export function isTokenExpired(token: string): boolean {
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

export async function login(email: string, senha: string) {
  try {
    const response = await axios.post(
      API_URL,
      { email, senha },
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
