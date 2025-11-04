/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/usuarios";

// Interface para o Usuário (baseado na resposta real da API)
export interface Usuario {
  username: string;
  email: string;
  telefone: string;
  role: 'ADMIN' | 'MECANICO';
  status: 'ATIVO' | 'INATIVO';
  dataCadastro?: string;
  empresaNome?: string;
  nome?: string; // Para compatibilidade com o formulário
  id?: number; // Para compatibilidade
  ativo?: boolean; // Derivado do status
}

// Interface para criação de usuário
export interface UsuarioInput {
  username: string;
  email: string;
  telefone: string;
  password: string;
  role: 'ADMIN' | 'MECANICO' | 'USUARIO';
  status: 'ATIVO' | 'INATIVO';
  empresaNome?: string;
}

// Interface para edição de usuário (sem username e empresaNome)
export interface UsuarioUpdateInput {
  email: string;
  telefone: string;
  password: string; // Obrigatório na API
  role: 'ADMIN' | 'MECANICO';
  status: 'ATIVO' | 'INATIVO';
}

// Interface para resposta paginada (caso a API implemente paginação no futuro)
export interface UsuariosResponse {
  content: Usuario[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Buscar todos os usuários (adaptado para resposta real da API)
export async function getUsuarios(page: number = 0, size: number = 10): Promise<UsuariosResponse> {
  try {
    console.log("Fazendo requisição para:", API_URL);
    const response = await apiClient.get(`${API_URL}?_t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log("Resposta recebida:", response.status);
    console.log("Dados da resposta:", response.data);
    
    // A API retorna um array simples, não paginado
    const usuarios: Usuario[] = Array.isArray(response.data) ? response.data : [];
    
    // Processar os dados para adicionar compatibilidade
    const processedUsers = usuarios.map(user => ({
      ...user,
      nome: user.username, // Usar username como nome para compatibilidade
      id: user.username.length, // ID temporário baseado no username
      ativo: user.status === 'ATIVO', // Converter status para boolean
      dataCriacao: user.dataCadastro // Usar dataCadastro como dataCriacao
    }));
    
    // Simular paginação no frontend
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedUsers = processedUsers.slice(startIndex, endIndex);
    
    return {
      content: paginatedUsers,
      totalElements: processedUsers.length,
      totalPages: Math.ceil(processedUsers.length / size),
      size: size,
      number: page,
      first: page === 0,
      last: endIndex >= processedUsers.length
    };
  } catch (error: any) {
    console.error("Error fetching usuários:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response && error.response.status === 404) {
      // Retornar estrutura vazia se não encontrar usuários
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    }
    
    throw error;
  }
}

// Buscar usuário por ID
export async function getUsuarioById(id: number): Promise<Usuario> {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching usuário ${id}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    throw new Error("Erro ao buscar usuário. Tente novamente.");
  }
}

// Buscar usuário por username
export async function getUsuarioByUsername(username: string): Promise<Usuario> {
  try {
    const response = await apiClient.get(`${API_URL}/${username}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching usuário ${username}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    throw new Error("Erro ao buscar usuário. Tente novamente.");
  }
}

// Criar novo usuário
export async function createUsuario(usuario: UsuarioInput): Promise<Usuario> {
  try {
    const response = await apiClient.post(API_URL, usuario);
    return response.data;
  } catch (error: any) {
    console.error("Error creating usuário:", error);
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response && error.response.status === 400) {
      if (errorMessage.toLowerCase().includes("username") || 
          errorMessage.toLowerCase().includes("usuário")) {
        throw new Error("Nome de usuário já existe. Escolha outro.");
      }
      if (errorMessage.toLowerCase().includes("email")) {
        throw new Error("E-mail já está em uso. Use outro e-mail.");
      }
      throw new Error("Dados inválidos. Verifique os campos e tente novamente.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para criar usuários.");
    }
    
    throw new Error("Erro ao criar usuário. Tente novamente.");
  }
}

// Atualizar usuário
export async function updateUsuario(username: string, usuario: UsuarioUpdateInput): Promise<Usuario> {
  try {
    const response = await apiClient.put(`${API_URL}/${username}`, usuario);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating usuário ${username}:`, error);
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response && error.response.status === 400) {
      if (errorMessage.toLowerCase().includes("username") || 
          errorMessage.toLowerCase().includes("usuário")) {
        throw new Error("Nome de usuário já existe. Escolha outro.");
      }
      if (errorMessage.toLowerCase().includes("email")) {
        throw new Error("E-mail já está em uso. Use outro e-mail.");
      }
      throw new Error("Dados inválidos. Verifique os campos e tente novamente.");
    }
    
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para editar usuários.");
    }
    
    throw new Error("Erro ao atualizar usuário. Tente novamente.");
  }
}

// Deletar usuário (desativar)
export async function deleteUsuario(id: number): Promise<void> {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    console.error(`Error deleting usuário ${id}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para excluir usuários.");
    }
    
    throw new Error("Erro ao excluir usuário. Tente novamente.");
  }
}

// Alternar status do usuário (ativar/desativar)
export async function toggleUsuarioStatus(id: number): Promise<Usuario> {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    console.error(`Error toggling status usuário ${id}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para alterar status de usuários.");
    }
    
    throw new Error("Erro ao alterar status do usuário. Tente novamente.");
  }
}

// Resetar senha do usuário
export async function resetUsuarioPassword(id: number, newPassword: string): Promise<void> {
  try {
    await apiClient.patch(`${API_URL}/${id}/reset-password`, { newPassword });
  } catch (error: any) {
    console.error(`Error resetting password usuário ${id}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Usuário não encontrado.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para resetar senhas.");
    }
    
    throw new Error("Erro ao resetar senha. Tente novamente.");
  }
}

// Buscar apenas usuários mecânicos
export async function getMecanicos(): Promise<Usuario[]> {
  try {
    console.log("Fazendo requisição para buscar mecânicos:", API_URL);
    const response = await apiClient.get(`${API_URL}?_t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log("Resposta recebida para mecânicos:", response.status);
    console.log("Dados da resposta:", response.data);
    
    // A API retorna um array simples, filtrar apenas mecânicos ativos
    const usuarios: Usuario[] = Array.isArray(response.data) ? response.data : [];
    
    // Filtrar apenas usuários com role MECANICO e status ATIVO
    const mecanicos = usuarios.filter(user => 
      user.role === 'MECANICO' && user.status === 'ATIVO'
    );
    
    console.log("Mecânicos filtrados:", mecanicos);
    
    return mecanicos;
  } catch (error: any) {
    console.error("Error fetching mecânicos:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response && error.response.status === 404) {
      // Retornar array vazio se não encontrar usuários
      return [];
    }
    
    throw new Error("Erro ao buscar mecânicos. Tente novamente.");
  }
}