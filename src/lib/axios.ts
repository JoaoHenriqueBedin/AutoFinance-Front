import axios from "axios";
import { getToken } from "../servicos/login-service";

// Configuração global do axios
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro (principalmente 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido, remover do localStorage
      localStorage.removeItem("authToken");
      
      // Redirecionar para a landing page
      window.location.href = "/";
      
      throw new Error("Sessão expirada. Você será redirecionado para a página inicial.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
