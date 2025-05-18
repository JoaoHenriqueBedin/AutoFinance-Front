/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "../../../assets/logo.svg";
import alvo from "../../../assets/alvo.svg";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getToken,
  isTokenExpired,
  login,
} from "../../../services/login-service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      navigate("/home");
    }
  }, [navigate]);


  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email && !senha) {
      toast.error("E‑mail e senha são obrigatórios");
      return false;
    }

    if (!email.trim()) {
      toast.error("E‑mail é obrigatório");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Formato de e‑mail inválido");
      return false;
    }

    if (!senha.trim()) {
      toast.error("Senha é obrigatória");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, senha);
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex md:mt-10 mt-40">
        <img src={logo} alt="logo" />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col w-full items-start md:w-[30%] md:items-center md:mt-2 px-14 mt-10"
      >
        <p className="text-center text-base font-bold mt-10 flex items-center justify-center gap-2">
          Acesse sua conta
          <img src={alvo} alt="Ícone" />
        </p>

        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm">Senha</label>
          <PasswordInput
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex flex-col mt-4 w-full py-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Carregando..." : "ENTRAR"}
          </Button>
        </div>

        <div className="flex flex-col items-center mt-4 w-full py-4">
          <p>Desenvolvido por</p>
          <img src={logo} alt="logo menor" className="w-20 h-20" />
        </div>
      </form>
    </div>
  );
}
