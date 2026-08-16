# Direção de Design — Arssony RPG 3D

## Três direções exploradas

| Tema | Introdução breve | Probabilidade |
|---|---|---:|
| **Grimório de Cinza** | Uma fantasia sombria e artesanal, em que carvão, osso, ferro gasto e vermelho ritual sustentam a jornada de um guerreiro solitário. O mundo parece uma carta de campanha que ganhou profundidade e perigo. | 0,07 |
| **Aurora das Ruínas** | Uma aventura de alta fantasia clara, com vales azuis, arquitetura desmoronada e luzes de amanhecer. A sensação é de descoberta serena antes de um conflito iminente. | 0,04 |
| **Areia do Juramento** | Um RPG de fronteira árida, marcado por pedra ocre, tecidos queimados de sol e relíquias de um antigo império. A violência seria rápida e silenciosa, como uma tempestade no deserto. | 0,09 |

## Abordagem escolhida: Grimório de Cinza

### Movimento de design

**Fantasia sombria ilustrada**, combinando o relevo de mapas de campanha com a materialidade de miniaturas pintadas à mão. A experiência deve parecer uma aventura que emergiu do mapa anexado, sem imitar a interface de um jogo de tabuleiro.

### Princípios centrais

1. **Silhuetas antes de detalhe:** Arssony, inimigos, armas e marcos devem ser identificáveis em movimento por forma e cor.
2. **Matéria imperfeita:** pedra, madeira, ferro e tecido usam variação visual sutil em vez de superfícies limpas e plastificadas.
3. **Perigo legível:** ataque, alcance, vida e arma equipada são sempre compreensíveis sem bloquear a cena.
4. **Exploração conduzida por marcos:** ruínas, pinheiros, obeliscos e caminhos substituem layouts simétricos e genéricos.

### Filosofia de cor

O cenário usa verdes esmaecidos, cinza ardósia e terra fria para deixar o **vermelho de juramento** de Arssony controlar a atenção. O vermelho não é decorativo: ele anuncia aço ativo, dano, foco de combate e identidade do protagonista. O dourado velho aparece apenas em pequenos sinais de descoberta e energia.

### Paradigma de layout

O jogo é visto por uma câmera oblíqua de terceira pessoa. A paisagem se abre por uma rota curva entre floresta, ruínas e um círculo de combate, criando uma progressão espacial em vez de uma arena centralizada. A interface fica em cantos discretos, como placas presas a um códice militar.

### Elementos de assinatura

1. **Estandartes e riscos vermelhos** indicam áreas de conflito, ataques e a identidade de Arssony.
2. **Pedras rúnicas circulares** funcionam como arenas e pontos de interesse.
3. **Molduras de ferro escurecido**, com cortes angulares e marcas de pincel seco, estruturam o HUD.

### Filosofia de interação

Os comandos devem ser diretos, táteis e responsivos. A troca de arma é exibida como uma roda/linha de equipamento em que a opção ativa ganha um risco vermelho; cada arma possui um comportamento distinto e imediatamente reconhecível.

### Animação

Movimento, ataques e projéteis usam aceleração curta e término firme. As armas deixam rastros discretos na cor de assinatura: aço pálido para espada, vermelho para duas espadas, âmbar para arco e branco-osso para lança. A interface evita movimentos constantes; somente o recuo de dano, o pulso de seleção e a entrada das mensagens recebem animação abaixo de 300 ms. Preferências de redução de movimento devem eliminar os efeitos não essenciais.

### Sistema tipográfico

**Cinzel** sustenta títulos, nomes de armas e placas, trazendo um tom ritual sem perder legibilidade. **Barlow Condensed** organiza números, atalhos e instruções de combate. Títulos em caixa alta com espaçamento moderado; textos de apoio em frase curta e clara; números de dano usam peso alto e contraste forte.

### Essência da marca

**Arssony RPG 3D é uma jornada de fantasia sombria para quem quer alternar estilos de combate em um mundo que parece saído de um mapa de campanha.**

Personalidade: **implacável, artesanal, ritualística**.

### Voz de marca

As manchetes são concisas e solenes; CTAs e microtextos soam como ordens de campo, nunca como slogans vazios.

> “Troque o aço. Mude o destino.”

> “O bosque não esquece quem sangrou primeiro.”

### Palavra-marca e logo

O nome **ARSSONY** é tratado como uma inscrição em ferro marcado, com uma runa de duas lâminas cruzadas no lugar de um brasão. O símbolo é independente do texto: duas lâminas verticais abertas por uma fissura vermelha, reconhecível em miniatura.

### Cor de assinatura

**Vermelho de Juramento — #B52F2B.**

## Style Decisions

1. Cada estado principal expõe acima da dobra a marca de Arssony: a runa de lâminas, a inscrição ritual ou a fissura vermelha.
2. O Vermelho de Juramento permanece reservado para conflito, arma equipada, ataque, marca de marca e ação primária; não funciona como enfeite indiferenciado.
3. O minimapa, a clareira, as ruínas, o círculo rúnico e os estandartes formam a gramática espacial obrigatória do mundo, evitando telas escuras sem contexto de campanha.
