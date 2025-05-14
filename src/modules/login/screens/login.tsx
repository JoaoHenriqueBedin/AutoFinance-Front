/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "../../../assets/logo.svg";
import alvo from "../../../assets/alvo.svg";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getToken,
  isTokenExpired,
  login,
} from "../../../services/login-service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para o carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      navigate("/home"); // Redireciona para a tela home se o token for válido
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, senha);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex md:mt-10 mt-40">
        <img src={logo} alt="logo" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-start md:w-[30%] md:items-center md:mt-2 px-14 mt-10"
      >
        <p className="text-center text-base font-bold mt-10 flex items-center justify-center gap-2">
          Acesse sua conta
          <img src={alvo} alt="Ícone" />
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col mt-4 w-full py-2">
          <label className="text-sm">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
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
