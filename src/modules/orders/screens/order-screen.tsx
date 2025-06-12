/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"

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

// Dados de exemplo das ordens de serviço
const serviceOrders = [
  {
    id: 1,
    cliente: "João Silva",
    carro: "Fiat Uno 2012",
    servico: "Troca de óleo",
    valor: "R$ 150,00",
    mecanico: "Gustavo",
    status: "Em andamento",
    dataInicio: "2024-01-15",
    dataCriacao: new Date("2024-01-15"),
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    carro: "Volkswagen Gol 2018",
    servico: "Alinhamento e balanceamento",
    valor: "R$ 120,00",
    mecanico: "Isabely",
    status: "Concluído",
    dataInicio: "2024-01-14",
    dataCriacao: new Date("2024-01-14"),
  },
  {
    id: 3,
    cliente: "Carlos Souza",
    carro: "Chevrolet Onix 2019",
    servico: "Revisão dos freios",
    valor: "R$ 250,00",
    mecanico: "João",
    status: "Aguardando peças",
    dataInicio: "2024-01-16",
    dataCriacao: new Date("2024-01-16"),
  },
  {
    id: 4,
    cliente: "Ana Paula Lima",
    carro: "Honda Civic 2020",
    servico: "Troca do filtro de ar",
    valor: "R$ 80,00",
    mecanico: "Gustavo",
    status: "Concluído",
    dataInicio: "2024-01-13",
    dataCriacao: new Date("2024-01-13"),
  },
  {
    id: 5,
    cliente: "Fernando Ribeiro",
    carro: "Toyota Corolla 2018",
    servico: "Revisão dos amortecedores",
    valor: "R$ 380,00",
    mecanico: "Isabely",
    status: "Em andamento",
    dataInicio: "2024-01-17",
    dataCriacao: new Date("2024-01-17"),
  },
  {
    id: 6,
    cliente: "Lucas Martins",
    carro: "Ford Ka 2016",
    servico: "Substituição da correia dentada",
    valor: "R$ 450,00",
    mecanico: "João",
    status: "Pendente",
    dataInicio: "2024-01-18",
    dataCriacao: new Date("2024-01-18"),
  },
  {
    id: 7,
    cliente: "Bruno Costa",
    carro: "Renault Sandero 2017",
    servico: "Troca da bateria",
    valor: "R$ 300,00",
    mecanico: "Gustavo",
    status: "Em andamento",
    dataInicio: "2024-01-12",
    dataCriacao: new Date("2024-01-12"),
  },
  {
    id: 8,
    cliente: "Patrícia Gomes",
    carro: "Hyundai HB20 2021",
    servico: "Higienização do ar-condicionado",
    valor: "R$ 130,00",
    mecanico: "Isabely",
    status: "Concluído",
    dataInicio: "2024-01-19",
    dataCriacao: new Date("2024-01-19"),
  },
  {
    id: 9,
    cliente: "Roberto Santos",
    carro: "Nissan March 2015",
    servico: "Troca de pastilhas de freio",
    valor: "R$ 200,00",
    mecanico: "João",
    status: "Aguardando peças",
    dataInicio: "2024-01-20",
    dataCriacao: new Date("2024-01-20"),
  },
  {
    id: 10,
    cliente: "Juliana Costa",
    carro: "Peugeot 208 2019",
    servico: "Revisão geral",
    valor: "R$ 500,00",
    mecanico: "Gustavo",
    status: "Em andamento",
    dataInicio: "2024-01-21",
    dataCriacao: new Date("2024-01-21"),
  },
]

const ITEMS_PER_PAGE = 5

export default function ServiceOrdersScreen() {
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = React.useState(false)
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

  // Função de ordenação
  const sortedOrders = React.useMemo(() => {
    const sorted = [...serviceOrders].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.dataCriacao.getTime() - a.dataCriacao.getTime()
        case "oldest":
          return a.dataCriacao.getTime() - b.dataCriacao.getTime()
        case "client":
          return a.cliente.localeCompare(b.cliente)
        case "value":
          const valueA = Number.parseFloat(a.valor.replace(/[R$\s.,]/g, ""))
          const valueB = Number.parseFloat(b.valor.replace(/[R$\s.,]/g, ""))
          return valueB - valueA
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })
    return sorted
  }, [sortBy])

  // Paginação
  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentOrders = sortedOrders.slice(startIndex, endIndex)

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (order: any) => {
    setSelectedOrder(order)
    setEditForm({
      cliente: order.cliente,
      carro: order.carro,
      servico: order.servico,
      valor: order.valor,
      mecanico: order.mecanico,
      status: order.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (orderId: number) => {
    console.log("Excluindo ordem de serviço:", orderId)
  }

  const handleSaveEdit = () => {
    console.log("Salvando edição:", editForm)
    setIsEditDialogOpen(false)
  }

  const handleCreateOrder = () => {
    console.log("Criando nova ordem de serviço")
    setIsCreateDialogOpen(false)
  }

  const handleRecoverOrder = () => {
    console.log("Recuperando ordem de serviço")
    setIsRecoverDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Em andamento": { color: "bg-blue-100 text-blue-800", text: "Em andamento" },
      Concluído: { color: "bg-green-100 text-green-800", text: "Concluído" },
      "Aguardando peças": { color: "bg-yellow-100 text-yellow-800", text: "Aguardando peças" },
      Pendente: { color: "bg-gray-100 text-gray-800", text: "Pendente" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pendente"]
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  const renderActionButtons = (order: any) => (
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
              Tem certeza que deseja excluir a ordem de serviço de {order.cliente}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(order.id)} className="bg-red-600 hover:bg-red-700">
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
                  <Search className="w-4 h-4 mr-2" />
                  Recuperar ordem de serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Recuperar Ordem de Serviço</DialogTitle>
                  <DialogDescription>Digite o ID ou código da ordem de serviço para recuperá-la.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recover-id">ID da Ordem</Label>
                    <Input id="recover-id" placeholder="Digite o ID da ordem" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRecoverDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRecoverOrder}>Recuperar</Button>
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

        {/* Desktop Table */}
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
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{order.cliente}</TableCell>
                  <TableCell>{order.carro}</TableCell>
                  <TableCell>{order.servico}</TableCell>
                  <TableCell className="font-medium text-green-600">{order.valor}</TableCell>
                  <TableCell>{order.mecanico}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{renderActionButtons(order)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-900">{order.cliente}</p>
                </div>
                {renderActionButtons(order)}
              </div>

              <div>
                <p className="text-sm text-gray-500">Carro</p>
                <p className="text-gray-800">{order.carro}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Serviço</p>
                <p className="text-gray-800">{order.servico}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium text-green-600">{order.valor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mecânico</p>
                  <p className="text-gray-800">{order.mecanico}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(order.status)}
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
                    <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                    <p className="text-sm">{selectedOrder.cliente}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Carro</Label>
                    <p className="text-sm">{selectedOrder.carro}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Serviço</Label>
                  <p className="text-sm">{selectedOrder.servico}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Valor</Label>
                    <p className="text-sm font-medium text-green-600">{selectedOrder.valor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mecânico</Label>
                    <p className="text-sm">{selectedOrder.mecanico}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Início</Label>
                    <p className="text-sm">{selectedOrder.dataInicio}</p>
                  </div>
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
