/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/dashboard";

// Interface para o calendário de agendamentos
export interface CalendarioAgendamentos {
  [data: string]: boolean;
}

// Interface para orçamentos recentes
export interface OrcamentoRecente {
  nomeCliente: string;
  valor: number;
}

// Interface para serviços recentes
export interface ServicoRecente {
  nomeCliente: string;
  valorTotal: number;
}

// Interface principal do Dashboard
export interface Dashboard {
  totalClientes: number;
  totalVeiculos: number;
  ordensEmAndamento: number;
  faturamentoMensal: number;
  calendarioAgendamentos: CalendarioAgendamentos;
  orcamentosRecentes: OrcamentoRecente[];
  servicosRecentes: ServicoRecente[];
}

// Buscar dados do dashboard
export async function getDashboard(): Promise<Dashboard> {
  try {
    console.log("Fazendo requisição para:", API_URL);
    const response = await apiClient.get(API_URL, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log("Resposta recebida:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching dashboard:", error);
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
    throw new Error("Erro ao buscar dados do dashboard. Tente novamente.");
  }
}
