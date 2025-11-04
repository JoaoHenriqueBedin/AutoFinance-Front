/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, User } from "lucide-react"
import { 
  getAgendamentos, 
  createAgendamento, 
  updateAgendamento, 
  deleteAgendamento,
  type Agendamento,
  type AgendamentoInput,
  type AgendamentoForm
} from "@/servicos/schedules-service"
import { getMecanicos, type Usuario } from "@/servicos/users-service"
import { Loading } from "@/components/ui/loading"
import { ErrorDisplay } from "@/components/ui/error-display"

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

const ITEMS_PER_PAGE = 5

export default function SchedulingScreen() {
  // Estados para dados da API
  const [appointments, setAppointments] = React.useState<Agendamento[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [mecanicos, setMecanicos] = React.useState<Usuario[]>([])
  const [loadingMecanicos, setLoadingMecanicos] = React.useState(false)

  // Função auxiliar para obter mecânico padrão
  const getDefaultMechanic = () => mecanicos.length > 0 ? mecanicos[0].username : ""
  
  // Estados existentes
  const [selectedAppointment, setSelectedAppointment] = React.useState<Agendamento | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedMechanic, setSelectedMechanic] = React.useState("todos")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [editForm, setEditForm] = React.useState<AgendamentoForm>({
    dataAgendada: "",
    observacoes: "",
    mecanicoUsername: "",
  })
  const [createForm, setCreateForm] = React.useState<AgendamentoForm>({
    id: 0,
    dataAgendada: "",
    observacoes: "",
    mecanicoUsername: "",
  })

  // Carregar agendamentos da API
  const loadAgendamentos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAgendamentos()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar agendamentos")
    } finally {
      setLoading(false)
    }
  }

  // Carregar mecânicos da API
  const loadMecanicos = async () => {
    try {
      setLoadingMecanicos(true)
      const data = await getMecanicos()
      setMecanicos(data)
    } catch (err) {
      console.error("Erro ao carregar mecânicos:", err)
      // Não exibir erro para mecânicos, apenas usar lista vazia
      setMecanicos([])
    } finally {
      setLoadingMecanicos(false)
    }
  }

  // Carregar dados na inicialização
  React.useEffect(() => {
    loadAgendamentos()
    loadMecanicos()
  }, [])

  // Atualizar mecânico padrão quando mecânicos são carregados
  React.useEffect(() => {
    if (mecanicos.length > 0 && !createForm.mecanicoUsername) {
      setCreateForm(prev => ({
        ...prev,
        mecanicoUsername: mecanicos[0].username
      }))
    }
  }, [mecanicos, createForm.mecanicoUsername])

  // Filtros e busca
  const filteredAppointments = React.useMemo(() => {
    let filtered = appointments

    // Filtro por mecânico
    if (selectedMechanic !== "todos") {
      filtered = filtered.filter((appointment) => 
        appointment.mecanico?.toLowerCase() === selectedMechanic.toLowerCase() ||
        (appointment as any).mecanicoUsername?.toLowerCase() === selectedMechanic.toLowerCase()
      )
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.automovel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.telefone?.includes(searchTerm) ||
          appointment.servico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.observacoes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [appointments, selectedMechanic, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex)

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (appointment: Agendamento) => {
    console.log("=== handleEdit CHAMADO ===");
    console.log("appointment recebido:", appointment);
    
    setSelectedAppointment(appointment)
    
    // Tentar obter o mecânico do agendamento, senão usar padrão
    const mecanicoFromAppointment = appointment.mecanicoUsername || appointment.mecanico || getDefaultMechanic();
    console.log("Mecânico detectado:", mecanicoFromAppointment);
    
    setEditForm({
      dataAgendada: appointment.dataAgendada,
      observacoes: appointment.observacoes || "",
      mecanicoUsername: mecanicoFromAppointment,
    })
    
    console.log("editForm configurado:", {
      dataAgendada: appointment.dataAgendada,
      observacoes: appointment.observacoes || "",
      mecanicoUsername: mecanicoFromAppointment,
    });
    
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (appointmentId: number) => {
    try {
      await deleteAgendamento(appointmentId)
      await loadAgendamentos() // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir agendamento")
    }
  }

  const handleSaveEdit = async () => {
    console.log("=== INÍCIO handleSaveEdit ===");
    console.log("selectedAppointment:", selectedAppointment);
    console.log("editForm:", editForm);
    
    setIsUpdating(true);
    setError(null);
    
    try {
      // Usar numeroOrdem se id não estiver disponível
      const appointmentId = selectedAppointment?.id || selectedAppointment?.numeroOrdem
      
      if (!appointmentId) {
        console.log("ERRO: ID do agendamento não encontrado (tentou id e numeroOrdem)");
        setError("ID do agendamento não encontrado");
        return
      }
      
      // Validar campos obrigatórios
      if (!editForm.dataAgendada) {
        setError("Data e hora são obrigatórios");
        return;
      }
      
      if (!editForm.mecanicoUsername) {
        setError("Mecânico é obrigatório");
        return;
      }
      
      console.log("Preparando dados para atualização...");
      const agendamentoData: AgendamentoInput = {
        dataAgendada: editForm.dataAgendada,
        observacoes: editForm.observacoes,
        mecanicoUsername: editForm.mecanicoUsername,
      }
      
      console.log("Dados a serem enviados:", agendamentoData);
      console.log("ID do agendamento:", appointmentId);
      
      await updateAgendamento(appointmentId, agendamentoData)
      console.log("Agendamento atualizado com sucesso!");
      
      setIsEditDialogOpen(false)
      await loadAgendamentos() // Recarregar lista
      console.log("=== FIM handleSaveEdit - SUCESSO ===");
    } catch (err) {
      console.error("=== ERRO handleSaveEdit ===", err);
      setError(err instanceof Error ? err.message : "Erro ao salvar agendamento")
    } finally {
      setIsUpdating(false);
    }
  }

  const handleCreateAppointment = async () => {
    console.log("=== CLIQUE NO BOTÃO DETECTADO ===");
    console.log("createForm atual:", createForm);
    
    try {
      setError(null); // Limpar erro anterior
      
      // Validação básica
      if (!createForm.dataAgendada) {
        console.log("Erro: Data não preenchida");
        setError("Data e hora são obrigatórios.");
        return;
      }
      
      const agendamentoData: AgendamentoInput = {
        dataAgendada: createForm.dataAgendada,
        observacoes: createForm.observacoes || "",
        mecanicoUsername: createForm.mecanicoUsername,
      }
      
      console.log("=== CHAMANDO SERVIÇO ===");
      
      const resultado = await createAgendamento(agendamentoData);
      
      console.log("=== SUCESSO - RESULTADO ===", resultado);
      
      setIsCreateDialogOpen(false);
      await loadAgendamentos();
      
      // Limpar formulário
      setCreateForm({
        dataAgendada: "",
        observacoes: "",
        mecanicoUsername: getDefaultMechanic(),
      });
      
    } catch (err) {
      console.error("=== ERRO CAPTURADO ===", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  }

  const renderActionButtons = (appointment: Agendamento) => (
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
            <AlertDialogAction onClick={() => handleDelete(appointment.id!)} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Agendamentos</h1>
          <Loading />
        </div>
      </div>
    )
  }

  // Mostrar erro apenas se for erro de carregamento inicial, não de operações
  if (error && loading === false && appointments.length === 0) {
    return (
      <div className="flex-1 p-4 sm:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Agendamentos</h1>
          <ErrorDisplay message={error} onRetry={loadAgendamentos} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Agendamentos</h1>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-red-600 text-sm">{error}</div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Mechanic Filter */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-blue-600">Agendamentos por mecânico:</Label>
              <Select value={selectedMechanic} onValueChange={setSelectedMechanic} disabled={loadingMecanicos}>
                <SelectTrigger className="w-full lg:w-64">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {mecanicos.map((mecanico) => (
                    <SelectItem key={mecanico.username} value={mecanico.username}>
                      {mecanico.username}
                    </SelectItem>
                  ))}
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
                        <Label htmlFor="new-data">Data e Hora</Label>
                        <Input 
                          id="new-data" 
                          type="datetime-local"
                          min={new Date().toISOString().slice(0, 16)}
                          value={createForm.dataAgendada}
                          onChange={(e) => setCreateForm({ ...createForm, dataAgendada: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-mecanico">Mecânico</Label>
                        <Select
                          value={createForm.mecanicoUsername}
                          onValueChange={(value: string) => 
                            setCreateForm({ ...createForm, mecanicoUsername: value })
                          }
                          disabled={loadingMecanicos}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mecanicos.length > 0 ? (
                              mecanicos.map((mecanico) => (
                                <SelectItem key={mecanico.username} value={mecanico.username}>
                                  {mecanico.username}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                {loadingMecanicos ? "Carregando..." : "Nenhum mecânico encontrado"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-observacoes">Observações</Label>
                      <Textarea 
                        id="new-observacoes" 
                        placeholder="Observações adicionais (opcional)"
                        value={createForm.observacoes}
                        onChange={(e) => setCreateForm({ ...createForm, observacoes: e.target.value })}
                      />
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

          {/* Appointments Label */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-blue-600">Agendamentos:</h2>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="text-blue-700 font-medium">Data/Hora</TableHead>
                <TableHead className="text-blue-700 font-medium">Status</TableHead>
                <TableHead className="text-blue-700 font-medium">Observações</TableHead>
                <TableHead className="text-blue-700 font-medium w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {filteredAppointments.length === 0 && appointments.length > 0
                      ? "Nenhum agendamento encontrado com os filtros aplicados"
                      : "Nenhum agendamento cadastrado"}
                  </TableCell>
                </TableRow>
              ) : (
                currentAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {new Date(appointment.dataAgendada).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>{appointment.observacoes || "-"}</TableCell>
                    <TableCell>{renderActionButtons(appointment)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500">
                {filteredAppointments.length === 0 && appointments.length > 0
                  ? "Nenhum agendamento encontrado com os filtros aplicados"
                  : "Nenhum agendamento cadastrado"}
              </p>
            </div>
          ) : (
            currentAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Data/Hora</p>
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.dataAgendada).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  {renderActionButtons(appointment)}
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                {appointment.observacoes && (
                  <div>
                    <p className="text-sm text-gray-500">Observações</p>
                    <p className="text-gray-800">{appointment.observacoes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {(() => {
            const pages = []
            const maxVisiblePages = 7 // Número máximo de páginas visíveis
            
            if (totalPages <= maxVisiblePages) {
              // Se há poucas páginas, mostra todas
              for (let i = 1; i <= totalPages; i++) {
                pages.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className={currentPage === i ? "bg-[#5A6ACF] text-white" : ""}
                  >
                    {i}
                  </Button>
                )
              }
            } else {
              // Lógica para muitas páginas com "..."
              
              // Primeira página
              pages.push(
                <Button
                  key={1}
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  className={currentPage === 1 ? "bg-[#5A6ACF] text-white" : ""}
                >
                  1
                </Button>
              )

              // "..." inicial se necessário
              if (currentPage > 4) {
                pages.push(
                  <span key="start-ellipsis" className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }

              // Páginas ao redor da atual
              const start = Math.max(2, currentPage - 1)
              const end = Math.min(totalPages - 1, currentPage + 1)
              
              for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className={currentPage === i ? "bg-[#5A6ACF] text-white" : ""}
                    >
                      {i}
                    </Button>
                  )
                }
              }

              // "..." final se necessário
              if (currentPage < totalPages - 3) {
                pages.push(
                  <span key="end-ellipsis" className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }

              // Última página
              if (totalPages > 1) {
                pages.push(
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className={currentPage === totalPages ? "bg-[#5A6ACF] text-white" : ""}
                  >
                    {totalPages}
                  </Button>
                )
              }
            }
            
            return pages
          })()}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        )}

        {filteredAppointments.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Página {currentPage} de {totalPages} • {filteredAppointments.length} agendamento{filteredAppointments.length !== 1 ? 's' : ''} encontrado{filteredAppointments.length !== 1 ? 's' : ''}
        </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Agendamento</DialogTitle>
              <DialogDescription>Detalhes do agendamento selecionado.</DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Data/Hora</Label>
                  <p className="text-sm">{new Date(selectedAppointment.dataAgendada).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAppointment.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-800' :
                    selectedAppointment.status === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                    selectedAppointment.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
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
                  <Label htmlFor="edit-data">Data e Hora</Label>
                  <Input
                    id="edit-data"
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={editForm.dataAgendada}
                    onChange={(e) => setEditForm({ ...editForm, dataAgendada: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-mecanico">Mecânico</Label>
                  <Select
                    value={editForm.mecanicoUsername}
                    onValueChange={(value: string) => 
                      setEditForm({ ...editForm, mecanicoUsername: value })
                    }
                    disabled={loadingMecanicos}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mecanicos.length > 0 ? (
                        mecanicos.map((mecanico) => (
                          <SelectItem key={mecanico.username} value={mecanico.username}>
                            {mecanico.username}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          {loadingMecanicos ? "Carregando..." : "Nenhum mecânico encontrado"}
                        </SelectItem>
                      )}
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
              <Button onClick={handleSaveEdit} disabled={isUpdating}>
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
