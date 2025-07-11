/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Car, User } from "lucide-react"

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

// Lista de clientes para vinculação
const availableClients = [
  { id: 1, nome: "João Silva" },
  { id: 2, nome: "Maria Oliveira" },
  { id: 3, nome: "Carlos Souza" },
  { id: 4, nome: "Ana Paula Lima" },
  { id: 5, nome: "Fernando Ribeiro" },
  { id: 6, nome: "Lucas Martins" },
  { id: 7, nome: "Bruno Costa" },
  { id: 8, nome: "Patrícia Gomes" },
  { id: 9, nome: "Roberto Santos" },
  { id: 10, nome: "Juliana Costa" },
]

// Dados de exemplo dos veículos
const vehicles = [
  {
    id: 1,
    placa: "ABC-1234",
    marca: "Fiat",
    modelo: "Uno",
    ano: 2012,
    cor: "Branco",
    combustivel: "Flex",
    quilometragem: 85000,
    chassi: "9BD15906040123456",
    renavam: "12345678901",
    clienteId: 1,
    clienteNome: "João Silva",
    status: "Ativo",
    ultimaManutencao: "2024-01-20",
    proximaRevisao: "2024-04-20",
    totalServicos: 5,
    observacoes: "Veículo bem conservado",
    dataCadastro: new Date("2023-06-15"),
  },
  {
    id: 2,
    placa: "DEF-5678",
    marca: "Volkswagen",
    modelo: "Gol",
    ano: 2018,
    cor: "Prata",
    combustivel: "Flex",
    quilometragem: 45000,
    chassi: "9BWZZZ377VT123456",
    renavam: "98765432109",
    clienteId: 2,
    clienteNome: "Maria Oliveira",
    status: "Ativo",
    ultimaManutencao: "2024-01-18",
    proximaRevisao: "2024-07-18",
    totalServicos: 3,
    observacoes: "",
    dataCadastro: new Date("2023-08-10"),
  },
  {
    id: 3,
    placa: "GHI-9012",
    marca: "Chevrolet",
    modelo: "Onix",
    ano: 2019,
    cor: "Vermelho",
    combustivel: "Flex",
    quilometragem: 32000,
    chassi: "9BGKS08X0JG123456",
    renavam: "11223344556",
    clienteId: 3,
    clienteNome: "Carlos Souza",
    status: "Ativo",
    ultimaManutencao: "2024-01-22",
    proximaRevisao: "2024-04-22",
    totalServicos: 8,
    observacoes: "Veículo de frota empresarial",
    dataCadastro: new Date("2023-04-20"),
  },
  {
    id: 4,
    placa: "JKL-3456",
    marca: "Honda",
    modelo: "Civic",
    ano: 2020,
    cor: "Preto",
    combustivel: "Flex",
    quilometragem: 28000,
    chassi: "19XFC2F59KE123456",
    renavam: "66778899001",
    clienteId: 4,
    clienteNome: "Ana Paula Lima",
    status: "Ativo",
    ultimaManutencao: "2024-01-15",
    proximaRevisao: "2024-06-15",
    totalServicos: 2,
    observacoes: "",
    dataCadastro: new Date("2023-11-05"),
  },
  {
    id: 5,
    placa: "MNO-7890",
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2018,
    cor: "Branco",
    combustivel: "Flex",
    quilometragem: 67000,
    chassi: "9BR53ZEC4J8123456",
    renavam: "22334455667",
    clienteId: 5,
    clienteNome: "Fernando Ribeiro",
    status: "Inativo",
    ultimaManutencao: "2023-11-30",
    proximaRevisao: "2024-02-28",
    totalServicos: 12,
    observacoes: "Cliente mudou-se de cidade",
    dataCadastro: new Date("2022-01-15"),
  },
  {
    id: 6,
    placa: "PQR-1234",
    marca: "Ford",
    modelo: "Ka",
    ano: 2016,
    cor: "Azul",
    combustivel: "Flex",
    quilometragem: 95000,
    chassi: "9BFZK5BA8G8123456",
    renavam: "33445566778",
    clienteId: 6,
    clienteNome: "Lucas Martins",
    status: "Ativo",
    ultimaManutencao: "2024-01-19",
    proximaRevisao: "2024-05-19",
    totalServicos: 6,
    observacoes: "",
    dataCadastro: new Date("2023-07-12"),
  },
  {
    id: 7,
    placa: "STU-5678",
    marca: "Renault",
    modelo: "Sandero",
    ano: 2017,
    cor: "Cinza",
    combustivel: "Flex",
    quilometragem: 78000,
    chassi: "93Y4SRDA4HJ123456",
    renavam: "44556677889",
    clienteId: 7,
    clienteNome: "Bruno Costa",
    status: "Ativo",
    ultimaManutencao: "2024-01-10",
    proximaRevisao: "2024-04-10",
    totalServicos: 1,
    observacoes: "Primeiro veículo do cliente",
    dataCadastro: new Date("2024-01-05"),
  },
  {
    id: 8,
    placa: "VWX-9012",
    marca: "Hyundai",
    modelo: "HB20",
    ano: 2021,
    cor: "Branco",
    combustivel: "Flex",
    quilometragem: 15000,
    chassi: "KMHB341BAMU123456",
    renavam: "55667788990",
    clienteId: 8,
    clienteNome: "Patrícia Gomes",
    status: "Ativo",
    ultimaManutencao: "2024-01-21",
    proximaRevisao: "2024-07-21",
    totalServicos: 4,
    observacoes: "",
    dataCadastro: new Date("2023-09-18"),
  },
]

