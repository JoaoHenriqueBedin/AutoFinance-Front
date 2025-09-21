import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Building, User, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "react-toastify"
import { criarEmpresa, type EmpresaInput } from "@/servicos/empresa-service"

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

  // Função para validar CNPJ
  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCnpj = cnpj.replace(/\D/g, '')
    
    if (cleanCnpj.length !== 14) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCnpj)) return false
    
    // Validação dos dígitos verificadores
    let length = cleanCnpj.length - 2
    let numbers = cleanCnpj.substring(0, length)
    const digits = cleanCnpj.substring(length)
    let sum = 0
    let pos = length - 7
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11
    if (result !== parseInt(digits.charAt(0))) return false
    
    length = length + 1
    numbers = cleanCnpj.substring(0, length)
    sum = 0
    pos = length - 7
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11
    return result === parseInt(digits.charAt(1))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatação para campos específicos
    if (name === 'cnpj') {
      // Formatar CNPJ: 00.000.000/0000-00
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    } else if (name === 'telefone') {
      // Formatar telefone: (00) 00000-0000
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
    } else if (name === 'cep') {
      // Formatar CEP: 00000-000
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
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

    // Validação de campos obrigatórios
    if (!formData.nomeEmpresa.trim()) {
      setError("Nome da empresa é obrigatório")
      return
    }

    if (!formData.cnpj.trim()) {
      setError("CNPJ é obrigatório")
      return
    }

    if (!validateCNPJ(formData.cnpj)) {
      setError("CNPJ inválido")
      return
    }

    if (!formData.nomeResponsavel.trim()) {
      setError("Nome do responsável é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      setError("E-mail é obrigatório")
      return
    }

    if (!formData.telefone.trim()) {
      setError("Telefone é obrigatório")
      return
    }

    if (!formData.username.trim()) {
      setError("Nome de usuário é obrigatório")
      return
    }

    setIsLoading(true)
    
    try {
      // Preparar dados para envio conforme a API
      const empresaData: EmpresaInput = {
        nome: formData.nomeEmpresa,
        cnpj: formData.cnpj.replace(/\D/g, ''), // Remove formatação do CNPJ
        endereco: formData.endereco || '',
        cidade: formData.cidade || '',
        telefone: formData.telefone,
        cep: formData.cep || '',
        nomeAdmin: formData.nomeResponsavel,
        usernameAdmin: formData.username,
        emailAdmin: formData.email,
        senhaAdmin: formData.password
      }

      console.log("Criando empresa:", empresaData)
      
      // Chamar o serviço de criação de empresa
      await criarEmpresa(empresaData)
      
      // Sucesso - mostrar toast e redirecionar
      toast.success("Conta criada com sucesso! Redirecionando para o login...")
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
      
    } catch (error: unknown) {
      console.error("Erro ao criar conta:", error)
      
      // Mostrar erro específico da API ou erro genérico
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente."
      setError(errorMessage)
      toast.error(errorMessage)
      
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
