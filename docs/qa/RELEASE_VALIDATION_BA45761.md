# Release Validation — ba45761

## Escopo

Validação do commit `ba45761` com foco nas três correções de QA:

- parsing de preço com ponto decimal
- headers básicos de segurança
- mensagem de cobrança com itens e total

## Fonte

Este documento consolida o relatório de validação de deploy feito em produção após o push do commit para `main`.

## Resultado

**Aprovado para testes externos.**

## Itens validados

### BUG-1 — Parsing de preço

- input `49.90` passou a salvar como `R$ 49,90`
- helper de formulário atualizado
- fluxo de criação de produto funcionando

### BUG-2 — Headers de segurança

Validação registrada no relatório:

- `Strict-Transport-Security` presente
- `X-Frame-Options` presente
- `X-Content-Type-Options` presente
- `Referrer-Policy` presente
- `Permissions-Policy` presente

### BUG-3 — Mensagem de cobrança

- nome da cliente presente
- item e quantidade presentes
- total presente
- fallback sem Pix funcionando
- link `wa.me` preservando line breaks

## Smoke tests registrados

- `/` responde
- `/login` responde
- `/auth/callback` não retorna 404
- `/app/hoje` mantém proteção por autenticação
- layout principal permanece funcional

## Observações

- a validação reportada indica sucesso do workflow automático
- o release foi considerado apto para teste externo pequeno
