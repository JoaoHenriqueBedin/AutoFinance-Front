/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight, FileText } from "lucide-react"
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

// Importar serviços
import {
  getOrdensServico,
  createOrdemServicoFromOrcamento,
  deleteOrdemServico,
  OrdemServico,
} from "@/servicos/orders-service"
import { getClientes, Cliente } from "@/servicos/clients-service"
import { getVeiculos, Veiculo } from "@/servicos/vehicles-service"
import { getServicosList, Servico } from "@/servicos/services-service"

const ITEMS_PER_PAGE = 10

export default function ServiceOrdersScreen() {
  // Estados para dados da API
  const [orders, setOrders] = React.useState<OrdemServico[]>([])
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [veiculos, setVeiculos] = React.useState<Veiculo[]>([])
  const [servicos, setServicos] = React.useState<Servico[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Estados para controle dos diálogos
  const [selectedOrder, setSelectedOrder] = React.useState<OrdemServico | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = React.useState(false)
  const [orcamentoIdInput, setOrcamentoIdInput] = React.useState("")
  const [sortBy, setSortBy] = React.useState("latest")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [editForm, setEditForm] = React.useState({
    cliente: "",
    carro: "",
    servico: "",
    valor: "",
    mecanico: "",
    status: "",
  })

  // Carregar dados ao montar o componente
  React.useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar todos os dados em paralelo
      const [ordersData, clientesData, veiculosData, servicosData] = await Promise.all([
        getOrdensServico(),
        getClientes(),
        getVeiculos(),
        getServicosList(0, 1000),
      ])
      
      setOrders(ordersData)
      setClientes(clientesData)
      setVeiculos(Array.isArray(veiculosData) ? veiculosData : veiculosData.content)
      setServicos(servicosData.content)
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err)
      setError(err.message || "Erro ao carregar dados")
      toast.error(err.message || "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }
  
  // Buscar nome do cliente por CPF/CNPJ
  const getClienteNome = (cpfCnpj: string) => {
    if (!cpfCnpj) return "N/A"
    
    // Normalizar CPF/CNPJ removendo pontos, traços e barras
    const normalizarCpfCnpj = (valor: string) => valor.replace(/[.\-/]/g, '')
    const cpfCnpjNormalizado = normalizarCpfCnpj(cpfCnpj)
    
    const cliente = clientes.find(c => normalizarCpfCnpj(c.cpfCnpj) === cpfCnpjNormalizado)
    return cliente?.nome || cpfCnpj
  }

  // Buscar informações do veículo por placa
  const getVeiculoInfo = (placa: string) => {
    if (!placa) return "N/A"
    const veiculo = veiculos.find(v => v.placa === placa)
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}` : placa
  }

  // Obter valor da ordem (API retorna "valor", mas pode ter "valorAjustado" em alguns casos)
  const getValorOrdem = (order: OrdemServico): number => {
    return order.valor || order.valorAjustado || 0
  }

  // Função de ordenação
  const sortedOrders = React.useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
        case "oldest":
          return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime()
        case "client":
          return getClienteNome(a.clienteCpfCnpj || '').localeCompare(getClienteNome(b.clienteCpfCnpj || ''))
        case "value":
          return getValorOrdem(b) - getValorOrdem(a)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })
    return sorted
  }, [orders, sortBy, clientes]) // eslint-disable-line react-hooks/exhaustive-deps

  // Paginação
  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentOrders = sortedOrders.slice(startIndex, endIndex)

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (order: OrdemServico) => {
    setSelectedOrder(order)
    setEditForm({
      cliente: getClienteNome(order.clienteCpfCnpj || ''),
      carro: getVeiculoInfo(order.veiculoPlaca),
      servico: order.servicoNome,
      valor: getValorOrdem(order).toString(),
      mecanico: order.mecanicoUsername || '',
      status: order.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (numeroOrdem: number) => {
    try {
      await deleteOrdemServico(numeroOrdem)
      await loadAllData()
      toast.success("Ordem de serviço excluída com sucesso!")
    } catch (err: any) {
      console.error("Erro ao excluir ordem de serviço:", err)
      toast.error(err.message || "Erro ao excluir ordem de serviço")
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedOrder) return
    
    try {
      // A API não permite edição completa, então vamos apenas mostrar mensagem
      toast.info("Funcionalidade de edição em desenvolvimento")
      setIsEditDialogOpen(false)
    } catch (err: any) {
      console.error("Erro ao atualizar ordem de serviço:", err)
      toast.error(err.message || "Erro ao atualizar ordem de serviço")
    }
  }

  const handleCreateOrder = () => {
    toast.info("Use o botão 'Criar a partir de orçamento' para criar uma ordem de serviço")
    setIsCreateDialogOpen(false)
  }

  const handleRecoverOrder = async () => {
    if (!orcamentoIdInput.trim()) {
      toast.error("Digite o número do orçamento")
      return
    }
    
    const numeroOrcamento = Number.parseInt(orcamentoIdInput)
    if (isNaN(numeroOrcamento) || numeroOrcamento <= 0) {
      toast.error("Número do orçamento inválido")
      return
    }
    
    try {
      await createOrdemServicoFromOrcamento(numeroOrcamento)
      await loadAllData()
      setIsRecoverDialogOpen(false)
      setOrcamentoIdInput("")
      toast.success("Ordem de serviço criada a partir do orçamento!")
    } catch (err: any) {
      console.error("Erro ao criar ordem a partir do orçamento:", err)
      toast.error(err.message || "Erro ao criar ordem a partir do orçamento")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      ATIVO: { color: "bg-green-100 text-green-800", text: "Ativo" },
      EM_ANDAMENTO: { color: "bg-blue-100 text-blue-800", text: "Em Andamento" },
      CONCLUIDO: { color: "bg-gray-100 text-gray-800", text: "Concluído" },
      CANCELADO: { color: "bg-red-100 text-red-800", text: "Cancelado" },
      PENDENTE: { color: "bg-yellow-100 text-yellow-800", text: "Pendente" },
    }
    const config = statusConfig[status] || statusConfig["PENDENTE"]
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  const renderActionButtons = (order: OrdemServico) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
        onClick={() => handleView(order)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(order)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ordem de serviço #{order.numeroOrdem || order.numero}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(order.numeroOrdem || order.numero || 0)} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Ordens de Serviço</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5A6ACF]  hover:bg-[#5A6ACF]  text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar nova ordem de serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
                  <DialogDescription>Preencha os dados para criar uma nova ordem de serviço.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-cliente">Cliente</Label>
                    <Input id="new-cliente" placeholder="Nome do cliente" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-carro">Carro</Label>
                    <Input id="new-carro" placeholder="Modelo e ano do carro" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-servico">Serviço</Label>
                    <Textarea id="new-servico" placeholder="Descrição do serviço" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-valor">Valor</Label>
                    <Input id="new-valor" placeholder="R$ 0,00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-mecanico">Mecânico</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mecânico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gustavo">Gustavo</SelectItem>
                        <SelectItem value="isabely">Isabely</SelectItem>
                        <SelectItem value="joao">João</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em-andamento">Em andamento</SelectItem>
                        <SelectItem value="aguardando-pecas">Aguardando peças</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateOrder}>Criar Ordem</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isRecoverDialogOpen} onOpenChange={setIsRecoverDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-purple-100 w-full sm:w-auto">
                  <FileText className="w-4 h-4 mr-2" />
                  Criar a partir de orçamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Criar Ordem a partir de Orçamento</DialogTitle>
                  <DialogDescription>Digite o número do orçamento aprovado para criar uma ordem de serviço.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recover-id">Número do Orçamento</Label>
                    <Input 
                      id="recover-id" 
                      type="number" 
                      placeholder="Digite o número do orçamento" 
                      value={orcamentoIdInput}
                      onChange={(e) => setOrcamentoIdInput(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRecoverDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRecoverOrder}>Criar Ordem</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <span className="text-sm text-gray-600">Listagem de ordens de serviço:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigas</SelectItem>
                  <SelectItem value="client">Cliente A-Z</SelectItem>
                  <SelectItem value="value">Maior valor</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading e Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <p>Carregando ordens de serviço...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Button onClick={loadAllData} variant="outline" size="sm" className="mt-2">
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && (
        <div className="hidden md:block bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="text-blue-700 font-medium">Cliente</TableHead>
                <TableHead className="text-blue-700 font-medium">Carro</TableHead>
                <TableHead className="text-blue-700 font-medium">Serviço</TableHead>
                <TableHead className="text-blue-700 font-medium">Valor (R$)</TableHead>
                <TableHead className="text-blue-700 font-medium">Mecânico</TableHead>
                <TableHead className="text-blue-700 font-medium">Status</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.numeroOrdem || order.numero || order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{getClienteNome(order.clienteCpfCnpj || '')}</TableCell>
                  <TableCell>{getVeiculoInfo(order.veiculoPlaca)}</TableCell>
                  <TableCell>{order.servicoNome}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {getValorOrdem(order).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell>{order.mecanicoUsername || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{renderActionButtons(order)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentOrders.map((order) => (
            <div key={order.numeroOrdem || order.numero || order.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-900">{getClienteNome(order.clienteCpfCnpj || '')}</p>
                </div>
                {renderActionButtons(order)}
              </div>

              <div>
                <p className="text-sm text-gray-500">Carro</p>
                <p className="text-gray-800">{getVeiculoInfo(order.veiculoPlaca)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Serviço</p>
                <p className="text-gray-800">{order.servicoNome}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium text-green-600">
                    {getValorOrdem(order).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mecânico</p>
                  <p className="text-gray-800">{order.mecanicoUsername}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
        )}

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
              className={currentPage === page ? "bg-blue-600 text-white" : ""}
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
          Página {currentPage} de {totalPages} ({sortedOrders.length} ordens no total)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Ordem de Serviço</DialogTitle>
              <DialogDescription>Detalhes da ordem de serviço selecionada.</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nº Ordem</Label>
                    <p className="text-sm font-semibold">#{selectedOrder.numeroOrdem}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                    <p className="text-sm">{getClienteNome(selectedOrder.clienteCpfCnpj || '')}</p>
                    <p className="text-xs text-gray-400">{selectedOrder.clienteCpfCnpj}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Veículo</Label>
                    <p className="text-sm">{getVeiculoInfo(selectedOrder.veiculoPlaca)}</p>
                    <p className="text-xs text-gray-400">{selectedOrder.veiculoPlaca}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Serviço</Label>
                  <p className="text-sm">{selectedOrder.servicoNome}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Valor</Label>
                    <p className="text-sm font-medium text-green-600">
                      {getValorOrdem(selectedOrder).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mecânico</Label>
                    <p className="text-sm">{selectedOrder.mecanicoUsername}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Criação</Label>
                    <p className="text-sm">{new Date(selectedOrder.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {selectedOrder.numeroOrcamento && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Orçamento</Label>
                      <p className="text-sm">#{selectedOrder.numeroOrcamento}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Ordem de Serviço</DialogTitle>
              <DialogDescription>Faça as alterações necessárias na ordem de serviço.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Input
                  id="edit-cliente"
                  value={editForm.cliente}
                  onChange={(e) => setEditForm({ ...editForm, cliente: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-carro">Carro</Label>
                <Input
                  id="edit-carro"
                  value={editForm.carro}
                  onChange={(e) => setEditForm({ ...editForm, carro: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-servico">Serviço</Label>
                <Textarea
                  id="edit-servico"
                  value={editForm.servico}
                  onChange={(e) => setEditForm({ ...editForm, servico: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-valor">Valor</Label>
                <Input
                  id="edit-valor"
                  value={editForm.valor}
                  onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mecanico">Mecânico</Label>
                <Select
                  value={editForm.mecanico}
                  onValueChange={(value) => setEditForm({ ...editForm, mecanico: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gustavo">Gustavo</SelectItem>
                    <SelectItem value="Isabely">Isabely</SelectItem>
                    <SelectItem value="João">João</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Aguardando peças">Aguardando peças</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
