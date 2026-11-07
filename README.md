# Estúdio Família Amorin · Natal em 360°

Tour virtual do Estúdio Família Amorin, em Maringá, com exportação 3DVista e interface externa de vidro, verde, cobre e dourado.

## Executar

Sirva esta pasta por HTTP. A entrada é `index.html`; `tour/index.htm` contém o player exportado do 3DVista. A seleção de cenários usa a instância `tour` e `setMediaByIndex()` do próprio player, em um iframe da mesma origem.

## Atualizar o tour

1. Preserve o projeto `.vtp` e a exportação anterior.
2. Exporte o 3DVista para uma nova pasta e valide a navegação.
3. Atualize apenas a pasta `tour/`, preservando a interface externa.
4. Atualize `scenes.json` se houver alteração na ordem ou quantidade de panoramas.
5. Teste a versão local e o endereço público, incluindo agenda e dispositivos físicos.

A arte original em `assets/capa-natal.png` é o thumbnail do projeto. O carregamento usa a nova composição centralizada: `assets/capa-carregamento-desktop.png` e `assets/capa-carregamento-mobile.png`. Seus originais vetoriais também estão em `assets/`. No VTP, a imagem usa ajuste dentro e alinhamento central; na publicação, `loading-skin.css` escolhe a versão vertical em telas de retrato. Preserve o link a esse CSS no índice externo do player após uma nova exportação.

## Agenda

O botão abre a agenda pública do Google Calendar em um diálogo com botão de fechamento, tecla Escape, link externo alternativo e opção “Manter aberta”. O diálogo fecha após 15 segundos de inatividade **na interface externa**. O Google não permite observar eventos internos do iframe de outra origem; o temporizador pausa enquanto o cursor ou o foco está na agenda, evitando perda de preenchimento. O fechamento não cancela um agendamento já confirmado no Google.

## Música

O arquivo válido `videoplayback.m4a` fornecido pelo usuário foi copiado para `assets/trilha-natal.m4a`: AAC estéreo, aproximadamente 2 min 8 s. `audio.json` configura essa faixa em loop, com volume inicial de 22%. A reprodução começa após “Explorar em 360°”, a primeira interação com o panorama ou o botão de som; o botão permite pausar e retomar. A reprodução pausa quando a aba perde visibilidade.

No VTP, a mesma faixa está configurada pelo usuário em Música de Fundo, com repetição. A versão web atual reproduz a trilha pela interface externa. Após futuras exportações com áudio nativo, confira que apenas uma fonte está tocando para evitar duplicação.

## Arquivos publicados

Inclui somente a versão web do tour, a skin e os recursos visuais usados. Fotografias RAW, panoramas originais, arquivo nativo, cópias de segurança e auditoria ficam fora do repositório público. Os WebP estáticos foram recomprimidos em qualidade 85, preservando as dimensões; player JavaScript, índices de tiles e arquivos animados não foram alterados por essa otimização.

Endereço conferido no perfil Google informado pelo cliente: Rua Joaquim Nabuco, 810, Zona 04, Maringá–PR.

Criação: MG Tour 360°. Fotografias e identidade visual: seus respectivos titulares. Não há licença genérica de reutilização das imagens ou da marca.
