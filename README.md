# KOF ARENA

Protótipo inicial da plataforma 1v1 para KOF 2002.

## Estado atual
Interface de salas, criação de sala e entrada; aceite obrigatório dos termos; fluxo de pagamento e resultado simulados; cálculo de taxa de 10% do pote.

## Próximas etapas
1. Integrar emulador browser-based com controles.
2. Integrar netplay/matchmaking.
3. Backend para partidas e estado.
4. Provedor PIX com webhook.
5. Liberar partida somente após confirmação dos dois pagamentos.
6. Liquidar prêmio automaticamente ao vencedor, com idempotência.
7. Revisar requisitos legais, pagamentos e direitos do jogo antes de uso público/comercial.

## Rodar localmente
python -m http.server 8080

Não inclua ROMs protegidas por direitos autorais no repositório.