# Arquitetura

```text
Browser
  → Next.js App Router
    → server actions / route handlers
      → sessão e autorização
      → Prisma Client 7 + adapter-pg
        → PostgreSQL 18
      → Redis (rate limit, futuras filas/cache)
      → SMTP/Mailpit (email)
      → S3/MinIO (documentos futuros)
```

## Módulos

- `apps/web`: aplicação e controlos administrativos iniciais.
- `packages/auth`: hashing, tokens e validação.
- `packages/config`: validação de ambiente.
- `packages/database`: schema, migração, cliente e seeds.
- `packages/ui`: componentes acessíveis e tokens de marca.
- `packages/testing`: utilitários de testes.

O domínio de previsões será acrescentado numa migração própria na Fase 2. Resultados, pontuação e rankings ficam numa migração da Fase 3, evitando uma migração inicial impossível de rever.
