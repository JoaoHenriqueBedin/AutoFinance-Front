/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Car, User, RotateCcw } from "lucide-react"
import { Veiculo, VeiculoInput, getVeiculosList, createVeiculo, updateVeiculo } from "@/servicos/vehicles-service"
import { getClientes } from "@/servicos/clients-service"
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

const ITEMS_PER_PAGE = 6

export default function VehiclesScreen() {
  const [selectedVehicle, setSelectedVehicle] = React.useState<Veiculo | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [vehiclesList, setVehiclesList] = React.useState<Veiculo[]>([])
  const [clientsList, setClientsList] = React.useState<Array<{ cpfCnpj: string; nome: string }>>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
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
    combustivel: "Gasolina",
    quilometragem: "",
    chassi: "",
    renavam: "",
    cpfCnpjCliente: "",
    status: "ATIVO",
    observacoes: "",
  })
  const [createForm, setCreateForm] = React.useState({
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    combustivel: "Gasolina",
    quilometragem: "",
    chassi: "",
    renavam: "",
    cpfCnpjCliente: "",
    status: "ATIVO",
    observacoes: "",
  })

  // Carregar dados da API
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Carregar veículos e clientes em paralelo
        const [vehiclesData, clientsData] = await Promise.all([
          getVeiculosList(),
          getClientes()
        ])
        
        setVehiclesList(vehiclesData)
        setClientsList(clientsData.map(client => ({
          cpfCnpj: client.cpfCnpj,
          nome: client.nome
        })))
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar dados")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Função de ordenação e filtros
  const filteredAndSortedVehicles = React.useMemo(() => {
    let filtered = vehiclesList

    // Filtro por status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((vehicle) => vehicle.status === filterStatus)
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
          vehicle.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.chassi.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.cliente.dataCadastro).getTime() - new Date(a.cliente.dataCadastro).getTime()
        case "oldest":
          return new Date(a.cliente.dataCadastro).getTime() - new Date(b.cliente.dataCadastro).getTime()
        case "plate":
          return a.placa.localeCompare(b.placa)
        case "brand":
          return a.marca.localeCompare(b.marca)
        case "year":
          return b.ano - a.ano
        case "client":
          return a.cliente.nome.localeCompare(b.cliente.nome)
        case "services":
          return 0 // Sem dados de serviços na API atual
        default:
          return 0
      }
    })

    return sorted
  }, [vehiclesList, sortBy, filterStatus, filterBrand, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedVehicles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentVehicles = filteredAndSortedVehicles.slice(startIndex, endIndex)

  const handleView = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vehicle: Veiculo) => {
    setSelectedVehicle(vehicle)
    setEditForm({
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      cor: vehicle.cor,
      combustivel: vehicle.combustivel,
      quilometragem: vehicle.quilometragem,
      chassi: vehicle.chassi,
      renavam: vehicle.renavam,
      cpfCnpjCliente: vehicle.cliente.cpfCnpj,
      status: vehicle.status,
      observacoes: vehicle.observacoes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (vehiclePlaca: string) => {
    try {
      // Encontrar o veículo na lista para obter seus dados
      const vehicle = vehiclesList.find(v => v.placa === vehiclePlaca)
      if (!vehicle) {
        throw new Error("Veículo não encontrado")
      }

      // Criar objeto com dados atuais mas status INATIVO
      const vehicleInput: VeiculoInput = {
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: vehicle.ano,
        cor: vehicle.cor,
        combustivel: vehicle.combustivel,
        quilometragem: vehicle.quilometragem,
        chassi: vehicle.chassi,
        renavam: vehicle.renavam,
        status: "INATIVO", // Inativar ao invés de excluir
        observacoes: vehicle.observacoes || "",
        cliente: {
          cpfCnpj: vehicle.cliente.cpfCnpj,
        },
      }

      // Atualizar o veículo para inativo
      await updateVeiculo(vehiclePlaca, vehicleInput)
      
      // Recarregar lista após inativar
      const vehiclesData = await getVeiculosList()
      setVehiclesList(vehiclesData)
      
      // Toast de sucesso
      toast.success(`Veículo ${vehicle.marca} ${vehicle.modelo} (${vehiclePlaca}) foi inativado com sucesso!`)
    } catch (err) {
      console.error("Erro ao inativar veículo:", err)
      setError(err instanceof Error ? err.message : "Erro ao inativar veículo")
      toast.error(err instanceof Error ? err.message : "Erro ao inativar veículo")
    }
  }

  const handleSaveEdit = async () => {
    try {
      if (!selectedVehicle) return
      
      const vehicleInput: VeiculoInput = {
        placa: editForm.placa,
        marca: editForm.marca,
        modelo: editForm.modelo,
        ano: parseInt(editForm.ano) || 0,
        cor: editForm.cor,
        combustivel: editForm.combustivel,
        quilometragem: editForm.quilometragem,
        chassi: editForm.chassi,
        renavam: editForm.renavam,
        status: editForm.status,
        observacoes: editForm.observacoes || "",
        cliente: {
          cpfCnpj: editForm.cpfCnpjCliente,
        },
      }
      
      console.log("Dados do formulário de edição:", editForm)
      console.log("Payload que será enviado:", vehicleInput)
      
      await updateVeiculo(selectedVehicle.placa, vehicleInput)
      
      // Recarregar lista após editar
      const vehiclesData = await getVeiculosList()
      setVehiclesList(vehiclesData)
      setIsEditDialogOpen(false)
      
      // Toast de sucesso
      toast.success(`Veículo ${vehicleInput.marca} ${vehicleInput.modelo} foi atualizado com sucesso!`)
    } catch (err) {
      console.error("Erro ao editar veículo:", err)
      setError(err instanceof Error ? err.message : "Erro ao editar veículo")
      toast.error(err instanceof Error ? err.message : "Erro ao editar veículo")
    }
  }

  const handleCreateVehicle = async () => {
    try {
      const vehicleInput: VeiculoInput = {
        placa: createForm.placa,
        marca: createForm.marca,
        modelo: createForm.modelo,
        ano: parseInt(createForm.ano) || 0,
        cor: createForm.cor,
        combustivel: createForm.combustivel,
        quilometragem: createForm.quilometragem,
        chassi: createForm.chassi,
        renavam: createForm.renavam,
        status: createForm.status,
        observacoes: createForm.observacoes || "",
        cliente: {
          cpfCnpj: createForm.cpfCnpjCliente,
        },
      }
      
      await createVeiculo(vehicleInput)
      
      // Recarregar lista após criar
      const vehiclesData = await getVeiculosList()
      setVehiclesList(vehiclesData)
      setIsCreateDialogOpen(false)
      
      // Toast de sucesso
      toast.success(`Veículo ${vehicleInput.marca} ${vehicleInput.modelo} foi cadastrado com sucesso!`)
      
      // Limpar formulário
      setCreateForm({
        placa: "",
        marca: "",
        modelo: "",
        ano: "",
        cor: "",
        combustivel: "Gasolina",
        quilometragem: "",
        chassi: "",
        renavam: "",
        cpfCnpjCliente: "",
        status: "ATIVO",
        observacoes: "",
      })
    } catch (err) {
      console.error("Erro ao criar veículo:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar veículo")
      toast.error(err instanceof Error ? err.message : "Erro ao criar veículo")
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "ATIVO" ? (
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



  const formatKm = (km: string | number) => {
    const kmNumber = typeof km === 'string' ? parseInt(km.replace(/\D/g, '')) : km
    return kmNumber.toLocaleString("pt-BR") + " km"
  }

  const handleReactivate = async (vehiclePlaca: string) => {
    try {
      // Encontrar o veículo na lista para obter seus dados
      const vehicle = vehiclesList.find(v => v.placa === vehiclePlaca)
      if (!vehicle) {
        throw new Error("Veículo não encontrado")
      }

      // Criar objeto com dados atuais mas status ATIVO
      const vehicleInput: VeiculoInput = {
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: vehicle.ano,
        cor: vehicle.cor,
        combustivel: vehicle.combustivel,
        quilometragem: vehicle.quilometragem,
        chassi: vehicle.chassi,
        renavam: vehicle.renavam,
        status: "ATIVO", // Reativar o veículo
        observacoes: vehicle.observacoes || "",
        cliente: {
          cpfCnpj: vehicle.cliente.cpfCnpj,
        },
      }

      // Atualizar o veículo para ativo
      await updateVeiculo(vehiclePlaca, vehicleInput)
      
      // Recarregar lista após reativar
      const vehiclesData = await getVeiculosList()
      setVehiclesList(vehiclesData)
      
      // Toast de sucesso
      toast.success(`Veículo ${vehicle.marca} ${vehicle.modelo} (${vehiclePlaca}) foi reativado com sucesso!`)
    } catch (err) {
      console.error("Erro ao reativar veículo:", err)
      setError(err instanceof Error ? err.message : "Erro ao reativar veículo")
      toast.error(err instanceof Error ? err.message : "Erro ao reativar veículo")
    }
  }

  const renderActionButtons = (vehicle: Veiculo) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-purple-100"
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
      
      {vehicle.status === "ATIVO" ? (
        // Botão para inativar veículos ativos
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja inativar o veículo "{vehicle.marca} {vehicle.modelo}" (Placa: {vehicle.placa})? 
                O veículo será marcado como inativo mas seus dados serão preservados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(vehicle.placa)} className="bg-orange-600 hover:bg-orange-700">
                Inativar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        // Botão para reativar veículos inativos
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Reativação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja reativar o veículo "{vehicle.marca} {vehicle.modelo}" (Placa: {vehicle.placa})? 
                O veículo voltará a ficar ativo no sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleReactivate(vehicle.placa)} className="bg-green-600 hover:bg-green-700">
                Reativar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A6ACF] mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando veículos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#5A6ACF] hover:bg-[#5A6ACF]">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Veículos</h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5A6ACF] hover:bg-[#5A6ACF] text-white w-full sm:w-auto">
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
                    <Select value={createForm.cpfCnpjCliente} onValueChange={(value) => setCreateForm({ ...createForm, cpfCnpjCliente: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientsList.map((client) => (
                          <SelectItem key={client.cpfCnpj} value={client.cpfCnpj}>
                            {client.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-placa">Placa</Label>
                      <Input 
                        id="new-placa" 
                        placeholder="ABC-1234" 
                        value={createForm.placa}
                        onChange={(e) => setCreateForm({ ...createForm, placa: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-renavam">RENAVAM</Label>
                      <Input 
                        id="new-renavam" 
                        placeholder="12345678901" 
                        value={createForm.renavam}
                        onChange={(e) => setCreateForm({ ...createForm, renavam: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-chassi">Chassi</Label>
                    <Input 
                      id="new-chassi" 
                      placeholder="9BD15906040123456" 
                      value={createForm.chassi}
                      onChange={(e) => setCreateForm({ ...createForm, chassi: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-marca">Marca</Label>
                      <Select value={createForm.marca} onValueChange={(value) => setCreateForm({ ...createForm, marca: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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
                      <Label htmlFor="new-modelo">Modelo</Label>
                      <Input 
                        id="new-modelo" 
                        placeholder="Ex: Civic" 
                        value={createForm.modelo}
                        onChange={(e) => setCreateForm({ ...createForm, modelo: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-ano">Ano</Label>
                      <Input 
                        id="new-ano" 
                        type="number" 
                        placeholder="2020" 
                        min="1900" 
                        max="2030" 
                        value={createForm.ano}
                        onChange={(e) => setCreateForm({ ...createForm, ano: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-cor">Cor</Label>
                      <Input 
                        id="new-cor" 
                        placeholder="Ex: Branco" 
                        value={createForm.cor}
                        onChange={(e) => setCreateForm({ ...createForm, cor: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-combustivel">Combustível</Label>
                      <Select value={createForm.combustivel} onValueChange={(value) => setCreateForm({ ...createForm, combustivel: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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
                      <Label htmlFor="new-quilometragem">Quilometragem</Label>
                      <Input 
                        id="new-quilometragem" 
                        placeholder="50000" 
                        value={createForm.quilometragem}
                        onChange={(e) => setCreateForm({ ...createForm, quilometragem: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-observacoes">Observações</Label>
                    <Textarea 
                      id="new-observacoes" 
                      placeholder="Observações sobre o veículo (opcional)" 
                      value={createForm.observacoes}
                      onChange={(e) => setCreateForm({ ...createForm, observacoes: e.target.value })}
                    />
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
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
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
              <TableRow className="bg-purple-100">
                <TableHead className="text-[#707FDD] font-medium">Veículo</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Proprietário</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Placa</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Ano/KM</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Serviços</TableHead>
                <TableHead className="text-[#707FDD] font-medium">Status</TableHead>
                <TableHead className="text-[#707FDD] font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.map((vehicle) => (
                <TableRow key={vehicle.placa} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Car className="w-4 h-4 text-[#707FDD]" />
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
                      <span className="text-sm">{vehicle.cliente.nome}</span>
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
                      <p className="font-medium text-[#707FDD]">-</p>
                      <p className="text-xs text-gray-500">Sem dados</p>
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
            <div key={vehicle.placa} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#707FDD]" />
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
                <span>{vehicle.cliente.nome}</span>
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
                  <p className="text-sm text-gray-500">Combustível</p>
                  <p className="font-medium">{vehicle.combustivel}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(vehicle.status)}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">RENAVAM</p>
                  <p className="text-xs font-mono">{vehicle.renavam}</p>
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
          Página {currentPage} de {totalPages} ({filteredAndSortedVehicles.length} veículos encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visualizar Veículo</DialogTitle>
              <DialogDescription>Informações completas do veículo selecionado.</DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="space-y-4 py-2">
                {/* Header Section */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-[#707FDD]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {selectedVehicle.marca} {selectedVehicle.modelo}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">{selectedVehicle.placa}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getBrandColor(selectedVehicle.marca)}>{selectedVehicle.marca}</Badge>
                      {getStatusBadge(selectedVehicle.status)}
                    </div>
                  </div>
                </div>

                {/* Proprietário Section */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Proprietário</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Nome</Label>
                      <p className="text-sm font-medium">{selectedVehicle.cliente.nome}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">CPF/CNPJ</Label>
                      <p className="text-sm font-mono">{selectedVehicle.cliente.cpfCnpj}</p>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Veículo Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Detalhes do Veículo</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Ano</Label>
                      <p className="text-sm font-medium">{selectedVehicle.ano}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Cor</Label>
                      <p className="text-sm">{selectedVehicle.cor}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Combustível</Label>
                      <p className="text-sm">{selectedVehicle.combustivel}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Quilometragem</Label>
                      <p className="text-sm font-medium">{formatKm(selectedVehicle.quilometragem)}</p>
                    </div>
                  </div>
                </div>

                {/* Documentação Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Documentação</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Placa</Label>
                      <p className="text-sm font-mono">{selectedVehicle.placa}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">RENAVAM</Label>
                      <p className="text-sm font-mono">{selectedVehicle.renavam}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs font-medium text-gray-500">Chassi</Label>
                      <p className="text-sm font-mono break-all">{selectedVehicle.chassi}</p>
                    </div>
                  </div>
                </div>

                {/* Observações Section */}
                {selectedVehicle.observacoes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Observações</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedVehicle.observacoes}</p>
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Veículo</DialogTitle>
              <DialogDescription>Faça as alterações necessárias nos dados do veículo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cliente">Cliente Proprietário</Label>
                <Select
                  value={editForm.cpfCnpjCliente}
                  onValueChange={(value) => setEditForm({ ...editForm, cpfCnpjCliente: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsList.map((client) => (
                      <SelectItem key={client.cpfCnpj} value={client.cpfCnpj}>
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
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
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