const ITEMS_PER_PAGE = 6

export default function VehiclesScreen() {
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [filterStatus, setFilterStatus] = React.useState("todos")
  const [filterBrand, setFilterBrand] = React.useState("todas")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [editForm, setEditForm] = React.useState({
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    combustivel: "Flex",
    quilometragem: "",
    chassi: "",
    renavam: "",
    clienteId: "",
    status: "Ativo",
    observacoes: "",
  })

  // Função de ordenação e filtros
  const filteredAndSortedVehicles = React.useMemo(() => {
    let filtered = vehicles

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((vehicle) => vehicle.status.toLowerCase() === filterStatus.toLowerCase())
    }

    // Filtro por marca
    if (filterBrand !== "todas") {
      filtered = filtered.filter((vehicle) => vehicle.marca.toLowerCase() === filterBrand.toLowerCase())
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.chassi.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.dataCadastro.getTime() - a.dataCadastro.getTime()
        case "oldest":
          return a.dataCadastro.getTime() - b.dataCadastro.getTime()
        case "plate":
          return a.placa.localeCompare(b.placa)
        case "brand":
          return a.marca.localeCompare(b.marca)
        case "year":
          return b.ano - a.ano
        case "client":
          return a.clienteNome.localeCompare(b.clienteNome)
        case "services":
          return b.totalServicos - a.totalServicos
        default:
          return 0
      }
    })

    return sorted
  }, [sortBy, filterStatus, filterBrand, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedVehicles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentVehicles = filteredAndSortedVehicles.slice(startIndex, endIndex)

  const handleView = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setEditForm({
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      cor: vehicle.cor,
      combustivel: vehicle.combustivel,
      quilometragem: vehicle.quilometragem.toString(),
      chassi: vehicle.chassi,
      renavam: vehicle.renavam,
      clienteId: vehicle.clienteId.toString(),
      status: vehicle.status,
      observacoes: vehicle.observacoes,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (vehicleId: number) => {
    console.log("Excluindo veículo:", vehicleId)
  }

  const handleSaveEdit = () => {
    console.log("Salvando edição:", editForm)
    setIsEditDialogOpen(false)
  }

  const handleCreateVehicle = () => {
    console.log("Criando novo veículo")
    setIsCreateDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    return status === "Ativo" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
    )
  }

  const getBrandColor = (marca: string) => {
    const brandColors = {
      Fiat: "bg-red-100 text-red-800",
      Volkswagen: "bg-blue-100 text-blue-800",
      Chevrolet: "bg-yellow-100 text-yellow-800",
      Honda: "bg-gray-100 text-gray-800",
      Toyota: "bg-red-100 text-red-800",
      Ford: "bg-blue-100 text-blue-800",
      Renault: "bg-yellow-100 text-yellow-800",
      Hyundai: "bg-purple-100 text-purple-800",
    }
    return brandColors[marca as keyof typeof brandColors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatKm = (km: number) => {
    return km.toLocaleString("pt-BR") + " km"
  }

  const renderActionButtons = (vehicle: any) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
        onClick={() => handleView(vehicle)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(vehicle)}
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
              Tem certeza que deseja excluir o veículo "{vehicle.marca} {vehicle.modelo}" (Placa: {vehicle.placa})? Esta
              ação não pode ser desfeita e removerá todo o histórico do veículo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(vehicle.id)} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Veículos</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar novo veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
                  <DialogDescription>Preencha os dados para cadastrar um novo veículo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-cliente">Cliente Proprietário</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-placa">Placa</Label>
                      <Input id="new-placa" placeholder="ABC-1234" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-renavam">RENAVAM</Label>
                      <Input id="new-renavam" placeholder="12345678901" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-chassi">Chassi</Label>
                    <Input id="new-chassi" placeholder="9BD15906040123456" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-marca">Marca</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fiat">Fiat</SelectItem>
                          <SelectItem value="volkswagen">Volkswagen</SelectItem>
                          <SelectItem value="chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="honda">Honda</SelectItem>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                          <SelectItem value="renault">Renault</SelectItem>
                          <SelectItem value="hyundai">Hyundai</SelectItem>
                          <SelectItem value="nissan">Nissan</SelectItem>
                          <SelectItem value="peugeot">Peugeot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-modelo">Modelo</Label>
                      <Input id="new-modelo" placeholder="Ex: Civic" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-ano">Ano</Label>
                      <Input id="new-ano" type="number" placeholder="2020" min="1900" max="2030" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-cor">Cor</Label>
                      <Input id="new-cor" placeholder="Ex: Branco" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-combustivel">Combustível</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flex">Flex</SelectItem>
                          <SelectItem value="gasolina">Gasolina</SelectItem>
                          <SelectItem value="etanol">Etanol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="eletrico">Elétrico</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-quilometragem">Quilometragem</Label>
                      <Input id="new-quilometragem" type="number" placeholder="50000" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-observacoes">Observações</Label>
                    <Textarea id="new-observacoes" placeholder="Observações sobre o veículo (opcional)" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateVehicle}>Cadastrar Veículo</Button>
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
                  <SelectTrigger className="w-full sm:w-32">
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
                <span className="text-sm text-gray-600 whitespace-nowrap">Marca:</span>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="fiat">Fiat</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="renault">Renault</SelectItem>
                    <SelectItem value="hyundai">Hyundai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                    <SelectItem value="plate">Placa A-Z</SelectItem>
                    <SelectItem value="brand">Marca A-Z</SelectItem>
                    <SelectItem value="year">Ano (mais novo)</SelectItem>
                    <SelectItem value="client">Cliente A-Z</SelectItem>
                    <SelectItem value="services">Mais serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar veículos..."
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
                <TableHead className="text-blue-700 font-medium">Veículo</TableHead>
                <TableHead className="text-blue-700 font-medium">Proprietário</TableHead>
                <TableHead className="text-blue-700 font-medium">Placa</TableHead>
                <TableHead className="text-blue-700 font-medium">Ano/KM</TableHead>
                <TableHead className="text-blue-700 font-medium">Serviços</TableHead>
                <TableHead className="text-blue-700 font-medium">Status</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {vehicle.marca} {vehicle.modelo}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getBrandColor(vehicle.marca)} hover:${getBrandColor(vehicle.marca)} text-xs`}
                          >
                            {vehicle.marca}
                          </Badge>
                          <span className="text-xs text-gray-500">{vehicle.cor}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{vehicle.clienteNome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-medium">{vehicle.placa}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{vehicle.ano}</p>
                      <p className="text-gray-500">{formatKm(vehicle.quilometragem)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium text-blue-600">{vehicle.totalServicos}</p>
                      <p className="text-xs text-gray-500">Último: {formatDate(vehicle.ultimaManutencao)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>{renderActionButtons(vehicle)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vehicle.marca} {vehicle.modelo}
                    </p>
                    <p className="text-sm text-gray-500 font-mono">{vehicle.placa}</p>
                  </div>
                </div>
                {renderActionButtons(vehicle)}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>{vehicle.clienteNome}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ano/Cor</p>
                  <p className="text-sm font-medium">
                    {vehicle.ano} • {vehicle.cor}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quilometragem</p>
                  <p className="text-sm font-medium">{formatKm(vehicle.quilometragem)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Serviços</p>
                  <p className="font-medium text-blue-600">{vehicle.totalServicos}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Última manutenção</p>
                  <p className="text-xs">{formatDate(vehicle.ultimaManutencao)}</p>
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
          Página {currentPage} de {totalPages} ({filteredAndSortedVehicles.length} veículos encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Visualizar Veículo</DialogTitle>
              <DialogDescription>Informações completas do veículo selecionado.</DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedVehicle.marca} {selectedVehicle.modelo}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">{selectedVehicle.placa}</p>
                    <Badge className={`${getBrandColor(selectedVehicle.marca)} mt-1`}>{selectedVehicle.marca}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Proprietário</Label>
                    <p className="text-sm">{selectedVehicle.clienteNome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Ano</Label>
                    <p className="text-sm font-medium">{selectedVehicle.ano}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cor</Label>
                    <p className="text-sm">{selectedVehicle.cor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Combustível</Label>
                    <p className="text-sm">{selectedVehicle.combustivel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Quilometragem</Label>
                    <p className="text-sm font-medium">{formatKm(selectedVehicle.quilometragem)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total de Serviços</Label>
                    <p className="text-sm font-medium text-blue-600">{selectedVehicle.totalServicos}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Chassi</Label>
                    <p className="text-sm font-mono">{selectedVehicle.chassi}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">RENAVAM</Label>
                    <p className="text-sm font-mono">{selectedVehicle.renavam}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Última Manutenção</Label>
                    <p className="text-sm">{formatDate(selectedVehicle.ultimaManutencao)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Próxima Revisão</Label>
                    <p className="text-sm">{formatDate(selectedVehicle.proximaRevisao)}</p>
                  </div>
                </div>

                {selectedVehicle.observacoes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observações</Label>
                    <p className="text-sm">{selectedVehicle.observacoes}</p>
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
              <DialogTitle>Editar Veículo</DialogTitle>
              <DialogDescription>Faça as alterações necessárias nos dados do veículo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cliente">Cliente Proprietário</Label>
                <Select
                  value={editForm.clienteId}
                  onValueChange={(value) => setEditForm({ ...editForm, clienteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-placa">Placa</Label>
                  <Input
                    id="edit-placa"
                    value={editForm.placa}
                    onChange={(e) => setEditForm({ ...editForm, placa: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-renavam">RENAVAM</Label>
                  <Input
                    id="edit-renavam"
                    value={editForm.renavam}
                    onChange={(e) => setEditForm({ ...editForm, renavam: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-chassi">Chassi</Label>
                <Input
                  id="edit-chassi"
                  value={editForm.chassi}
                  onChange={(e) => setEditForm({ ...editForm, chassi: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-marca">Marca</Label>
                  <Select value={editForm.marca} onValueChange={(value) => setEditForm({ ...editForm, marca: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiat">Fiat</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="Hyundai">Hyundai</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-modelo">Modelo</Label>
                  <Input
                    id="edit-modelo"
                    value={editForm.modelo}
                    onChange={(e) => setEditForm({ ...editForm, modelo: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-ano">Ano</Label>
                  <Input
                    id="edit-ano"
                    type="number"
                    value={editForm.ano}
                    onChange={(e) => setEditForm({ ...editForm, ano: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cor">Cor</Label>
                  <Input
                    id="edit-cor"
                    value={editForm.cor}
                    onChange={(e) => setEditForm({ ...editForm, cor: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-combustivel">Combustível</Label>
                  <Select
                    value={editForm.combustivel}
                    onValueChange={(value) => setEditForm({ ...editForm, combustivel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flex">Flex</SelectItem>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Etanol">Etanol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Elétrico">Elétrico</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quilometragem">Quilometragem</Label>
                  <Input
                    id="edit-quilometragem"
                    type="number"
                    value={editForm.quilometragem}
                    onChange={(e) => setEditForm({ ...editForm, quilometragem: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
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
