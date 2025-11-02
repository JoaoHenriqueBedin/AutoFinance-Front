import { apiClient } from '@/lib/axios'

const API_URL = "https://autofinance.azurewebsites.net/servicos";

// Interfaces
export interface Servico {
  id: number
  nome: string
  descricao: string
  preco: number
  duracao: string
  possuiRetorno: boolean
  mesesRetornoPadrao: number
  mensagemRetornoPadrao: string
  status: 'ATIVO' | 'INATIVO'
  dataCriacao?: string
  dataAtualizacao?: string
}

export interface ServicoInput {
  nome: string
  descricao: string
  preco: number
  duracao: string
  possuiRetorno: boolean
  mesesRetornoPadrao: number
  mensagemRetornoPadrao: string
  status: 'ATIVO' | 'INATIVO'
}

export interface ServicosResponse {
  content: Servico[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Funções do serviço
// Buscar todos os serviços (sem paginação, igual ao serviço de clientes)
export const getServicosList = async (): Promise<Servico[]> => {
  try {
    console.log('Fazendo requisição para:', API_URL) // Debug
    
    const response = await apiClient.get(`${API_URL}?_t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    console.log('Status da resposta:', response.status) // Debug
    console.log('Dados da resposta:', response.data) // Debug
    console.log('Tipo dos dados:', Array.isArray(response.data) ? 'Array' : 'Object') // Debug
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    throw new Error('Erro ao carregar lista de serviços')
  }
}

export const getServicoById = async (id: number): Promise<Servico> => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar serviço:', error)
    throw new Error('Erro ao carregar dados do serviço')
  }
}

export const createServico = async (servico: ServicoInput): Promise<Servico> => {
  try {
    console.log('Enviando payload para criar serviço:', servico)
    console.log('URL da requisição:', API_URL)
    
    const response = await apiClient.post(API_URL, servico)
    return response.data
  } catch (error: unknown) {
    console.error('Erro detalhado ao criar serviço:', error)
    
    // Se for um erro do Axios, extrair informações específicas
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown } }
      console.error('Status HTTP:', axiosError.response?.status)
      console.error('Status Text:', axiosError.response?.statusText)
      console.error('Response Data:', axiosError.response?.data)
      
      throw new Error(`Erro ao criar serviço: ${axiosError.response?.status || 'Desconhecido'}`)
    }
    
    throw new Error('Erro ao criar serviço')
  }
}

export const updateServico = async (id: number, servico: ServicoInput): Promise<Servico> => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, servico)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    throw new Error('Erro ao atualizar serviço')
  }
}

export const deleteServico = async (servico: Servico): Promise<void> => {
  try {
    console.log('Inativando serviço ID:', servico.id)
    
    // Preparar dados do serviço com status INATIVO
    const servicoAtualizado = {
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao: servico.duracao,
      possuiRetorno: servico.possuiRetorno,
      mesesRetornoPadrao: servico.mesesRetornoPadrao,
      mensagemRetornoPadrao: servico.mensagemRetornoPadrao,
      status: 'INATIVO' as const
    }
    
    console.log('Payload para inativar:', servicoAtualizado)
    await apiClient.put(`${API_URL}/${servico.id}`, servicoAtualizado)
  } catch (error: unknown) {
    console.error('Erro ao inativar serviço:', error)
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: unknown } }
      console.error('Status do erro:', axiosError.response?.status)
      console.error('Dados do erro:', axiosError.response?.data)
      
      if (axiosError.response?.status === 403) {
        throw new Error('Você não tem permissão para inativar este serviço')
      }
      if (axiosError.response?.status === 404) {
        throw new Error('Serviço não encontrado')
      }
    }
    
    throw new Error('Erro ao inativar serviço')
  }
}

export const reactivateServico = async (servico: Servico): Promise<Servico> => {
  try {
    console.log('Reativando serviço ID:', servico.id)
    
    // Preparar dados do serviço com status ATIVO
    const servicoAtualizado = {
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao: servico.duracao,
      possuiRetorno: servico.possuiRetorno,
      mesesRetornoPadrao: servico.mesesRetornoPadrao,
      mensagemRetornoPadrao: servico.mensagemRetornoPadrao,
      status: 'ATIVO' as const
    }
    
    console.log('Payload para reativar:', servicoAtualizado)
    const response = await apiClient.put(`${API_URL}/${servico.id}`, servicoAtualizado)
    return response.data
  } catch (error: unknown) {
    console.error('Erro ao reativar serviço:', error)
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: unknown } }
      console.error('Status do erro:', axiosError.response?.status)
      console.error('Dados do erro:', axiosError.response?.data)
    }
    
    throw new Error('Erro ao reativar serviço')
  }
}

// Função auxiliar para buscar todos os serviços (alias para compatibilidade)
export const getAllServicos = async (): Promise<Servico[]> => {
  return getServicosList()
}