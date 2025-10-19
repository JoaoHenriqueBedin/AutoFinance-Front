/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Eye, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, User, Shield, ShieldCheck, RotateCcw, Key } from "lucide-react";
import { toast } from "react-toastify";

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

import { 
  getUsuarios, 
  createUsuario, 
  updateUsuario, 
  Usuario,
  UsuarioInput,
  UsuarioUpdateInput,
  UsuariosResponse
} from "@/servicos/users-service";
import { useAuth } from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 10;

export default function UsersScreen() {
  // Hook de autenticação
  const { authenticated, timeRemaining } = useAuth();
  
  // Estados para controle dos usuários
  const [users, setUsers] = React.useState<Usuario[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Estados para controle dos diálogos
  const [selectedUser, setSelectedUser] = React.useState<Usuario | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = React.useState(false);
  
  // Estados para filtros e paginação
  const [sortBy, setSortBy] = React.useState("latest");
  const [filterRole, setFilterRole] = React.useState("todos");
  const [filterStatus, setFilterStatus] = React.useState("todos");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Estados para formulários
  const [createForm, setCreateForm] = React.useState({
    username: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    role: "USUARIO" as 'ADMIN' | 'MECANICO' | 'USUARIO',
    status: "ATIVO" as 'ATIVO' | 'INATIVO',
    empresaNome: "",
  });
  
  const [editForm, setEditForm] = React.useState({
    username: "",
    email: "",
    telefone: "",
    password: "",
    role: "MECANICO" as 'ADMIN' | 'MECANICO',
    status: "ATIVO" as 'ATIVO' | 'INATIVO',
    empresaNome: "",
  });
  
  const [resetPasswordForm, setResetPasswordForm] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Carregar usuários ao montar o componente
  React.useEffect(() => {
    loadUsers();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UsuariosResponse = await getUsuarios(currentPage - 1, ITEMS_PER_PAGE);
      
      console.log("Dados retornados da API:", response);
      
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (err: any) {
      console.error("Erro ao carregar usuários:", err);
      setError(err.message || "Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtros e ordenação locais
  const filteredAndSortedUsers = React.useMemo(() => {
    let filtered = [...users];

    // Filtro por role
    if (filterRole !== "todos") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filtro por status
    if (filterStatus !== "todos") {
      if (filterStatus === "ativo") {
        filtered = filtered.filter(user => user.ativo === true);
      } else if (filterStatus === "inativo") {
        filtered = filtered.filter(user => user.ativo === false);
      }
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.telefone && user.telefone.includes(searchTerm))
      );
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return (b.id || 0) - (a.id || 0); // Mais recentes
        case "oldest":
          return (a.id || 0) - (b.id || 0); // Mais antigos
        case "name":
          return a.username.localeCompare(b.username); // Username A-Z
        case "username":
          return a.username.localeCompare(b.username); // Username A-Z
        case "role":
          return a.role.localeCompare(b.role); // Role A-Z
        default:
          return 0;
      }
    });

    return sorted;
  }, [users, searchTerm, sortBy, filterRole, filterStatus]);

  const handleView = (user: Usuario) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      telefone: user.telefone || "",
      password: "", // Limpo para nova senha
      role: user.role,
      status: user.status,
      empresaNome: user.empresaNome || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (username: string, nome: string, currentStatus: string) => {
    try {
      // Em vez de excluir, vamos inativar o usuário
      // Verificar se já está inativo
      if (currentStatus === "INATIVO") {
        toast.info(`Usuário ${nome} já está inativo`);
        return;
      }
      
      // Buscar dados atuais do usuário para manter os outros campos
      const usuarios = await getUsuarios(0, 1000);
      const currentUser = usuarios.content.find(u => u.username === username);
      
      if (!currentUser) {
        toast.error("Usuário não encontrado");
        return;
      }
      
      // Atualizar apenas o status para INATIVO, mantendo os outros dados
      const userData: UsuarioUpdateInput = {
        email: currentUser.email,
        telefone: currentUser.telefone,
        password: "temp123", // Senha temporária (será mantida a atual no backend)
        role: currentUser.role,
        status: "INATIVO",
      };
      
      await updateUsuario(username, userData);
      await loadUsers();
      toast.success(`Usuário ${nome} inativado com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao inativar usuário:", err);
      toast.error(err.message || "Erro ao inativar usuário");
    }
  };

  const handleToggleStatus = async (username: string, nome: string) => {
    try {
      // Buscar dados atuais do usuário para manter os outros campos
      const usuarios = await getUsuarios(0, 1000);
      const currentUser = usuarios.content.find(u => u.username === username);
      
      if (!currentUser) {
        toast.error("Usuário não encontrado");
        return;
      }
      
      // Atualizar o status para ATIVO
      const userData: UsuarioUpdateInput = {
        email: currentUser.email,
        telefone: currentUser.telefone,
        password: "temp123", // Senha temporária (será mantida a atual no backend)
        role: currentUser.role,
        status: "ATIVO",
      };
      
      await updateUsuario(username, userData);
      await loadUsers();
      toast.success(`Usuário ${nome} ativado com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao ativar usuário:", err);
      toast.error(err.message || "Erro ao ativar usuário");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    // Validações
    if (!editForm.username.trim()) {
      toast.error("Nome de usuário é obrigatório");
      return;
    }
    if (!editForm.email.trim()) {
      toast.error("E-mail é obrigatório");
      return;
    }
    if (!editForm.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }
    if (!editForm.password.trim()) {
      toast.error("Nova senha é obrigatória");
      return;
    }
    if (editForm.password.length < 5) {
      toast.error("A senha deve ter pelo menos 5 caracteres");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error("E-mail inválido");
      return;
    }
    
    try {
      const userData: UsuarioUpdateInput = {
        email: editForm.email.trim(),
        telefone: editForm.telefone.trim(),
        password: editForm.password,
        role: editForm.role,
        status: editForm.status,
      };

      await updateUsuario(selectedUser.username, userData);
      await loadUsers();
      setIsEditDialogOpen(false);
      toast.success("Usuário atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      toast.error(err.message || "Erro ao atualizar usuário");
    }
  };

  const handleCreateUser = async () => {
    // Validações
    if (!createForm.username.trim()) {
      toast.error("Nome de usuário é obrigatório");
      return;
    }
    if (!createForm.email.trim()) {
      toast.error("E-mail é obrigatório");
      return;
    }
    if (!createForm.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }
    if (!createForm.password.trim()) {
      toast.error("Senha é obrigatória");
      return;
    }
    if (createForm.password !== createForm.confirmPassword) {
      toast.error("Senhas não coincidem");
      return;
    }
    if (createForm.password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      toast.error("E-mail inválido");
      return;
    }
    
    try {
      const userData: UsuarioInput = {
        username: createForm.username.trim(),
        email: createForm.email.trim(),
        telefone: createForm.telefone.trim(),
        password: createForm.password,
        role: createForm.role,
        status: createForm.status,
      };

      await createUsuario(userData);
      await loadUsers();
      setIsCreateDialogOpen(false);
      
      // Limpar formulário
      setCreateForm({
        username: "",
        email: "",
        telefone: "",
        password: "",
        confirmPassword: "",
        role: "USUARIO",
        status: "ATIVO",
        empresaNome: "",
      });
      
      toast.success("Usuário criado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);
      toast.error(err.message || "Erro ao criar usuário");
    }
  };

  const handleResetPassword = (user: Usuario) => {
    setSelectedUser(user);
    setResetPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setIsResetPasswordDialogOpen(true);
  };

  const handleSaveResetPassword = async () => {
    if (!selectedUser) return;
    
    if (!resetPasswordForm.newPassword.trim()) {
      toast.error("Nova senha é obrigatória");
      return;
    }
    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      toast.error("Senhas não coincidem");
      return;
    }
    if (resetPasswordForm.newPassword.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      // Usar updateUsuario para atualizar apenas a senha
      const userData: UsuarioUpdateInput = {
        email: selectedUser.email,
        telefone: selectedUser.telefone || "",
        password: resetPasswordForm.newPassword,
        role: selectedUser.role,
        status: selectedUser.status,
      };
      
      await updateUsuario(selectedUser.username, userData);
      setIsResetPasswordDialogOpen(false);
      toast.success(`Senha do usuário ${selectedUser.nome} redefinida com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao resetar senha:", err);
      toast.error(err.message || "Erro ao resetar senha");
    }
  };

  // Função para obter ícone da role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldCheck className="h-4 w-4 text-red-600" />
      case 'MECANICO':
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  };

  // Função para obter cor da role
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'MECANICO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  // Função para renderizar os botões de ação
  const renderActionButtons = (user: Usuario) => (
    <div className="flex gap-1">
      {/* View Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
        onClick={() => handleView(user)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {/* Edit Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        onClick={() => handleEdit(user)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {/* Reset Password Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50"
        onClick={() => handleResetPassword(user)}
      >
        <Key className="h-4 w-4" />
      </Button>
      
      {/* Toggle Status Button - Only show if user is inactive */}
      {!user.ativo && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50"
          onClick={() => handleToggleStatus(user.username, user.nome || user.username)}
          title="Ativar usuário"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
      
      {/* Delete Button - Only show if user is active */}
      {user.ativo && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
              title="Inativar usuário"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja inativar o usuário <strong>{user.nome}</strong> ({user.username})?
                O usuário não poderá mais acessar o sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(user.username, user.nome || user.username, user.status)}
                className="bg-red-600 hover:bg-red-700"
              >
                Inativar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Gerenciar Usuários
            </h1>
            {authenticated && timeRemaining > 0 && timeRemaining <= 10 && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Sessão expira em {timeRemaining}min
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) {
                  setCreateForm({
                    username: "",
                    email: "",
                    telefone: "",
                    password: "",
                    confirmPassword: "",
                    role: "USUARIO",
                    status: "ATIVO",
                    empresaNome: "",
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#5A6ACF] hover:bg-[#4A5BC7] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar novo usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo usuário no sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-username">Nome de usuário</Label>
                    <Input
                      id="new-username"
                      placeholder="username"
                      value={createForm.username}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-email">E-mail</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="usuario@exemplo.com"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-telefone">Telefone</Label>
                    <Input
                      id="new-telefone"
                      placeholder="(11) 99999-9999"
                      value={createForm.telefone}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, telefone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-confirm-password">Confirmar senha</Label>
                    <Input
                      id="new-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={createForm.confirmPassword}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-role">Papel/Função</Label>
                    <Select
                      value={createForm.role}
                      onValueChange={(value: 'ADMIN' | 'MECANICO' | 'USUARIO') =>
                        setCreateForm({ ...createForm, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USUARIO">Usuário</SelectItem>
                        <SelectItem value="MECANICO">Mecânico</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser}>Criar Usuário</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, usuário ou e-mail..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Papel:</span>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MECANICO">Mecânico</SelectItem>
                  <SelectItem value="USUARIO">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
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
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="username">Usuário A-Z</SelectItem>
                  <SelectItem value="role">Papel A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading e Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <p>Carregando usuários...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Button 
              onClick={loadUsers} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && (
          <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="w-[150px]">Usuário</TableHead>
                  <TableHead className="w-[200px]">E-mail</TableHead>
                  <TableHead className="w-[120px]">Papel</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px]">Data Criação</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.length > 0 ? (
                  filteredAndSortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.dataCadastro
                          ? new Date(user.dataCadastro).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>{renderActionButtons(user)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm || filterRole !== "todos" || filterStatus !== "todos" 
                        ? "Nenhum usuário encontrado com os filtros aplicados" 
                        : "Nenhum usuário encontrado"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredAndSortedUsers.length > 0 ? (
              filteredAndSortedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{user.nome}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {renderActionButtons(user)}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {user.dataCadastro && (
                    <div className="text-xs text-gray-500">
                      Criado em {new Date(user.dataCadastro).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500">
                  {searchTerm || filterRole !== "todos" || filterStatus !== "todos" 
                    ? "Nenhum usuário encontrado com os filtros aplicados" 
                    : "Nenhum usuário encontrado"
                  }
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
            disabled={currentPage === 1 || loading}
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
              disabled={loading}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-2">
          Página {currentPage} de {totalPages} ({totalElements} usuários encontrados)
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Visualizar Usuário</DialogTitle>
              <DialogDescription>
                Informações detalhadas do usuário selecionado.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(selectedUser.role)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.nome}</h3>
                    <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-mail</Label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Papel</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(selectedUser.role)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ID</Label>
                    <p className="text-sm">#{selectedUser.id}</p>
                  </div>
                </div>
                
                {selectedUser.dataCadastro && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Criação</Label>
                    <p className="text-sm">{new Date(selectedUser.dataCadastro).toLocaleString('pt-BR')}</p>
                  </div>
                )}
                
                {selectedUser.dataCadastro && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Última Atualização</Label>
                    <p className="text-sm">{new Date(selectedUser.dataCadastro).toLocaleString('pt-BR')}</p>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias nos dados do usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Nome de usuário</Label>
                <Input
                  id="edit-username"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input
                  id="edit-telefone"
                  value={editForm.telefone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, telefone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Nova Senha</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="Digite uma nova senha"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Papel/Função</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value: 'ADMIN' | 'MECANICO') =>
                    setEditForm({ ...editForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MECANICO">Mecânico</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value as "ATIVO" | "INATIVO" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
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

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Redefinir Senha</DialogTitle>
              <DialogDescription>
                {selectedUser && `Definir nova senha para ${selectedUser.nome}`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-password">Nova senha</Label>
                <Input
                  id="reset-password"
                  type="password"
                  placeholder="••••••••"
                  value={resetPasswordForm.newPassword}
                  onChange={(e) =>
                    setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reset-confirm-password">Confirmar nova senha</Label>
                <Input
                  id="reset-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetPasswordDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveResetPassword}>Redefinir Senha</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}