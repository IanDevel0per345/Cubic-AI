# Revisão visual do frontend publicado

URL revisada: https://cubic-ai-psi.vercel.app/

A tela pública carregou com o título `Cubic AI`, porém ainda apresentou o fluxo antigo de onboarding: `Add a backend`, campos `Host Name`, `Host`, `API Key`, opção `OpenHands Cloud`, escolha de agente `OpenHands`, configuração de LLM e texto `Send your first message to OpenHands`. A alteração solicitada deve substituir esse gate por uma entrada proprietária da Cubic AI, sem exigir que o usuário informe host, API key ou backend próprio.

A captura inicial mostrou a interface em tema escuro, com o carregamento central do shell; o conteúdo textual completo foi extraído pela navegação da página. A logo enviada pelo usuário deve ser tratada como ativo transparente e integrada ao cabeçalho/sidebar, preservando o estilo geral da interface.

## Revisão da publicação após a integração da logo

Em 18 de agosto de 2026, a URL pública `https://cubic-ai-psi.vercel.app/` respondeu com título `Cubic AI` e carregou o asset `/assets/cubic-ai-logo-transparent-Bs_Nka-4.png`. A sidebar exibiu `Search commands`, `New Matter`, `Resources`, `Automate` e `Conversations`, mas o primeiro carregamento ainda apresentou o modal `Add a backend`, com campos de Host, URL, tipo Local/Cloud e API Key, seguido das etapas `Choose your agent`, `Set up your LLM` e `Say hello`.

A mesma experiência persistiu com o parâmetro de cache-buster `?cachebust=20260818-company-managed`, indicando que a publicação ainda precisa ser diagnosticada antes da entrega final. Não foram observados dados pessoais ou credenciais de aplicação no HTML público.

## Diagnóstico do redeploy final

Após o redeploy forçado com `VITE_COMPANY_MANAGED=true`, o alias público continuou servindo o módulo raiz `root-BWvVYBL_.js` e manteve o modal `Add a backend`. A URL direta do deployment (`cubic-dzap15sga-ian05519375s-projects.vercel.app`) redirecionou para login da Vercel, portanto a validação pública deve continuar sendo feita pelo alias `cubic-ai-psi.vercel.app`.

A build local explícita gerou o módulo raiz `root-B5kzko42.js`; o próximo passo é publicar a pasta de saída local correta/prebuilt, em vez de depender do build remoto/artefato antigo do alias.

## Validação pós-prebuilt

A publicação do artefato prebuilt foi concluída e o alias `cubic-ai-psi.vercel.app` respondeu normalmente, porém a revisão visual com cache-buster ainda mostrou `Add a backend`, `Host`, `API Key`, `OpenHands Cloud` e `Set up your LLM`. A logo transparente continua carregando corretamente. O problema restante está restrito ao gate de entrada/onboarding; a interface shell e o ativo visual já chegam ao público.

## Preview local

O servidor temporário iniciado com `npm start` respondeu `404` em `/` e `/index.html`, mas respondeu `200` em `/client/index.html`. Isso é uma particularidade do diretório de saída atual; o teste visual local será feito no caminho `/client/index.html` para separar o comportamento do código de problemas de rota do servidor.

## Validação visual final

Após o deploy `Bu7YaBt6GHabmUhKxuENbyoq7Rvq`, o alias `https://cubic-ai-psi.vercel.app/?cachebust=20260818-home-no-onboarding` abriu diretamente a home da Cubic AI. A captura mostrou a sidebar com `Search commands`, `New Matter`, `Resources`, `Automate` e `Conversations`, a logo transparente no cabeçalho e a tela principal `Let's work on your legal matter`, com campo de matéria e ações `Open Workspace` e `Plugins`.

Não foram exibidos `Add a backend`, `Host`, `API Key`, `OpenHands Cloud`, `Choose your agent` ou `Set up your LLM`. A navegação para `/conversations` também manteve a mesma interface sem o onboarding antigo.

## Release final

A publicação final `2Vp766Q3JQNuWK5Jp5SUsW3LTirF` foi validada em `https://cubic-ai-psi.vercel.app/?cachebust=20260818-release-final`. O título da página é `Cubic AI`. A tela mostra a sidebar com `Search commands`, `New Matter`, `Resources`, `Automate` e `Conversations`; a logo transparente Cubic AI aparece no cabeçalho; e a home mostra `Let's work on your legal matter`, o campo de análise e os botões `Open Workspace` e `Plugins`.

O modal antigo não aparece: não há `Add a backend`, campos `Host`, `Host URL`, `API Key`, `OpenHands Cloud`, `Choose your agent` ou `Set up your LLM` no HTML/viewport da home pública.

## Revisão local atual após a correção do OnboardingHost

Em 18 de agosto de 2026, a prévia limpa em `http://127.0.0.1:4173/` exibiu `Cubic AI`, o wordmark `Cubic`, `New legal matter`, `Legal resources`, `Automate` e `Your legal work, with an AI built for attorneys`. A tela entrou diretamente no workspace jurídico, sem `Add a backend`, `Host`, `API Key`, `OpenHands Cloud`, `Connect to OpenHands` ou etapas de onboarding. A build e o typecheck passaram após a remoção do `OnboardingHost` de `src/routes/home.tsx`.

## Revisão do sidebar do TXT — 18 de agosto de 2026

A versão publicada no alias `https://cubic-ai-psi.vercel.app/` foi revisada após o deploy `7R4fGQE5MJWxzRijJrVHWDRUcd3u`. A home exibe o logo Cubic, os itens `Home`, `Matters`, `Documents`, `Calendar`, `Search` e `Settings`, além do perfil `Cubic AI — Legal workspace`. O item `Automate` não aparece, os dashboards de automação foram removidos da home e as rotas de automação foram retiradas do mapa do React Router. A chamada jurídica `Your legal work, with an AI built for attorneys` permanece visível.
