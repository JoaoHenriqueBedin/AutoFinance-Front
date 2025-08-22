import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Building, User, Mail, Phone, MapPin } from "lucide-react"

export default function SignupScreen() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    nomeEmpresa: "",
    cnpj: "",
    nomeResponsavel: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)
    
    try {
      // Aqui você implementaria a chamada para a API de cadastro
      console.log("Dados do cadastro:", formData)
      
      // Simular processo de cadastro
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirecionar para login após sucesso
      window.location.href = "/login"
      
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLanding = () => {
    window.location.href = "/"
  }

  const handleGoToLogin = () => {
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToLanding}
            className="mb-4 text-[#5A6ACF] hover:text-[#4A5ABF]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para início
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#5A6ACF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">AutoFinance</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crie sua conta gratuita
          </h1>
          <p className="text-gray-600">
            Comece seu teste gratuito de 30 dias agora mesmo
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Empresa */}
            <div>
              <div className="flex items-center mb-4">
                <Building className="h-5 w-5 text-[#5A6ACF] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                  <Input
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleInputChange}
                    required
                    placeholder="Auto Mecânica Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    placeholder="Rua das Flores, 123"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="São Paulo"
                  />
                </div>
              </div>
            </div>

            {/* Seção Responsável */}
            <div>
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-[#5A6ACF] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dados do Responsável</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                  <Input
                    id="nomeResponsavel"
                    name="nomeResponsavel"
                    value={formData.nomeResponsavel}
                    onChange={handleInputChange}
                    required
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="joao@empresa.com"
                  />
                </div>
              </div>
            </div>

            {/* Seção Login */}
            <div>
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-[#5A6ACF] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dados de Acesso</h3>
              </div>
              
              <div className="grid md:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="joaosilva"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirme sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar Conta Gratuita"}
            </Button>

            {/* Terms */}
            <p className="text-sm text-gray-600 text-center">
              Ao criar sua conta, você concorda com nossos{" "}
              <a href="#" className="text-[#5A6ACF] hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-[#5A6ACF] hover:underline">
                Política de Privacidade
              </a>
            </p>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="text-[#5A6ACF] hover:underline font-medium"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            O que você terá acesso:
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-[#5A6ACF]" />
              </div>
              <h4 className="font-medium text-gray-900">Gestão Completa</h4>
              <p className="text-sm text-gray-600">Clientes, orçamentos e agendamentos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Phone className="h-6 w-6 text-[#707FDD]" />
              </div>
              <h4 className="font-medium text-gray-900">Suporte Dedicado</h4>
              <p className="text-sm text-gray-600">Ajuda sempre que precisar</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">30 Dias Grátis</h4>
              <p className="text-sm text-gray-600">Teste completo sem compromisso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
