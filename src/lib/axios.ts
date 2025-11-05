import axios from "axios";
import { getToken } from "../servicos/login-service";

// Função para fazer logout completo
const performLogout = () => {
  // Limpar todos os dados de autenticação
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  sessionStorage.clear();
  
  // Mostrar notificação apenas se não estivermos já na página de login
  if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
    // Importar toast dinamicamente para evitar problemas de importação circular
    import('react-toastify').then(({ toast }) => {
      toast.warning("Sua sessão expirou. Faça login novamente.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }
  
  // Redirecionar para a landing page após um pequeno delay
  setTimeout(() => {
    window.location.href = "/";
  }, 500);
};

// Configuração global do axios
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Se não há token válido e não estamos em rotas públicas, fazer logout
      const currentPath = window.location.pathname;
      const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
      
      if (!publicPaths.includes(currentPath)) {
        performLogout();
        return Promise.reject(new Error("Token não encontrado ou expirado"));
      }
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
      // Token expirado ou inválido
      performLogout();
      return Promise.reject(new Error("Sessão expirada. Redirecionando..."));
    }
    
    // Para erro 403, adicionar mensagem amigável mas manter o erro original
    if (error.response && error.response.status === 403) {
      // Não rejeitar com novo erro, manter o erro original para que os serviços possam ler response.data
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status >= 500) {
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
