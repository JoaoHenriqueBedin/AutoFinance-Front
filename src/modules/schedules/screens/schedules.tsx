/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, User } from "lucide-react"

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

// Dados de exemplo dos agendamentos
const appointments = [
  {
    id: 1,
    cliente: "João Silva",
    automovel: "Fiat Uno 2012",
    telefone: "(11) 9 1234-5678",
    hora: "08:00",
    mecanico: "Gustavo",
    data: "2024-01-22",
    servico: "Troca de óleo",
    observacoes: "Cliente preferencial",
  },
  {
    id: 2,
    cliente: "Maria Oliveira",
    automovel: "Volkswagen Gol 2015",
    telefone: "(21) 9 8765-4321",
    hora: "08:00",
    mecanico: "Isabely",
    data: "2024-01-22",
    servico: "Alinhamento e balanceamento",
    observacoes: "",
  },
  {
    id: 3,
    cliente: "Carlos Souza",
    automovel: "Chevrolet Onix 2019",
    telefone: "(31) 9 2345-6789",
    hora: "08:00",
    mecanico: "João",
    data: "2024-01-22",
    servico: "Revisão dos freios",
    observacoes: "Urgente",
  },
  {
    id: 4,
    cliente: "Ana Paula Lima",
    automovel: "Honda Civic 2020",
    telefone: "(41) 9 9876-5432",
    hora: "09:00",
    mecanico: "Gustavo",
    data: "2024-01-22",
    servico: "Troca do filtro de ar",
    observacoes: "",
  },
  {
    id: 5,
    cliente: "Fernando Ribeiro",
    automovel: "Toyota Corolla 2018",
    telefone: "(51) 9 3456-7890",
    hora: "09:00",
    mecanico: "Isabely",
    data: "2024-01-22",
    servico: "Revisão dos amortecedores",
    observacoes: "Cliente novo",
  },
  {
    id: 6,
    cliente: "Lucas Martins",
    automovel: "Ford Ka 2016",
    telefone: "(61) 9 7654-3210",
    hora: "09:00",
    mecanico: "João",
    data: "2024-01-22",
    servico: "Substituição da correia dentada",
    observacoes: "",
  },
  {
    id: 7,
    cliente: "Bruno Costa",
    automovel: "Renault Sandero 2017",
    telefone: "(71) 9 4567-8901",
    hora: "10:00",
    mecanico: "Gustavo",
    data: "2024-01-22",
    servico: "Troca da bateria",
    observacoes: "Garantia",
  },
  {
    id: 8,
    cliente: "Patrícia Gomes",
    automovel: "Hyundai HB20 2021",
    telefone: "(85) 9 6543-2109",
    hora: "10:00",
    mecanico: "Isabely",
    data: "2024-01-22",
    servico: "Higienização do ar-condicionado",
    observacoes: "",
  },
  {
    id: 9,
    cliente: "Roberto Santos",
    automovel: "Nissan March 2015",
    telefone: "(11) 9 8888-7777",
    hora: "10:30",
    mecanico: "João",
    data: "2024-01-22",
    servico: "Troca de pastilhas de freio",
    observacoes: "Retorno",
  },
  {
    id: 10,
    cliente: "Juliana Costa",
    automovel: "Peugeot 208 2019",
    telefone: "(21) 9 5555-4444",
    hora: "11:00",
    mecanico: "Gustavo",
    data: "2024-01-22",
    servico: "Revisão geral",
    observacoes: "Agendamento especial",
  },
]

const ITEMS_PER_PAGE = 8

