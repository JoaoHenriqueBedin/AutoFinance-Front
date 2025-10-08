/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/veiculos";

// Interface para o Cliente (aninhado no veículo)
export interface ClienteVeiculo {
  cpfCnpj: string;
  nome: string;
  email: string;
  celular: string;
  endereco?: string;
  cep?: string;
  observacoes?: string;
  dataNascimento?: string;
  dataCadastro: string;
  status: string;
}

// Interface para o Veículo
export interface Veiculo {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  renavam: string;
  chassi: string;
  combustivel: string;
  quilometragem: string;
  observacoes?: string;
  status: string;
  cliente: ClienteVeiculo;
}

// Interface para criação/atualização de veículo (estrutura esperada pela API)
export interface VeiculoInput {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  renavam: string;
  chassi: string;
  combustivel: string;
  quilometragem: string;
  observacoes?: string;
  status?: string;
  cliente: {
    cpfCnpj: string;
  };
}

// Interface para a resposta paginada da API
export interface VeiculosResponse {
  content: Veiculo[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Buscar todos os veículos
export async function getVeiculos(page: number = 0, size: number = 20): Promise<VeiculosResponse> {
  try {
    console.log("Fazendo requisição para:", `${API_URL}?page=${page}&size=${size}`);
    const response = await apiClient.get(`${API_URL}?page=${page}&size=${size}&_t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log("Resposta recebida:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching veículos:", error);
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
    throw new Error("Erro ao buscar veículos. Tente novamente.");
  }
}

// Buscar apenas a lista de veículos (sem paginação)
export async function getVeiculosList(): Promise<Veiculo[]> {
  try {
    const response = await getVeiculos(0, 1000); // Busca um número grande para pegar todos
    return response.content;
  } catch (error) {
    console.error("Error fetching veículos list:", error);
    throw error;
  }
}

// Buscar veículo por placa
export async function getVeiculoByPlaca(placa: string): Promise<Veiculo> {
  try {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await apiClient.get(`${API_URL}/${encodedPlaca}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching veículo ${placa}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Veículo não encontrado.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículo. Tente novamente.");
  }
}

// Criar novo veículo
export async function createVeiculo(veiculoData: VeiculoInput): Promise<Veiculo> {
  try {
    const response = await apiClient.post(API_URL, veiculoData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating veículo:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 409) {
      throw new Error("Já existe um veículo cadastrado com esta placa.");
    }
    if (error.response && error.response.status === 400) {
      // Verifica se a mensagem de erro contém informações sobre placa duplicada
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage.toLowerCase().includes("placa") || 
          errorMessage.toLowerCase().includes("já existe") || 
          errorMessage.toLowerCase().includes("duplicado")) {
        throw new Error("Já existe um veículo cadastrado com esta placa.");
      }
      if (errorMessage.toLowerCase().includes("cliente") || 
          errorMessage.toLowerCase().includes("cpf") || 
          errorMessage.toLowerCase().includes("cnpj")) {
        throw new Error("Cliente não encontrado. Verifique o CPF/CNPJ informado.");
      }
    }
    throw new Error("Erro ao criar veículo. Tente novamente.");
  }
}

// Atualizar veículo existente
export async function updateVeiculo(placa: string, veiculoData: VeiculoInput): Promise<Veiculo> {
  try {
    const encodedPlaca = encodeURIComponent(placa);
    console.log(`Atualizando veículo com placa: ${placa}`);
    console.log(`Placa codificada: ${encodedPlaca}`);
    console.log('Dados a serem enviados:', veiculoData);
    
    // Importante: Se a placa foi alterada, isso pode causar problemas
    // pois estamos usando a placa antiga na URL
    if (veiculoData.placa !== placa) {
      console.warn('ATENÇÃO: Placa foi alterada, mas estamos usando a antiga na URL');
    }
    
    const response = await apiClient.put(`${API_URL}/${encodedPlaca}`, veiculoData);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating veículo:", error);
    console.error("URL tentada:", `${API_URL}/${encodeURIComponent(placa)}`);
    console.error("Dados enviados:", veiculoData);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Veículo não encontrado.");
    }
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage.toLowerCase().includes("cliente") || 
          errorMessage.toLowerCase().includes("cpf") || 
          errorMessage.toLowerCase().includes("cnpj")) {
        throw new Error("Cliente não encontrado. Verifique o CPF/CNPJ informado.");
      }
    }
    throw new Error("Erro ao atualizar veículo. Tente novamente.");
  }
}

// Deletar veículo
export async function deleteVeiculo(placa: string): Promise<void> {
  try {
    const encodedPlaca = encodeURIComponent(placa);
    await apiClient.delete(`${API_URL}/${encodedPlaca}`);
  } catch (error: any) {
    console.error("Error deleting veículo:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Veículo não encontrado.");
    }
    throw new Error("Erro ao deletar veículo. Tente novamente.");
  }
}

// Buscar veículos por marca
export async function getVeiculosByMarca(marca: string): Promise<Veiculo[]> {
  try {
    const response = await apiClient.get(`${API_URL}/buscar?marca=${encodeURIComponent(marca)}`);
    return response.data.content || response.data; // Dependendo da estrutura da resposta
  } catch (error: any) {
    console.error(`Error searching veículos by marca ${marca}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículos por marca. Tente novamente.");
  }
}

// Buscar veículos por modelo
export async function getVeiculosByModelo(modelo: string): Promise<Veiculo[]> {
  try {
    const response = await apiClient.get(`${API_URL}/buscar?modelo=${encodeURIComponent(modelo)}`);
    return response.data.content || response.data; // Dependendo da estrutura da resposta
  } catch (error: any) {
    console.error(`Error searching veículos by modelo ${modelo}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículos por modelo. Tente novamente.");
  }
}

// Buscar veículos por CPF/CNPJ do cliente
export async function getVeiculosByCliente(cpfCnpj: string): Promise<Veiculo[]> {
  try {
    const response = await apiClient.get(`${API_URL}/cpfcnpj/${encodeURIComponent(cpfCnpj)}`);
    return response.data.content || response.data; // Dependendo da estrutura da resposta
  } catch (error: any) {
    console.error(`Error searching veículos by cliente ${cpfCnpj}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Nenhum veículo encontrado para este cliente.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículos do cliente. Tente novamente.");
  }
}

// Buscar veículos por nome do cliente
export async function getVeiculosByNome(nome: string): Promise<Veiculo[]> {
  try {
    const response = await apiClient.get(`${API_URL}/nome/${encodeURIComponent(nome)}`);
    return response.data.content || response.data; // Dependendo da estrutura da resposta
  } catch (error: any) {
    console.error(`Error searching veículos by nome ${nome}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Nenhum veículo encontrado para este cliente.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículos do cliente. Tente novamente.");
  }
}

// Buscar veículos com filtros múltiplos
export async function getVeiculosWithFilters(filters: {
  marca?: string;
  modelo?: string;
  ano?: number;
  cor?: string;
  status?: string;
  page?: number;
  size?: number;
}): Promise<VeiculosResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters.marca) params.append('marca', filters.marca);
    if (filters.modelo) params.append('modelo', filters.modelo);
    if (filters.ano) params.append('ano', filters.ano.toString());
    if (filters.cor) params.append('cor', filters.cor);
    if (filters.status) params.append('status', filters.status);
    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 20).toString());
    params.append('_t', Date.now().toString());
    
    const response = await apiClient.get(`${API_URL}?${params.toString()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching veículos with filters:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar veículos com filtros. Tente novamente.");
  }
}