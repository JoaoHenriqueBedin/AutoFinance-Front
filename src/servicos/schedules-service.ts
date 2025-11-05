/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";
import { toast } from "react-toastify";

const API_URL = "https://autofinance.azurewebsites.net/agendamentos";

// Interface para o Agendamento
export interface Agendamento {
  id?: number;
  numeroOrdem?: number; // Campo alternativo de ID que pode vir da API
  dataAgendada: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observacoes?: string;
  clienteId?: number;
  servicoId?: number;
  usuarioId?: number;
  mecanicoUsername?: string; // Campo do mecânico que pode vir da API
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
  observacoes?: string;
  mecanicoUsername: string;
  status?: 'AGENDADO' | 'CONCLUIDO' | 'INATIVO';
}

// Interface para o formulário de agendamento (inclui campos de display)
export interface AgendamentoForm {
  id?: number;
  dataAgendada: string;
  observacoes?: string;
  mecanicoUsername: string;
  status?: 'AGENDADO' | 'CONCLUIDO' | 'INATIVO';
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
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 403) {
      const errorMsg = "Acesso negado. Você não tem permissão para acessar este recurso.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    const errorMsg = "Erro ao buscar agendamentos. Tente novamente.";
    toast.error(errorMsg);
    throw new Error(errorMsg);
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
    console.log("=== INÍCIO createAgendamento ===");
    console.log("Dados recebidos:", agendamentoData);
    
    // Validar se a data foi fornecida
    if (!agendamentoData.dataAgendada) {
      throw new Error("Data e hora são obrigatórios.");
    }
    
    console.log("URL da requisição:", `${API_URL}/criar/avulso`);
    console.log("Enviando dados:", agendamentoData);
    
    const response = await apiClient.post(`${API_URL}/criar/avulso`, agendamentoData);
    
    console.log("Resposta da API:", response);
    console.log("=== FIM createAgendamento - SUCESSO ===");
    
    // Mostrar toast de sucesso
    toast.success("Agendamento criado com sucesso!");
    
    return response.data;
  } catch (error: any) {
    console.error("=== ERRO createAgendamento ===");
    console.error("Erro completo:", error);
    console.error("Response:", error.response);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    
    if (error.response && error.response.status === 401) {
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data?.error || error.response.data?.erro || "";
      console.error("Mensagem de erro da API:", errorMessage);
      
      // Mostrar mensagem de erro específica da API se disponível
      if (errorMessage) {
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
    
    // Para outros erros, mostrar mensagem genérica mas com log detalhado
    const mensagemErro = error.message || "Erro ao criar agendamento. Tente novamente.";
    console.error("Mensagem final do erro:", mensagemErro);
    toast.error(mensagemErro);
    throw new Error(mensagemErro);
  }
}

// Atualizar agendamento existente
export async function updateAgendamento(id: number, agendamentoData: AgendamentoInput): Promise<Agendamento> {
  try {
    console.log(`Atualizando agendamento com ID: ${id}`);
    console.log('Dados a serem enviados:', agendamentoData);
    
    const response = await apiClient.put(`${API_URL}/atualizar/${id}`, agendamentoData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log('Resposta da API:', response.data);
    
    // Mostrar toast de sucesso
    toast.success("Agendamento atualizado com sucesso!");
    
    return response.data;
  } catch (error: any) {
    console.error("Error updating agendamento:", error);
    console.error("URL tentada:", `${API_URL}/${id}/atualizar`);
    console.error("Dados enviados:", agendamentoData);
    
    if (error.response && error.response.status === 401) {
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 404) {
      const errorMsg = "Agendamento não encontrado.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 400) {
      // Capturar erro específico da API
      const errorData = error.response.data;
      const errorMessage = errorData?.erro || errorData?.error || errorData?.message || "";
      
      if (errorMessage) {
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Mensagens específicas antigas (mantidas como fallback)
      if (errorMessage.toLowerCase().includes("conflito") || errorMessage.toLowerCase().includes("horário")) {
        const errorMsg = "Já existe um agendamento para este horário.";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    }
    
    const errorMsg = "Erro ao atualizar agendamento. Tente novamente.";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Deletar agendamento
export async function deleteAgendamento(id: number): Promise<void> {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
    
    // Mostrar toast de sucesso
    toast.success("Agendamento deletado com sucesso!");
  } catch (error: any) {
    console.error("Error deleting agendamento:", error);
    if (error.response && error.response.status === 401) {
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 404) {
      const errorMsg = "Agendamento não encontrado.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    const errorMsg = "Erro ao deletar agendamento. Tente novamente.";
    toast.error(errorMsg);
    throw new Error(errorMsg);
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
    
    // Mostrar toast de sucesso
    toast.success("Agendamento confirmado com sucesso!");
    
    return response.data;
  } catch (error: any) {
    console.error("Error confirming agendamento:", error);
    if (error.response && error.response.status === 401) {
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 404) {
      const errorMsg = "Agendamento não encontrado.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    const errorMsg = "Erro ao confirmar agendamento. Tente novamente.";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Cancelar agendamento
export async function cancelarAgendamento(id: number, motivo?: string): Promise<Agendamento> {
  try {
    const data = motivo ? { observacoes: motivo } : {};
    const response = await apiClient.patch(`${API_URL}/${id}/cancelar`, data);
    
    // Mostrar toast de sucesso
    toast.success("Agendamento cancelado com sucesso!");
    
    return response.data;
  } catch (error: any) {
    console.error("Error canceling agendamento:", error);
    if (error.response && error.response.status === 401) {
      const errorMsg = "Acesso não autorizado. Faça login novamente.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (error.response && error.response.status === 404) {
      const errorMsg = "Agendamento não encontrado.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    const errorMsg = "Erro ao cancelar agendamento. Tente novamente.";
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}