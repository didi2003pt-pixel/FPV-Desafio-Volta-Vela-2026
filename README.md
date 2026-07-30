# Desafio Volta à Vela 2026 — Fundação

Fase 1 do projeto: repositório, PostgreSQL, Prisma ORM, autenticação, design system, Docker, ambientes e seeds oficiais. Não contém previsões, resultados, rankings ou missões.

## Arranque local

```bash
cp .env.example .env
# substituir AUTH_PEPPER e, se necessário, definir SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD
npm install
npm run db:generate
docker compose up -d postgres redis minio mailpit
npm run db:deploy
npm run db:seed
npm run dev
```

Serviços:

- aplicação: `http://localhost:3000`
- Mailpit: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`
- health: `http://localhost:3000/api/health`
- readiness: `http://localhost:3000/api/ready`

## Validação sem dependências

```bash
npm run verify:foundation
```

## Decisões deliberadas

- Node.js 24 LTS.
- Next.js 16 com App Router.
- Prisma ORM 7 com `prisma-client` e driver adapter PostgreSQL.
- PostgreSQL 18.
- Autenticação própria com Argon2id e sessões opacas armazenadas por hash.
- Feature flags públicas desativadas no seed.
- Resultados históricos não são incluídos.

## Limitação do pacote

O ambiente de geração não permitiu descarregar dependências npm. Por isso, não é fornecido `package-lock.json`; deve ser criado no primeiro `npm install` e submetido ao repositório antes de produção.
