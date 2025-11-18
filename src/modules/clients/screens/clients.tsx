/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, User, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatPhone } from "@/lib/utils"

// Importar serviços e tipos
import { 
  getClientes, 
  createCliente, 
  updateCliente, 
  getClienteById,
  Cliente
} from "@/servicos/clients-service"

const ITEMS_PER_PAGE = 6

export default function ClientsScreen() {
  // Estados para dados e UI
  const [clients, setClients] = React.useState<Cliente[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const isInitializedRef = React.useRef(false) // Controle para evitar chamadas duplas
  const [selectedClient, setSelectedClient] = React.useState<Cliente | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [filterStatus, setFilterStatus] = React.useState("todos")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  
  // Estados para formulários
    const [createForm, setCreateForm] = React.useState({
    nome: "",
    email: "",
    celular: "",
    cpfCnpj: "",
    endereco: "",
    cep: "",
    dataNascimento: "",
    ativo: true,
    observacoes: "",
  })
  
  const [editForm, setEditForm] = React.useState({
    nome: "",
    email: "",
    celular: "",
    cpfCnpj: "",
    endereco: "",
    cep: "",
    dataNascimento: "",
    ativo: true,
    observacoes: "",
  })

  const [formErrors, setFormErrors] = React.useState<{[key: string]: string}>({})
  const [isLoadingCep, setIsLoadingCep] = React.useState(false)

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) return
    
    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        setCreateForm(prev => ({
          ...prev,
          endereco: fullAddress
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setIsLoadingCep(false)
    }
  }

  // Função para buscar endereço pelo CEP no modal de edição
  const fetchAddressByCepEdit = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) return
    
    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        setEditForm(prev => ({
          ...prev,
          endereco: fullAddress
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setIsLoadingCep(false)
    }
  }

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
    
    const cpfDigits = cpf.split('').map(el => +el)
    const rest = (count: number): number => {
      return (cpfDigits.slice(0, count-12)
        .reduce((soma, el, index) => (soma + el * (count-index)), 0) * 10) % 11 % 10
    }
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10]
  }

  // Função para validar CNPJ
  const validateCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, '')
    if (cnpj.length !== 14) return false
    
    // Elimina CNPJs inválidos conhecidos
    if (cnpj === "00000000000000" || 
        cnpj === "11111111111111" || 
        cnpj === "22222222222222") return false

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    
    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== +digitos.charAt(0)) return false
    
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    
    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    return resultado === +digitos.charAt(1)
  }

  // Função para formatar CPF/CNPJ
  const formatCpfCnpj = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '')
    
    if (cleanValue.length <= 11) {
      // CPF
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    } else {
      // CNPJ
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }
  }



  // Função para formatar CEP
  const formatCEP = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue.replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1')
  }

  // Função para validar formulário
  const validateCreateForm = (): boolean => {
    const errors: {[key: string]: string} = {}
    
    if (!createForm.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }
    
    if (!createForm.cpfCnpj.trim()) {
      errors.cpfCnpj = "CPF/CNPJ é obrigatório"
    } else {
      const cleanCpfCnpj = createForm.cpfCnpj.replace(/\D/g, '')
      
      // Verificar se já existe um cliente com este CPF/CNPJ
      const existingClient = clients.find(client => 
        client.cpfCnpj.replace(/\D/g, '') === cleanCpfCnpj
      )
      
      if (existingClient) {
        errors.cpfCnpj = "Já existe um cliente cadastrado com este CPF/CNPJ"
        toast.error("Já existe um cliente cadastrado com este CPF/CNPJ.")
      } else if (cleanCpfCnpj.length === 11) {
        if (!validateCPF(createForm.cpfCnpj)) {
          errors.cpfCnpj = "CPF inválido"
        }
      } else if (cleanCpfCnpj.length === 14) {
        if (!validateCNPJ(createForm.cpfCnpj)) {
          errors.cpfCnpj = "CNPJ inválido"
        }
      } else {
        errors.cpfCnpj = "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"
      }
    }
    
    if (!createForm.email.trim()) {
      errors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(createForm.email)) {
      errors.email = "E-mail inválido"
    }
    
    if (!createForm.celular.trim()) {
      errors.celular = "Celular é obrigatório"
    } else if (createForm.celular.replace(/\D/g, '').length < 10) {
      errors.celular = "Celular deve ter pelo menos 10 dígitos"
    }
    
    if (!createForm.dataNascimento) {
      errors.dataNascimento = "Data de nascimento é obrigatória"
    } else {
      const today = new Date()
      const birthDate = new Date(createForm.dataNascimento)
      if (birthDate > today) {
        errors.dataNascimento = "Data de nascimento não pode ser no futuro"
      }
      
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age > 120) {
        errors.dataNascimento = "Data de nascimento inválida"
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para limpar erro de um campo específico
  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  // Função para limpar o formulário de criação
  const clearCreateForm = () => {
    setCreateForm({
      cpfCnpj: "",
      nome: "",
      celular: "",
      email: "",
      dataNascimento: "",
      endereco: "",
      cep: "",
      observacoes: "",
      ativo: true,
    })
    setFormErrors({})
  }

  // Função para validar formulário de edição
  const validateEditForm = (): boolean => {
    const errors: {[key: string]: string} = {}
    
    if (!editForm.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }
    
    // CPF/CNPJ não é validado na edição pois não pode ser alterado
    
    if (!editForm.email.trim()) {
      errors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "E-mail inválido"
    }
    
    if (!editForm.celular.trim()) {
      errors.celular = "Celular é obrigatório"
    } else if (editForm.celular.replace(/\D/g, '').length < 10) {
      errors.celular = "Celular deve ter pelo menos 10 dígitos"
    }
    
    // Validar data de nascimento apenas se estiver vazia ou tiver sido alterada
    const originalDate = selectedClient?.dataNascimento
    const currentDate = editForm.dataNascimento
    const dateChanged = originalDate !== currentDate
    
    if (!editForm.dataNascimento && dateChanged) {
      errors.dataNascimento = "Data de nascimento é obrigatória"
    } else if (editForm.dataNascimento) {
      const today = new Date()
      const birthDate = new Date(editForm.dataNascimento)
      if (birthDate > today) {
        errors.dataNascimento = "Data de nascimento não pode ser no futuro"
      }
      
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age > 120) {
        errors.dataNascimento = "Data de nascimento inválida"
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Carregar clientes ao montar o componente
  React.useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      loadClients()
    }
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getClientes()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar clientes")
      console.error("Erro ao carregar clientes:", err)
    } finally {
      setLoading(false)
    }
  }

  // Função de ordenação e filtros (adaptada para dados reais)
  const filteredAndSortedClients = React.useMemo(() => {
    let filtered = clients

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter(client => {
        if (filterStatus === "ativo") {
          return client.status === "ATIVO"
        } else if (filterStatus === "inativo") {
          return client.status === "INATIVO"
        }
        return true
      })
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.celular.includes(searchTerm) ||
          client.cpfCnpj.includes(searchTerm),
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return (b.id || 0) - (a.id || 0) // Ordenar por ID decrescente (mais recentes)
        case "oldest":
          return (a.id || 0) - (b.id || 0) // Ordenar por ID crescente (mais antigos)
        case "name":
          return a.nome.localeCompare(b.nome) // Ordenar por nome A-Z
        case "services":
          // Para "Mais serviços" vamos ordenar por ID por enquanto
          // TODO: Implementar quando houver dados de serviços
          return (b.id || 0) - (a.id || 0)
        case "lastService":
          // Para "Último serviço" vamos ordenar por ID por enquanto  
          // TODO: Implementar quando houver dados de serviços
          return (b.id || 0) - (a.id || 0)
        default:
          return 0
      }
    })

    return sorted
  }, [clients, searchTerm, sortBy, filterStatus])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedClients.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentClients = filteredAndSortedClients.slice(startIndex, endIndex)

  const handleView = async (client: Cliente) => {
    try {
      // Buscar dados atualizados do cliente
      const clientData = await getClienteById(client.cpfCnpj)
      setSelectedClient(clientData)
      setIsViewDialogOpen(true)
    } catch (err) {
      console.error("Erro ao buscar cliente:", err)
      setSelectedClient(client) // Usar dados locais se a busca falhar
      setIsViewDialogOpen(true)
    }
  }

  const handleEdit = (client: Cliente) => {
    setSelectedClient(client)
    setIsEditDialogOpen(true)
  }

  // useEffect para preencher o formulário quando selectedClient mudar
  React.useEffect(() => {
    if (selectedClient && isEditDialogOpen) {
      setEditForm({
        cpfCnpj: selectedClient.cpfCnpj,
        nome: selectedClient.nome,
        celular: selectedClient.celular,
        email: selectedClient.email,
        dataNascimento: selectedClient.dataNascimento,
        endereco: selectedClient.endereco,
        cep: selectedClient.cep,
        observacoes: selectedClient.observacoes || "",
        ativo: selectedClient.status !== 'INATIVO',
      })
      // Limpar erros quando abrir o modal de edição
      setFormErrors({})
    }
  }, [selectedClient, isEditDialogOpen])

  const handleToggleStatus = async (clientId: number, isCurrentlyActive: boolean) => {
    try {
      // Buscar o cliente atual da lista
      const currentClient = clients.find(c => c.id === clientId)
      if (!currentClient || !currentClient.cpfCnpj) return
      
      const newStatus = isCurrentlyActive ? "INATIVO" : "ATIVO"
      const newAtivo = !isCurrentlyActive
      
      const updatedClient = {
        cpfCnpj: currentClient.cpfCnpj,
        nome: currentClient.nome,
        celular: currentClient.celular,
        email: currentClient.email,
        dataNascimento: currentClient.dataNascimento,
        observacoes: currentClient.observacoes || "",
        endereco: currentClient.endereco,
        cep: currentClient.cep,
        ativo: newAtivo,
        status: newStatus
      }
      
      console.log('Atualizando status do cliente:', updatedClient)
      await updateCliente(currentClient.cpfCnpj, updatedClient)
      await loadClients() // Recarregar lista após alteração
      toast.success(`Cliente ${newStatus.toLowerCase()} com sucesso!`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alterar status do cliente"
      setError(errorMessage)
      console.error("Erro ao alterar status do cliente:", err)
      toast.error(errorMessage)
    }
  }

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return
    }
    
    try {
      if (!selectedClient?.cpfCnpj) return
      
      const clientData = {
        ...editForm,
        status: editForm.ativo ? "ATIVO" : "INATIVO"
      }
      
      const updatedClient = await updateCliente(selectedClient.cpfCnpj, clientData)
      
      // Atualizar o cliente na lista local imediatamente
      setClients(prevClients => 
        prevClients.map(client => 
          client.cpfCnpj === selectedClient.cpfCnpj 
            ? { ...updatedClient, id: client.id } // Manter o ID original
            : client
        )
      )
      
      // Também recarregar a lista completa após um delay
      setTimeout(async () => {
        await loadClients()
      }, 1000)
      
      setIsEditDialogOpen(false)
      setFormErrors({}) // Limpar erros após sucesso
      setError(null)
      toast.success("Cliente atualizado com sucesso!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar cliente"
      setError(errorMessage)
      console.error("Erro ao atualizar cliente:", err)
      toast.error(errorMessage)
    }
  }

  const handleCreateClient = async () => {
    if (!validateCreateForm()) {
      return
    }
    
    try {
      const clientData = {
        ...createForm,
        status: createForm.ativo ? "ATIVO" : "INATIVO"
      }
      
      await createCliente(clientData)
      await loadClients() // Recarregar lista após criação
      setIsCreateDialogOpen(false)
      setCreateForm({
        cpfCnpj: "",
        nome: "",
        celular: "",
        email: "",
        dataNascimento: "",
        endereco: "",
        cep: "",
        observacoes: "",
        ativo: true,
      })
      setFormErrors({})
      setError(null)
      toast.success("Cliente criado com sucesso!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar cliente"
      setError(errorMessage)
      console.error("Erro ao criar cliente:", err)
      
      // Exibir toast de erro
      if (errorMessage.includes("Já existe um cliente cadastrado com este CPF/CNPJ")) {
        toast.error("Já existe um cliente cadastrado com este CPF/CNPJ.")
      } else {
        toast.error(errorMessage)
      }
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const renderActionButtons = (client: any) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-purple-100"
        onClick={() => handleView(client)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(client)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${
              client.status === 'INATIVO'
                ? "text-green-600 hover:bg-green-50" 
                : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            {client.status === 'INATIVO' ? (
              <User className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {client.status === 'INATIVO' ? "Ativar Cliente" : "Inativar Cliente"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {client.status === 'INATIVO'
                ? `Tem certeza que deseja ativar o cliente "${client.nome}"? O cliente ficará ativo no sistema.`
                : `Tem certeza que deseja inativar o cliente "${client.nome}"? O cliente ficará inativo no sistema.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleToggleStatus(client.id, client.status !== 'INATIVO')} 
              className={client.status === 'INATIVO' ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
            >
              {client.status === 'INATIVO' ? "Ativar" : "Inativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  return (
    <div className="flex-1 p-4 sm:p-6  ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Clientes</h1>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadClients}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (open) {
                clearCreateForm() // Limpar formulário ao abrir o modal
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#5A6ACF] hover:bg-[#5A6ACF] text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar novo cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>Preencha os dados para cadastrar um novo cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 sm:gap-6 py-2 sm:py-4">
                  {/* Nome e CPF/CNPJ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-nome">Nome Completo *</Label>
                      <Input 
                        id="new-nome" 
                        placeholder="Nome completo do cliente"
                        value={createForm.nome}
                        onChange={(e) => {
                          setCreateForm({ ...createForm, nome: e.target.value })
                          clearFieldError('nome')
                        }}
                        className={formErrors.nome ? "border-red-500" : ""}
                      />
                      <div className="min-h-[1.25rem]">
                        {formErrors.nome && (
                          <p className="text-red-500 text-sm break-words">{formErrors.nome}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-cpfCnpj">CPF/CNPJ *</Label>
                      <Input 
                        id="new-cpfCnpj" 
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        value={createForm.cpfCnpj}
                        onChange={(e) => {
                          const formatted = formatCpfCnpj(e.target.value)
                          setCreateForm({ ...createForm, cpfCnpj: formatted })
                          clearFieldError('cpfCnpj')
                        }}
                        className={formErrors.cpfCnpj ? "border-red-500" : ""}
                        maxLength={18}
                      />
                      <div className="min-h-[1.25rem]">
                        {formErrors.cpfCnpj && (
                          <p className="text-red-500 text-sm break-words">{formErrors.cpfCnpj}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email e Telefone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-email">E-mail *</Label>
                      <Input 
                        id="new-email" 
                        type="email" 
                        placeholder="cliente@email.com"
                        value={createForm.email}
                        onChange={(e) => {
                          setCreateForm({ ...createForm, email: e.target.value })
                          clearFieldError('email')
                        }}
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      <div className="min-h-[1.25rem]">
                        {formErrors.email && (
                          <p className="text-red-500 text-sm break-words">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-celular">Celular *</Label>
                      <Input 
                        id="new-celular" 
                        placeholder="(00) 0 0000-0000"
                        value={createForm.celular}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          setCreateForm({ ...createForm, celular: formatted })
                          clearFieldError('celular')
                        }}
                        className={formErrors.celular ? "border-red-500" : ""}
                        maxLength={15}
                      />
                      <div className="min-h-[1.25rem]">
                        {formErrors.celular && (
                          <p className="text-red-500 text-sm break-words">{formErrors.celular}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Data de Nascimento e CEP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-nascimento">Data de Nascimento *</Label>
                      <Input 
                        id="new-nascimento" 
                        type="date"
                        value={createForm.dataNascimento}
                        onChange={(e) => {
                          setCreateForm({ ...createForm, dataNascimento: e.target.value })
                          clearFieldError('dataNascimento')
                        }}
                        className={formErrors.dataNascimento ? "border-red-500" : ""}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <div className="min-h-[1.25rem]">
                        {formErrors.dataNascimento && (
                          <p className="text-red-500 text-sm break-words">{formErrors.dataNascimento}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-cep">CEP</Label>
                      <Input 
                        id="new-cep" 
                        placeholder="00000-000"
                        value={createForm.cep}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value)
                          setCreateForm({ ...createForm, cep: formatted })
                          clearFieldError('cep')
                          
                          // Buscar endereço quando CEP estiver completo
                          if (formatted.replace(/\D/g, '').length === 8) {
                            fetchAddressByCep(formatted)
                          }
                        }}
                        maxLength={9}
                        disabled={isLoadingCep}
                      />
                      <div className="min-h-[1.25rem]">
                        {isLoadingCep && (
                          <p className="text-blue-500 text-sm">Buscando endereço...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="grid gap-2">
                    <Label htmlFor="new-endereco">Endereço Completo</Label>
                    <Input 
                      id="new-endereco" 
                      placeholder="Rua, número, bairro, cidade, estado"
                      value={createForm.endereco}
                      onChange={(e) => setCreateForm({ ...createForm, endereco: e.target.value })}
                    />
                  </div>

                  {/* Status */}
                  <div className="grid gap-2">
                    <Label htmlFor="new-status">Status</Label>
                    <Select 
                      value={createForm.ativo ? "true" : "false"} 
                      onValueChange={(value) => setCreateForm({ ...createForm, ativo: value === "true" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Observações */}
                  <div className="grid gap-2">
                    <Label htmlFor="new-observacoes">Observações</Label>
                    <Textarea 
                      id="new-observacoes" 
                      placeholder="Observações sobre o cliente (opcional)"
                      value={createForm.observacoes}
                      onChange={(e) => setCreateForm({ ...createForm, observacoes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 pb-2 sm:pb-0">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false)
                    clearCreateForm()
                  }} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateClient} className="w-full sm:w-auto">
                    Cadastrar Cliente
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Status:</span>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="services">Mais serviços</SelectItem>
                    <SelectItem value="lastService">Último serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="text-[#707FDD] font-medium">Cliente</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Contato</TableHead>
                <TableHead className="text-[#707FDD] font-medium">CPF/CNPJ</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Data Nascimento</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Status</TableHead>
                <TableHead className="text-[#707FDD] font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5A6ACF] mr-3"></div>
                      <span className="text-gray-600">Carregando clientes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : currentClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                currentClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{client.nome}</p>
                          <p className="text-sm text-gray-500">
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {formatPhone(client.celular)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{formatCpfCnpj(client.cpfCnpj)}</TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(client.dataNascimento)}</p>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'INATIVO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {client.status === 'INATIVO' ? 'INATIVO' : 'ATIVO'}
                      </span>
                    </TableCell>
                    <TableCell>{renderActionButtons(client)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5A6ACF] mr-3"></div>
                <span className="text-gray-600">Carregando clientes...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : currentClients.length === 0 ? (
            <div className="text-center py-8">Nenhum cliente encontrado</div>
          ) : (
            currentClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 flex-grow">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.nome}</p>
                      <p className="text-sm text-gray-500">{formatCpfCnpj(client.cpfCnpj)}</p>
                    </div>
                  </div>
                  {renderActionButtons(client)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{formatPhone(client.celular)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{client.endereco}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span 
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'INATIVO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {client.status === 'INATIVO' ? 'INATIVO' : 'ATIVO'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Data Nascimento</p>
                    <p className="text-xs">{formatDate(client.dataNascimento)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">CEP</p>
                    <p className="text-xs">{client.cep}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-[#5A6ACF] text-white" : ""}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-2">
          Página {currentPage} de {totalPages} ({filteredAndSortedClients.length} clientes encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visualizar Cliente</DialogTitle>
              <DialogDescription>Informações completas do cliente selecionado.</DialogDescription>
            </DialogHeader>
            {selectedClient && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedClient.nome}</h3>
                    <p className="text-sm text-gray-500">
                      ID: {selectedClient.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CPF/CNPJ</Label>
                    <p className="text-sm font-mono">{formatCpfCnpj(selectedClient.cpfCnpj)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Nascimento</Label>
                    <p className="text-sm">{formatDate(selectedClient.dataNascimento)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Celular</Label>
                    <p className="text-sm">{formatPhone(selectedClient.celular)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-mail</Label>
                    <p className="text-sm">{selectedClient.email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Endereço</Label>
                  <p className="text-sm">{selectedClient.endereco}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CEP</Label>
                    <p className="text-sm font-mono">{selectedClient.cep}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedClient.status === 'INATIVO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedClient.status === 'INATIVO' ? 'INATIVO' : 'ATIVO'}
                    </span>
                  </div>
                </div>

                {selectedClient.observacoes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observações</Label>
                    <p className="text-sm">{selectedClient.observacoes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 pb-2 sm:pb-0">
              <Button onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Faça as alterações necessárias nos dados do cliente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nome">Nome Completo</Label>
                  <Input
                    id="edit-nome"
                    value={editForm.nome}
                    onChange={(e) => {
                      setEditForm({ ...editForm, nome: e.target.value })
                      clearFieldError('nome')
                    }}
                  />
                  <div className="min-h-6">
                    {formErrors.nome && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.nome}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="edit-cpfCnpj"
                    value={editForm.cpfCnpj}
                    disabled={true}
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">CPF/CNPJ não pode ser alterado após o cadastro</p>
                  <div className="min-h-6">
                    {formErrors.cpfCnpj && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.cpfCnpj}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">E-mail</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => {
                      setEditForm({ ...editForm, email: e.target.value })
                      clearFieldError('email')
                    }}
                  />
                  <div className="min-h-6">
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-celular">Celular</Label>
                  <Input
                    id="edit-celular"
                    value={editForm.celular}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      setEditForm({ ...editForm, celular: formatted })
                      clearFieldError('celular')
                    }}
                    maxLength={15}
                  />
                  <div className="min-h-6">
                    {formErrors.celular && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.celular}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endereco">Endereço Completo</Label>
                <Input
                  id="edit-endereco"
                  value={editForm.endereco}
                  onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cep">CEP</Label>
                  <Input
                    id="edit-cep"
                    value={editForm.cep}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value)
                      setEditForm({ ...editForm, cep: formatted })
                      clearFieldError('cep')
                      
                      // Buscar endereço quando CEP estiver completo
                      if (formatted.replace(/\D/g, '').length === 8) {
                        fetchAddressByCepEdit(formatted)
                      }
                    }}
                    maxLength={9}
                    disabled={isLoadingCep}
                  />
                  <div className="min-h-6">
                    {isLoadingCep && (
                      <p className="text-blue-500 text-xs">Buscando endereço...</p>
                    )}
                    {formErrors.cep && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.cep}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-nascimento">Data de Nascimento</Label>
                  <Input
                    id="edit-nascimento"
                    type="date"
                    value={editForm.dataNascimento}
                    onChange={(e) => {
                      setEditForm({ ...editForm, dataNascimento: e.target.value })
                      clearFieldError('dataNascimento')
                    }}
                  />
                  <div className="min-h-6">
                    {formErrors.dataNascimento && (
                      <p className="text-red-500 text-xs mt-1 break-words">{formErrors.dataNascimento}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editForm.ativo ? "true" : "false"} 
                  onValueChange={(value) => setEditForm({ ...editForm, ativo: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-observacoes">Observações</Label>
                <Textarea
                  id="edit-observacoes"
                  value={editForm.observacoes}
                  onChange={(e) => setEditForm({ ...editForm, observacoes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 pb-2 sm:pb-0">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
