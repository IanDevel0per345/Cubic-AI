# Arquitetura incremental da Cubic AI

## Princípios

A Cubic AI reutiliza o shell visual do OpenHands como base de experiência. O primeiro ciclo evita redesign, landing page paralela, dashboard genérico ou substituição de componentes existentes. As mudanças de produto concentram-se em branding, copy principal e preparação de limites técnicos.

A aplicação deve se comportar como um workspace jurídico brasileiro, mas não deve afirmar que já possui fontes jurídicas, integrações com tribunais, jurisprudência validada ou provedor de IA configurado quando essas capacidades ainda não existem. Respostas futuras deverão suportar fontes, citações, identificadores de origem e rastreabilidade.

## Camadas preparadas

| Camada | Responsabilidade | Estado neste ciclo |
| --- | --- | --- |
| Interface | Sidebar, workspace, conversas e componentes existentes | Mantida; copy principal adaptada para contexto jurídico |
| Serviço de IA | Contrato `AiProvider`, mensagens, respostas e citações | Criado; nenhum fornecedor está acoplado |
| Persistência | Transporte público do Supabase e futuros repositórios de domínio | Criado como seam REST; nenhum dado jurídico é persistido automaticamente |
| Deployment | Build atual do React Router/Vite e configuração do Vercel | Preservados; variáveis públicas documentadas |
| Segurança | Separação entre chave anon pública e credenciais server-side | Documentada; service-role nunca deve entrar no bundle |
| Computer-use | Ferramentas de navegador | Opt-in explícito por `VITE_ENABLE_BROWSER_TOOLS=true`; desativado por padrão |

## Supabase e LGPD

A camada de cliente aceita somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. O isolamento de dados deverá ser implementado por repositórios server-side e políticas de Row Level Security no Supabase quando as entidades forem adicionadas. A chave service-role não deve ser usada no navegador. A arquitetura futura deve considerar autenticação, organizações, membros, casos, documentos, conversas, mensagens, fontes, citações, execuções de IA, uso e configurações, sempre com autorização por organização e caso.

A presença da camada não constitui afirmação de conformidade com a LGPD. Antes de produção, ainda serão necessários desenho de base legal, retenção e exclusão, gestão de consentimento quando aplicável, registro de auditoria, controles de acesso, resposta a incidentes e revisão jurídica e de segurança.

## Provedor de IA

A interface `AiProvider` recebe mensagens, contexto opcional de caso e IDs de fontes, retornando texto e citações estruturadas. O estado padrão é `unconfigured`, que falha de maneira explícita em vez de inventar resposta jurídica ou fonte. Um adaptador futuro deverá ser server-side, registrar o provedor e normalizar respostas sem expor chaves de fornecedor ao frontend.

## Referências conceituais

A pesquisa pública observou categorias recorrentes em plataformas modernas de IA jurídica: assistência conversacional, pesquisa e validação de jurisprudência e legislação, análise de documentos e processos, redação e revisão de peças, respostas com fontes verificáveis e controles de privacidade. As referências foram usadas apenas como orientação funcional, sem copiar marca, identidade visual ou textos proprietários.

- [Jus IA](https://ia.jusbrasil.com.br/)
- [Jurídico AI](https://juridico.ai/)
