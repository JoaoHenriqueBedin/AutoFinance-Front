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
  status: string;
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
  status: string;
}

// Buscar todos os orçamentos
export async function getOrcamentos(): Promise<Orcamento[]> {
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
    
    // A API retorna uma estrutura paginada, extrair o array content
    const data: OrcamentosResponse = response.data;
    return data.content || [];
  } catch (error: any) {
    console.error("Error fetching orçamentos:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
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

// Criar novo orçamento
export async function createOrcamento(orcamentoData: OrcamentoInput): Promise<Orcamento> {
  try {
    console.log("Criando orçamento:", orcamentoData);
    const response = await apiClient.post(API_URL, orcamentoData);
    console.log("Orçamento criado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating orçamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage) {
        throw new Error(`Erro de validação: ${errorMessage}`);
      }
      throw new Error("Dados inválidos para criação do orçamento.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente, veículo ou serviço não encontrado.");
    }
    throw new Error("Erro ao criar orçamento. Tente novamente.");
  }
}

// Atualizar orçamento existente
export async function updateOrcamento(numeroOrcamento: number, orcamentoData: OrcamentoInput): Promise<Orcamento> {
  try {
    console.log(`Atualizando orçamento com número: ${numeroOrcamento}`);
    console.log('Dados a serem enviados:', orcamentoData);
    
    const response = await apiClient.put(`${API_URL}/${numeroOrcamento}`, orcamentoData);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating orçamento:", error);
    console.error("URL tentada:", `${API_URL}/${numeroOrcamento}`);
    console.error("Dados enviados:", orcamentoData);
    
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
    console.log(`Deletando orçamento com número: ${numeroOrcamento}`);
    await apiClient.delete(`${API_URL}/${numeroOrcamento}`);
    console.log("Orçamento deletado com sucesso");
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