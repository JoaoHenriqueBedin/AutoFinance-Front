/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/clientes";

// Interface para o Cliente
export interface Cliente {
  id?: number;
  cpfCnpj: string;
  nome: string;
  celular: string;
  email: string;
  dataNascimento: string;
  observacoes?: string;
  endereco: string;
  cep: string;
  ativo?: boolean;
  status?: string;
}

// Interface para criação/atualização de cliente (sem ID)
export interface ClienteInput {
  cpfCnpj: string;
  nome: string;
  celular: string;
  email: string;
  dataNascimento: string;
  observacoes?: string;
  endereco: string;
  cep: string;
  ativo?: boolean;
  status?: string;
}

// Buscar todos os clientes
export async function getClientes(): Promise<Cliente[]> {
  try {
    console.log("Fazendo requisição para:", API_URL);
    const response = await apiClient.get(API_URL);
    console.log("Resposta recebida:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching clientes:", error);
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
    throw new Error("Erro ao buscar clientes. Tente novamente.");
  }
}

// Buscar cliente por CPF/CNPJ
export async function getClienteById(cpfCnpj: string): Promise<Cliente> {
  try {
    const encodedCpfCnpj = encodeURIComponent(cpfCnpj)
    const response = await apiClient.get(`${API_URL}/${encodedCpfCnpj}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching cliente ${cpfCnpj}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente não encontrado.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar cliente. Tente novamente.");
  }
}

// Criar novo cliente
export async function createCliente(clienteData: ClienteInput): Promise<Cliente> {
  try {
    const response = await apiClient.post(API_URL, clienteData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating cliente:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao criar cliente. Tente novamente.");
  }
}

// Atualizar cliente existente
export async function updateCliente(cpfCnpj: string, clienteData: ClienteInput): Promise<Cliente> {
  try {
    const encodedCpfCnpj = encodeURIComponent(cpfCnpj)
    console.log(`Atualizando cliente com CPF/CNPJ: ${cpfCnpj}`)
    console.log(`CPF/CNPJ codificado: ${encodedCpfCnpj}`)
    console.log('Dados a serem enviados:', clienteData)
    const response = await apiClient.put(`${API_URL}/${encodedCpfCnpj}`, clienteData);
    console.log('Resposta da API:', response.data)
    return response.data;
  } catch (error: any) {
    console.error("Error updating cliente:", error);
    console.error("URL tentada:", `${API_URL}/${encodeURIComponent(cpfCnpj)}`)
    console.error("Dados enviados:", clienteData)
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente não encontrado.");
    }
    throw new Error("Erro ao atualizar cliente. Tente novamente.");
  }
}

// Deletar cliente
export async function deleteCliente(cpfCnpj: string): Promise<void> {
  try {
    const encodedCpfCnpj = encodeURIComponent(cpfCnpj)
    await apiClient.delete(`${API_URL}/${encodedCpfCnpj}`);
  } catch (error: any) {
    console.error("Error deleting cliente:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente não encontrado.");
    }
    throw new Error("Erro ao deletar cliente. Tente novamente.");
  }
}

// Buscar clientes por CPF/CNPJ
export async function getClienteByCpfCnpj(cpfCnpj: string): Promise<Cliente> {
  try {
    const response = await apiClient.get(`${API_URL}/cpf/${cpfCnpj}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching cliente by CPF/CNPJ ${cpfCnpj}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente não encontrado com este CPF/CNPJ.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar cliente por CPF/CNPJ. Tente novamente.");
  }
}

// Buscar clientes por nome (busca parcial)
export async function getClientesByNome(nome: string): Promise<Cliente[]> {
  try {
    const response = await apiClient.get(`${API_URL}/buscar?nome=${encodeURIComponent(nome)}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error searching clientes by nome ${nome}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar clientes por nome. Tente novamente.");
  }
}
