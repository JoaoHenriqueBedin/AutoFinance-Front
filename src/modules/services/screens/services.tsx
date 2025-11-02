/* eslint-disable no-case-declarations */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Wrench, RotateCcw } from "lucide-react"
import { Servico, ServicoInput, getServicosList, createServico, updateServico, deleteServico, reactivateServico } from "@/servicos/services-service"
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
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"



const ITEMS_PER_PAGE = 6

export default function ServicesScreen() {
  // Estados para dados da API
  const [services, setServices] = React.useState<Servico[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Estados para UI
  const [selectedService, setSelectedService] = React.useState<Servico | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [filterStatus, setFilterStatus] = React.useState("todos")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  
  // Estados para formulários
  const [createForm, setCreateForm] = React.useState<ServicoInput>({
    nome: "",
    descricao: "",
    preco: 0,
    duracao: "",
    possuiRetorno: false,
    mesesRetornoPadrao: 0,
    mensagemRetornoPadrao: "",
    status: "ATIVO",
  })
  
  const [editForm, setEditForm] = React.useState<ServicoInput>({
    nome: "",
    descricao: "",
    preco: 0,
    duracao: "",
    possuiRetorno: false,
    mesesRetornoPadrao: 0,
    mensagemRetornoPadrao: "",
    status: "ATIVO",
  })

  // Função para carregar serviços
  const loadServices = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Iniciando carregamento de serviços...') // Debug
      const data = await getServicosList()
      console.log('Dados recebidos da API:', data) // Debug
      console.log('É um array?', Array.isArray(data)) // Debug
      console.log('Quantidade de itens:', data?.length) // Debug
      
      setServices(data || [])
    } catch (err) {
      console.error('Erro ao carregar serviços:', err) // Debug
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços')
      setServices([]) // Definir array vazio em caso de erro
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar serviços na inicialização
  React.useEffect(() => {
    loadServices()
  }, [loadServices])

  // Função de ordenação e filtros
  const filteredAndSortedServices = React.useMemo(() => {
    // Verificar se services é válido e é um array
    if (!services || !Array.isArray(services)) {
      return []
    }

    let filtered = [...services]

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((service) => service.status.toLowerCase() === filterStatus.toLowerCase())
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Ordenação
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          const dateA = a.dataCriacao ? new Date(a.dataCriacao) : new Date(0)
          const dateB = b.dataCriacao ? new Date(b.dataCriacao) : new Date(0)
          return dateB.getTime() - dateA.getTime()
        case "oldest":
          const dateOldA = a.dataCriacao ? new Date(a.dataCriacao) : new Date(0)
          const dateOldB = b.dataCriacao ? new Date(b.dataCriacao) : new Date(0)
          return dateOldA.getTime() - dateOldB.getTime()
        case "name":
          return a.nome.localeCompare(b.nome)
        case "price":
          return b.preco - a.preco
        default:
          return 0
      }
    })

    return sorted
  }, [services, sortBy, filterStatus, searchTerm])

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedServices.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentServices = filteredAndSortedServices.slice(startIndex, endIndex)

  // Função para limpar formulário de criação
  const clearCreateForm = () => {
    setCreateForm({
      nome: "",
      descricao: "",
      preco: 0,
      duracao: "",
      possuiRetorno: false,
      mesesRetornoPadrao: 0,
      mensagemRetornoPadrao: "",
      status: "ATIVO",
    })
  }

  // Handlers CRUD
  const handleView = (service: Servico) => {
    setSelectedService(service)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (service: Servico) => {
    setSelectedService(service)
    setEditForm({
      nome: service.nome,
      descricao: service.descricao,
      preco: service.preco,
      duracao: service.duracao,
      possuiRetorno: service.possuiRetorno,
      mesesRetornoPadrao: service.mesesRetornoPadrao,
      mensagemRetornoPadrao: service.mensagemRetornoPadrao,
      status: service.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (service: Servico) => {
    try {
      await deleteServico(service)
      toast.success('Serviço inativado com sucesso!')
      loadServices()
    } catch (error: unknown) {
      console.error('Erro ao inativar serviço:', error)
      
      // Extrair mensagem de erro se disponível
      let errorMessage = 'Erro ao inativar serviço'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message
      }
      
      toast.error(errorMessage)
    }
  }

  const handleReactivate = async (service: Servico) => {
    try {
      await reactivateServico(service)
      toast.success('Serviço reativado com sucesso!')
      loadServices()
    } catch (error: unknown) {
      console.error('Erro ao reativar serviço:', error)
      
      // Extrair mensagem de erro se disponível
      let errorMessage = 'Erro ao reativar serviço'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message
      }
      
      toast.error(errorMessage)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedService) return
    
    // Validação básica
    if (!editForm.nome.trim()) {
      toast.error('Nome do serviço é obrigatório')
      return
    }
    
    if (!editForm.descricao.trim()) {
      toast.error('Descrição do serviço é obrigatória')
      return
    }
    
    if (editForm.preco <= 0) {
      toast.error('Preço deve ser maior que zero')
      return
    }
    
    if (!editForm.duracao.trim()) {
      toast.error('Duração é obrigatória')
      return
    }
    
    if (editForm.possuiRetorno) {
      if (editForm.mesesRetornoPadrao <= 0) {
        toast.error('Meses de retorno deve ser maior que zero')
        return
      }
      
      if (!editForm.mensagemRetornoPadrao.trim()) {
        toast.error('Mensagem de retorno é obrigatória quando possui retorno')
        return
      }
    }
    
    try {
      // Garantir que o preço seja enviado com 2 casas decimais
      const servicoData = {
        ...editForm,
        preco: parseFloat(editForm.preco.toFixed(2))
      }
      
      await updateServico(selectedService.id, servicoData)
      toast.success('Serviço atualizado com sucesso!')
      setIsEditDialogOpen(false)
      loadServices()
    } catch (error: unknown) {
      console.error('Erro ao atualizar serviço:', error)
      
      // Extrair mensagem de erro se disponível
      let errorMessage = 'Erro ao atualizar serviço'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message
      }
      
      toast.error(errorMessage)
    }
  }

  const handleCreateService = async () => {
    // Validação básica
    if (!createForm.nome.trim()) {
      toast.error('Nome do serviço é obrigatório')
      return
    }
    
    if (!createForm.descricao.trim()) {
      toast.error('Descrição do serviço é obrigatória')
      return
    }
    
    if (createForm.preco <= 0) {
      toast.error('Preço deve ser maior que zero')
      return
    }
    
    if (!createForm.duracao.trim()) {
      toast.error('Duração é obrigatória')
      return
    }
    
    if (createForm.possuiRetorno) {
      if (createForm.mesesRetornoPadrao <= 0) {
        toast.error('Meses de retorno deve ser maior que zero')
        return
      }
      
      if (!createForm.mensagemRetornoPadrao.trim()) {
        toast.error('Mensagem de retorno é obrigatória quando possui retorno')
        return
      }
    }

    try {
      // Garantir que o preço seja enviado como number com formato decimal
      const servicoData = {
        ...createForm,
        preco: Number(createForm.preco.toFixed(2))
      }
      
      console.log('Payload enviado:', servicoData) // Debug
      console.log('Tipo do preço:', typeof servicoData.preco) // Debug
      
      await createServico(servicoData)
      toast.success('Serviço criado com sucesso!')
      setIsCreateDialogOpen(false)
      clearCreateForm()
      loadServices()
    } catch (error) {
      console.error('Erro detalhado:', error) // Debug
      toast.error('Erro ao criar serviço')
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'ATIVO' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const renderActionButtons = (service: Servico) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-purple-100"
        onClick={() => handleView(service)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(service)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {service.status === 'ATIVO' ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja inativar o serviço "{service.nome}"? O serviço ficará inativo no sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(service)} className="bg-red-600 hover:bg-red-700">
                Inativar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
          onClick={() => handleReactivate(service)}
          title="Reativar serviço"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  // Loading state
  if (loading) {
    return <Loading message="Carregando serviços..." fullScreen />
  }

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Serviços</h1>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadServices}
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
                  Cadastrar novo serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
                  <DialogDescription>Preencha os dados para cadastrar um novo serviço.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-nome">Nome do Serviço</Label>
                    <Input 
                      id="new-nome" 
                      placeholder="Ex: Troca de óleo"
                      value={createForm.nome}
                      onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-descricao">Descrição</Label>
                    <Textarea 
                      id="new-descricao" 
                      placeholder="Descrição detalhada do serviço"
                      value={createForm.descricao}
                      onChange={(e) => setCreateForm({ ...createForm, descricao: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-preco">Preço</Label>
                      <Input 
                        id="new-preco" 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={createForm.preco || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          const numericValue = value === '' ? 0 : parseFloat(value)
                          setCreateForm({ ...createForm, preco: numericValue })
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-duracao">Duração Estimada</Label>
                      <Input 
                        id="new-duracao" 
                        placeholder="Ex: 30 minutos"
                        value={createForm.duracao}
                        onChange={(e) => setCreateForm({ ...createForm, duracao: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-retorno">
                        Possui Retorno
                      </Label>
                      <Select
                        value={createForm.possuiRetorno ? "sim" : "nao"}
                        onValueChange={(value) => setCreateForm({ ...createForm, possuiRetorno: value === "sim" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-status">Status</Label>
                      <Select
                        value={createForm.status}
                        onValueChange={(value) => setCreateForm({ ...createForm, status: value as 'ATIVO' | 'INATIVO' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ATIVO">Ativo</SelectItem>
                          <SelectItem value="INATIVO">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {createForm.possuiRetorno && (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-meses">Meses de Retorno</Label>
                        <Input 
                          id="new-meses" 
                          type="number"
                          placeholder="6"
                          value={createForm.mesesRetornoPadrao}
                          onChange={(e) => setCreateForm({ ...createForm, mesesRetornoPadrao: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-mensagem">Mensagem de Retorno</Label>
                        <Textarea 
                          id="new-mensagem" 
                          placeholder="Ex: Sua troca de óleo já venceu, recomendamos que venha fazer uma visita para nós novamente!"
                          value={createForm.mensagemRetornoPadrao}
                          onChange={(e) => setCreateForm({ ...createForm, mensagemRetornoPadrao: e.target.value })}
                          className="min-h-[100px]"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateService}>Cadastrar Serviço</Button>
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
                  <SelectTrigger className="w-full sm:w-48">
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
                    <SelectItem value="price">Maior preço</SelectItem>
                    <SelectItem value="category">Categoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar serviços..."
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
                <TableHead className="text-[#707FDD] font-medium">Nome do Serviço</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Retorno</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Preço</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Duração</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Status</TableHead>
                <TableHead className="text-[#707FDD] font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.nome}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{service.descricao}</p>
                    </div>
                  </TableCell>
                  <TableCell>{service.possuiRetorno ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="font-medium text-green-600">{formatPrice(service.preco)}</TableCell>
                  <TableCell>{service.duracao}</TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>{renderActionButtons(service)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="h-4 w-4 text-[#707FDD]" />
                    <p className="font-medium text-gray-900">{service.nome}</p>
                  </div>
                  <p className="text-sm text-gray-600">{service.descricao}</p>
                </div>
                {renderActionButtons(service)}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Retorno</p>
                  <p className="text-sm">{service.possuiRetorno ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(service.status)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="font-medium text-green-600">{formatPrice(service.preco)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duração</p>
                  <p className="text-gray-800">{service.duracao}</p>
                </div>
              </div>
            </div>
          ))}
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
          Página {currentPage} de {totalPages} ({filteredAndSortedServices?.length || 0} serviços encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Serviço</DialogTitle>
              <DialogDescription>Detalhes do serviço selecionado.</DialogDescription>
            </DialogHeader>
            {selectedService && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nome do Serviço</Label>
                  <p className="text-sm font-medium">{selectedService.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Descrição</Label>
                  <p className="text-sm">{selectedService.descricao}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Possui Retorno</Label>
                    <p className="text-sm">{selectedService.possuiRetorno ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedService.status)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Preço</Label>
                    <p className="text-sm font-medium text-green-600">{formatPrice(selectedService.preco)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duração Estimada</Label>
                    <p className="text-sm">{selectedService.duracao}</p>
                  </div>
                </div>
                {selectedService.possuiRetorno && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Meses de Retorno</Label>
                      <p className="text-sm">{selectedService.mesesRetornoPadrao}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Mensagem de Retorno</Label>
                      <p className="text-sm">{selectedService.mensagemRetornoPadrao}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Serviço</DialogTitle>
              <DialogDescription>Faça as alterações necessárias no serviço.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nome">Nome do Serviço</Label>
                <Input
                  id="edit-nome"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Textarea
                  id="edit-descricao"
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-preco">Preço</Label>
                  <Input
                    id="edit-preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.preco || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      const numericValue = value === '' ? 0 : parseFloat(value)
                      setEditForm({ ...editForm, preco: numericValue })
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-duracao">Duração Estimada</Label>
                  <Input
                    id="edit-duracao"
                    value={editForm.duracao}
                    onChange={(e) => setEditForm({ ...editForm, duracao: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value as 'ATIVO' | 'INATIVO' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-retorno">Possui Retorno</Label>
                  <Select
                    value={editForm.possuiRetorno ? "sim" : "nao"}
                    onValueChange={(value) => setEditForm({ ...editForm, possuiRetorno: value === "sim" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {editForm.possuiRetorno && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-meses">Meses de Retorno</Label>
                    <Input
                      id="edit-meses"
                      type="number"
                      value={editForm.mesesRetornoPadrao}
                      onChange={(e) => setEditForm({ ...editForm, mesesRetornoPadrao: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-mensagem">Mensagem de Retorno</Label>
                    <Textarea
                      id="edit-mensagem"
                      value={editForm.mensagemRetornoPadrao}
                      onChange={(e) => setEditForm({ ...editForm, mensagemRetornoPadrao: e.target.value })}
                      className="min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
