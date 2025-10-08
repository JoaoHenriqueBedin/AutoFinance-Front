/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  getOrcamentos, 
  createOrcamento, 
  updateOrcamento, 
  deleteOrcamento,
  Orcamento,
  OrcamentoInput 
} from "@/servicos/budgets-service";
import { getClientes, Cliente } from "@/servicos/clients-service";
import { getVeiculosByCliente, Veiculo } from "@/servicos/vehicles-service";
import { getServicosList, Servico } from "@/servicos/services-service";

const ITEMS_PER_PAGE = 6;

export default function BudgetScreen() {
  // Hook de autenticação para monitorar sessão
  const { authenticated, timeRemaining } = useAuth();
  
  // Estados para controle dos orçamentos
  const [budgets, setBudgets] = React.useState<Orcamento[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Estados para controle dos diálogos
  const [selectedBudget, setSelectedBudget] = React.useState<Orcamento | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  
  // Estados para filtros e paginação
  const [sortBy, setSortBy] = React.useState("latest");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Estados para dados auxiliares
  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [vehicles, setVehicles] = React.useState<Veiculo[]>([]);
  const [services, setServices] = React.useState<Servico[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const [loadingVehicles, setLoadingVehicles] = React.useState(false);
  const [loadingServices, setLoadingServices] = React.useState(false);

  // Estados para formulários
  const [createForm, setCreateForm] = React.useState({
    clienteCpfCnpj: "",
    veiculoPlaca: "",
    servicoId: "",
    valorAjustado: "",
    status: "ATIVO",
  });
  
  const [editForm, setEditForm] = React.useState({
    cpfCnpj: "",
    placa: "",
    nomeServico: "",
    valorAjustado: "",
    status: "ATIVO",
  });

  // Carregar dados iniciais ao montar o componente
  React.useEffect(() => {
    loadBudgets();
    loadClients();
    loadServices();
  }, []);

  // Carregar veículos quando cliente for selecionado
  React.useEffect(() => {
    if (createForm.clienteCpfCnpj) {
      loadVehiclesByClient(createForm.clienteCpfCnpj);
    } else {
      setVehicles([]);
      setCreateForm(prev => ({ ...prev, veiculoPlaca: "" }));
    }
  }, [createForm.clienteCpfCnpj]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrcamentos();
      
      // Debug: log do que está sendo retornado
      console.log("Dados retornados da API:", data);
      console.log("Tipo dos dados:", typeof data);
      console.log("É array?", Array.isArray(data));
      
      // Garantir que data é um array
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Erro ao carregar orçamentos:", err);
      console.error("Detalhes do erro:", err.response?.data);
      setError(err.message || "Erro ao carregar orçamentos");
      setBudgets([]); // Definir array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const data = await getClientes();
      setClients(Array.isArray(data) ? data.filter(c => c.ativo !== false) : []);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadVehiclesByClient = async (cpfCnpj: string) => {
    try {
      setLoadingVehicles(true);
      console.log("Carregando veículos para cliente:", cpfCnpj);
      const data = await getVeiculosByCliente(cpfCnpj);
      console.log("Veículos carregados:", data);
      setVehicles(Array.isArray(data) ? data.filter(v => v.status === 'ATIVO') : []);
    } catch (err: any) {
      console.error("Erro ao carregar veículos:", err);
      setVehicles([]);
      // Não mostrar alert para não interromper o fluxo, apenas log
    } finally {
      setLoadingVehicles(false);
    }
  };

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const response = await getServicosList(0, 100);
      setServices(response.content.filter(s => s.status === 'ATIVO') || []);
    } catch (err: any) {
      console.error("Erro ao carregar serviços:", err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // Função para formatar valor em R$
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleView = (budget: Orcamento) => {
    setSelectedBudget(budget);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (budget: Orcamento) => {
    setSelectedBudget(budget);
    setEditForm({
      cpfCnpj: budget.cpfCnpj,
      placa: budget.veiculoPlaca,
      nomeServico: budget.servicoNome,
      valorAjustado: budget.valorAjustado.toString(),
      status: budget.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (numeroOrcamento: number) => {
    try {
      await deleteOrcamento(numeroOrcamento);
      await loadBudgets(); // Recarregar a lista
      toast.success("Orçamento excluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao excluir orçamento:", err);
      toast.error(err.message || "Erro ao excluir orçamento");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedBudget) return;
    
    try {
      const orcamentoData: OrcamentoInput = {
        cliente: { cpfCnpj: editForm.cpfCnpj },
        veiculo: { placa: editForm.placa },
        servico: { nome: editForm.nomeServico },
        valorAjustado: parseFloat(editForm.valorAjustado),
        status: editForm.status,
      };

      await updateOrcamento(selectedBudget.numeroOrcamento, orcamentoData);
      await loadBudgets(); // Recarregar a lista
      setIsEditDialogOpen(false);
      toast.success("Orçamento atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar orçamento:", err);
      toast.error(err.message || "Erro ao atualizar orçamento");
    }
  };

  const handleCreateBudget = async () => {
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
      if (!createForm.valorAjustado || parseFloat(createForm.valorAjustado) <= 0) {
        toast.error("Informe um valor válido");
        return;
      }

      const selectedService = services.find(s => s.id.toString() === createForm.servicoId);
      
      const orcamentoData: OrcamentoInput = {
        cliente: { cpfCnpj: createForm.clienteCpfCnpj },
        veiculo: { placa: createForm.veiculoPlaca },
        servico: { nome: selectedService?.nome || "" },
        valorAjustado: parseFloat(createForm.valorAjustado),
        status: createForm.status,
      };

      await createOrcamento(orcamentoData);
      await loadBudgets(); // Recarregar a lista
      setIsCreateDialogOpen(false);
      // Limpar o formulário
      setCreateForm({
        clienteCpfCnpj: "",
        veiculoPlaca: "",
        servicoId: "",
        valorAjustado: "",
        status: "ATIVO",
      });
      toast.success("Orçamento criado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar orçamento:", err);
      toast.error(err.message || "Erro ao criar orçamento");
    }
  };

  // Filtros e ordenação com paginação
  const filteredAndSortedBudgets = React.useMemo(() => {
    let filtered = [...budgets];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (budget) =>
          budget.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.veiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.servicoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.numeroOrcamento.toString().includes(searchTerm)
      );
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.numeroOrcamento - a.numeroOrcamento; // Mais recentes
        case "oldest":
          return a.numeroOrcamento - b.numeroOrcamento; // Mais antigos
        case "client":
          return a.cpfCnpj.localeCompare(b.cpfCnpj); // Cliente A-Z
        case "value":
          return b.valorAjustado - a.valorAjustado; // Maior valor
        default:
          return 0;
      }
    });

    return sorted;
  }, [budgets, searchTerm, sortBy]);

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedBudgets.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBudgets = filteredAndSortedBudgets.slice(startIndex, endIndex);

  // Função para renderizar os botões de ação (evita repetição de código)
  const renderActionButtons = (budget: any) => (
    <div className="flex gap-1">
      {/* View Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-purple-100"
        onClick={() => handleView(budget)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {/* Edit Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(budget)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {/* Delete Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento #{budget.numeroOrcamento} do cliente {budget.cpfCnpj}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(budget.numeroOrcamento)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    // AJUSTE 1: Padding responsivo para melhor visualização em telas pequenas.
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Orçamentos
            </h1>
            {authenticated && timeRemaining > 0 && timeRemaining <= 10 && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Sessão expira em {timeRemaining}min
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {/* AJUSTE 2: Empilhar botões em telas pequenas (flex-col) e manter lado a lado em telas maiores (sm:flex-row) */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) {
                  // Limpar formulário ao fechar
                  setCreateForm({
                    clienteCpfCnpj: "",
                    veiculoPlaca: "",
                    servicoId: "",
                    valorAjustado: "",
                    status: "ATIVO",
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#5A6ACF] hover:bg-[#5A6ACF] text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar novo orçamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Orçamento</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo orçamento.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-cliente">Cliente</Label>
                    <Select
                      value={createForm.clienteCpfCnpj}
                      onValueChange={(value) =>
                        setCreateForm({ ...createForm, clienteCpfCnpj: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
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
                              : loadingVehicles 
                                ? "Carregando veículos..." 
                                : vehicles.length === 0 
                                  ? "Cliente não possui veículos cadastrados" 
                                  : "Selecione um veículo"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
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
                        const selectedService = services.find(s => s.id.toString() === value);
                        if (selectedService && !createForm.valorAjustado) {
                          setCreateForm(prev => ({ ...prev, valorAjustado: selectedService.preco.toString() }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingServices ? "Carregando serviços..." : "Selecione um serviço"} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.nome} - {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(service.preco)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {createForm.servicoId && (() => {
                      const selectedService = services.find(s => s.id.toString() === createForm.servicoId);
                      return selectedService ? (
                        <div className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                          <p><strong>Descrição:</strong> {selectedService.descricao}</p>
                          <p><strong>Duração:</strong> {selectedService.duracao}</p>
                          <p><strong>Preço padrão:</strong> {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(selectedService.preco)}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-valor">Valor Ajustado</Label>
                    <Input 
                      id="new-valor" 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={createForm.valorAjustado}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, valorAjustado: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-status">Status</Label>
                    <Select
                      value={createForm.status}
                      onValueChange={(value) =>
                        setCreateForm({ ...createForm, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATIVO">ATIVO</SelectItem>
                        <SelectItem value="INATIVO">INATIVO</SelectItem>
                        <SelectItem value="CONCLUIDO">CONCLUÍDO</SelectItem>
                        <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setCreateForm({
                        clienteCpfCnpj: "",
                        veiculoPlaca: "",
                        servicoId: "",
                        valorAjustado: "",
                        status: "ATIVO",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateBudget}>Criar Orçamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por CPF/CNPJ, placa, serviço ou número do orçamento..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset para primeira página ao buscar
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table Header */}
          {/* AJUSTE 3: Empilhar a ordenação em telas pequenas */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <span className="text-sm text-gray-600">
              Listagem de orçamentos:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Últimas adicionadas</SelectItem>
                  <SelectItem value="oldest">Mais antigas</SelectItem>
                  <SelectItem value="client">Cliente A-Z</SelectItem>
                  <SelectItem value="value">Maior valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* AJUSTE 4: ESTRUTURA RESPONSIVA PARA A LISTA */}

        {/* Loading e Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <p>Carregando orçamentos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Button 
              onClick={loadBudgets} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* 🖥️ Tabela para Telas Grandes (md+) */}
        {!loading && !error && (
          <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nº Orçamento</TableHead>
                  <TableHead className="w-[180px]">Cliente (CPF/CNPJ)</TableHead>
                  <TableHead className="w-[150px]">Veículo (Placa)</TableHead>
                  <TableHead className="w-[200px]">Serviço</TableHead>
                  <TableHead className="w-[120px]">Valor</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(currentBudgets) && currentBudgets.length > 0 ? (
                  currentBudgets.map((budget) => (
                    <TableRow key={budget.numeroOrcamento}>
                      <TableCell className="font-medium text-blue-600">
                        #{budget.numeroOrcamento}
                      </TableCell>
                      <TableCell className="font-medium">
                        {budget.cpfCnpj}
                      </TableCell>
                      <TableCell>{budget.veiculoPlaca}</TableCell>
                      <TableCell>{budget.servicoNome}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(budget.valorAjustado)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          budget.status === 'ATIVO' 
                            ? 'bg-green-100 text-green-800' 
                            : budget.status === 'GERADO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {budget.status}
                        </span>
                      </TableCell>
                      <TableCell>{renderActionButtons(budget)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? `Nenhum orçamento encontrado para "${searchTerm}"` : "Nenhum orçamento encontrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* 📱 Lista de Cards para Telas Pequenas (até md) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {Array.isArray(currentBudgets) && currentBudgets.length > 0 ? (
              currentBudgets.map((budget) => (
                <div
                  key={budget.numeroOrcamento}
                  className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">Orçamento #{budget.numeroOrcamento}</p>
                      <p className="text-sm text-gray-500 mt-1">Cliente (CPF/CNPJ)</p>
                      <p className="font-medium text-gray-900">{budget.cpfCnpj}</p>
                    </div>
                    {renderActionButtons(budget)}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Veículo (Placa)</p>
                    <p className="text-gray-800">{budget.veiculoPlaca}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Serviço</p>
                    <p className="text-gray-800">{budget.servicoNome}</p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="font-medium text-green-600">{formatCurrency(budget.valorAjustado)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        budget.status === 'ATIVO' 
                          ? 'bg-green-100 text-green-800' 
                          : budget.status === 'GERADO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {budget.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">
                  {searchTerm ? `Nenhum orçamento encontrado para "${searchTerm}"` : "Nenhum orçamento encontrado"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || filteredAndSortedBudgets.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {filteredAndSortedBudgets.length > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            disabled={currentPage === totalPages || filteredAndSortedBudgets.length === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-2">
          Página {currentPage} de {totalPages} ({filteredAndSortedBudgets.length} orçamentos encontrados)
        </div>

        {/* View Dialog (sem alterações) */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Orçamento</DialogTitle>
              <DialogDescription>
                Detalhes do orçamento selecionado.
              </DialogDescription>
            </DialogHeader>
            {selectedBudget && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Número do Orçamento
                    </Label>
                    <p className="text-sm font-medium">{selectedBudget.numeroOrcamento}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Cliente (CPF/CNPJ)
                    </Label>
                    <p className="text-sm">{selectedBudget.cpfCnpj}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Veículo (Placa)
                    </Label>
                    <p className="text-sm">{selectedBudget.veiculoPlaca}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Mecânico
                    </Label>
                    <p className="text-sm">{selectedBudget.mecanicoUsername}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Serviço
                  </Label>
                  <p className="text-sm">{selectedBudget.servicoNome}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Valor
                    </Label>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(selectedBudget.valorAjustado)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Status
                    </Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedBudget.status === 'ATIVO' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedBudget.status === 'GERADO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBudget.status}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Data de Criação
                  </Label>
                  <p className="text-sm">{new Date(selectedBudget.dataCriacao).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog (sem alterações) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Orçamento</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias no orçamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cpfCnpj">CPF/CNPJ do Cliente</Label>
                <Input
                  id="edit-cpfCnpj"
                  value={editForm.cpfCnpj}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cpfCnpj: e.target.value })
                  }
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-placa">Placa do Veículo</Label>
                <Input
                  id="edit-placa"
                  value={editForm.placa}
                  onChange={(e) =>
                    setEditForm({ ...editForm, placa: e.target.value })
                  }
                  placeholder="ABC1234"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-servico">Nome do Serviço</Label>
                <Textarea
                  id="edit-servico"
                  value={editForm.nomeServico}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nomeServico: e.target.value })
                  }
                  placeholder="Descrição do serviço"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-valor">Valor Ajustado</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  step="0.01"
                  value={editForm.valorAjustado}
                  onChange={(e) =>
                    setEditForm({ ...editForm, valorAjustado: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">ATIVO</SelectItem>
                    <SelectItem value="INATIVO">INATIVO</SelectItem>
                    <SelectItem value="CONCLUIDO">CONCLUÍDO</SelectItem>
                    <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