export default function SchedulingScreen() {
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedMechanic, setSelectedMechanic] = React.useState("todos")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [editForm, setEditForm] = React.useState({
    cliente: "",
    automovel: "",
    telefone: "",
    hora: "",
    mecanico: "",
    data: "",
    servico: "",
    observacoes: "",
  })

  // Filtros e busca
  const filteredAppointments = React.useMemo(() => {
    let filtered = appointments

    // Filtro por mecânico
    if (selectedMechanic !== "todos") {
      filtered = filtered.filter((appointment) => appointment.mecanico.toLowerCase() === selectedMechanic.toLowerCase())
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.automovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.telefone.includes(searchTerm) ||
          appointment.servico.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [selectedMechanic, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex)

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setEditForm({
      cliente: appointment.cliente,
      automovel: appointment.automovel,
      telefone: appointment.telefone,
      hora: appointment.hora,
      mecanico: appointment.mecanico,
      data: appointment.data,
      servico: appointment.servico,
      observacoes: appointment.observacoes,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (appointmentId: number) => {
    console.log("Excluindo agendamento:", appointmentId)
  }

  const handleSaveEdit = () => {
    console.log("Salvando edição:", editForm)
    setIsEditDialogOpen(false)
  }

  const handleCreateAppointment = () => {
    console.log("Criando novo agendamento")
    setIsCreateDialogOpen(false)
  }

  const renderActionButtons = (appointment: any) => (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
        onClick={() => handleView(appointment)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(appointment)}
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
              Tem certeza que deseja excluir o agendamento de {appointment.cliente}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(appointment.id)} className="bg-red-600 hover:bg-red-700">
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Agendamentos</h1>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Mechanic Filter */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-blue-600">Agendamentos por mecânico:</Label>
              <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                <SelectTrigger className="w-full lg:w-64">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="gustavo">Gustavo</SelectItem>
                  <SelectItem value="isabely">Isabely</SelectItem>
                  <SelectItem value="joão">João</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* New Appointment Button */}
            <div className="flex items-end">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#5A6ACF]  hover:bg-[#5A6ACF]  text-white px-8 py-2 h-10">NOVO AGENDAMENTO</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                    <DialogDescription>Preencha os dados para criar um novo agendamento.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-cliente">Cliente</Label>
                        <Input id="new-cliente" placeholder="Nome do cliente" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-telefone">Telefone</Label>
                        <Input id="new-telefone" placeholder="(00) 0 0000-0000" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-automovel">Automóvel</Label>
                      <Input id="new-automovel" placeholder="Modelo e ano do automóvel" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-data">Data</Label>
                        <Input id="new-data" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-hora">Hora</Label>
                        <Input id="new-hora" type="time" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-mecanico">Mecânico</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gustavo">Gustavo</SelectItem>
                            <SelectItem value="isabely">Isabely</SelectItem>
                            <SelectItem value="joao">João</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-servico">Serviço</Label>
                      <Input id="new-servico" placeholder="Descrição do serviço" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-observacoes">Observações</Label>
                      <Textarea id="new-observacoes" placeholder="Observações adicionais (opcional)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateAppointment}>Criar Agendamento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="flex items-end flex-1">
              <div className="relative w-full lg:max-w-sm ml-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Today's Appointments Label */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-blue-600">Agendamentos do dia:</h2>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="text-blue-700 font-medium">Cliente</TableHead>
                <TableHead className="text-blue-700 font-medium">Automóvel</TableHead>
                <TableHead className="text-blue-700 font-medium">Telefone</TableHead>
                <TableHead className="text-blue-700 font-medium">Hora</TableHead>
                <TableHead className="text-blue-700 font-medium">Mecânico</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{appointment.cliente}</TableCell>
                  <TableCell>{appointment.automovel}</TableCell>
                  <TableCell>{appointment.telefone}</TableCell>
                  <TableCell className="font-medium">{appointment.hora}</TableCell>
                  <TableCell>{appointment.mecanico}</TableCell>
                  <TableCell>{renderActionButtons(appointment)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-900">{appointment.cliente}</p>
                </div>
                {renderActionButtons(appointment)}
              </div>

              <div>
                <p className="text-sm text-gray-500">Automóvel</p>
                <p className="text-gray-800">{appointment.automovel}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-gray-800">{appointment.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium text-gray-900">{appointment.hora}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mecânico</p>
                <p className="text-gray-800">{appointment.mecanico}</p>
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
          Página {currentPage} de {totalPages} ({filteredAppointments.length} agendamentos encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Agendamento</DialogTitle>
              <DialogDescription>Detalhes do agendamento selecionado.</DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                    <p className="text-sm">{selectedAppointment.cliente}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                    <p className="text-sm">{selectedAppointment.telefone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Automóvel</Label>
                  <p className="text-sm">{selectedAppointment.automovel}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data</Label>
                    <p className="text-sm">{selectedAppointment.data}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Hora</Label>
                    <p className="text-sm font-medium">{selectedAppointment.hora}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mecânico</Label>
                    <p className="text-sm">{selectedAppointment.mecanico}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Serviço</Label>
                  <p className="text-sm">{selectedAppointment.servico}</p>
                </div>
                {selectedAppointment.observacoes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observações</Label>
                    <p className="text-sm">{selectedAppointment.observacoes}</p>
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
              <DialogTitle>Editar Agendamento</DialogTitle>
              <DialogDescription>Faça as alterações necessárias no agendamento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cliente">Cliente</Label>
                  <Input
                    id="edit-cliente"
                    value={editForm.cliente}
                    onChange={(e) => setEditForm({ ...editForm, cliente: e.target.value })}
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
                <Label htmlFor="edit-automovel">Automóvel</Label>
                <Input
                  id="edit-automovel"
                  value={editForm.automovel}
                  onChange={(e) => setEditForm({ ...editForm, automovel: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-data">Data</Label>
                  <Input
                    id="edit-data"
                    type="date"
                    value={editForm.data}
                    onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-hora">Hora</Label>
                  <Input
                    id="edit-hora"
                    type="time"
                    value={editForm.hora}
                    onChange={(e) => setEditForm({ ...editForm, hora: e.target.value })}
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-servico">Serviço</Label>
                <Input
                  id="edit-servico"
                  value={editForm.servico}
                  onChange={(e) => setEditForm({ ...editForm, servico: e.target.value })}
                />
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
