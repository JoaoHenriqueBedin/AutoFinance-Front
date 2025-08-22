/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "../../../assets/logo.svg";
import alvo from "../../../assets/alvo.svg";
import { PasswordInput } from "@/components/ui/password";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { resetPassword } from "../../../servicos/login-service";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Token de recuperação inválido");
      navigate("/login");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, navigate]);

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Nova senha é obrigatória");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="flex md:mt-10 mt-40">
        <img src={logo} alt="logo" />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col w-full items-start md:w-[30%] md:items-center md:mt-2 px-14 mt-10"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 w-full">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBackToLogin}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-center text-base font-bold flex items-center justify-center gap-2">
            Redefinir senha
            <img src={alvo} alt="Ícone" />
          </p>
        </div>

        {/* Instruction Text */}
        <div className="mb-6 w-full">
          <p className="text-gray-600 text-sm text-center leading-relaxed">
            Digite sua nova senha abaixo. A senha deve ter pelo menos 6 caracteres.
          </p>
        </div>

        {/* New Password Input */}
        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm font-medium text-gray-700 mb-2">Nova senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md"
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm font-medium text-gray-700 mb-2">Confirmar nova senha</label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md"
            />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mt-2 w-full">
          <p className="text-xs text-gray-500">
            A senha deve ter pelo menos 6 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col mt-6 w-full py-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white py-3"
          >
            {isLoading ? "Redefinindo..." : "REDEFINIR SENHA"}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="flex flex-col items-center mt-6 w-full">
          <Button
            type="button"
            variant="link"
            onClick={handleBackToLogin}
            className="text-[#5A6ACF] hover:text-[#4A5ABF] text-sm"
          >
            Voltar para o login
          </Button>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-8 w-full py-4">
          <p className="text-gray-500 text-sm">Desenvolvido por</p>
          <img src={logo} alt="logo menor" className="w-20 h-20" />
        </div>
      </form>
    </div>
  );
}
