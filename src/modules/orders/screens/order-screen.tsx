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
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { ErrorDisplay } from "@/components/ui/error-display"

// Importar serviços
import {
  getOrdensServico,
  createOrdemServicoFromOrcamento,
  createOrdemServico,
  updateOrdemServico,
  inactivateOrdemServico,
  OrdemServico,
  OrdemServicoInput,
  OrdemServicoUpdateInput,
} from "@/servicos/orders-service"
import { getClientes, Cliente } from "@/servicos/clients-service"
import { getVeiculos, Veiculo } from "@/servicos/vehicles-service"
import { getUsuarios, Usuario } from "@/servicos/users-service"
import { getAllServicos, Servico } from "@/servicos/services-service"


export default function ServiceOrdersScreen() {
  // Estados para dados da API
  const [orders, setOrders] = React.useState<OrdemServico[]>([])
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [allVeiculos, setAllVeiculos] = React.useState<Veiculo[]>([]) // Lista completa para visualização
  const [veiculos, setVeiculos] = React.useState<Veiculo[]>([]) // Lista filtrada para o formulário
  const [mecanicos, setMecanicos] = React.useState<Usuario[]>([])
  const [services, setServices] = React.useState<Servico[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Estados para carregamento individual (removido loadingVehicles pois não é mais async)
  
  // Estados para controle dos diálogos
  const [selectedOrder, setSelectedOrder] = React.useState<OrdemServico | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = React.useState(false)
  const [orcamentoIdInput, setOrcamentoIdInput] = React.useState("")
  const [sortBy, setSortBy] = React.useState("latest")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(5)
  const [searchTerm, setSearchTerm] = React.useState("")
  
  // Estado para formulário de criação
  const [createForm, setCreateForm] = React.useState({
    clienteCpfCnpj: "",
    veiculoPlaca: "",
    servicoId: "",
    mecanicoUsername: "",
    valor: "",
    status: "ATIVA",
  })
  
  // Estado para formulário de edição
  const [editForm, setEditForm] = React.useState({
    clienteCpfCnpj: "",
    veiculoPlaca: "",
    servicoId: "",
    mecanicoUsername: "",
    valor: "",
    status: "",
  })

  // Carregar dados ao montar o componente
  React.useEffect(() => {
    loadAllData()
  }, [])

  // Função para carregar veículos de um cliente específico
  const loadVehiclesByClient = React.useCallback((clienteCpfCnpj: string) => {
    if (!clienteCpfCnpj) {
      setVeiculos([])
      return
    }
    
    // Filtrar veículos do cliente selecionado e ativos
    const clientVehicles = allVeiculos.filter(vehicle => {
      return vehicle.cliente?.cpfCnpj === clienteCpfCnpj && 
             vehicle.status === 'ATIVO'
    })
    
    setVeiculos(clientVehicles)
  }, [allVeiculos])

  // Efeito para carregar veículos quando cliente mudar no formulário de criação
  React.useEffect(() => {
    if (createForm.clienteCpfCnpj) {
      loadVehiclesByClient(createForm.clienteCpfCnpj)
    } else {
      setVeiculos([])
    }
  }, [createForm.clienteCpfCnpj, allVeiculos, loadVehiclesByClient])

  // Efeito para carregar veículos quando cliente mudar no formulário de edição
  React.useEffect(() => {
    if (editForm.clienteCpfCnpj) {
      loadVehiclesByClient(editForm.clienteCpfCnpj)
    }
  }, [editForm.clienteCpfCnpj, allVeiculos, loadVehiclesByClient])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar todos os dados em paralelo
      const [ordersData, clientesData, veiculosData, usuariosData, servicesData] = await Promise.all([
        getOrdensServico(),
        getClientes(),
        getVeiculos(),
        getUsuarios(),
        getAllServicos(),
      ])
      
      setOrders(ordersData)
      setClientes(clientesData)
      
      // Carregar lista completa de veículos para visualização
      const allVehiclesList = Array.isArray(veiculosData) ? veiculosData : veiculosData.content
      setAllVeiculos(allVehiclesList)
      setVeiculos([]) // Inicializar lista filtrada vazia
      
      // Filtrar apenas usuários com role MECANICO
      const mecanicosList = usuariosData.content ? usuariosData.content.filter(user => user.role === 'MECANICO' && user.status === 'ATIVO') : []
      setMecanicos(mecanicosList)
      
      // Garantir que servicesData seja sempre um array
      setServices(Array.isArray(servicesData) ? servicesData : [])
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
    const veiculo = allVeiculos.find(v => v.placa === placa)
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}` : placa
  }

  // Obter valor da ordem (API retorna "valor", mas pode ter "valorAjustado" em alguns casos)
  const getValorOrdem = (order: OrdemServico): number => {
    return order.valor || order.valorAjustado || 0
  }

  // Função de filtragem e ordenação
  const sortedOrders = React.useMemo(() => {
    // Primeiro filtra por termo de busca
    let filtered = [...orders];
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => 
        getClienteNome(order.clienteCpfCnpj || '').toLowerCase().includes(search) ||
        getVeiculoInfo(order.veiculoPlaca).toLowerCase().includes(search) ||
        order.servicoNome?.toLowerCase().includes(search) ||
        order.mecanicoUsername?.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search) ||
        order.numeroOrdem?.toString().includes(search) ||
        order.numero?.toString().includes(search)
      );
    }
    
    // Depois ordena
    const sorted = filtered.sort((a, b) => {
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
  }, [orders, sortBy, searchTerm, clientes]) // eslint-disable-line react-hooks/exhaustive-deps

  // Paginação
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = sortedOrders.slice(startIndex, endIndex)

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (order: OrdemServico) => {
    setSelectedOrder(order)
    
    // Buscar o ID do serviço pelo nome
    const selectedService = (services || []).find(s => s.nome === order.servicoNome)
    
    setEditForm({
      clienteCpfCnpj: order.clienteCpfCnpj || '',
      veiculoPlaca: order.veiculoPlaca,
      servicoId: selectedService ? selectedService.id.toString() : '',
      mecanicoUsername: order.mecanicoUsername || '',
      valor: getValorOrdem(order).toString(),
      status: order.status,
    })
    
    // Carregar veículos do cliente selecionado para o formulário de edição
    if (order.clienteCpfCnpj) {
      loadVehiclesByClient(order.clienteCpfCnpj)
    }
    
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (ordem: OrdemServico) => {
    try {
      // Usar o ID da ordem (numeroOrdem ou numero)
      const ordemId = ordem.numeroOrdem || ordem.numero;
      if (!ordemId) {
        toast.error("ID da ordem de serviço não encontrado");
        return;
      }

      await inactivateOrdemServico(ordemId)
      await loadAllData()
      toast.success(`Ordem de serviço #${ordemId} foi inativada com sucesso!`)
    } catch (err: any) {
      console.error("Erro ao inativar ordem de serviço:", err)
      toast.error(err.message || "Erro ao inativar ordem de serviço")
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedOrder) return
    
    try {
      // Validações
      if (!editForm.clienteCpfCnpj) {
        toast.error("Selecione um cliente");
        return;
      }
      if (!editForm.veiculoPlaca) {
        toast.error("Selecione um veículo");
        return;
      }
      if (!editForm.servicoId) {
        toast.error("Selecione um serviço");
        return;
      }
      if (!editForm.mecanicoUsername) {
        toast.error("Selecione um mecânico");
        return;
      }
      if (!editForm.valor || parseFloat(editForm.valor) <= 0) {
        toast.error("Informe um valor válido");
        return;
      }

      // Buscar o nome do serviço pelo ID
      const selectedService = (services || []).find(s => s.id.toString() === editForm.servicoId);
      if (!selectedService) {
        toast.error("Serviço selecionado não encontrado");
        return;
      }

      // Montar o payload de atualização
      const ordemServicoUpdate: OrdemServicoUpdateInput = {
        cliente: {
          cpfCnpj: editForm.clienteCpfCnpj
        },
        veiculo: {
          placa: editForm.veiculoPlaca
        },
        servico: {
          nome: selectedService.nome
        },
        mecanico: {
          username: editForm.mecanicoUsername
        },
        valor: parseFloat(editForm.valor),
        status: editForm.status
      };

      console.log("Atualizando ordem de serviço com payload:", ordemServicoUpdate);

      // Usar o ID da ordem (numeroOrdem ou numero)
      const ordemId = selectedOrder.numeroOrdem || selectedOrder.numero;
      if (!ordemId) {
        toast.error("ID da ordem de serviço não encontrado");
        return;
      }

      // Chamar a API para atualizar a ordem de serviço
      await updateOrdemServico(ordemId, ordemServicoUpdate);
      
      // Recarregar os dados
      await loadAllData();
      
      toast.success("Ordem de serviço atualizada com sucesso!");
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error("Erro ao atualizar ordem de serviço:", err);
      toast.error(err.message || "Erro ao atualizar ordem de serviço");
    }
  }

  const handleCreateOrder = async () => {
    try {
      // Validações
      if (!createForm.clienteCpfCnpj) {
        toast.error("Selecione um cliente");
        return;
      }
      if (!createForm.veiculoPlaca) {
        toast.error("Selecione um veículo");
        return;
      }
      if (!createForm.servicoId) {
        toast.error("Selecione um serviço");
        return;
      }
      if (!createForm.mecanicoUsername) {
        toast.error("Selecione um mecânico");
        return;
      }
      if (!createForm.valor || parseFloat(createForm.valor) <= 0) {
        toast.error("Informe um valor válido");
        return;
      }

      // Buscar o nome do serviço pelo ID
      const selectedService = (services || []).find(s => s.id.toString() === createForm.servicoId);
      if (!selectedService) {
        toast.error("Serviço selecionado não encontrado");
        return;
      }

      // Montar o payload conforme o exemplo fornecido
      const ordemServicoInput: OrdemServicoInput = {
        cliente: {
          cpfCnpj: createForm.clienteCpfCnpj
        },
        veiculo: {
          placa: createForm.veiculoPlaca
        },
        servico: {
          nome: selectedService.nome
        },
        mecanico: {
          username: createForm.mecanicoUsername
        },
        valor: parseFloat(createForm.valor),
        status: createForm.status
      };

      console.log("Criando ordem de serviço com payload:", ordemServicoInput);

      // Chamar a API para criar a ordem de serviço
      await createOrdemServico(ordemServicoInput);
      
      // Recarregar os dados
      await loadAllData();
      
      toast.success("Ordem de serviço criada com sucesso!");
      setIsCreateDialogOpen(false);
      
      // Limpar o formulário
      setCreateForm({
        clienteCpfCnpj: "",
        veiculoPlaca: "",
        servicoId: "",
        mecanicoUsername: "",
        valor: "",
        status: "ATIVA",
      });
    } catch (err: any) {
      console.error("Erro ao criar ordem de serviço:", err);
      toast.error(err.message || "Erro ao criar ordem de serviço");
    }
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
      ATIVA: { color: "bg-green-100 text-green-800", text: "Ativa" },
      EM_ANDAMENTO: { color: "bg-blue-100 text-blue-800", text: "Em Andamento" },
      CONCLUIDO: { color: "bg-gray-100 text-gray-800", text: "Concluído" },
      CANCELADO: { color: "bg-red-100 text-red-800", text: "Cancelado" },
      INATIVO: { color: "bg-gray-100 text-gray-600", text: "Inativo" },
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar a ordem de serviço #{order.numeroOrdem || order.numero}? 
              A ordem será marcada como inativa mas seus dados serão preservados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(order)} className="bg-orange-600 hover:bg-orange-700">
              Inativar
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
                    <Select
                      value={createForm.clienteCpfCnpj}
                      onValueChange={(value) => {
                        setCreateForm({ ...createForm, clienteCpfCnpj: value, veiculoPlaca: "" })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Carregando clientes..." : "Selecione um cliente"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(clientes || []).map((client) => (
                          <SelectItem key={client.cpfCnpj} value={client.cpfCnpj}>
                            {client.nome} - {client.cpfCnpj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-veiculo">Veículo</Label>
                    <Select
                      value={createForm.veiculoPlaca}
                      onValueChange={(value) =>
                        setCreateForm({ ...createForm, veiculoPlaca: value })
                      }
                      disabled={!createForm.clienteCpfCnpj}
                    >
                      <SelectTrigger>
                        <SelectValue 
                          placeholder={
                            !createForm.clienteCpfCnpj 
                              ? "Selecione um cliente primeiro" 
                              : loading 
                                ? "Carregando veículos..." 
                                : veiculos.length === 0 
                                  ? "Cliente não possui veículos cadastrados" 
                                  : "Selecione um veículo"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(veiculos || []).map((vehicle) => (
                          <SelectItem key={vehicle.placa} value={vehicle.placa}>
                            {vehicle.marca} {vehicle.modelo} ({vehicle.ano}) - {vehicle.placa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-servico">Serviço</Label>
                    <Select
                      value={createForm.servicoId}
                      onValueChange={(value) => {
                        setCreateForm({ ...createForm, servicoId: value });
                        // Auto-preencher o valor com o preço padrão do serviço
                        const selectedService = (services || []).find(s => s.id.toString() === value);
                        if (selectedService && !createForm.valor) {
                          setCreateForm(prev => ({ ...prev, valor: selectedService.preco.toString() }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Carregando serviços..." : "Selecione um serviço"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(services || []).map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.nome} - {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(service.preco)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-valor">Valor</Label>
                    <Input 
                      id="new-valor" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={createForm.valor}
                      onChange={(e) => setCreateForm({ ...createForm, valor: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-mecanico">Mecânico</Label>
                    <Select
                      value={createForm.mecanicoUsername}
                      onValueChange={(value) =>
                        setCreateForm({ ...createForm, mecanicoUsername: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Carregando mecânicos..." : "Selecione o mecânico"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(mecanicos || []).map((mecanico) => (
                          <SelectItem key={mecanico.username} value={mecanico.username}>
                            {mecanico.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-status">Status</Label>
                    <Select
                      value={createForm.status}
                      onValueChange={(value) => setCreateForm({ ...createForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATIVA">Ativa</SelectItem>
                        <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                        <SelectItem value="INATIVO">Inativo</SelectItem>
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

          {/* Search and Filters */}
          <div className="mb-4 space-y-4">
            {/* Título */}
            <div className="text-sm text-gray-600">Listagem de ordens de serviço:</div>
            
            {/* Busca */}
            <div className="w-full">
              <Input
                placeholder="Buscar por cliente, veículo, serviço, mecânico ou status..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Volta para primeira página ao buscar
                }}
                className="w-full"
              />
            </div>
            
            {/* Filtros - Layout responsivo melhorado */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              {/* Ordenação */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 min-w-0">
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
              
              {/* Paginação */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-600 whitespace-nowrap">Mostrar:</span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-16 sm:w-20 min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600 whitespace-nowrap">por página</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading e Error States */}
        {loading && <Loading message="Carregando ordens de serviço..." />}
        {error && <ErrorDisplay message={error} onRetry={loadAllData} />}

        {/* Empty State */}
        {!loading && !error && sortedOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-lg mb-2">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhuma ordem encontrada" : "Nenhuma ordem de serviço"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Tente ajustar os filtros de busca ou limpar o campo de pesquisa."
                : "Comece criando uma nova ordem de serviço ou a partir de um orçamento aprovado."
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                className="mb-2"
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && sortedOrders.length > 0 && (
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
        {!loading && !error && sortedOrders.length > 0 && (
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
          Página {currentPage} de {totalPages} ({sortedOrders.length} ordens encontradas)
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Ordem de Serviço</DialogTitle>
              <DialogDescription>Faça as alterações necessárias na ordem de serviço.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Select
                  value={editForm.clienteCpfCnpj}
                  onValueChange={(value) => {
                    setEditForm({ ...editForm, clienteCpfCnpj: value, veiculoPlaca: "" })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Carregando clientes..." : "Selecione um cliente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(clientes || []).map((client) => (
                      <SelectItem key={client.cpfCnpj} value={client.cpfCnpj}>
                        {client.nome} - {client.cpfCnpj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-veiculo">Veículo</Label>
                <Select
                  value={editForm.veiculoPlaca}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, veiculoPlaca: value })
                  }
                  disabled={!editForm.clienteCpfCnpj}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !editForm.clienteCpfCnpj 
                          ? "Selecione um cliente primeiro" 
                          : loading 
                            ? "Carregando veículos..." 
                            : veiculos.length === 0 
                              ? "Cliente não possui veículos cadastrados" 
                              : "Selecione um veículo"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(veiculos || []).map((vehicle) => (
                      <SelectItem key={vehicle.placa} value={vehicle.placa}>
                        {vehicle.marca} {vehicle.modelo} ({vehicle.ano}) - {vehicle.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-servico">Serviço</Label>
                <Select
                  value={editForm.servicoId}
                  onValueChange={(value) => {
                    setEditForm({ ...editForm, servicoId: value });
                    // Auto-preencher o valor com o preço padrão do serviço se estiver vazio
                    const selectedService = (services || []).find(s => s.id.toString() === value);
                    if (selectedService && !editForm.valor) {
                      setEditForm(prev => ({ ...prev, valor: selectedService.preco.toString() }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Carregando serviços..." : "Selecione um serviço"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(services || []).map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.nome} - {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.preco)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-valor">Valor</Label>
                <Input 
                  id="edit-valor" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={editForm.valor}
                  onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mecanico">Mecânico</Label>
                <Select
                  value={editForm.mecanicoUsername}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, mecanicoUsername: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Carregando mecânicos..." : "Selecione o mecânico"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(mecanicos || []).map((mecanico) => (
                      <SelectItem key={mecanico.username} value={mecanico.username}>
                        {mecanico.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVA">Ativa</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
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
