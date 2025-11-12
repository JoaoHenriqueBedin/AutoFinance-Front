/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/ordens-servico";

// Interface para Ordem de Serviço
export interface OrdemServico {
  id?: string;
  numero?: number;
  numeroOrdem?: number;
  clienteCpfCnpj: string; // Campo real retornado pela API
  cpfCnpj?: string; // Alias para compatibilidade
  veiculoPlaca: string;
  servicoNome: string;
  mecanicoUsername?: string;
  valor: number; // Campo real retornado pela API
  valorAjustado?: number; // Alias para compatibilidade
  status: string;
  observacoes?: string;
  dataCriacao: string;
  dataFinalizacao?: string;
  dataRetorno?: string;
  numeroOrcamento?: number; // Opcional, caso tenha sido criada a partir de um orçamento
}

// Interface para resposta paginada da API
export interface OrdensServicoResponse {
  content: OrdemServico[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// Interface para criação de ordem de serviço sem orçamento
export interface OrdemServicoInput {
  cliente: { cpfCnpj: string };
  veiculo: { placa: string };
  servico: { nome: string };
  mecanico: { username: string };
  valor: number;
  status: string;
}

// Interface para atualização de ordem de serviço
export interface OrdemServicoUpdateInput {
  cliente?: { cpfCnpj: string };
  veiculo?: { placa: string };
  servico?: { nome: string };
  mecanico?: { username: string };
  valor?: number;
  status?: string;
}

/**
 * Buscar todas as ordens de serviço
 */
export async function getOrdensServico(): Promise<OrdemServico[]> {
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
    
    // A API pode retornar uma estrutura paginada ou um array simples
    if (response.data.content) {
      const data: OrdensServicoResponse = response.data;
      return data.content || [];
    }
    
    // Se for array simples
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("Error fetching ordens de serviço:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response && error.response.status === 404) {
      return [];
    }
    
    throw new Error("Erro ao buscar ordens de serviço. Tente novamente.");
  }
}

/**
 * Buscar ordem de serviço por número
 */
export async function getOrdemServicoById(numeroOrdem: number): Promise<OrdemServico> {
  try {
    const response = await apiClient.get(`${API_URL}/${numeroOrdem}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ordem de serviço ${numeroOrdem}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Ordem de serviço não encontrada.");
    }
    
    throw new Error("Erro ao buscar ordem de serviço. Tente novamente.");
  }
}

/**
 * Criar ordem de serviço SEM orçamento
 */
export async function createOrdemServico(ordemServico: OrdemServicoInput): Promise<OrdemServico> {
  try {
    console.log("Criando ordem de serviço sem orçamento:", ordemServico);
    const response = await apiClient.post(`${API_URL}/criar`, ordemServico);
    console.log("Ordem de serviço criada com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating ordem de serviço:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response && error.response.status === 400) {
      if (errorMessage.toLowerCase().includes("cliente")) {
        throw new Error("Cliente não encontrado. Verifique o CPF/CNPJ.");
      }
      if (errorMessage.toLowerCase().includes("veículo") || errorMessage.toLowerCase().includes("placa")) {
        throw new Error("Veículo não encontrado. Verifique a placa.");
      }
      if (errorMessage.toLowerCase().includes("serviço")) {
        throw new Error("Serviço não encontrado. Verifique o nome do serviço.");
      }
      throw new Error("Dados inválidos. Verifique os campos e tente novamente.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para criar ordens de serviço.");
    }
    
    throw new Error("Erro ao criar ordem de serviço. Tente novamente.");
  }
}

/**
 * Criar ordem de serviço a partir de um ORÇAMENTO
 */
export async function createOrdemServicoFromOrcamento(numeroOrcamento: number): Promise<OrdemServico> {
  try {
    const response = await apiClient.post(`${API_URL}/criar/orcamento/${numeroOrcamento}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error creating ordem de serviço from orçamento ${numeroOrcamento}:`, error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response && error.response.status === 404) {
      throw new Error("Orçamento não encontrado.");
    }
    
    if (error.response && error.response.status === 400) {
      if (errorMessage.toLowerCase().includes("já possui")) {
        throw new Error("Este orçamento já possui uma ordem de serviço associada.");
      }
      if (errorMessage.toLowerCase().includes("status")) {
        throw new Error("O orçamento precisa estar aprovado para criar uma ordem de serviço.");
      }
      throw new Error("Não foi possível criar ordem de serviço a partir deste orçamento.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      // Verificar se o problema é falta de roles no token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const hasRoles = payload.roles || payload.authorities || payload.role;
          if (!hasRoles) {
            throw new Error("⚠️ Erro de autenticação: Seu token não possui as permissões necessárias. Por favor, faça logout e login novamente. Se o problema persistir, contate o administrador do sistema.");
          }
        } catch {
          // Se não conseguir decodificar, continuar com mensagem padrão
        }
      }
      throw new Error("Você não tem permissão para criar ordens de serviço. Apenas administradores podem executar esta ação.");
    }
    
    throw new Error("Erro ao criar ordem de serviço a partir do orçamento. Tente novamente.");
  }
}

/**
 * Atualizar ordem de serviço
 */
export async function updateOrdemServico(
  id: number,
  ordemServico: OrdemServicoUpdateInput
): Promise<OrdemServico> {
  try {
    console.log(`Atualizando ordem de serviço com ID ${id}:`, ordemServico);
    const response = await apiClient.put(`${API_URL}/${id}`, ordemServico);
    console.log("Ordem de serviço atualizada com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating ordem de serviço ${id}:`, error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response && error.response.status === 404) {
      throw new Error("Ordem de serviço não encontrada.");
    }
    
    if (error.response && error.response.status === 400) {
      if (errorMessage.toLowerCase().includes("cliente")) {
        throw new Error("Cliente não encontrado. Verifique o CPF/CNPJ.");
      }
      if (errorMessage.toLowerCase().includes("veículo") || errorMessage.toLowerCase().includes("placa")) {
        throw new Error("Veículo não encontrado. Verifique a placa.");
      }
      if (errorMessage.toLowerCase().includes("serviço")) {
        throw new Error("Serviço não encontrado. Verifique o nome do serviço.");
      }
      if (errorMessage.toLowerCase().includes("mecanico") || errorMessage.toLowerCase().includes("mecânico")) {
        throw new Error("Mecânico não encontrado. Verifique o username do mecânico.");
      }
      throw new Error("Dados inválidos. Verifique os campos e tente novamente.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para atualizar ordens de serviço.");
    }
    
    throw new Error("Erro ao atualizar ordem de serviço. Tente novamente.");
  }
}

/**
 * Deletar ordem de serviço
 */
export async function deleteOrdemServico(numeroOrdem: number): Promise<void> {
  try {
    console.log(`Deletando ordem de serviço ${numeroOrdem}`);
    await apiClient.delete(`${API_URL}/${numeroOrdem}`);
    console.log("Ordem de serviço deletada com sucesso");
  } catch (error: any) {
    console.error(`Error deleting ordem de serviço ${numeroOrdem}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Ordem de serviço não encontrada.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para deletar ordens de serviço.");
    }
    
    throw new Error("Erro ao deletar ordem de serviço. Tente novamente.");
  }
}

/**
 * Inativar ordem de serviço (mudança de status via PUT)
 */
export async function inactivateOrdemServico(id: number): Promise<OrdemServico> {
  try {
    console.log(`Inativando ordem de serviço com ID ${id}`);
    
    // Usar PUT com payload contendo apenas o status INATIVA
    const payload = { status: "INATIVA" };
    const response = await apiClient.put(`${API_URL}/${id}`, payload);
    
    console.log("Ordem de serviço inativada com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error inactivating ordem de serviço ${id}:`, error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    if (error.response && error.response.status === 404) {
      throw new Error("Ordem de serviço não encontrada.");
    }
    
    if (error.response && error.response.status === 400) {
      throw new Error("Não foi possível inativar a ordem de serviço. Verifique se ela está em um status válido.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para inativar ordens de serviço.");
    }
    
    throw new Error("Erro ao inativar ordem de serviço. Tente novamente.");
  }
}

/**
 * Alterar status da ordem de serviço
 */
export async function updateOrdemServicoStatus(
  numeroOrdem: number,
  status: string
): Promise<OrdemServico> {
  try {
    console.log(`Alterando status da ordem de serviço ${numeroOrdem} para ${status}`);
    const response = await apiClient.patch(`${API_URL}/${numeroOrdem}/status`, { status });
    console.log("Status atualizado com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating status ordem de serviço ${numeroOrdem}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error("Ordem de serviço não encontrada.");
    }
    
    if (error.response && error.response.status === 400) {
      throw new Error("Status inválido.");
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    
    if (error.response && error.response.status === 403) {
      throw new Error("Você não tem permissão para alterar status de ordens de serviço.");
    }
    
    throw new Error("Erro ao alterar status da ordem de serviço. Tente novamente.");
  }
}
