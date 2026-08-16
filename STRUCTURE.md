# Estrutura Técnica — Arssony RPG 3D

## Princípio de camadas

> React emoldura a experiência; Babylon.js desenha a cena; as classes em `client/src/game` detêm as regras do jogo.

| Módulo | Responsabilidade |
|---|---|
| `components/GameCanvas.tsx` | Inicializa o motor uma única vez, redimensiona o canvas e descarta recursos ao sair da página. |
| `components/GameHud.tsx` | Mostra vida, arma ativa, instruções, objetivo e estado de início sem conter regras de combate. |
| `game/scene.ts` | Cria a cena, câmera, luzes, mundo, materiais e ciclo de atualização; expõe `createGameScene`. |
| `game/GameWorld.ts` | Coordena jogador, inimigos, projéteis, danos, objetivos, modo demonstração e descarte. |
| `game/Player.ts` | Mantém malhas de Arssony, movimento, arma ativa, ataque e vida. |
| `game/Enemy.ts` | Mantém uma criatura hostil, vida, perseguição, ataque simples, dano e respawn. |
| `game/Weapon.ts` | Declara estatísticas e comportamentos para espada, lâminas gêmeas, arco e lança. |
| `game/InputManager.ts` | Converte teclado, mouse e botões de HUD em ações sem espalhar verificações de teclas. |
| `game/assets.ts` | Centraliza URLs das imagens geradas e constantes de material. |

## Fluxo de atualização

`scene.onBeforeRenderObservable` chama `world.update(delta)`. O mundo lê as ações semânticas de entrada, atualiza a posição e a apresentação de Arssony, processa ataques e projéteis, depois move inimigos e atualiza a ponte de estado que alimenta o HUD React.

## Dados principais

| Conceito | Dados essenciais |
|---|---|
| Arma | nome, atalho, alcance, dano, recarga, quantidade de golpes, tipo de ataque e cor de rastro. |
| Jogador | posição, direção, vida, arma ativa, estado de ataque e tempo de recarga. |
| Inimigo | posição, vida, velocidade, alcance, atraso de golpe, raio corporal e tempo de ressurgimento. |
| Projétil | malha, vetor de velocidade, dano, tempo de vida e alvo possível. |
| Estado HUD | vida, arma, munição, objetivo, mensagem transitória e estado de início. |

## Recursos visuais

As imagens geradas são carregadas por URL de armazenamento gerenciado. O mapa original não é carregado diretamente porque contém iframes externos; os seus dados visuais são reinterpretados no minimapa e na descrição da rota, sem executar conteúdo incorporado.
