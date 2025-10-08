/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://autofinance.azurewebsites.net/auth/login";

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Verificar se o token tem o campo 'exp'
    if (!decoded.exp) {
      return true; // Considerar expirado se não tem data de expiração
    }
    
    // Adicionar uma margem de 30 segundos para evitar problemas de timing
    return (decoded.exp - 30) < currentTime;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return true; // Considerar expirado se não conseguir decodificar
  }
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
  localStorage.removeItem("userData");
  sessionStorage.clear();
  // Limpar cache de role
  userRoleCache = null;
}

export function getToken(): string | null {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    return null;
  }
  
  try {
    if (isTokenExpired(token)) {
      logout();
      return null;
    }
    return token;
  } catch (error) {
    // Token malformado ou inválido
    console.error("Token inválido:", error);
    logout();
    return null;
  }
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

// Verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null;
}

// Obter informações do usuário do token
export function getUserInfo(): any | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    return {
      username: decoded.sub || decoded.username,
      roles: decoded.roles || [],
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch (error) {
    console.error("Erro ao decodificar token para obter informações do usuário:", error);
    return null;
  }
}

// Cache para role do usuário
let userRoleCache: { username: string; role: string; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em ms

// Verificar se o usuário é admin
export async function isUserAdmin(): Promise<boolean> {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.username) {
    return false;
  }

  const username = userInfo.username;
  const now = Date.now();

  // Verificar se temos cache válido
  if (userRoleCache && 
      userRoleCache.username === username && 
      (now - userRoleCache.timestamp) < CACHE_DURATION) {
    return userRoleCache.role === 'ADMIN';
  }

  try {
    // Importar dinamicamente para evitar dependência circular
    const { getUsuarioByUsername } = await import('./users-service');
    const userData = await getUsuarioByUsername(username);
    
    // Atualizar cache
    userRoleCache = {
      username,
      role: userData.role,
      timestamp: now
    };

    return userData.role === 'ADMIN';
  } catch (error) {
    console.error('Erro ao verificar role do usuário:', error);
    return false;
  }
}

// Versão síncrona para casos onde já temos o cache
export function isUserAdminSync(): boolean {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.username) {
    return false;
  }

  const username = userInfo.username;
  const now = Date.now();

  // Só retorna true se temos cache válido e é admin
  if (userRoleCache && 
      userRoleCache.username === username && 
      (now - userRoleCache.timestamp) < CACHE_DURATION) {
    return userRoleCache.role === 'ADMIN';
  }

  return false; // Por padrão, não é admin se não temos certeza
}

// Limpar cache de role (útil quando dados do usuário são atualizados)
export function clearUserRoleCache(): void {
  userRoleCache = null;
}

// Obter tempo restante do token em minutos
export function getTokenTimeRemaining(): number {
  const token = getToken();
  if (!token) {
    return 0;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;
    return Math.max(0, Math.floor(timeRemaining / 60)); // Retorna em minutos
  } catch {
    return 0;
  }
}
