/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/agendamentos";

// Interface para o Agendamento
export interface Agendamento {
  id?: number;
  dataAgendada: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observacoes?: string;
  clienteId?: number;
  servicoId?: number;
  usuarioId?: number;
  // Campos adicionais que podem vir da API expandida
  cliente?: string;
  automovel?: string;
  telefone?: string;
  hora?: string;
  mecanico?: string;
  data?: string;
  servico?: string;
}

// Interface para criação/atualização de agendamento (sem ID)
export interface AgendamentoInput {
  dataAgendada: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observacoes?: string;
}

// Interface para o formulário de agendamento (inclui campos de display)
export interface AgendamentoForm {
  dataAgendada: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observacoes?: string;
  cliente?: string;
  automovel?: string;
  telefone?: string;
  hora?: string;
  mecanico?: string;
  data?: string;
  servico?: string;
}

// Buscar todos os agendamentos
export async function getAgendamentos(): Promise<Agendamento[]> {
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
    return response.data;
  } catch (error: any) {
    console.error("Error fetching agendamentos:", error);
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
    throw new Error("Erro ao buscar agendamentos. Tente novamente.");
  }
}

// Buscar agendamento por ID
export async function getAgendamentoById(id: number): Promise<Agendamento> {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching agendamento ${id}:`, error);
    if (error.response && error.response.status === 404) {
      throw new Error("Agendamento não encontrado.");
    }
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar agendamento. Tente novamente.");
  }
}

// Criar novo agendamento
export async function createAgendamento(agendamentoData: AgendamentoInput): Promise<Agendamento> {
  try {
    const response = await apiClient.post(API_URL, agendamentoData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating agendamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage.toLowerCase().includes("conflito") || errorMessage.toLowerCase().includes("horário")) {
        throw new Error("Já existe um agendamento para este horário.");
      }
    }
    throw new Error("Erro ao criar agendamento. Tente novamente.");
  }
}

// Atualizar agendamento existente
export async function updateAgendamento(id: number, agendamentoData: AgendamentoInput): Promise<Agendamento> {
  try {
    console.log(`Atualizando agendamento com ID: ${id}`);
    console.log('Dados a serem enviados:', agendamentoData);
    
    const response = await apiClient.put(`${API_URL}/${id}`, agendamentoData);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating agendamento:", error);
    console.error("URL tentada:", `${API_URL}/${id}`);
    console.error("Dados enviados:", agendamentoData);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Agendamento não encontrado.");
    }
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "";
      if (errorMessage.toLowerCase().includes("conflito") || errorMessage.toLowerCase().includes("horário")) {
        throw new Error("Já existe um agendamento para este horário.");
      }
    }
    throw new Error("Erro ao atualizar agendamento. Tente novamente.");
  }
}

// Deletar agendamento
export async function deleteAgendamento(id: number): Promise<void> {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    console.error("Error deleting agendamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Agendamento não encontrado.");
    }
    throw new Error("Erro ao deletar agendamento. Tente novamente.");
  }
}

// Buscar agendamentos por status
export async function getAgendamentosByStatus(status: string): Promise<Agendamento[]> {
  try {
    const response = await apiClient.get(`${API_URL}/status/${encodeURIComponent(status)}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching agendamentos by status ${status}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar agendamentos por status. Tente novamente.");
  }
}

// Buscar agendamentos por data
export async function getAgendamentosByData(data: string): Promise<Agendamento[]> {
  try {
    const response = await apiClient.get(`${API_URL}/data/${encodeURIComponent(data)}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching agendamentos by data ${data}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    throw new Error("Erro ao buscar agendamentos por data. Tente novamente.");
  }
}

// Buscar agendamentos por cliente
export async function getAgendamentosByCliente(clienteId: number): Promise<Agendamento[]> {
  try {
    const response = await apiClient.get(`${API_URL}/cliente/${clienteId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching agendamentos by cliente ${clienteId}:`, error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Cliente não encontrado.");
    }
    throw new Error("Erro ao buscar agendamentos do cliente. Tente novamente.");
  }
}

// Confirmar agendamento
export async function confirmarAgendamento(id: number): Promise<Agendamento> {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/confirmar`);
    return response.data;
  } catch (error: any) {
    console.error("Error confirming agendamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Agendamento não encontrado.");
    }
    throw new Error("Erro ao confirmar agendamento. Tente novamente.");
  }
}

// Cancelar agendamento
export async function cancelarAgendamento(id: number, motivo?: string): Promise<Agendamento> {
  try {
    const data = motivo ? { observacoes: motivo } : {};
    const response = await apiClient.patch(`${API_URL}/${id}/cancelar`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error canceling agendamento:", error);
    if (error.response && error.response.status === 401) {
      throw new Error("Acesso não autorizado. Faça login novamente.");
    }
    if (error.response && error.response.status === 404) {
      throw new Error("Agendamento não encontrado.");
    }
    throw new Error("Erro ao cancelar agendamento. Tente novamente.");
  }
}