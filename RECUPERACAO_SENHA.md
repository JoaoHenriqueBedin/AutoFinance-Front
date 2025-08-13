# Sistema de Recuperação de Senha

## Visão Geral

O sistema de recuperação de senha foi implementado com três telas principais:

1. **Login** - Tela principal com botão "Esqueci minha senha"
2. **Recuperação de Senha** - Tela para solicitar reset via e-mail
3. **Redefinição de Senha** - Tela para definir nova senha com token

## Fluxo do Usuário

### 1. Acesso à Recuperação
- Na tela de login (`/login`), o usuário clica em "Esqueci minha senha"
- Redirecionado para `/forgot-password`

### 2. Solicitação de Reset
- Usuário digita seu e-mail
- Sistema envia e-mail com link de recuperação
- E-mail contém link: `seu-dominio.com/reset-password?token=TOKEN_GERADO`

### 3. Redefinição da Senha
- Usuário clica no link do e-mail
- Redirecionado para `/reset-password?token=TOKEN`
- Digita nova senha e confirmação
- Senha é redefinida e usuário volta ao login

## Rotas Implementadas

```tsx
// App.tsx - Rotas adicionadas
<Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

## Serviços de API

```typescript
// login-service.ts - Funções adicionadas

// Enviar e-mail de recuperação
export async function forgotPassword(email: string)

// Redefinir senha com token
export async function resetPassword(token: string, newPassword: string)
```

## Endpoints da API

### Recuperação de Senha
```
POST https://autofinance.azurewebsites.net/auth/forgot-password
Body: { "email": "usuario@email.com" }
```

### Reset de Senha
```
POST https://autofinance.azurewebsites.net/auth/reset-password
Body: { "token": "TOKEN_DO_EMAIL", "newPassword": "novaSenha123" }
```

## Validações Implementadas

### Tela de Recuperação
- ✅ Campo e-mail obrigatório
- ✅ Validação de formato de e-mail
- ✅ Feedback de loading durante envio

### Tela de Redefinição
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha deve coincidir
- ✅ Validação de token na URL
- ✅ Redirecionamento automático se token inválido

## Componentes Criados

1. **`ForgotPassword.tsx`** - Tela de solicitação de recuperação
2. **`ResetPassword.tsx`** - Tela de redefinição de senha
3. Modificações em **`Login.tsx`** - Adicionado botão de recuperação

## Tratamento de Erros

- **E-mail não encontrado**: Mensagem específica do backend
- **Token inválido/expirado**: Redirecionamento automático para login
- **Erros de rede**: Mensagens genéricas de erro
- **Validações**: Feedback imediato ao usuário

## Próximos Passos

Para implementação completa, o backend deve:

1. Implementar endpoints de recuperação
2. Sistema de tokens com expiração
3. Envio de e-mails com templates
4. Validações de segurança (rate limiting, etc.)
