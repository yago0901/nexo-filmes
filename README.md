# Nexo Filmes

Portal de catálogo de filmes construído como micro-frontends (Module Federation + Rsbuild), consumindo a API pública da TMDB e guardando os dados do usuário no navegador através de um repositório simulado.

Este repositório foi desenvolvido como parte da segunda fase de um processo seletivo para Desenvolvedor(a) Front-end (React + TypeScript). O enunciado pede três times evoluindo partes diferentes do portal em ritmos distintos — por isso a arquitetura é de micro-frontends desde o início.

## Como rodar

Na raiz do projeto, execute:

pnpm install
pnpm dev

Abra http://localhost:3000.

Dois comandos apenas (requisito do desafio). O `pnpm dev` sobe os quatro apps em paralelo: Shell na porta 3000, Catálogo na 3001, Filme na 3002 e Minha Área na 3003.

## Variáveis de ambiente

Crie um `.env` na raiz do projeto com:

PUBLIC_TMDB_TOKEN=seu_token_aqui

Gere o API Read Access Token em https://www.themoviedb.org/settings/api. Veja `.env.example`. O `.env` está no `.gitignore` e não vai para o repositório.

Como o projeto é um monorepo com micro-frontends que compartilham o mesmo token da TMDB, optamos por um único `.env` na raiz — os apps leem a variável a partir daí. Isso evita duplicação e mantém a chave num só lugar.

Nota sobre segurança: o Rsbuild só expõe ao navegador variáveis com prefixo `PUBLIC_`, então o token fica visível no bundle. Em produção o ideal seria um BFF escondendo a chave — está registrado na seção "O que ficou de fora".

## Stack

- Monorepo: pnpm workspaces
- Bundler + MFE: Rsbuild + Module Federation (`@module-federation/rsbuild-plugin` + `@module-federation/enhanced`)
- UI: React 19 + TypeScript em modo strict
- Roteamento: React Router (única instância no Shell)
- Estado assíncrono: TanStack Query
- Formulários: React Hook Form + Zod
- Testes: Vitest + Testing Library + jsdom
- Estilo: design system próprio em `@nexo/ui` (CSS variables, sem framework)

## Arquitetura

nexo-filmes/
├── apps/
│   ├── shell/         (porta 3000: cabeçalho, menu, 404, roteamento)
│   ├── catalogo/      (porta 3001: lista, busca, filtro por gênero)
│   ├── filme/         (porta 3002: detalhe, favorito, avaliação)
│   └── minha-area/    (porta 3003: favoritos, painel, contador do cabeçalho)
└── packages/
    ├── shared-types/  (@nexo/shared-types: apenas tipos)
    ├── user-data/     (@nexo/user-data: repositório simulado)
    ├── tmdb/          (@nexo/tmdb: cliente HTTP + mapeadores)
    └── ui/            (@nexo/ui: design system)

### Micro-frontends

Estratégia escolhida: Module Federation com `@module-federation/rsbuild-plugin` e runtime `@module-federation/enhanced`.

Motivos:

1. Runtime nativo do Rsbuild, com HMR funcionando em cada remote de forma independente.
2. Remotes registrados em runtime (`registerRemotes` + `loadRemote`), não declarados no build do Shell — isso é essencial para que a queda de um remote não derrube a página inteira (ver "Isolamento de falhas").
3. `shared: { singleton: true }` em `react`, `react-dom` e `react-router-dom` — garante uma única cópia do React e do roteador na página.
4. Entrada assíncrona (`import('./bootstrap')`) em Shell e remotes — obrigatória para evitar o erro `RUNTIME-006`.

### Comunicação entre micro-frontends

Nenhum micro-frontend importa código de outro. A comunicação acontece por três canais:

- URL: rotas (`/filmes`, `/filme/:id`, `/favoritos`, `/painel`) e filtros (`?q=&genero=&pagina=`).
- Eventos (`CustomEvent`): `nexo:favoritos-alterados`, `nexo:favorito-falhou`, `nexo:avaliacao-alterada`.
- Pacote de tipos: `@nexo/shared-types` — só interfaces, nenhuma lógica.

O `@nexo/user-data` é um pacote de biblioteca, não um MFE. Ele é consumido por todos os remotes que precisam ler/escrever dados do usuário.

### Isolamento de falhas

Cada remote no Shell é carregado dentro de um componente `Remote` que combina:

- `React.lazy` + `Suspense` (carregamento)
- Error Boundary (captura erros de carregamento e de renderização)

