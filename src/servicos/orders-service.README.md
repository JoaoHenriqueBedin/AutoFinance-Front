# Serviço de Ordens de Serviço - Documentação de Uso

## 📋 Visão Geral

O serviço `orders-service.ts` fornece todas as operações necessárias para gerenciar ordens de serviço no sistema AutoFinance.

## 🔧 Funcionalidades Disponíveis

### 1. **Buscar todas as Ordens de Serviço**
```typescript
import { getOrdensServico } from "@/servicos/orders-service";

const orders = await getOrdensServico();
```

### 2. **Buscar Ordem de Serviço por ID**
```typescript
import { getOrdemServicoById } from "@/servicos/orders-service";

const order = await getOrdemServicoById(4);
```

### 3. **Criar Ordem de Serviço SEM Orçamento**
```typescript
import { createOrdemServico, OrdemServicoInput } from "@/servicos/orders-service";

const novaOrdem: OrdemServicoInput = {
  cliente: { cpfCnpj: "10872433943" },
  veiculo: { placa: "ISA0303" },
  servico: { nome: "Troca de pneu" },
  valorAjustado: 250.00,
  status: "ATIVO"
};

const ordemCriada = await createOrdemServico(novaOrdem);
```

### 4. **Criar Ordem de Serviço A PARTIR DE UM ORÇAMENTO**
```typescript
import { createOrdemServicoFromOrcamento } from "@/servicos/orders-service";

// Criar OS a partir do orçamento #8
const ordemCriada = await createOrdemServicoFromOrcamento(8);
```

### 5. **Atualizar Ordem de Serviço**
```typescript
import { updateOrdemServico, OrdemServicoUpdateInput } from "@/servicos/orders-service";

const dadosAtualizados: OrdemServicoUpdateInput = {
  valorAjustado: 300.00,
  status: "CONCLUIDO"
};

const ordemAtualizada = await updateOrdemServico(4, dadosAtualizados);
```

### 6. **Deletar Ordem de Serviço**
```typescript
import { deleteOrdemServico } from "@/servicos/orders-service";

await deleteOrdemServico(4);
```

### 7. **Atualizar Status da Ordem de Serviço**
```typescript
import { updateOrdemServicoStatus } from "@/servicos/orders-service";

const ordemAtualizada = await updateOrdemServicoStatus(4, "CONCLUIDO");
```

## 📊 Interfaces TypeScript

### OrdemServico
```typescript
interface OrdemServico {
  numeroOrdem: number;
  cpfCnpj: string;
  veiculoPlaca: string;
  servicoNome: string;
  mecanicoUsername: string;
  valorAjustado: number;
  status: string;
  dataCriacao: string;
  numeroOrcamento?: number; // Opcional, caso tenha sido criada a partir de um orçamento
}
```

### OrdemServicoInput (Criar sem orçamento)
```typescript
interface OrdemServicoInput {
  cliente: { cpfCnpj: string };
  veiculo: { placa: string };
  servico: { nome: string };
  valorAjustado: number;
  status: string;
}
```

### OrdemServicoUpdateInput (Atualizar)
```typescript
interface OrdemServicoUpdateInput {
  cliente?: { cpfCnpj: string };
  veiculo?: { placa: string };
  servico?: { nome: string };
  valorAjustado?: number;
  status?: string;
}
```

## 🎯 Exemplo de Implementação Completa

```typescript
import React, { useState, useEffect } from "react";
import {
  getOrdensServico,
  createOrdemServico,
  createOrdemServicoFromOrcamento,
  updateOrdemServico,
  deleteOrdemServico,
  OrdemServico,
  OrdemServicoInput
} from "@/servicos/orders-service";
import { toast } from "react-toastify";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar ordens de serviço
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdensServico();
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar ordens de serviço");
    } finally {
      setLoading(false);
    }
  };

  // Criar ordem de serviço sem orçamento
  const handleCreateOrder = async (orderData: OrdemServicoInput) => {
    try {
      await createOrdemServico(orderData);
      await loadOrders();
      toast.success("Ordem de serviço criada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar ordem de serviço");
    }
  };

  // Criar ordem de serviço a partir de orçamento
  const handleCreateFromBudget = async (numeroOrcamento: number) => {
    try {
      await createOrdemServicoFromOrcamento(numeroOrcamento);
      await loadOrders();
      toast.success("Ordem de serviço criada a partir do orçamento!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar ordem de serviço");
    }
  };

  // Atualizar ordem de serviço
  const handleUpdateOrder = async (numeroOrdem: number, data: any) => {
    try {
      await updateOrdemServico(numeroOrdem, data);
      await loadOrders();
      toast.success("Ordem de serviço atualizada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar ordem de serviço");
    }
  };

  // Deletar ordem de serviço
  const handleDeleteOrder = async (numeroOrdem: number) => {
    try {
      await deleteOrdemServico(numeroOrdem);
      await loadOrders();
      toast.success("Ordem de serviço deletada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar ordem de serviço");
    }
  };

  return (
    <div>
      {/* Seu componente aqui */}
    </div>
  );
}
```

## 🚨 Tratamento de Erros

Todos os métodos incluem tratamento de erros completo com mensagens específicas:

- **400 Bad Request**: Dados inválidos, cliente/veículo/serviço não encontrado
- **401 Unauthorized**: Necessário fazer login novamente
- **403 Forbidden**: Sem permissão para a operação
- **404 Not Found**: Recurso não encontrado

## ✅ Status Possíveis

- `ATIVO` - Ordem de serviço ativa
- `EM_ANDAMENTO` - Em execução
- `CONCLUIDO` - Finalizada
- `CANCELADO` - Cancelada

## 📝 Notas Importantes

1. **Criação a partir de Orçamento**: Quando uma OS é criada a partir de um orçamento, o campo `numeroOrcamento` será preenchido automaticamente.

2. **CPF/CNPJ**: Deve ser enviado sem pontuação (apenas números).

3. **Placa do Veículo**: Formato aceito pela API (ex: "ISA0303").

4. **Cache**: As requisições GET incluem cache-busting para garantir dados atualizados.

5. **Autenticação**: Todas as requisições usam o `apiClient` que já inclui o token JWT automaticamente.
