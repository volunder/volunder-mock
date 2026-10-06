'use strict';
/* Semente do mock v3: o conjunto do mock v3 de docs/26, sobre o Painel de Contas do mock v2. Tudo é fictício,
   e as pessoas aparecem só pelo papel. A função devolve um objeto novo a cada chamada, para reiniciar sem resto. */
(function () {
  const PAPEIS = [
    { id: 'cliente', nome: 'Cliente', frase: 'Servidor do órgão. Confere as prévias, comenta na própria tela e aprova as entregas.', pessoa: 'cli1', telas: ['trilho', 'conferir', 'entregas'], carteira: false },
    { id: 'aipo', nome: 'AI PO', frase: 'Transforma o que chega em trabalho pronto e decide o que o cliente vê.', pessoa: 'aipo1', telas: ['trilho', 'entrada', 'requisitos', 'liberacao', 'projeto'], carteira: false },
    { id: 'pm', nome: 'PM', frase: 'Mantém o projeto no rumo combinado e fecha o que foi entregue.', pessoa: 'pm1', telas: ['trilho', 'sprint', 'riscos', 'fechamento', 'projeto'], carteira: false },
    { id: 'builder', nome: 'Builder', frase: 'Constrói cada task contra uma spec aceita e entrega o PR revisado.', pessoa: 'ba', telas: ['trilho', 'task', 'revisoes', 'projeto'], carteira: false },
    { id: 'pe', nome: 'Principal Engineer', frase: 'Revisa o PR que escala ou que toca área sensível e cuida da qualidade técnica.', pessoa: 'pe1', telas: ['trilho', 'revisoes', 'projeto'], carteira: false },
    { id: 'headops', nome: 'Head Ops', frase: 'Cuida da carteira só por números, sem ler conteúdo nem medir pessoa.', pessoa: 'headops', telas: ['trilho', 'capacidade'], carteira: true },
    { id: 'direcao', nome: 'Direção', frase: 'Decide o que escala e aprova a medição junto com o cliente.', pessoa: 'direcao', telas: ['trilho'], carteira: true },
    { id: 'admin', nome: 'Admin', frase: 'Deixa a plataforma pronta e os agentes sob controle, sem ler conteúdo.', pessoa: 'admin', telas: ['trilho', 'pessoas', 'agentes'], carteira: false }
  ];

  /* Os 9 passos do andamento de um pedido (docs/31). */
  const PASSOS = ['Pedido recebido', 'Em discussão', 'Requisito', 'Planejado', 'Em construção', 'Para conferir', 'Homologado', 'Ida à produção', 'Medido'];

  const TELAS = {
    trilho: 'Trilho', inicio: 'Início', conferir: 'Conferir', entregas: 'Entregas',
    entrada: 'Entrada', requisitos: 'Requisitos', liberacao: 'Liberação',
    sprint: 'Sprint', riscos: 'Riscos', fechamento: 'Fechamento',
    task: 'Task e PR', revisoes: 'Revisões', capacidade: 'Capacidade',
    pessoas: 'Pessoas e projetos', agentes: 'Agentes', projeto: 'Projeto'
  };

  function semente() {
    return {
      versao: 7,
      pessoas: {
        cli1: { nome: 'Cliente 1', org: 'Órgão Exemplo', papeis: ['cliente'] },
        aipo1: { nome: 'AI PO 1', papeis: ['aipo', 'builder'] },
        pm1: { nome: 'PM 1', papeis: ['pm'] },
        ba: { nome: 'Builder A', papeis: ['builder'] },
        bb: { nome: 'Builder B', papeis: ['builder'] },
        pe1: { nome: 'Principal Engineer 1', papeis: ['pe'] },
        headops: { nome: 'Head Ops', papeis: ['headops'] },
        direcao: { nome: 'Direção', papeis: ['direcao'] },
        admin: { nome: 'Admin geral', papeis: ['admin'] }
      },
      projeto: { id: 'pcx', nome: 'Painel de Contas', org: 'Órgão Exemplo', sprint: 'Sprint 2', limite: 20, sprints: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'] },
      carteira: [
        { id: 'pcx', nome: 'Painel de Contas', saude: 'No rumo', sprint: 'Sprint 2', planejado: 22, capacidade: 60 },
        { id: 'pte', nome: 'Protocolo Exemplo', saude: 'No rumo', sprint: 'Sprint 1', planejado: null, capacidade: null },
        { id: 'rex', nome: 'Registro Exemplo', saude: null, sprint: null, planejado: null, capacidade: null, nota: 'em cadastro, sem relato ainda' }
      ],
      agentes: {
        requisitos: { nome: 'Agente de requisitos', estado: 'ativo', modo: 'sugere, uma pessoa aprova' },
        planejamento: { nome: 'Agente de planejamento', estado: 'ativo', modo: 'sugere, uma pessoa aprova' },
        triagem: { nome: 'Agente de triagem', estado: 'ativo', modo: 'sugere, uma pessoa aprova' },
        contexto: { nome: 'Agente de contexto do projeto', estado: 'ativo', modo: 'sugere, uma pessoa decide' },
        codigo: { nome: 'Agente de código', estado: 'desligado', motivo: 'Neste projeto, a classe do dado não permite mandar o código a um modelo externo. Quando o projeto permitir, o passo a passo dele aparece aqui, e o resultado é sempre um PR que você revisa.' }
      },
      itens: {
        'PED-01': { tipo: 'pedido', titulo: 'Cada número apresentado precisa mostrar a sua comprovação', requisito: 'R-01', tasks: ['PCX-T-042', 'PCX-T-071', 'PCX-T-072', 'PCX-T-073', 'PCX-T-076'] },
        'PED-02': { tipo: 'pedido', titulo: 'Incluir as listas do planejamento e as exigências por item', requisito: 'R-02', tasks: ['PCX-T-074', 'PCX-T-075'] },
        'PED-03': { tipo: 'pedido', titulo: 'Corrigir os erros de valor apontados pelo cliente', tasks: ['PCX-T-040'] },
        'R-01': { tipo: 'requisito', titulo: 'Situação e documentos de cada número', versao: 2, estado: 'aceito', pedido: 'PED-01', tasks: ['PCX-T-042', 'PCX-T-071', 'PCX-T-072', 'PCX-T-073', 'PCX-T-076'], porque: 'O servidor do órgão quer ver a situação de cada número e os documentos que o sustentam, para saber o que já está comprovado e o que falta.',
          /* Os critérios do R-01 no mock v2, em Dado, Quando e Então. */
          criterios: [['um número com documento aceito', 'abro o painel', 'vejo a situação Comprovado e o documento'], ['um número sem documento', 'abro o painel', 'vejo a situação Lacuna e o documento que falta'], ['a legenda das situações', 'passo o foco por ela', 'cada situação tem nome e ícone, não só cor']] },
        'R-02': { tipo: 'requisito', titulo: 'Exigências por item do planejamento', versao: 1, estado: 'aceito', pedido: 'PED-02', tasks: ['PCX-T-074', 'PCX-T-075'] },
        'PCX-T-040': { tipo: 'task', titulo: 'Corrigir os erros de valor apontados pelo cliente', pf: 3, resp: 'bb', sprint: 'Sprint 2', estado: 'em-construcao', pedido: 'PED-03', passo: 5, territorio: 'app/repasses/valores/', branch: 'pcx-t-040-valores', spec: 'pcx-correcao-de-valores' },
        'PCX-T-042': { tipo: 'task', titulo: 'Mostrar a origem de cada número', pf: 5, resp: 'ba', sprint: 'Sprint 1', estado: 'aguardando-homologacao', pedido: 'PED-01', pr: 'PR-8', passo: 7, territorio: 'app/numeros/origem/', spec: 'pcx-origem-dos-numeros', vez: { papel: 'cliente', pessoa: 'cli1' } },
        'PCX-T-071': { tipo: 'task', titulo: 'Dar a cada número uma situação', pf: 5, resp: 'ba', sprint: 'Sprint 2', estado: 'revisado', pedido: 'PED-01', pr: 'PR-9', passo: 6, territorio: 'app/numeros/situacao/', spec: 'pcx-situacao-dos-numeros' },
        'PCX-T-072': { tipo: 'task', titulo: 'Ligar cada número aos documentos que o sustentam', pf: 3, resp: 'ba', sprint: 'Sprint 2', estado: 'revisado', pedido: 'PED-01', pr: 'PR-9', passo: 6, territorio: 'app/numeros/documentos/', spec: 'pcx-situacao-dos-numeros' },
        'PCX-T-073': { tipo: 'task', titulo: 'Montar o catálogo dos 20 dados de dois exercícios', pf: 8, resp: 'ba', sprint: 'Sprint 2', estado: 'em-construcao', pedido: 'PED-01', passo: 5, territorio: 'app/catalogo/', branch: 'pcx-t-073-catalogo', spec: 'pcx-catalogo-de-dados' },
        'PCX-T-074': { tipo: 'task', titulo: 'Mostrar as exigências por item do planejamento', pf: 5, resp: 'ba', sprint: 'Sprint 2', estado: 'proposta', pedido: 'PED-02', passo: 4, porAgente: 'planejamento' },
        'PCX-T-075': { tipo: 'task', titulo: 'Filtrar os itens do planejamento pela situação das exigências', pf: 3, resp: 'bb', sprint: 'Sprint 2', estado: 'proposta', pedido: 'PED-02', passo: 4, porAgente: 'planejamento' },
        'PCX-T-076': { tipo: 'task', titulo: 'Mostrar a data prometida pelo órgão na situação Lacuna', pf: 3, resp: 'aipo1', sprint: 'Sprint 2', estado: 'em-revisao', pedido: 'PED-01', pr: 'PR-10', passo: 5, territorio: 'app/numeros/legenda/', branch: 'pcx-t-076-legenda-dos-numeros' },
        'PR-8': { tipo: 'pr', numero: 8, titulo: 'Origem de cada número no painel', autor: 'ba', revisor: 'bb', estado: 'mesclado', previaLiberada: true, tasks: ['PCX-T-042'], mudouCli: 'Cada número agora mostra a sua origem, na tela Números do exercício.',
          resumo: { verificado: ['Testes da tela de números; checagem de acessibilidade sem erro.'], suposto: [], naoFeito: [] }, vez: { papel: 'cliente', pessoa: 'cli1' } },
        'PR-9': { tipo: 'pr', numero: 9, titulo: 'Situação e documentos de cada número', autor: 'ba', revisor: 'bb', estado: 'revisado', previaLiberada: false, tasks: ['PCX-T-071', 'PCX-T-072'], mudouCli: 'Cada número agora tem uma situação e os documentos que o sustentam.', tituloCli: 'Situação e documentos de cada número', vez: { papel: 'aipo', pessoa: 'aipo1' },
          /* O resumo do PR #9 pelo que mudou, com as seções do PR no mock v2: a verificação, a dúvida que fica para a prévia e o que entra depois. */
          resumo: { verificado: ['Testes da tela de números; checagem de acessibilidade sem erro.', 'Verificações do PR: integração, acessibilidade e guarda de dado pessoal, todas passaram.'], suposto: ['Que o nome Hipotético é claro para o cliente: a dúvida fica para a prévia.'], naoFeito: ['O catálogo do segundo exercício, que entra na PCX-T-073.'] },
          /* A prévia que o cliente confere: a tela Números do exercício, com os trechos que ele pode comentar (docs/26, conjunto do mock v3). */
          previa: { tela: 'Números do exercício', trechos: [
            { id: 'pg-1', rotulo: 'Pagamento pg-1', conteudo: 'R$ 100.000,00 · Comprovado', cmt: 'CMT-01', triagem: { sugestao: 'dado a conferir', destino: 'o PM e a AI PO', motivo: 'O cliente aponta divergência entre o dado e a evidência.', confianca: 'alta' } },
            { id: 'legenda', rotulo: 'Legenda das situações', conteudo: 'Comprovado · Hipotético · Lacuna', cmt: 'CMT-02', triagem: { sugestao: 'correção', destino: 'o Builder A', motivo: 'Ajuste de texto numa tela em validação, sem mudar a regra.', confianca: 'média' } }
          ] } },
        'PR-10': { tipo: 'pr', numero: 10, titulo: 'Data prometida na situação Lacuna', autor: 'aipo1', revisor: 'ba', estado: 'em-revisao', tasks: ['PCX-T-076'], vez: { papel: 'builder', pessoa: 'ba' }, territorio: 'app/numeros/legenda/' },
        'CMT-00': { tipo: 'comentario', autor: 'cli1', texto: 'Os valores de dois repasses estão trocados.', estado: 'em-construcao', destino: 'correção', task: 'PCX-T-040' },
        'REL-01': { tipo: 'relato', titulo: 'Relato da semana 1 da Sprint 2', estado: 'liberado', requisito: 60, desenvolvimento: 30 },
        /* Montado pelo sistema (v2): os percentuais de docs/26, que nunca regridem, e o que está com o cliente; o PM escreve a redação. */
        'REL-02': { tipo: 'relato', titulo: 'Relato da semana 2 da Sprint 2', estado: 'rascunho', requisito: 70, desenvolvimento: 40, redacao: '' },
        'RIS-01': { tipo: 'risco', forma: 'risco', titulo: 'As credenciais do ambiente de homologação do cliente ainda não chegaram', trava: 'Ida à produção do PR #8', responde: 'TI do Órgão Exemplo', saude: 'Em atenção', aberto: 'aberto há 2 dias', estado: 'aberto' },
        'IMP-01': { tipo: 'risco', forma: 'impedimento', titulo: 'Decisão pendente do órgão: onde ficam o banco e os arquivos do painel', trava: 'Sprints 3 e 4', responde: 'Órgão Exemplo', saude: 'Em risco', aberto: 'aberto há 4 dias', estado: 'aberto', bloqueadoPor: 'a decisão sobre onde ficam o banco e os arquivos ainda não foi tomada. Ela depende da resposta do Órgão Exemplo a uma pergunta da equipe.' },
        'ATV-REQ': { tipo: 'ativacao', titulo: 'Versão 2 do agente de requisitos', estado: 'sombra-concluida' },
        'REV-MATRIZ': { tipo: 'revisao-modelos', titulo: 'Revisão semanal dos modelos', estado: 'pronta' }
      },
      /* Pendências: o que espera uma pessoa. `bloco` diz onde aparece no Início: com (Com você) ou prep (Preparado para você).
         Os prazos são os de docs/21 ou os de exemplo declarados em docs/26 (conjunto do mock v3); escala: null quando o destino não foi definido. */
      pendencias: [
        { id: 'LIB-PR9', tipo: 'liberar-previa', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: 'PR-9', titulo: 'Liberar ao cliente a prévia do PR #9', pediu: 'Builder A, com a revisão aprovada pelo Builder B', prazo: 1, escala: 'o PM', acao: 'Abrir a prévia', tela: 'liberacao' },
        { id: 'TASKS-PED02', tipo: 'aprovar-tasks', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: 'PED-02', agente: 'planejamento', titulo: 'Aprovar as duas tasks propostas para o pedido de exigências por item', pediu: 'Agente de planejamento, a partir do requisito Exigências por item do planejamento, versão 1', prazo: 1, escala: 'a Direção', acao: 'Abrir a sprint', tela: 'sprint', motivo: 'O requisito foi dividido em duas partes que cabem numa sprint cada, a partir dos critérios aceitos.', confianca: 'média' },
        { id: 'REL-02', tipo: 'relato', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: 'REL-02', titulo: 'Escrever a redação do relato da semana 2', pediu: 'Rotina do projeto: o relato sai antes da reunião semanal', prazo: 2, escala: 'a Direção', acao: 'Abrir o relato', tela: 'fechamento' },
        { id: 'REL-RASC', tipo: 'rascunho-relato', bloco: 'prep', pessoa: 'pm1', papel: 'pm', item: 'REL-02', agente: 'sistema', titulo: 'Rascunho do relato da semana 2', motivo: 'Montado pelo sistema a partir da trilha da semana.', fonte: 'Trilha do Painel de Contas, semana 2 da Sprint 2', efeito: 'Nada vai ao cliente até a redação ser escrita e liberada.', tela: 'fechamento' },
        { id: 'P24-RIS-01', tipo: 'impedimento', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: 'RIS-01', titulo: 'Encerrar o risco: as credenciais do ambiente de homologação ainda não chegaram', pediu: 'Risco aberto há 2 dias; responde a TI do Órgão Exemplo', prazo: 3, escala: 'o Head Ops', acao: 'Abrir o risco', tela: 'riscos' },
        { id: 'P24-IMP-01', tipo: 'impedimento', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: 'IMP-01', titulo: 'Encerrar o impedimento: onde ficam o banco e os arquivos do painel', pediu: 'Impedimento aberto há 4 dias; responde o Órgão Exemplo', prazo: 2, escala: 'o Head Ops', acao: 'Abrir o impedimento', tela: 'riscos' },
        { id: 'APR-042', tipo: 'aprovar-entrega', bloco: 'com', pessoa: 'cli1', papel: 'cliente', item: 'PCX-T-042', titulo: 'Aprovar a entrega: mostrar a origem de cada número', pediu: 'Equipe do projeto, depois da prévia que você conferiu', prazo: 5, escala: 'o PM do projeto', acao: 'Abrir a entrega', tela: 'entregas' },
        { id: 'REV-PR10', tipo: 'revisar-pr', bloco: 'com', pessoa: 'ba', papel: 'builder', item: 'PR-10', titulo: 'Revisar o PR #10: data prometida pelo órgão na situação Lacuna', pediu: 'AI PO 1, como Builder deste PR', prazo: 1, escala: 'o Principal Engineer', acao: 'Abrir a revisão', tela: 'revisoes' },
        { id: 'ATV-REQ', tipo: 'ativar-agente', bloco: 'com', pessoa: 'admin', papel: 'admin', item: 'ATV-REQ', titulo: 'Ativar a versão 2 do agente de requisitos', pediu: 'Fim do período de sombra', prazo: 5, escala: null, acao: 'Ver o resultado da sombra', tela: 'agentes' },
        { id: 'REV-MATRIZ', tipo: 'revisao-modelos', bloco: 'com', pessoa: 'admin', papel: 'admin', item: 'REV-MATRIZ', titulo: 'Fazer a revisão semanal dos modelos', pediu: 'Rotina semanal da plataforma, que abre na segunda-feira', prazo: 2, escala: null, acao: 'Abrir a revisão', tela: 'agentes' },
        { id: 'CUSTO', tipo: 'relatorio-custo', bloco: 'prep', pessoa: 'admin', papel: 'admin', item: 'REV-MATRIZ', agente: 'sistema', titulo: 'Custo dos agentes por bloco de trabalho e por projeto', motivo: 'Somado pelo sistema, só com dados de uso.', fonte: 'Uso dos agentes na semana', efeito: 'Serve de base para a revisão dos modelos.', tela: 'agentes' },
        { id: 'MAPA-PE', tipo: 'mapa-prs', bloco: 'prep', pessoa: 'pe1', papel: 'pe', item: 'PR-10', agente: 'contexto', titulo: 'O que os PRs abertos afetam', motivo: 'O PR #10 mexe só na legenda dos números, em app/numeros/legenda/, que não é área sensível.', fonte: 'Territórios dos PRs abertos', confianca: 'alta', efeito: 'Nenhum PR aberto pede a sua revisão por área sensível.', tela: 'revisoes' },
        { id: 'TOCA-073', tipo: 'contexto', bloco: 'prep', pessoa: 'ba', papel: 'builder', item: 'PCX-T-073', agente: 'contexto', titulo: 'O que mais o catálogo dos 20 dados toca', motivo: 'Nenhum PR aberto mexe no mesmo lugar que esta task.', fonte: 'Territórios dos PRs abertos', confianca: 'média', efeito: 'Pode seguir sem combinar com outra pessoa.', tela: 'task' }
      ],
      /* O que cada pessoa entregou e acompanha. O texto da vez sai do item, não daqui. */
      entregas: [
        { pessoa: 'ba', papel: 'builder', item: 'PR-9' },
        { pessoa: 'ba', papel: 'builder', item: 'PR-8' },
        { pessoa: 'bb', papel: 'builder', item: 'PR-9', como: 'revisão' },
        { pessoa: 'aipo1', papel: 'builder', item: 'PR-10' },
        { pessoa: 'aipo1', papel: 'aipo', item: 'R-01' },
        { pessoa: 'pm1', papel: 'pm', item: 'REL-01' },
        { pessoa: 'cli1', papel: 'cliente', item: 'CMT-00' }
      ],
      trilha: [
        { item: 'PR-9', quando: 'ontem', quem: 'Builder A', texto: 'Abriu o PR #9 com as tasks PCX-T-071 e PCX-T-072.' },
        { item: 'PR-9', quando: 'hoje', quem: 'Builder B', texto: 'Revisou e aprovou o PR #9.' },
        { item: 'PR-8', quando: 'há 4 dias', quem: 'AI PO 1', texto: 'Liberou ao cliente a prévia do PR #8.', cli: 'A equipe liberou a prévia: origem de cada número.' },
        { item: 'PR-8', quando: 'há 2 dias', quem: 'Cliente 1', texto: 'Conferiu a prévia e comentou dois trechos.', cli: 'Você conferiu a prévia e comentou dois trechos.' },
        { item: 'CMT-00', quando: 'há 4 dias', quem: 'Cliente 1', texto: 'Comentou na prévia: "Os valores de dois repasses estão trocados."', cli: 'Você comentou: "Os valores de dois repasses estão trocados."' },
        { item: 'CMT-00', quando: 'há 3 dias', quem: 'AI PO 1', texto: 'Triou o comentário como correção, para o Builder B.', cli: 'A equipe recebeu o comentário como correção e começou a construção.' },
        { item: 'PR-10', quando: 'hoje', quem: 'AI PO 1', texto: 'Abriu o PR #10, como Builder, e pediu a revisão do Builder A.' },
        { item: 'PED-02', quando: 'hoje', quem: 'Agente de planejamento', texto: 'Propôs as tasks PCX-T-074 e PCX-T-075; uma pessoa decide.' },
        { item: 'R-01', quando: 'há 6 dias', quem: 'AI PO 1', texto: 'Aceitou o requisito na versão 1.' },
        { item: 'R-01', quando: 'ontem', quem: 'AI PO 1', texto: 'Aprovou a versão 2 do requisito.' },
        { item: 'REL-01', quando: 'há 5 dias', quem: 'AI PO 1', texto: 'Liberou ao cliente o relato da semana 1.' }
      ]
    };
  }

  /* O que o cliente escolhe ao pedir ajuste ou recusar uma entrega: a lista do mock v2 (MOTIVOS_CLIENTE), que liga o ajuste
     a correção, ajuste de escopo ou ideia nova. O texto "o que precisa mudar" é sempre obrigatório. */
  const MOTIVOS_AJUSTE = [['correção', 'Não funciona como combinado'], ['ajuste de escopo', 'Quero mudar o combinado'], ['ideia nova', 'É uma ideia nova']];

  /* Motivos da equipe ao pedir ajuste, recusar ou trocar a sugestão de um agente: a lista fechada de docs/22. */
  const MOTIVOS_EQUIPE = ['fato errado', 'sem fonte', 'destino errado', 'fora do contrato', 'estimativa errada', 'duplicado', 'incompleto', 'texto inadequado ao público', 'regra de negócio não considerada', 'outro (com uma linha)'];
  /* Destinos da triagem de um comentário do cliente (docs/31, "Voltas"). */
  const DESTINOS = [['correção', 'Correção: volta à construção, para quem fez'], ['ajuste de escopo', 'Ajuste de escopo: versão nova do requisito'], ['ideia nova', 'Ideia nova: abre um pedido ligado'], ['dado a conferir', 'Dado a conferir: o PM confere com o órgão']];

  window.V3 = { PAPEIS, TELAS, PASSOS, MOTIVOS_AJUSTE, MOTIVOS_EQUIPE, DESTINOS, semente };
})();
