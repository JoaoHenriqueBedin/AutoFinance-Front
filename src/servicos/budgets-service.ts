/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/orcamentos";

// Interface real do Orçamento baseada na API
export interface Orcamento {
  numeroOrcamento: number;
  cpfCnpj: string;
  veiculoPlaca: string;
  servicoNome: string;
  mecanicoUsername: string;
  valorAjustado: number;
  status: 'ATIVO' | 'INATIVO' | 'GERADO';
  dataCriacao: string;
}

// Interface para resposta paginada da API
export interface OrcamentosResponse {
  content: Orcamento[];
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

// Interface para criação/atualização de orçamento (mantendo a estrutura original para compatibilidade)
export interface OrcamentoInput {
  cliente: { cpfCnpj: string };
  veiculo: { placa: string };
  servico: { nome: string };
  valorAjustado: number;
  status: 'ATIVO' | 'INATIVO' | 'GERADO';
}

// Buscar todos os orçamentos
export async function getOrcamentos(): Promise<Orcamento[]> {
  try {
    const response = await apiClient.get(API_URL, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    // Verificar se a resposta é paginada ou array direto
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Se for estrutura paginada
    if (response.data && typeof response.data === 'object' && response.data.content) {
      return response.data.content || [];
    }
    
    return [];
  } catch (error: any) {
    console.error("Error fetching orçamentos:", error);
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 403) {
      throw new Error("Acesso negado. Você não tem permissão para acessar este recurso.");
    }
    throw new Error("Erro ao buscar orçamentos. Tente novamente.");  
  }
}

// Buscar orçamento por número
export async function getOrcamentoById(numeroOrcamento: number): Promise<Orcamento> {
  try {
    const response = await apiClient.get(`${API_URL}/${numeroOrcamento}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching orçamento ${numeroOrcamento}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Orçamento não encontrado.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar orçamento. Tente novamente.");
  }
}

// Criar um novo orçamento
export async function createOrcamento(orcamentoData: OrcamentoInput): Promise<Orcamento> {
  try {
    // Validar dados básicos
    if (!orcamentoData.cliente?.cpfCnpj) {
      throw new Error("Cliente é obrigatório");
    }
    
    const response = await apiClient.post(API_URL, orcamentoData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar orçamento:", error);
    
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data?.message || "Dados inválidos. Verifique os campos obrigatórios.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 403) {
      throw new Error("Acesso negado. Você não tem permissão para criar orçamentos.");
    }
    throw new Error("Erro ao criar orçamento. Tente novamente.");
  }
}

// Atualizar orçamento existente
export async function updateOrcamento(numeroOrcamento: number, orcamentoData: OrcamentoInput): Promise<Orcamento> {
  try {
    const response = await apiClient.put(`${API_URL}/${numeroOrcamento}`, orcamentoData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating orçamento:", error);
    
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Orçamento não encontrado.");
    }
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage) {
        throw new Error(`Erro de validação: ${errorMessage}`);
      }
      throw new Error("Dados inválidos para atualização do orçamento.");
    }
    throw new Error("Erro ao atualizar orçamento. Tente novamente.");
  }
}

// Deletar orçamento
export async function deleteOrcamento(numeroOrcamento: number): Promise<void> {
  try {
    await apiClient.delete(`${API_URL}/${numeroOrcamento}`);
  } catch (error: any) {
    console.error("Error deleting orçamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Orçamento não encontrado.");
    }
    throw new Error("Erro ao deletar orçamento. Tente novamente.");
  }
}

// Buscar orçamentos por status
export async function getOrcamentosByStatus(status: string): Promise<Orcamento[]> {
  try {
    const response = await apiClient.get(`${API_URL}?status=${encodeURIComponent(status)}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching orçamentos by status ${status}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar orçamentos por status. Tente novamente.");
  }
}

// Buscar orçamentos por CPF/CNPJ do cliente
export async function getOrcamentosByCliente(cpfCnpj: string): Promise<Orcamento[]> {
  try {
    const response = await apiClient.get(`${API_URL}/cliente/${encodeURIComponent(cpfCnpj)}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching orçamentos by cliente ${cpfCnpj}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Nenhum orçamento encontrado para este cliente.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar orçamentos do cliente. Tente novamente.");
  }
}