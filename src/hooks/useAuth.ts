import { useState, useEffect, useCallback } from 'react';
import { 
  isAuthenticated, 
  getTokenTimeRemaining, 
  getUserInfo, 
  logout 
} from '../servicos/login-service';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [timeRemaining, setTimeRemaining] = useState(getTokenTimeRemaining());

  // Função para atualizar estado de autenticação
  const updateAuthState = useCallback(() => {
    const isAuth = isAuthenticated();
    const userInfoData = getUserInfo();
    const timeLeft = getTokenTimeRemaining();

    setAuthenticated(isAuth);
    setUserInfo(userInfoData);
    setTimeRemaining(timeLeft);

    return { isAuth, userInfoData, timeLeft };
  }, []);

  // Função para fazer logout
  const performLogout = useCallback(() => {
    logout();
    setAuthenticated(false);
    setUserInfo(null);
    setTimeRemaining(0);
  }, []);

  useEffect(() => {
    // Verificar autenticação a cada 30 segundos
    const interval = setInterval(() => {
      const { isAuth, timeLeft } = updateAuthState();

      if (!isAuth) {
        clearInterval(interval);
        return;
      }

      // Avisos de expiração
      if (timeLeft === 5) {
        toast.warning('Sua sessão expira em 5 minutos. Salve seu trabalho.', {
          position: 'top-center',
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (timeLeft === 2) {
        toast.error('Sua sessão expira em 2 minutos! Salve urgentemente seu trabalho.', {
          position: 'top-center',
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (timeLeft === 1) {
        toast.error('Sua sessão expira em 1 minuto! Último aviso.', {
          position: 'top-center',
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }, 30000); // 30 segundos

    // Limpeza
    return () => clearInterval(interval);
  }, [updateAuthState]);

  return {
    authenticated,
    userInfo,
    timeRemaining,
    updateAuthState,
    performLogout,
  };
};