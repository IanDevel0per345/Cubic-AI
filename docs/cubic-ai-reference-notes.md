# Notas de referência conceitual da Cubic AI

As referências públicas consultadas foram usadas somente para identificar categorias funcionais de uma plataforma moderna de IA jurídica. Não foram copiadas identidade visual, marca, textos proprietários ou elementos de interface.

## Funcionalidades recorrentes observadas

- Assistente jurídico conversacional com compreensão do vocabulário e do raciocínio jurídico brasileiro.
- Pesquisa e validação de jurisprudência, legislação, normas e decisões reais.
- Respostas com fontes, links ou referências verificáveis para conferência.
- Uso de documentos anexados como contexto para perguntas e análises.
- Criação, revisão e organização de peças e outros documentos jurídicos.
- Análise de documentos e processos, estruturação de teses e apoio à estratégia.
- Ênfase em segurança, privacidade, controle de acesso e tratamento cuidadoso de informações sensíveis.

## Aplicação ao primeiro ciclo

O primeiro ciclo deve manter o shell visual do OpenHands e expor somente um contexto jurídico discreto. Funcionalidades ainda sem backend ou fontes jurídicas reais devem permanecer como estados vazios, placeholders ou arquitetura preparada, sem apresentar jurisprudência, legislação ou decisões fictícias como reais. A base técnica deve separar a UI de persistência e do provedor de IA, deixando Supabase e Vercel como infraestrutura futura/externa e sem acoplamento definitivo a um fornecedor de modelo.

## Fontes consultadas

- Jus IA: https://ia.jusbrasil.com.br/
- Jurídico AI: https://juridico.ai/