Se um remote cair, só a área dele mostra "Tentar novamente" com o botão de retry. O cabeçalho, o menu e as outras áreas continuam funcionando.

No cabeçalho, o contador é um `Remote` em modo compacto: se `minha-area` estiver fora do ar, aparece "Contador indisponível." com um botão pequeno — sem derrubar o resto do cabeçalho.

Lição aprendida: declarar `remotes` no `rsbuild.config.ts` do Shell derruba a página inteira quando um remote está offline — o runtime busca o `mf-manifest.json` antes do React renderizar e lança `RUNTIME-003` (tela branca, sem CSS). A solução foi registrar os remotes em runtime no `remotes.ts` e deixar a falha acontecer dentro do `lazy`, onde o Error Boundary captura.

## Decisões de arquitetura

### 1. Onde ficam os dados do usuário (`@nexo/user-data`)

Favoritos e avaliações ficam no `localStorage`, atrás de um repositório simulado. Esse repositório vive num pacote de biblioteca separado (`@nexo/user-data`), e não dentro de um dos remotes.

Por quê?

- Nenhum micro-frontend acessa o `localStorage` diretamente — requisito do enunciado. Toda leitura/escrita passa pelo pacote.
- Coerência entre telas — como todos os remotes importam o mesmo pacote, o estado é único na página (com um cuidado extra: o pacote precisa ser `singleton` no Module Federation, senão cada remote teria sua própria cópia).
- Simplicidade — a alternativa mais estrita seria a `minha-area` ser dona dos dados, e os outros falarem por eventos. Isso é viável, mas exige sincronização manual de estado em cada remote. Optamos por um pacote compartilhado que faz o trabalho uma vez.

Requisitos do repositório simulado (atendidos):

- Toda operação é assíncrona, com atraso aleatório de 300 ms a 1500 ms.
- Toda escrita em filme cujo id termina em 13 falha com `ErroEscritaSimulado`.
- Atraso e falha são configuráveis por variável de ambiente (`PUBLIC_REPO_DELAY`, `PUBLIC_REPO_FAIL`) e desligados nos testes.

### 2. Acesso único ao localStorage

O `@nexo/user-data` é o único ponto do código que toca `localStorage`. Ele é organizado em camadas:

- `armazenamento.ts`: wrapper do localStorage (só este arquivo toca `window.localStorage`).
- `repositorio.ts`: lógica de negócio (atraso, falha no id 13, uma avaliação por filme).
- `store-global.ts`: singleton em `globalThis` (uma única instância por página).
- `hooks.ts`: hooks React (`useFavoritos`, `useAvaliacoes`, etc.) via `useSyncExternalStore`.

### 3. Singleton no Module Federation

`react`, `react-dom` e `react-router-dom` estão como `singleton: true` no `shared` de todos os apps (Shell e remotes). Isso garante:

- Uma só cópia do React na página (evita "invalid hook call").
- Um só `BrowserRouter` — o Shell é o único dono do roteador; os remotes expõem apenas componentes.

Também colocamos `@nexo/user-data` como singleton, para que todos os remotes compartilhem a mesma instância do store (se não, cada remote teria seu próprio estado e o contador do cabeçalho não reagiria às mudanças de outros remotes).

### 4. Busca e filtro de gênero são excludentes

Decisão: ao digitar na busca, o filtro de gênero é limpo automaticamente (com aviso). Ao escolher um gênero, a busca é limpa.

Por quê? A API da TMDB não permite combinar as duas coisas:

- `/search/movie?query=...` não aceita `with_genres`.
- `/discover/movie?with_genres=...` não aceita `query`.

Filtrar por gênero no cliente seria possível, mas quebraria a paginação (a TMDB pagina por 20, e o cliente teria que paginar de novo). A solução mais honesta é deixar os dois excludentes e avisar o usuário.

### 5. Favoritar otimista com rollback

Favoritar/desfavoritar muda a tela na hora, antes do repositório responder. O botão fica em estado "salvando" (`aria-busy="true"`, `disabled`). Se o salvamento falhar:

1. O estado volta ao que era antes.
2. Um evento `nexo:favorito-falhou` é emitido.
3. O Shell escuta e mostra um aviso em `aria-live="assertive"` por 6 segundos.

Testável com filme de id 13 (ou qualquer id terminado em 13).

### 6. Validação do formulário de avaliação

