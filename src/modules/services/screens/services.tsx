/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Wrench } from "lucide-react"

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

// Dados de exemplo dos serviços
const services = [
  {
    id: 1,
    nome: "Troca de Óleo",
    descricao: "Troca completa do óleo do motor com filtro",
    preco: "R$ 150,00",
    categoria: "Motor",
    duracao: "30 min",
    ativo: true,
    dataCriacao: new Date("2024-01-10"),
  },
  {
    id: 2,
    nome: "Alinhamento e Balanceamento",
    descricao: "Alinhamento das rodas e balanceamento dos pneus",
    preco: "R$ 120,00",
    categoria: "Pneus",
    duracao: "45 min",
    ativo: true,
    dataCriacao: new Date("2024-01-12"),
  },
  {
    id: 3,
    nome: "Revisão dos Freios",
    descricao: "Inspeção completa do sistema de freios",
    preco: "R$ 250,00",
    categoria: "Freios",
    duracao: "60 min",
    ativo: true,
    dataCriacao: new Date("2024-01-08"),
  },
  {
    id: 4,
    nome: "Troca do Filtro de Ar",
    descricao: "Substituição do filtro de ar do motor",
    preco: "R$ 80,00",
    categoria: "Motor",
    duracao: "15 min",
    ativo: true,
    dataCriacao: new Date("2024-01-15"),
  },
  {
    id: 5,
    nome: "Revisão dos Amortecedores",
    descricao: "Inspeção e teste dos amortecedores",
    preco: "R$ 380,00",
    categoria: "Suspensão",
    duracao: "90 min",
    ativo: true,
    dataCriacao: new Date("2024-01-05"),
  },
  {
    id: 6,
    nome: "Substituição da Correia Dentada",
    descricao: "Troca da correia dentada e tensor",
    preco: "R$ 450,00",
    categoria: "Motor",
    duracao: "120 min",
    ativo: true,
    dataCriacao: new Date("2024-01-18"),
  },
  {
    id: 7,
    nome: "Troca da Bateria",
    descricao: "Substituição da bateria do veículo",
    preco: "R$ 300,00",
    categoria: "Elétrica",
    duracao: "20 min",
    ativo: false,
    dataCriacao: new Date("2024-01-03"),
  },
  {
    id: 8,
    nome: "Higienização do Ar-condicionado",
    descricao: "Limpeza completa do sistema de ar-condicionado",
    preco: "R$ 130,00",
    categoria: "Ar-condicionado",
    duracao: "40 min",
    ativo: true,
    dataCriacao: new Date("2024-01-20"),
  },
  {
    id: 9,
    nome: "Troca de Pastilhas de Freio",
    descricao: "Substituição das pastilhas de freio dianteiras",
    preco: "R$ 200,00",
    categoria: "Freios",
    duracao: "50 min",
    ativo: true,
    dataCriacao: new Date("2024-01-14"),
  },
  {
    id: 10,
    nome: "Revisão Geral",
    descricao: "Revisão completa de todos os sistemas do veículo",
    preco: "R$ 500,00",
    categoria: "Geral",
    duracao: "180 min",
    ativo: true,
    dataCriacao: new Date("2024-01-22"),
  },
]

