import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um CPF ou CNPJ com a pontuação correta
 * CPF: 000.000.000-00
 * CNPJ: 00.000.000/0000-00
 */
export function formatCpfCnpj(value: string): string {
  if (!value) return ""
  
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, "")
  
  // CPF (11 dígitos)
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  } 
  // CNPJ (14 dígitos)
  else {
    return cleanValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }
}

/**
 * Formata um número de telefone brasileiro com a pontuação correta
 * Celular (11 dígitos): (00) 00000-0000
 * Fixo (10 dígitos): (00) 0000-0000
 */
export function formatPhone(value: string): string {
  if (!value) return ""
  
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, "")
  
  // Celular (11 dígitos)
  if (cleanValue.length === 11) {
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }
  // Fixo (10 dígitos)
  else if (cleanValue.length === 10) {
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }
  // Formatar parcialmente se ainda estiver digitando
  else if (cleanValue.length > 0) {
    if (cleanValue.length <= 2) {
      return `(${cleanValue}`
    } else if (cleanValue.length <= 6) {
      return cleanValue.replace(/(\d{2})(\d)/, "($1) $2")
    } else if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    }
  }
  
  return cleanValue
}