- Zod com schema (`esquemaAvaliacao`) definindo:
  - Nota obrigatória, de 0,5 a 10, em passos de 0,5.
  - Comentário opcional, até 500 caracteres.
- React Hook Form integra o schema via `@hookform/resolvers`.
- Cada campo tem mensagem própria (`aria-invalid`, `aria-describedby`).
- Com dados inválidos, o foco vai para o primeiro campo inválido.
- O que o usuário digitou nunca é perdido — nem em caso de falha de salvamento (o rascunho do comentário permanece).

### 7. Camada anti-corrupção da TMDB

Os componentes não conhecem o formato da TMDB. Tudo passa por `@nexo/tmdb`:

TMDB (JSON cru) → mapeadores.ts → Domínio (`@nexo/shared-types`: `Filme`, `FilmeDetalhe`, `Genero`, `Pagina`) → Componentes (React)

Regras de transformação:

- `release_date` vira `ano: number | null`.
- `vote_average` é arredondado para 1 casa (`Math.round(n * 10) / 10`).
- `poster_path` vira URL completa (`https://image.tmdb.org/t/p/w342` na lista, `w500` no detalhe).
- Direção = membros do `crew` com `job === 'Director'`.
- Elenco = primeiros 10 do `cast`, ordenados por `order`.
- Páginas limitadas a 500 (a TMDB não permite mais que isso).
- Gêneros desconhecidos são ignorados.

### 8. Tratamento de 429 (limite de requisições)

O cliente TMDB lança `ErroLimiteRequisicoes` (subtipo de `ErroTmdb`) quando a resposta é 429. O `mensagemDeErro` converte isso em uma mensagem amigável ("Muitas requisições em pouco tempo. Aguarde um instante e tente novamente."), e as telas mostram um botão "Tentar novamente".

A busca por título tem debounce — não faz uma requisição por tecla digitada.

### 9. Estilo próprio (design system)

O template inicial do Rsbuild foi completamente substituído por um design system próprio em `@nexo/ui`:

- Tokens de cor (`--cor-fundo`, `--cor-destaque`, `--cor-nota`…), tipografia, espaçamento, raio e sombra.
- Componentes: `PosterFilme` (com selo de nota), `BotaoFavorito`, estados (`EstadoCarregando`, `EstadoErro`, `EstadoVazio`), `EsqueletoGrade`.
- Utilitários de acessibilidade (`.somente-leitor`).
- Suporte a `prefers-reduced-motion`.

O visual foi inspirado em portais de streaming, com fundo azul-marinho escuro, destaque laranja nas ações e selo dourado nas notas. Cada remote importa o design system e usa apenas as CSS variables — sem CSS global conflitante.

### 10. Organização dos arquivos dentro de src/

Optei por manter os arquivos de cada app diretamente em `src/`, sem subpastas. Com o escopo atual (2 a 5 arquivos por categoria em cada app), subpastas adicionariam navegação sem ganho real, e a distinção entre "tela", "dados" e "estado" fica clara pelo nome do arquivo (`PaginaCatalogo.tsx`, `dados.ts`, `estado-url.ts`).

Em `@nexo/user-data` a divisão já é mais granular, porque lá o número de arquivos é maior (armazenamento, repositório, stores, estado, hooks, eventos) e as camadas são conceitualmente distintas.

Limitação reconhecida: com mais telas e mais domínios, a divisão natural seria por domínio dentro de cada app — por exemplo, em `apps/filme/src/`: `detalhe/`, `avaliacao/` e `comum/`. Não fiz essa divisão agora para não mexer em imports no fim do projeto, com todos os testes passando. É o próximo passo natural de organização, quando o escopo crescer.

## Cobertura do desafio

1. React 19 + TS strict → `tsconfig.base.json` com `strict: true`, `noUncheckedIndexedAccess: true`.
2. Micro-frontends com Shell + 3 remotes → `apps/shell` + `apps/catalogo`, `apps/filme`, `apps/minha-area`.
3. Cada remote roda sozinho → `bootstrap.tsx` com `BrowserRouter` próprio em cada remote.
4. Falha isolada, com retry → `apps/shell/src/components/Remote.tsx` (Error Boundary + `lazy`).
5. Comunicação por URL, eventos e tipos → `@nexo/shared-types`, `CustomEvents`, rotas.
6. Camada anti-corrupção → `packages/tmdb/src/mapeadores.ts`.
7. Validação com schema → `apps/filme/src/esquema-avaliacao.ts` (Zod).
8. Estados, 360 px, teclado → Componentes de estado em `@nexo/ui`, CSS responsivo, foco visível.
9. Testes sem chamar TMDB, 70%+ → Vitest + Testing Library, `fetch` mockado.
10. 2 comandos → `pnpm install` + `pnpm dev`.

