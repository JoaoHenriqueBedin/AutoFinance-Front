/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, User, Phone, Mail, MapPin } from "lucide-react"

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

// Dados de exemplo dos clientes
const clients = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 9 1234-5678",
    cpf: "123.456.789-01",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    cep: "01234-567",
    dataNascimento: "1985-03-15",
    status: "Ativo",
    totalServicos: 5,
    ultimoServico: "2024-01-20",
    observacoes: "Cliente preferencial",
    dataCadastro: new Date("2023-06-15"),
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(21) 9 8765-4321",
    cpf: "987.654.321-09",
    endereco: "Av. Copacabana, 456 - Rio de Janeiro, RJ",
    cep: "22070-001",
    dataNascimento: "1990-07-22",
    status: "Ativo",
    totalServicos: 3,
    ultimoServico: "2024-01-18",
    observacoes: "",
    dataCadastro: new Date("2023-08-10"),
  },
  {
    id: 3,
    nome: "Carlos Souza",
    email: "carlos.souza@email.com",
    telefone: "(31) 9 2345-6789",
    cpf: "456.789.123-45",
    endereco: "Rua da Liberdade, 789 - Belo Horizonte, MG",
    cep: "30112-000",
    dataNascimento: "1978-12-03",
    status: "Ativo",
    totalServicos: 8,
    ultimoServico: "2024-01-22",
    observacoes: "Possui frota de veículos",
    dataCadastro: new Date("2023-04-20"),
  },
  {
    id: 4,
    nome: "Ana Paula Lima",
    email: "ana.lima@email.com",
    telefone: "(41) 9 9876-5432",
    cpf: "789.123.456-78",
    endereco: "Rua XV de Novembro, 321 - Curitiba, PR",
    cep: "80020-310",
    dataNascimento: "1992-05-18",
    status: "Ativo",
    totalServicos: 2,
    ultimoServico: "2024-01-15",
    observacoes: "",
    dataCadastro: new Date("2023-11-05"),
  },
  {
    id: 5,
    nome: "Fernando Ribeiro",
    email: "fernando.ribeiro@email.com",
    telefone: "(51) 9 3456-7890",
    cpf: "321.654.987-12",
    endereco: "Av. Ipiranga, 654 - Porto Alegre, RS",
    cep: "90160-093",
    dataNascimento: "1980-09-10",
    status: "Inativo",
    totalServicos: 12,
    ultimoServico: "2023-11-30",
    observacoes: "Cliente antigo, mudou-se de cidade",
    dataCadastro: new Date("2022-01-15"),
  },
  {
    id: 6,
    nome: "Lucas Martins",
    email: "lucas.martins@email.com",
    telefone: "(61) 9 7654-3210",
    cpf: "654.321.789-01",
    endereco: "SQN 308, Bloco A - Brasília, DF",
    cep: "70747-010",
    dataNascimento: "1988-11-25",
    status: "Ativo",
    totalServicos: 6,
    ultimoServico: "2024-01-19",
    observacoes: "",
    dataCadastro: new Date("2023-07-12"),
  },
  {
    id: 7,
    nome: "Bruno Costa",
    email: "bruno.costa@email.com",
    telefone: "(71) 9 4567-8901",
    cpf: "147.258.369-74",
    endereco: "Rua da Praia, 987 - Salvador, BA",
    cep: "40070-110",
    dataNascimento: "1995-02-14",
    status: "Ativo",
    totalServicos: 1,
    ultimoServico: "2024-01-10",
    observacoes: "Cliente novo",
    dataCadastro: new Date("2024-01-05"),
  },
  {
    id: 8,
    nome: "Patrícia Gomes",
    email: "patricia.gomes@email.com",
    telefone: "(85) 9 6543-2109",
    cpf: "963.852.741-85",
    endereco: "Av. Beira Mar, 159 - Fortaleza, CE",
    cep: "60165-121",
    dataNascimento: "1987-08-07",
    status: "Ativo",
    totalServicos: 4,
    ultimoServico: "2024-01-21",
    observacoes: "",
    dataCadastro: new Date("2023-09-18"),
  },
  {
    id: 9,
    nome: "Roberto Santos",
    email: "roberto.santos@email.com",
    telefone: "(11) 9 8888-7777",
    cpf: "852.741.963-96",
    endereco: "Rua Augusta, 753 - São Paulo, SP",
    cep: "01305-100",
    dataNascimento: "1983-04-30",
    status: "Ativo",
    totalServicos: 7,
    ultimoServico: "2024-01-17",
    observacoes: "Indicou outros clientes",
    dataCadastro: new Date("2023-05-22"),
  },
  {
    id: 10,
    nome: "Juliana Costa",
    email: "juliana.costa@email.com",
    telefone: "(21) 9 5555-4444",
    cpf: "741.852.963-74",
    endereco: "Rua das Laranjeiras, 246 - Rio de Janeiro, RJ",
    cep: "22240-070",
    dataNascimento: "1991-06-12",
    status: "Ativo",
    totalServicos: 3,
    ultimoServico: "2024-01-16",
    observacoes: "",
    dataCadastro: new Date("2023-10-08"),
  },
]

const ITEMS_PER_PAGE = 6

