/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "../../../assets/logo.svg";
import alvo from "../../../assets/alvo.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Mail } from "lucide-react";
import { forgotPassword } from "../../../services/login-service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("E-mail é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Digite um e-mail válido");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar e-mail de recuperação. Tente novamente.");
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
        <div className="flex items-center justify-center  mb-8 w-full">
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
            Recuperar senha
            <img src={alvo} alt="Ícone" />
          </p>
        </div>

        {/* Instruction Text */}
        <div className="mb-6 w-full">
          <p className="text-gray-600 text-sm text-center leading-relaxed">
            Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
          </p>
        </div>

        {/* Email Input */}
        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md"
              placeholder="Digite seu e-mail"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col mt-6 w-full py-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white py-3"
          >
            {isLoading ? "Enviando..." : "ENVIAR E-MAIL"}
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
