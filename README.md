# Desafio Volta à Vela 2026 — Fase 2

Implementação do domínio do jogo: etapas, embarcações, mercados ANC/ORC, pergunta especial, previsões, bloqueio por prazo, perfil do participante e configuração administrativa.

A Fase 2 **não** calcula resultados, pontos ou rankings. Esses módulos pertencem à Fase 3.

## Arranque local

```bash
cp .env.example .env
# alterar AUTH_PEPPER, CRON_SECRET e credenciais locais
npm install
npm run db:generate
docker compose up -d postgres redis minio mailpit
npm run db:deploy
npm run db:seed
npm run dev
```

Serviços locais:

- aplicação: `http://localhost:3000`
- administração: `http://localhost:3000/admin`
- Mailpit: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`
- health: `http://localhost:3000/api/health`
- readiness: `http://localhost:3000/api/ready`

## Preparar uma etapa

1. Abrir `/admin/etapas`.
2. Configurar a partida e o estado da etapa.
3. Configurar as janelas ANC e ORC.
4. Marcar as embarcações surpresa elegíveis.
5. Criar e ativar a pergunta especial.
6. Confirmar que não existem previsões de teste.
7. Ativar `public_game_enabled` e `predictions_enabled` em `/admin/configuracao`.

Não abrir um mercado sem datas completas. O fecho é validado no servidor e pode ser aplicado por cron:

```bash
npm run markets:close
```

Ou através de:

```bash
curl -X POST http://localhost:3000/api/cron/close-markets \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Validação

```bash
npm run verify:foundation
npm run verify:phase2
npm test
npm run typecheck
```

## Regras implementadas

- previsão separada por etapa e classe ANC/ORC;
- vencedor, segundo, terceiro, surpresa e pergunta especial;
- três embarcações distintas no pódio;
- surpresa limitada à lista editorial definida pela organização;
- surpresa fora do pódio por defeito;
- edição apenas até ao prazo do servidor;
- transação serializável e unicidade por utilizador/mercado;
- histórico de revisões e auditoria;
- bloqueio automático de mercados expirados;
- pergunta e elegibilidade bloqueadas após a primeira previsão;
- dados de tripulantes não incluídos.

## Feature flags

O seed deixa o jogo público e as previsões desativados:

- `public_game_enabled=false`
- `predictions_enabled=false`
- `registrations_enabled=false`
- `profiles_enabled=true`
- `preclose_stats_enabled=false`

## Limitação do pacote

O ambiente de geração não instalou dependências npm nem executou PostgreSQL/Docker. O primeiro `npm install` deve gerar e versionar o `package-lock.json`. Depois, executar a migração, o seed, os testes e o build num ambiente com os serviços disponíveis.
