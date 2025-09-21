/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../lib/axios";

const API_URL = "https://autofinance.azurewebsites.net/empresas";

// Interface para criação de empresa
export interface EmpresaInput {
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  telefone: string;
  cep: string;
  nomeAdmin: string;
  usernameAdmin: string;
  emailAdmin: string;
  senhaAdmin: string;
}

// Interface para resposta de erro
export interface EmpresaError {
  erro: string;
}

// Função para criar uma nova empresa
export const criarEmpresa = async (empresaData: EmpresaInput): Promise<any> => {
  try {
    // Garantir que o telefone tenha o formato correto (+55)
    let telefoneFormatado = empresaData.telefone
    const cleanPhone = empresaData.telefone.replace(/\D/g, '')
    
    if (cleanPhone.length === 11 && !telefoneFormatado.startsWith('+')) {
      telefoneFormatado = `+55${cleanPhone}`
    } else if (cleanPhone.length === 10 && !telefoneFormatado.startsWith('+')) {
      telefoneFormatado = `+55${cleanPhone}`
    }

    const dadosFinais = {
      ...empresaData,
      telefone: telefoneFormatado
    }
    
    console.log('Criando empresa:', dadosFinais);
    
    const response = await apiClient.post(`${API_URL}/criar`, dadosFinais);
    
    console.log('Resposta da criação de empresa:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Erro ao criar empresa:', error);
    
    // Se há uma resposta do servidor com erro específico
    if (error.response?.data?.erro) {
      throw new Error(error.response.data.erro);
    }
    
    // Outros tipos de erro
    if (error.response?.status === 400) {
      throw new Error('Dados inválidos fornecidos');
    }
    
    if (error.response?.status === 409) {
      throw new Error('Já existe uma empresa com este CNPJ');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde');
    }
    
    // Erro genérico
    throw new Error('Erro ao criar empresa. Verifique sua conexão e tente novamente');
  }
};