export default function ClientsScreen() {
  const [selectedClient, setSelectedClient] = React.useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [filterStatus, setFilterStatus] = React.useState("todos")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [editForm, setEditForm] = React.useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    cep: "",
    dataNascimento: "",
    status: "Ativo",
    observacoes: "",
  })

  // Função de ordenação e filtros
  const filteredAndSortedClients = React.useMemo(() => {
    let filtered = clients

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((client) => client.status.toLowerCase() === filterStatus.toLowerCase())
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.telefone.includes(searchTerm) ||
          client.cpf.includes(searchTerm),
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.dataCadastro.getTime() - a.dataCadastro.getTime()
        case "oldest":
          return a.dataCadastro.getTime() - b.dataCadastro.getTime()
        case "name":
          return a.nome.localeCompare(b.nome)
        case "services":
          return b.totalServicos - a.totalServicos
        case "lastService":
          return new Date(b.ultimoServico).getTime() - new Date(a.ultimoServico).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [sortBy, filterStatus, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedClients.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentClients = filteredAndSortedClients.slice(startIndex, endIndex)

  const handleView = (client: any) => {
    setSelectedClient(client)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setEditForm({
      nome: client.nome,
      email: client.email,
      telefone: client.telefone,
      cpf: client.cpf,
      endereco: client.endereco,
      cep: client.cep,
      dataNascimento: client.dataNascimento,
      status: client.status,
      observacoes: client.observacoes,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (clientId: number) => {
    console.log("Excluindo cliente:", clientId)
  }

  const handleSaveEdit = () => {
    console.log("Salvando edição:", editForm)
    setIsEditDialogOpen(false)
  }

  const handleCreateClient = () => {
    console.log("Criando novo cliente")
    setIsCreateDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    return status === "Ativo" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const renderActionButtons = (client: any) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{client.nome}"? Esta ação não pode ser desfeita e removerá todo
              o histórico do cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(client.id)} className="bg-red-600 hover:bg-red-700">
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Clientes</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar novo cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>Preencha os dados para cadastrar um novo cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-nome">Nome Completo</Label>
                      <Input id="new-nome" placeholder="Nome completo do cliente" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-cpf">CPF</Label>
                      <Input id="new-cpf" placeholder="000.000.000-00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-email">E-mail</Label>
                      <Input id="new-email" type="email" placeholder="cliente@email.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-telefone">Telefone</Label>
                      <Input id="new-telefone" placeholder="(00) 0 0000-0000" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-endereco">Endereço Completo</Label>
                    <Input id="new-endereco" placeholder="Rua, número, bairro, cidade, estado" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-cep">CEP</Label>
                      <Input id="new-cep" placeholder="00000-000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-nascimento">Data de Nascimento</Label>
                      <Input id="new-nascimento" type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-observacoes">Observações</Label>
                    <Textarea id="new-observacoes" placeholder="Observações sobre o cliente (opcional)" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateClient}>Cadastrar Cliente</Button>
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
              <TableRow className="bg-blue-50">
                <TableHead className="text-blue-700 font-medium">Cliente</TableHead>
                <TableHead className="text-blue-700 font-medium">Contato</TableHead>
                <TableHead className="text-blue-700 font-medium">CPF</TableHead>
                <TableHead className="text-blue-700 font-medium">Serviços</TableHead>
                <TableHead className="text-blue-700 font-medium">Status</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-sm text-gray-500">
                          Cadastro: {formatDate(client.dataCadastro.toISOString())}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {client.telefone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{client.cpf}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium text-blue-600">{client.totalServicos}</p>
                      <p className="text-xs text-gray-500">Último: {formatDate(client.ultimoServico)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>{renderActionButtons(client)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentClients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.nome}</p>
                    <p className="text-sm text-gray-500">{client.cpf}</p>
                  </div>
                </div>
                {renderActionButtons(client)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{client.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{client.endereco}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Serviços</p>
                  <p className="font-medium text-blue-600">{client.totalServicos}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(client.status)}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Último serviço</p>
                  <p className="text-xs">{formatDate(client.ultimoServico)}</p>
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
          Página {currentPage} de {totalPages} ({filteredAndSortedClients.length} clientes encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Visualizar Cliente</DialogTitle>
              <DialogDescription>Informações completas do cliente selecionado.</DialogDescription>
            </DialogHeader>
            {selectedClient && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedClient.nome}</h3>
                    <p className="text-sm text-gray-500">
                      Cliente desde {formatDate(selectedClient.dataCadastro.toISOString())}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CPF</Label>
                    <p className="text-sm font-mono">{selectedClient.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Nascimento</Label>
                    <p className="text-sm">{formatDate(selectedClient.dataNascimento)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                    <p className="text-sm">{selectedClient.telefone}</p>
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CEP</Label>
                    <p className="text-sm font-mono">{selectedClient.cep}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total de Serviços</Label>
                    <p className="text-sm font-medium text-blue-600">{selectedClient.totalServicos}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Último Serviço</Label>
                  <p className="text-sm">{formatDate(selectedClient.ultimoServico)}</p>
                </div>

                {selectedClient.observacoes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observações</Label>
                    <p className="text-sm">{selectedClient.observacoes}</p>
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={editForm.cpf}
                    onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">E-mail</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input
                    id="edit-telefone"
                    value={editForm.telefone}
                    onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                  />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cep">CEP</Label>
                  <Input
                    id="edit-cep"
                    value={editForm.cep}
                    onChange={(e) => setEditForm({ ...editForm, cep: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-nascimento">Data de Nascimento</Label>
                  <Input
                    id="edit-nascimento"
                    type="date"
                    value={editForm.dataNascimento}
                    onChange={(e) => setEditForm({ ...editForm, dataNascimento: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