### Cobertura de testes (regras de negócio)

- `apps/minha-area`: 93,87%
- `packages/user-data`: 99,46%
- `packages/tmdb`: 98,57%
- `apps/filme`: 91,80%
- `apps/catalogo`: 93,33%
- `packages/ui`: 100%

Rodar com:

pnpm test:coverage

Nenhum teste chama a TMDB real. O `fetch` é substituído por um `fetcher` injetável.

## Testando a falha de escrita (id terminado em 13)

1. Com o site aberto, abra o Console (F12) e cole:

localStorage.setItem('nexo:favoritos', JSON.stringify([{ filme: { id: 13, titulo: 'Forrest Gump', ano: 1994, posterUrl: null, generos: ['Drama'] }, favoritadoEm: '2026-10-01T10:00:00.000Z' }]))

2. Recarregue e vá para `/favoritos`.

3. Clique em "Remover" em Forrest Gump.

4. Comportamento esperado:
   - O filme some na hora e o contador desce.
   - Após 300–1500 ms, ele volta e aparece um aviso vermelho no rodapé: "Não foi possível salvar…".

5. Para limpar: `localStorage.removeItem('nexo:favoritos')`.

O mesmo vale para avaliação: avaliar o filme 13 faz o salvamento falhar e a UI desfaz.

## Diferenciais entregues

- Painel (`/painel`) com total de favoritos, total de avaliados, nota média (1 casa) e gênero mais frequente (empate por ordem alfabética).
- URLs dos remotes resolvidas em runtime — `apps/shell/src/remotes.ts` lê `PUBLIC_*_URL` e faz `registerRemotes`. Em produção, dá para apontar para hosts diferentes sem rebuild.
- Micro-frontends verdadeiramente independentes — cada remote roda sozinho em sua porta, com `BrowserRouter` próprio.

## O que ficou de fora (e por quê)

- BFF para esconder a chave da TMDB — limitado pelo Rsbuild, que só expõe variáveis `PUBLIC_*` no bundle do navegador. Em produção, o correto seria um BFF (Node) que guarda o token e expõe endpoints próprios.
- Ordenação do catálogo (por nota, data, etc.) — não estava na demanda, e adicionaria complexidade ao estado da URL sem ganho claro.
- Excluir avaliação — o enunciado só pede criar e editar. Excluir fica para uma próxima iteração.
- Testes E2E (Playwright/Cypress) — a cobertura de regras de negócio já atende ao requisito. E2E consome tempo desproporcional para o escopo.
- CI (GitHub Actions) — o projeto roda localmente com 2 comandos. CI seria o próximo passo natural.
- Docker — não é exigido, e o monorepo com 4 apps é servido confortavelmente em dev.
- Storybook — o design system é pequeno (5-6 componentes com regra visual). Storybook seria overhead.
- Reorganização de `src/` em subpastas por domínio — registrado no item 10 das decisões. É a evolução natural quando o escopo crescer.

Tudo o que foi entregue funciona; nada está pela metade.

## Scripts

- `pnpm install` — Instala as dependências de todos os pacotes.
- `pnpm dev` — Sobe os 4 apps em paralelo.
- `pnpm build` — Build de produção de todos os apps.
- `pnpm preview` — Serve os builds de produção.
- `pnpm test` — Roda os testes de todos os pacotes.
- `pnpm test:coverage` — Roda os testes com cobertura.
- `pnpm typecheck` — Checa tipos em todos os pacotes.

## Acessibilidade

- Foco visível em todos os elementos interativos (anel laranja, `outline: 3px`).
- Navegação por teclado completa (Tab, Enter, Esc).
- `prefers-reduced-motion` respeitado — sem animações nem transições.
- Link "Ir para o conteúdo" no topo do Shell (aparece ao dar Tab).
- Regiões `aria-live` para o contador de favoritos e para o aviso de falha.
- Contraste mínimo 4,5:1 — texto escuro sobre laranja (o branco sobre laranja não passa em AA).
- Formulário acessível — `aria-invalid`, `aria-describedby`, foco no primeiro campo inválido.

## Créditos

Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB. Dados e imagens de themoviedb.org (https://www.themoviedb.org).