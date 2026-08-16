# Memória de Produção — Arssony RPG 3D

## Referências recebidas

O usuário forneceu três vistas de Arssony e uma configuração pública do Hero Forge. A leitura visual estabelecida para o herói é: pele escura, cabelo curto prateado, marca vermelha na testa, manta preta de pele, detalhes de osso e ferro, tiras de couro, espadas curtas e lança vermelha. Essa referência guiará uma versão original e procedimental em 3D.

O arquivo `mapaatualdoprojetoarasony.map` foi identificado como um mapa em SVG/HTML de 1024×625 pixels, contendo 58 marcadores e conteúdo incorporado externo. A integração será temática e segura: a rota e os topônimos inspiram o mundo; iframes e conteúdo remoto do arquivo não serão carregados pelo jogo.

## Decisões técnicas

1. Babylon.js renderiza a cena; React apenas hospeda o canvas e o HUD.
2. O personagem não usa modelo GLB ou dados extraídos do Hero Forge. Malhas primitivas e texturas geradas recriam a silhueta de modo original.
3. O jogo mantém uma área de combate densa e uma demonstração determinística em `?demo` para facilitar verificação visual.
4. As imagens geradas usam URLs de armazenamento e jamais serão copiadas para o diretório de build do projeto.