const ITEMS_PER_PAGE = 6

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [filterCategory, setFilterCategory] = React.useState("todas")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [editForm, setEditForm] = React.useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    duracao: "",
    ativo: true,
  })

  // Função de ordenação e filtros
  const filteredAndSortedServices = React.useMemo(() => {
    let filtered = services

    // Filtro por categoria
    if (filterCategory !== "todas") {
      filtered = filtered.filter((service) => service.categoria.toLowerCase() === filterCategory.toLowerCase())
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.dataCriacao.getTime() - a.dataCriacao.getTime()
        case "oldest":
          return a.dataCriacao.getTime() - b.dataCriacao.getTime()
        case "name":
          return a.nome.localeCompare(b.nome)
        case "price":
          const priceA = Number.parseFloat(a.preco.replace(/[R$\s.,]/g, ""))
          const priceB = Number.parseFloat(b.preco.replace(/[R$\s.,]/g, ""))
          return priceB - priceA
        case "category":
          return a.categoria.localeCompare(b.categoria)
        default:
          return 0
      }
    })

    return sorted
  }, [sortBy, filterCategory, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedServices.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentServices = filteredAndSortedServices.slice(startIndex, endIndex)

  const handleView = (service: any) => {
    setSelectedService(service)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (service: any) => {
    setSelectedService(service)
    setEditForm({
      nome: service.nome,
      descricao: service.descricao,
      preco: service.preco,
      categoria: service.categoria,
      duracao: service.duracao,
      ativo: service.ativo,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (serviceId: number) => {
    console.log("Excluindo serviço:", serviceId)
  }

  const handleSaveEdit = () => {
    console.log("Salvando edição:", editForm)
    setIsEditDialogOpen(false)
  }

  const handleCreateService = () => {
    console.log("Criando novo serviço")
    setIsCreateDialogOpen(false)
  }

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    )
  }

  const getCategoryBadge = (categoria: string) => {
    const categoryColors = {
      Motor: "bg-blue-100 text-blue-800",
      Freios: "bg-red-100 text-red-800",
      Pneus: "bg-gray-100 text-gray-800",
      Suspensão: "bg-purple-100 text-purple-800",
      Elétrica: "bg-yellow-100 text-yellow-800",
      "Ar-condicionado": "bg-cyan-100 text-cyan-800",
      Geral: "bg-green-100 text-green-800",
    }
    const colorClass = categoryColors[categoria as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"
    return <Badge className={`${colorClass} hover:${colorClass}`}>{categoria}</Badge>
  }

  const renderActionButtons = (service: any) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
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
              Tem certeza que deseja excluir o serviço "{service.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Serviços</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
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
                    <Input id="new-nome" placeholder="Ex: Troca de óleo" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-descricao">Descrição</Label>
                    <Textarea id="new-descricao" placeholder="Descrição detalhada do serviço" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-preco">Preço</Label>
                      <Input id="new-preco" placeholder="R$ 0,00" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-duracao">Duração Estimada</Label>
                      <Input id="new-duracao" placeholder="Ex: 30 min" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-categoria">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motor">Motor</SelectItem>
                        <SelectItem value="freios">Freios</SelectItem>
                        <SelectItem value="pneus">Pneus</SelectItem>
                        <SelectItem value="suspensao">Suspensão</SelectItem>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="ar-condicionado">Ar-condicionado</SelectItem>
                        <SelectItem value="geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <span className="text-sm text-gray-600 whitespace-nowrap">Categoria:</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="freios">Freios</SelectItem>
                    <SelectItem value="pneus">Pneus</SelectItem>
                    <SelectItem value="suspensão">Suspensão</SelectItem>
                    <SelectItem value="elétrica">Elétrica</SelectItem>
                    <SelectItem value="ar-condicionado">Ar-condicionado</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
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
              <TableRow className="bg-blue-50">
                <TableHead className="text-blue-700 font-medium">Nome do Serviço</TableHead>
                <TableHead className="text-blue-700 font-medium">Categoria</TableHead>
                <TableHead className="text-blue-700 font-medium">Preço</TableHead>
                <TableHead className="text-blue-700 font-medium">Duração</TableHead>
                <TableHead className="text-blue-700 font-medium">Status</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
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
                  <TableCell>{getCategoryBadge(service.categoria)}</TableCell>
                  <TableCell className="font-medium text-green-600">{service.preco}</TableCell>
                  <TableCell>{service.duracao}</TableCell>
                  <TableCell>{getStatusBadge(service.ativo)}</TableCell>
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
                    <Wrench className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-gray-900">{service.nome}</p>
                  </div>
                  <p className="text-sm text-gray-600">{service.descricao}</p>
                </div>
                {renderActionButtons(service)}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  {getCategoryBadge(service.categoria)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(service.ativo)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="font-medium text-green-600">{service.preco}</p>
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
          Página {currentPage} de {totalPages} ({filteredAndSortedServices.length} serviços encontrados)
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
                    <Label className="text-sm font-medium text-gray-500">Categoria</Label>
                    <div className="mt-1">{getCategoryBadge(selectedService.categoria)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedService.ativo)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Preço</Label>
                    <p className="text-sm font-medium text-green-600">{selectedService.preco}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duração Estimada</Label>
                    <p className="text-sm">{selectedService.duracao}</p>
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
                    value={editForm.preco}
                    onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
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
                  <Label htmlFor="edit-categoria">Categoria</Label>
                  <Select
                    value={editForm.categoria}
                    onValueChange={(value) => setEditForm({ ...editForm, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor">Motor</SelectItem>
                      <SelectItem value="Freios">Freios</SelectItem>
                      <SelectItem value="Pneus">Pneus</SelectItem>
                      <SelectItem value="Suspensão">Suspensão</SelectItem>
                      <SelectItem value="Elétrica">Elétrica</SelectItem>
                      <SelectItem value="Ar-condicionado">Ar-condicionado</SelectItem>
                      <SelectItem value="Geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-ativo">Status</Label>
                  <Select
                    value={editForm.ativo ? "ativo" : "inativo"}
                    onValueChange={(value) => setEditForm({ ...editForm, ativo: value === "ativo" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
