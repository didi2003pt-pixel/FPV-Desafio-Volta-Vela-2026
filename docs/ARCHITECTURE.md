# Arquitetura — Fase 2

```text
Browser
  → Next.js App Router
    → Server Components
    → Server Actions
      → sessão e autorização
      → validação Zod + domínio @desafio/game
      → transação Prisma serializável
        → PostgreSQL
      → AuditLog + PredictionRevision
    → POST /api/cron/close-markets
      → fecho de mercados + bloqueio de previsões
```

## Módulos

- `apps/web`: páginas públicas, perfil, jogo e administração.
- `packages/game`: regras puras de abertura, seleção, pergunta e snapshots.
- `packages/database`: Prisma, migrações, seeds e fecho automático.
- `packages/auth`: palavras-passe, tokens e validação de conta.
- `packages/config`: ambiente e segredos.
- `packages/ui`: componentes acessíveis.

## Fronteiras

A Fase 2 grava previsões, mas não conhece resultados nem atribui pontos. A Fase 3 deverá consumir as previsões bloqueadas e resultados oficiais, sem alterar os snapshots históricos.

## Consistência

- `@@unique([userId, marketId])`: uma previsão por utilizador e mercado.
- `@@id([predictionId, position])`: uma escolha por posição.
- `@@unique([predictionId, boatId])`: não repetir embarcação no pódio.
- transação `Serializable` na submissão;
- relógio do servidor e janela fechada no instante `now >= closesAt`;
- revisões guardam antes/depois;
- alterações administrativas relevantes entram em `audit_logs`.
