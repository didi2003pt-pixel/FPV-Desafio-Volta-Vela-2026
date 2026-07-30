# Fase 0 — Auditoria das Fontes

- **Projeto:** Desafio Volta à Vela 2026
- **Versão da auditoria:** 1.2.0
- **Atualizado em:** 2026-07-29T17:20:00+01:00
- **Âmbito:** exclusivamente Fase 0; sem interface pública e sem importação de resultados.

## Atualização 1.2 — lista de inscritos e tripulantes

Foi auditado o ficheiro `LISTA DE INSCRITOS E TRIPULANTES.VAP (2).pdf` com **201 linhas individuais** distribuídas pelas **30 embarcações**.

Por conter nomes, estados de licença, pagamentos e notas administrativas, o documento foi classificado como **INTERNAL_RESTRICTED**. Nenhum nome de tripulante foi copiado para os CSV, JSON ou workbook gerados.

Resumo:
- licenças marcadas como válidas: 200;
- pagamentos marcados como Sim: 200;
- linhas marcadas como COMPLETO: 198;
- linhas com observação não completa: 3;
- linhas com registo de embarcação incoerente: 1.

Anomalias:
- **Mar de Levante:** uma linha usa `E26`, embora o registo esperado seja `E25`; `E26` pertence ao Sete Estrelo.
- **BIÃO II:** uma linha tem licença e pagamento em branco e nota de pagamento pendente.
- **First Way:** uma linha tem faturação pendente.
- **Mar de Levante:** uma linha tem dados de faturação pendentes.

## Resultado executivo global

A auditoria consolida **30 embarcações**: **22 ANC** e **8 ORC**. Os 30 números de barco estão preenchidos, são únicos e foram confirmados através das capturas da tabela Excel.

Pendências técnicas principais:
- certificado do IBERO'S em falta;
- PDF original do FAROFINO em falta;
- certificado válido do AZUL XL em falta;
- conflitos documentais de números de vela já registados;
- correção da linha E26/Mar de Levante na lista de tripulantes.

## Entregáveis de dados

- `fase0_embarcacoes_consolidadas.csv` e `.json` — identidade e participação.
- `fase0_participacao_etapas.csv` — matriz das oito etapas.
- `fase0_resumo_tripulacoes.csv` — contagens agregadas, sem nomes.
- `fase0_auditoria_tripulacoes.json` — auditoria e anomalias, sem nomes.
- `fase0_inventario_ficheiros.csv` — inventário e hashes.
- `fase0_conflitos.csv` — conflitos documentais e operacionais.
- `fase0_decisoes_validacao_humana.csv` — decisões pendentes.
- `fase0_dados_privados_excluir.csv` — política de exclusão.
- `fase0_esquema_normalizado.schema.json` — esquema dos dados de embarcações.
- `fase0_analise_sailti.json` — estratégia de integração.

## Integração Sailti

Mantém-se a prioridade: API ou exportação oficial estruturada; depois importação de ficheiro; leitura HTML autorizada apenas como alternativa; introdução manual auditada como fallback.

## Privacidade

Nomes de tripulantes, licenças individuais, pagamentos, faturação, contactos, assinaturas, nomes de staff e notas internas não podem entrar no frontend público, seeds, rankings, cartões partilháveis ou APIs públicas.

## Estado

**Atualização concluída. A lista de tripulantes foi incorporada apenas em formato agregado e restrito. Não foi iniciada a Fase 1.**