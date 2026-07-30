# Desafio Volta à Vela 2026 — Fase 4

Implementação do domínio de **resultados, integração Sailti, pontuação auditável e classificações** sobre a fundação e o jogo das Fases 1 e 2.

Nenhum resultado real foi importado neste pacote. Os resultados provisórios antigos recebidos na auditoria continuam excluídos.

## Arranque local

Requisitos:

- Node.js 24 LTS ou superior;
- npm 10 ou superior;
- Docker com PostgreSQL, Redis, MinIO e Mailpit.

```bash
cp .env.example .env
# definir AUTH_PEPPER, CRON_SECRET, RESULTS_CRON_SECRET e credenciais locais
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
- resultados: `http://localhost:3000/admin/resultados`
- regras: `http://localhost:3000/admin/pontuacao`
- classificações: `http://localhost:3000/classificacoes`
- Mailpit: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`

## Fluxo operacional de uma etapa

1. Configurar horários e abrir o mercado ANC/ORC.
2. Fechar o mercado antes de receber resultados.
3. Em `/admin/resultados`, carregar CSV, JSON ou XRR/XML; em emergência, criar resultado manual.
4. Rever todas as correspondências entre linhas externas e embarcações.
5. Guardar a resposta oficial da pergunta especial, quando aplicável.
6. Confirmar o resultado como provisório ou oficial.
7. Executar o cálculo da pontuação.
8. Rever o ranking por etapa, geral, cidade e clube.
9. Quando o resultado oficial mudar, importar a nova fonte e criar uma nova versão; nunca editar a versão anterior.

O sistema rejeita a confirmação enquanto o mercado não estiver `CLOSED`.

## Integração Sailti

A aplicação usa uma interface substituível de fornecedores:

- `SailtiApiProvider` — reservado para API autorizada;
- `SailtiXrrProvider` / XRR — ingestão XML estruturada;
- `SailtiFileProvider` — CSV, JSON e XRR/XML;
- `SailtiHtmlProvider` — deliberadamente desativado sem autorização;
- `ManualResultsProvider` — fallback auditado.

A correspondência usa, por ordem: identificador externo, número de vela, número de barco, nome/alias e revisão manual.

## Pontuação inicial

- vencedor exato: 100;
- segundo exato: 75;
- terceiro exato: 75;
- embarcação no pódio noutra posição: 40;
- surpresa no top 5: 60;
- pergunta especial correta: 50;
- participação em todas as etapas elegíveis: 100.

Cada atribuição é guardada em `score_events`, com explicação, regra, cálculo e resultado de origem. Os valores podem ser versionados no painel; uma alteração cria uma nova versão, não reescreve a anterior.

## Classificações

- geral por classe;
- etapa por classe;
- cidade — média dos melhores 10;
- clube — média dos melhores 10.

Os snapshots provisórios e definitivos são separados. O desempate individual usa acertos de vencedor, posições exatas, surpresas, perguntas, erro numérico e instante da última previsão.

## Feature flags

O seed mantém os novos módulos desligados até validação operacional:

- `result_imports_enabled=false`
- `results_enabled=false`
- `rankings_enabled=false`
- `sailti_sync_enabled=false`

## Operações automáticas

Fecho dos mercados:

```bash
npm run markets:close
```

Recálculo de resultados pendentes:

```bash
npm run results:recalculate
```

Ou através do endpoint protegido:

```bash
curl -X POST http://localhost:3000/api/cron/recalculate-results \
  -H "Authorization: Bearer $RESULTS_CRON_SECRET"
```

## Validação

```bash
npm run verify:foundation
npm run verify:phase2
npm run verify:phase3
npm test
npm run typecheck
npm run build
```

## Limitações antes de produção

O ambiente onde o pacote foi gerado não conseguiu instalar as dependências npm, criar o cliente Prisma, executar PostgreSQL/Docker nem produzir o build Next.js. O repositório foi verificado estruturalmente e os módulos puros foram compilados/testados, mas a passagem por CI com Node 24, base de dados real e testes end-to-end continua obrigatória.


## Fase 4
Missões, prémios, notificações e cartões sociais estão implementados. Execute `npm run verify:phase4`.
