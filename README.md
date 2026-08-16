# Arssony RPG 3D — Juramento de Ferro

> Um protótipo de RPG de ação em terceira pessoa para navegador. Arssony alterna entre espada, lâminas gêmeas, arco e lança para limpar o Círculo de Cinzas na rota de Movium.

## O que já está jogável

| Sistema | Implementação |
|---|---|
| **Exploração 3D** | Clareira de floresta com ruínas, pinheiros, pedras, estandartes rúnicos e arena de combate. A rota e o nome de Movium reinterpretam o mapa de campanha fornecido. |
| **Arssony em 3D** | Personagem construído de forma procedimental, inspirado no cabelo prateado, marca vermelha, manta de pele, detalhes de osso e armas das referências fornecidas. |
| **Espada** | Golpe equilibrado, dano estável e curto alcance. |
| **Lâminas gêmeas** | Ataque mais veloz, com dois impactos e rastro vermelho. |
| **Arco** | Flecha ritual física, alcance longo e munição limitada. |
| **Lança** | Estocada pesada, dano alto e maior alcance corpo a corpo. |
| **Inimigos** | Sentinelas de cinza e guardiões de osso com perseguição, ataque, vida, derrota e ressurgimento. |
| **HUD** | Vida, objetivo, minimapa de Movium, arma equipada, flechas e botões de apoio. |
| **Demonstração** | A rota `/?demo` inicia uma sequência determinística de movimento, troca de armas e ataques para fins de captura e validação. |

## Controles

| Ação | Teclado | Alternativa |
|---|---|---|
| Mover Arssony | `W`, `A`, `S`, `D` ou setas | — |
| Atacar | `Espaço` | clique esquerdo ou botão **Atacar** |
| Espada | `1` | seleção no HUD |
| Lâminas gêmeas | `2` | seleção no HUD |
| Arco | `3` | seleção no HUD |
| Lança | `4` | seleção no HUD |
| Alternar arma | `Q` | botão **Trocar** |

## Como executar localmente

O projeto usa **React**, **TypeScript**, **Vite** e **Babylon.js**.

```bash
pnpm install
pnpm dev
```

Abra a URL indicada pelo Vite. Para iniciar o modo de apresentação automático, abra:

```text
http://localhost:3000/?demo
```

## Validação e compilação

```bash
pnpm check
pnpm build
```

## Publicar no GitHub

Depois de criar um repositório vazio no GitHub, execute os comandos abaixo na pasta do projeto e troque a URL pelo seu repositório:

```bash
git add .
git commit -m "feat: cria protótipo jogável Arssony RPG 3D"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/arssony-rpg.git
git push -u origin main
```

Se preferir usar a hospedagem gerenciada do ambiente de projeto, crie uma versão e clique em **Publish** no painel de gerenciamento. Para publicar externamente, o GitHub Pages, Netlify ou Vercel podem servir o resultado do comando `pnpm build`; mantenha os arquivos de mídia nos URLs gerenciados já configurados no código.

## Estrutura relevante

```text
client/src/
├── components/
│   ├── GameCanvas.tsx       # ciclo de vida do Babylon e canvas
│   └── GameHud.tsx          # HUD, tela inicial e controles por botão
├── game/
│   ├── scene.ts             # cenário, câmera, iluminação e geometria do mundo
│   ├── GameWorld.ts         # combate, projéteis, inimigos e estado do HUD
│   ├── Player.ts            # Arssony procedimental e troca de armas
│   ├── Enemy.ts             # sentinelas e guardiões
│   ├── InputManager.ts      # ações de teclado, mouse e HUD
│   ├── weapons.ts           # atributos das quatro armas
│   └── assets.ts            # URLs dos recursos visuais
├── PLAN.md                  # fatias de risco e critérios de aceitação
├── STRUCTURE.md             # arquitetura de módulos
├── ASSETS.md                # catálogo visual e dimensões
└── MEMORY.md                # decisões e limitações
```

## Notas sobre referências e direitos

As imagens e a configuração pública do Hero Forge fornecidas pelo usuário foram usadas apenas como referência estética. O personagem do jogo é uma **representação original em geometria procedimental**, sem exportar, copiar ou extrair um modelo do Hero Forge. O arquivo de mapa original contém conteúdo incorporado externo; o jogo utiliza somente a inspiração cartográfica, nomes e estrutura de rota, sem executar esses elementos externos.

## Próximos incrementos sugeridos

Uma continuação natural é expandir a rota de Movium para áreas conectadas, adicionar missões, inventário, efeitos sonoros ativados por gesto, progresso salvo e modelos animados originais. Esses itens foram deliberadamente deixados fora do primeiro protótipo para manter esta versão pequena, responsiva e verificável no navegador..
