import { Navigate } from "react-router-dom";
import { isAuthenticated, getTokenTimeRemaining } from "../servicos/login-service";
import { JSX, useEffect } from "react";
import { toast } from "react-toastify";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      // Verificar tempo restante do token
      const timeRemaining = getTokenTimeRemaining();
      
      // Se restam menos de 5 minutos, mostrar aviso
      if (timeRemaining > 0 && timeRemaining <= 5) {
        toast.warning(`Sua sessão expira em ${timeRemaining} minuto(s). Salve seu trabalho.`, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [authenticated]);

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;