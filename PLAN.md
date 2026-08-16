# Plano do Jogo — Arssony RPG 3D

## Visão

O protótipo é um RPG de ação em terceira pessoa para navegador. Arssony explora uma clareira ligada ao mapa de campanha fornecido, enfrenta guardiões e alterna em tempo real entre espada, lâminas gêmeas, arco e lança. A versão inicial foca em uma área compacta, completa e jogável, em vez de prometer um mundo aberto incompleto.

## Fatias de risco

### 1. Personagem 3D procedimental e troca visual de armas

- **Por que está isolado:** o herói precisa manter leitura clara enquanto quatro arsenais diferentes aparecem, somem e realizam ataques sem exigir um modelo 3D proprietário ou rig importado.
- **Abordagem:** construir Arssony com malhas primitivas compostas — corpo, manta de pele, detalhes de osso e cabelo prateado — e agrupar as armas em nós próprios. A arma ativa é visível nas mãos; as não equipadas aparecem como equipamento nas costas quando apropriado. Os ataques usam transformações curtas e rastros de partículas, não animação esquelética.
- **Verificação:** cada atalho troca imediatamente o modelo visível e o rótulo do HUD; ataques de espada, lâminas gêmeas, arco e lança terminam sem deixar armas duplicadas ou presas em poses intermediárias.

### 2. Combate de alcance múltiplo e respostas inimigas

- **Por que está isolado:** o combate combina colisão por distância, projéteis, tempos de recarga e inimigos que avançam ao jogador; erros de estado podem causar múltiplos danos no mesmo golpe ou ataques sem retorno visual.
- **Abordagem:** centralizar o estado de combate em `GameWorld`, com janela de acerto por ataque, lista de projéteis com tempo de vida e inimigos com aproximação, pausa de golpe, dano e reaparecimento controlado.
- **Verificação:** espada e lâminas acertam apenas dentro do alcance; lança mantém alcance maior; arco cria flecha visível e acerta à distância; o mesmo ataque não aplica dano repetidamente; inimigos perdem vida, reagem e retornam após derrota.

### 3. Câmera de terceira pessoa e deslocamento no cenário

- **Por que está isolado:** uma câmera que acompanha o jogador sem se mover com solavancos é essencial para a leitura do combate e pode conflitar com movimento do teclado e composição da cena.
- **Abordagem:** usar câmera orbital suave com alvo interpolado e limites verticais; WASD cria um vetor relativo ao plano horizontal da câmera, com direção visual de Arssony orientada à marcha.
- **Verificação:** andar em cada direção corresponde ao comando pressionado, a câmera mantém o personagem em quadro, a troca entre parado → caminhando → atacando não causa teleporte visual e o modo `?demo` percorre uma rota demonstrável sem interação.

## Construção principal

O cenário inclui uma clareira de floresta, um círculo rúnico de combate, estandartes vermelhos, ruínas, pedras altas e uma leitura abstrata da campanha de **Movium**, local identificado no mapa fornecido. O mapa original tem 1024×625 px e 58 marcadores; ele será reinterpretado como minimapa/rota de exploração segura, sem incorporar os iframes externos contidos no arquivo de origem.

O jogador controla Arssony com **WASD** ou setas. **1–4** alternam o equipamento e **Q** percorre as armas. Clique esquerdo ou **Espaço** ataca. A espada simples aplica um golpe equilibrado, as lâminas gêmeas disparam uma sequência veloz, o arco projeta flechas e a lança oferece alcance maior. Um HUD mostra vida, instruções, arma equipada, munição do arco e objetivo atual. Um botão de início torna o jogo acessível em navegadores que só liberam foco no canvas depois de uma interação.

- **Recursos necessários:** referência de cena, símbolo de arma, retrato de Arssony, textura de solo da floresta e estandarte rúnico; modelos de personagem, inimigos, ruínas, árvores, pedras e armas serão compostos procedimentalmente.
- **Verificação:** controles são legíveis, o HUD não encobre o combate, nenhum recurso gerado fica em placeholder, a paleta segue verdes frios, ardósia e vermelho de juramento, e o personagem se mantém distinguível no cenário.
- **Verificação final:** executar `pnpm check` e `pnpm build`; confirmar pelo modo `?demo` que o cenário, personagem, inimigos, HUD e combate aparecem em uma captura sem erros do console.

## Limites deliberados da primeira versão

Esta entrega é um protótipo jogável de RPG de ação para web. Ela não inclui narrativa longa, inventário persistente, salvamento, rede, áudio, modelo 3D extraído do Hero Forge, ou um mundo aberto completo. A configuração pública do Hero Forge e as imagens fornecidas são usadas apenas como referências de aparência para uma representação original e procedimental.
