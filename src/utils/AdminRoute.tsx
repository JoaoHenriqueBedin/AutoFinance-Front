import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isUserAdmin, isUserAdminSync } from '../servicos/login-service';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [userIsAdmin, setUserIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Primeiro verifica o cache síncrono
        const syncResult = isUserAdminSync();
        if (syncResult) {
          setUserIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // Se não tem cache, faz a verificação assíncrona
        const isAdmin = await isUserAdmin();
        setUserIsAdmin(isAdmin);
        
        if (!isAdmin) {
          toast.error("Acesso negado! Somente administradores podem acessar esta página.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setUserIsAdmin(false);
        toast.error("Acesso negado! Somente administradores podem acessar esta página.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!userIsAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;