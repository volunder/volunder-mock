'use strict';
/* Mock v3 (docs/43, D70): um estado só, com eventos e pendências; cada papel lê o mesmo estado pelo seu Início.
   Endereço: #p=<pessoa>&papel=<papel>&tela=<tela>[&etapa=<estágio>][&est=<subetapa>][&item=<id>]. Sem endereço, a escolha do papel. */
(function () {
  const { PAPEIS, TELAS, PASSOS, MOTIVOS_AJUSTE, MOTIVOS_EQUIPE, DESTINOS, semente } = window.V3;
  const FORA_DA_CARGA = ['proposta', 'rascunho', 'aguardando-limite', 'recusada', 'cancelada'];
  const OUTRO = MOTIVOS_EQUIPE[MOTIVOS_EQUIPE.length - 1];
  const CHAVE = 'volunder-mock-v3';
  let S = carregar();
  /* Tema (D73): claro, escuro ou do computador, como preferência de cada pessoa. Começa no claro. */
  const CHAVE_TEMA = 'volunder-tema';
  const TEMAS = [['claro', 'Claro'], ['escuro', 'Escuro'], ['sistema', 'Do computador']];
  function temaSalvo() { try { const t = localStorage.getItem(CHAVE_TEMA); return TEMAS.some((x) => x[0] === t) ? t : 'claro'; } catch (e) { return 'claro'; } }
  function aplicarTema(t) { document.documentElement.dataset.tema = t; try { localStorage.setItem(CHAVE_TEMA, t); } catch (e) { /* sem armazenamento: vale até fechar a página */ } }
  document.documentElement.dataset.tema = temaSalvo();
  /* A marca: as letras VOLUND do desenho da Volund e o ER na mesma geometria (design/marca/volunder.svg). */
  const MARCA = "<svg class=\"marca\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 145.72 12.1\" role=\"img\" aria-label=\"Volunder\"><path fill=\"currentColor\" d=\"M1.06 0.08C0.53 0.1 0.07 0.11 0.05 0.12C0.01 0.12 0 0.19 0 0.36L0 0.61L0.12 0.65C0.27 0.7 0.37 0.8 0.45 0.99C0.48 1.06 0.56 1.2 0.62 1.29C0.68 1.37 0.77 1.52 0.81 1.6C0.86 1.68 0.95 1.82 1.02 1.9C1.1 1.98 1.2 2.13 1.26 2.24C1.31 2.35 1.4 2.48 1.45 2.54C1.51 2.6 1.6 2.74 1.66 2.86C1.72 2.98 1.83 3.15 1.9 3.23C1.97 3.32 2.06 3.47 2.11 3.58C2.15 3.68 2.26 3.84 2.34 3.94C2.43 4.03 2.52 4.17 2.54 4.25C2.57 4.33 2.65 4.47 2.73 4.57C2.8 4.67 2.9 4.82 2.94 4.9C2.98 4.98 3.08 5.12 3.15 5.2C3.23 5.28 3.33 5.43 3.38 5.54C3.43 5.64 3.53 5.79 3.59 5.86C3.65 5.94 3.74 6.08 3.78 6.17C3.83 6.25 3.92 6.39 4 6.47C4.07 6.54 4.18 6.71 4.24 6.84C4.3 6.97 4.4 7.13 4.45 7.2C4.51 7.26 4.6 7.4 4.65 7.51C4.7 7.61 4.8 7.77 4.86 7.84C4.93 7.92 5.02 8.07 5.07 8.18C5.13 8.29 5.22 8.43 5.27 8.49C5.33 8.56 5.42 8.69 5.47 8.79C5.52 8.88 5.62 9.03 5.69 9.11C5.76 9.19 5.87 9.35 5.92 9.45C5.98 9.56 6.07 9.7 6.12 9.76C6.18 9.83 6.26 9.96 6.31 10.05C6.36 10.15 6.47 10.31 6.56 10.4C6.64 10.5 6.74 10.66 6.77 10.77C6.81 10.87 6.89 11.02 6.97 11.09C7.04 11.18 7.14 11.32 7.2 11.42C7.25 11.51 7.34 11.65 7.4 11.72C7.45 11.79 7.51 11.89 7.53 11.94L7.57 12.03L8.75 12.03L9.94 12.03L9.99 11.91C10.05 11.76 10.21 11.53 10.4 11.31C10.47 11.22 10.59 11.05 10.64 10.93C10.7 10.81 10.8 10.66 10.85 10.6C10.91 10.54 10.99 10.39 11.04 10.27C11.09 10.11 11.15 10.02 11.26 9.94C11.34 9.87 11.43 9.76 11.48 9.63C11.53 9.52 11.61 9.39 11.67 9.33C11.73 9.27 11.82 9.12 11.88 8.99C11.95 8.84 12.04 8.71 12.12 8.65C12.2 8.6 12.28 8.48 12.33 8.36C12.38 8.25 12.46 8.11 12.52 8.06C12.57 8 12.67 7.84 12.73 7.71C12.79 7.58 12.9 7.4 12.97 7.32C13.05 7.24 13.14 7.1 13.19 7C13.23 6.9 13.32 6.74 13.4 6.65C13.47 6.55 13.57 6.4 13.61 6.31C13.66 6.22 13.74 6.08 13.81 6.01C13.87 5.93 13.96 5.8 14 5.72C14.05 5.65 14.15 5.49 14.24 5.39C14.32 5.28 14.42 5.12 14.46 5.03C14.51 4.95 14.59 4.81 14.66 4.73C14.72 4.66 14.81 4.53 14.85 4.45C14.9 4.37 15 4.23 15.07 4.13C15.14 4.03 15.24 3.87 15.29 3.76C15.34 3.65 15.43 3.5 15.5 3.41C15.57 3.33 15.66 3.17 15.7 3.05C15.76 2.89 15.82 2.81 15.92 2.73C16.01 2.66 16.1 2.54 16.15 2.42C16.2 2.31 16.28 2.17 16.34 2.12C16.39 2.06 16.49 1.9 16.55 1.77C16.62 1.63 16.71 1.5 16.79 1.44C16.86 1.38 16.94 1.27 17 1.15C17.04 1.04 17.16 0.87 17.26 0.77C17.35 0.66 17.44 0.53 17.45 0.48C17.48 0.34 17.38 0.13 17.28 0.09C17.15 0.05 15.1 0.08 14.97 0.14C14.83 0.2 14.52 0.53 14.41 0.76C14.36 0.87 14.26 1.01 14.2 1.09C14.13 1.17 14.04 1.33 13.98 1.44C13.94 1.56 13.84 1.71 13.77 1.78C13.71 1.85 13.61 2 13.56 2.12C13.51 2.23 13.42 2.37 13.37 2.43C13.31 2.49 13.21 2.65 13.15 2.78C13.08 2.93 12.99 3.05 12.92 3.11C12.84 3.17 12.76 3.28 12.7 3.4C12.66 3.51 12.57 3.65 12.52 3.71C12.46 3.76 12.37 3.92 12.31 4.05C12.25 4.19 12.14 4.36 12.06 4.44C11.99 4.52 11.89 4.67 11.85 4.77C11.81 4.86 11.71 5.02 11.64 5.12C11.56 5.22 11.46 5.37 11.42 5.46C11.38 5.55 11.29 5.68 11.23 5.76C11.17 5.84 11.08 5.96 11.03 6.04C10.99 6.12 10.88 6.27 10.8 6.38C10.72 6.48 10.62 6.64 10.57 6.73C10.53 6.82 10.44 6.95 10.37 7.03C10.31 7.11 10.22 7.27 10.17 7.39C10.12 7.5 10.02 7.65 9.95 7.72C9.89 7.79 9.79 7.94 9.74 8.06C9.69 8.17 9.6 8.31 9.55 8.38C9.49 8.43 9.4 8.58 9.34 8.7C9.28 8.82 9.16 9 9.08 9.09C9 9.19 8.9 9.3 8.87 9.34C8.79 9.44 8.62 9.44 8.55 9.35C8.52 9.32 8.47 9.22 8.44 9.14C8.4 9.05 8.33 8.92 8.28 8.85C8.22 8.78 8.14 8.64 8.08 8.54C8.03 8.44 7.95 8.31 7.89 8.24C7.84 8.18 7.74 8.03 7.68 7.91C7.62 7.79 7.52 7.63 7.46 7.57C7.4 7.5 7.32 7.36 7.27 7.25C7.22 7.14 7.12 6.98 7.04 6.9C6.97 6.82 6.86 6.67 6.81 6.57C6.76 6.47 6.68 6.33 6.61 6.25C6.55 6.18 6.46 6.04 6.41 5.95C6.37 5.85 6.26 5.7 6.17 5.6C6.09 5.5 5.99 5.35 5.96 5.25C5.92 5.14 5.83 4.98 5.73 4.87C5.64 4.77 5.54 4.62 5.52 4.54C5.49 4.47 5.41 4.32 5.34 4.22C5.26 4.13 5.17 3.98 5.12 3.9C5.08 3.81 4.99 3.68 4.91 3.59C4.84 3.52 4.74 3.36 4.68 3.26C4.63 3.16 4.54 3.01 4.47 2.93C4.41 2.85 4.32 2.71 4.26 2.6C4.22 2.5 4.13 2.37 4.07 2.3C4.02 2.24 3.92 2.09 3.86 1.97C3.8 1.85 3.7 1.69 3.64 1.63C3.58 1.56 3.5 1.42 3.45 1.31C3.4 1.2 3.3 1.04 3.22 0.96C3.15 0.88 3.04 0.71 2.98 0.59C2.82 0.28 2.54 0.09 2.21 0.07C2.12 0.06 1.6 0.07 1.06 0.08ZM23.5 0.01C23.18 0.03 22.88 0.08 22.38 0.19C21.99 0.29 21.35 0.82 21.16 1.22C21.11 1.32 21.03 1.46 20.98 1.51C20.86 1.66 20.84 1.72 20.76 2.22C20.69 2.62 20.69 2.83 20.69 5.82C20.69 9.75 20.71 10.18 20.98 10.57C21.05 10.67 21.13 10.81 21.17 10.89C21.3 11.14 21.73 11.53 21.99 11.63C22.23 11.72 22.37 11.83 22.42 11.95L22.45 12.03L28.32 12.03L34.19 12.03L34.25 11.93C34.29 11.85 34.36 11.79 34.5 11.73C34.91 11.55 35.02 11.48 35.3 11.19C35.54 10.95 35.6 10.85 35.64 10.71C35.67 10.61 35.76 10.43 35.85 10.31C36.08 9.96 36.08 9.97 36.08 5.95C36.08 1.98 36.09 2.14 35.79 1.51C35.65 1.22 35.58 1.11 35.34 0.87C34.97 0.5 34.53 0.2 34.28 0.16C33.44 0 33.62 0.01 28.61 0C25.99 0 23.69 0 23.5 0.01ZM32.97 2.19C33.42 2.32 33.47 2.39 33.63 2.97C33.7 3.25 33.7 3.31 33.69 6.12L33.68 8.98L33.59 9.19C33.47 9.5 33.14 9.82 32.88 9.87C32.74 9.9 31.46 9.91 28.27 9.91L23.85 9.9L23.69 9.82C23.51 9.73 23.29 9.49 23.17 9.24L23.09 9.09L23.09 6.05L23.09 3.01L23.21 2.72C23.28 2.57 23.36 2.41 23.39 2.38C23.44 2.32 23.8 2.19 24.1 2.12C24.14 2.11 26.08 2.11 28.43 2.11C32.68 2.12 32.69 2.12 32.97 2.19ZM40.88 0.13C40.69 0.24 40.7 0.01 40.7 4.87C40.7 7.56 40.72 9.51 40.73 9.66C40.77 9.91 40.87 10.18 41.15 10.75C41.21 10.87 41.35 11.04 41.55 11.24C41.83 11.51 41.88 11.54 42.11 11.61C42.4 11.7 42.51 11.78 42.57 11.93L42.61 12.03L47.01 12.03L51.4 12.03L51.46 11.69C51.54 11.22 51.54 10.27 51.46 10.11C51.35 9.87 51.52 9.88 47.62 9.88C43.6 9.88 43.75 9.89 43.46 9.6C43.1 9.26 43.1 9.24 43.11 4.41C43.11 1.49 43.1 0.35 43.07 0.3C43.05 0.26 42.97 0.19 42.89 0.15C42.76 0.09 42.69 0.08 41.86 0.08C41.18 0.09 40.94 0.1 40.88 0.13ZM68.86 0.12C68.81 0.15 68.73 0.21 68.69 0.26C68.63 0.35 68.63 0.5 68.63 4.66C68.63 8.79 68.63 8.97 68.57 9.11C68.46 9.34 68.16 9.68 67.98 9.77L67.82 9.85L63.29 9.84C60.29 9.84 58.7 9.83 58.61 9.8C58.44 9.76 58.21 9.55 58.12 9.35C58.04 9.19 58.04 9.17 58.03 4.76C58.03 1.15 58.02 0.32 57.98 0.27C57.85 0.11 57.7 0.08 56.74 0.08C55.74 0.08 55.67 0.1 55.59 0.29C55.53 0.43 55.56 9.52 55.61 9.8C55.65 9.97 55.8 10.34 56 10.75C56.07 10.89 56.18 11.03 56.4 11.22C56.75 11.53 56.82 11.58 57.11 11.66C57.3 11.71 57.53 11.9 57.53 12C57.53 12.02 59.6 12.03 63.27 12.03C68.94 12.03 69.02 12.03 69.04 11.96C69.08 11.84 69.25 11.73 69.56 11.63C69.73 11.58 69.88 11.52 69.89 11.5C69.9 11.48 70.02 11.38 70.15 11.27C70.36 11.11 70.4 11.06 70.45 10.9C70.49 10.79 70.58 10.61 70.65 10.49C70.96 10.01 70.96 9.93 70.96 4.74C70.96 0.02 70.98 0.27 70.76 0.13C70.64 0.05 69.02 0.04 68.86 0.12ZM77.62 0.14C77.33 0.17 77.19 0.2 77.09 0.27C77.01 0.31 76.87 0.39 76.76 0.45C76.45 0.63 76 1.1 75.91 1.34C75.87 1.46 75.79 1.62 75.73 1.71C75.49 2.08 75.51 1.76 75.51 6.94C75.51 9.52 75.52 11.72 75.54 11.83L75.56 12.03L76.67 12.03L77.78 12.03L77.84 11.72C77.89 11.44 77.9 11.06 77.89 7.37C77.89 3.36 77.89 3.32 77.97 2.96C78.09 2.4 78.17 2.31 78.67 2.22C79.07 2.15 87.12 2.15 87.65 2.22C88.1 2.28 88.16 2.32 88.35 2.7L88.5 2.99L88.5 7.17C88.5 10.93 88.51 11.38 88.56 11.69L88.62 12.03L89.73 12.03L90.83 12.03L90.85 11.85C90.9 11.53 90.91 3.67 90.87 2.88C90.83 2.04 90.79 1.81 90.61 1.56C90.55 1.46 90.46 1.3 90.42 1.22C90.3 0.94 90.03 0.66 89.78 0.54C89.65 0.48 89.5 0.39 89.44 0.35C89.08 0.08 89.17 0.08 83.2 0.09C79.22 0.09 77.93 0.1 77.62 0.14ZM95.61 0.14C95.56 0.16 95.49 0.23 95.47 0.29C95.43 0.4 95.44 11.72 95.49 11.92L95.51 12.03L101.15 12.03L106.79 12.03L106.92 11.93C107.09 11.77 107.34 11.66 107.67 11.6C107.85 11.56 107.99 11.5 108.11 11.42C108.2 11.35 108.38 11.26 108.49 11.22C108.62 11.17 108.77 11.08 108.87 10.99C108.96 10.91 109.09 10.81 109.17 10.77C109.25 10.73 109.37 10.63 109.43 10.56C109.5 10.49 109.61 10.38 109.69 10.33C109.77 10.27 109.86 10.15 109.92 10.05C109.96 9.95 110.05 9.81 110.11 9.75C110.21 9.64 110.26 9.56 110.4 9.24C110.45 9.14 110.55 8.97 110.62 8.88C110.7 8.76 110.76 8.63 110.81 8.39C110.85 8.22 110.93 7.98 110.99 7.86C111.09 7.66 111.11 7.59 111.16 7C111.22 6.24 111.2 5.14 111.12 4.68C111.09 4.51 111 4.2 110.92 3.97C110.85 3.75 110.77 3.47 110.74 3.36C110.72 3.24 110.66 3.1 110.58 2.99C110.51 2.9 110.42 2.74 110.36 2.63C110.31 2.52 110.19 2.34 110.09 2.23C109.72 1.81 108.9 1 108.76 0.93C108.68 0.89 108.52 0.79 108.4 0.71C108.23 0.59 108.11 0.54 107.94 0.51C107.81 0.48 107.59 0.41 107.45 0.35C107.2 0.23 107.02 0.18 106.5 0.12C105.99 0.06 95.72 0.07 95.61 0.14ZM106.07 2.25C106.52 2.32 106.55 2.33 106.8 2.52C106.9 2.6 107.03 2.67 107.08 2.69C107.14 2.7 107.25 2.74 107.31 2.77C107.47 2.85 108.09 3.49 108.18 3.65C108.21 3.72 108.29 3.85 108.36 3.94C108.54 4.2 108.55 4.23 108.66 4.87C108.8 5.75 108.82 6.11 108.75 6.6C108.64 7.34 108.52 7.77 108.4 7.96C108.33 8.05 108.25 8.2 108.2 8.29C108.13 8.46 107.77 8.84 107.32 9.23C107.14 9.38 107.04 9.43 106.79 9.51C106.62 9.56 106.43 9.63 106.36 9.67C106 9.85 106.19 9.84 102.02 9.84C97.75 9.85 97.95 9.86 97.87 9.64C97.85 9.59 97.84 8.22 97.84 6.01L97.84 2.46L97.91 2.36C98.07 2.16 97.89 2.17 101.94 2.18C105.28 2.19 105.71 2.2 106.07 2.25Z\"/><path class=\"er\" d=\"M117.62 0.08L126.72 0.08L126.72 2.2L118.57 2.2A0.45 0.45 0 0 0 118.12 2.65L118.12 4.54A0.45 0.45 0 0 0 118.57 4.99L125.72 4.99L125.72 7.11L118.57 7.11A0.45 0.45 0 0 0 118.12 7.56L118.12 9.46A0.45 0.45 0 0 0 118.57 9.91L126.72 9.91L126.72 12.03L117.62 12.03A1.9 1.9 0 0 1 115.72 10.13L115.72 1.98A1.9 1.9 0 0 1 117.62 0.08Z\"/><path class=\"er\" fill-rule=\"evenodd\" d=\"M130.92 0.08L141.82 0.08A3.2 3.2 0 0 1 145.02 3.28L145.02 3.91A3.2 3.2 0 0 1 141.82 7.11L133.32 7.11L133.32 12.03L130.92 12.03ZM133.32 2.2L141.62 2.2A1.1 1.1 0 0 1 142.72 3.3L142.72 3.89A1.1 1.1 0 0 1 141.62 4.99L133.32 4.99Z\"/><path class=\"er\" d=\"M138.74 6.51L141.59 6.51L145.62 12.03L142.77 12.03Z\"/></svg>";

  function carregar() {
    /* A versão vem da semente: um lugar só, para o estado salvo de uma versão antiga ser descartado e o atual nunca. */
    try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && s.versao === semente().versao) return s; } catch (e) { /* estado ilegível: recomeça */ }
    return semente();
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* sem armazenamento: vale até fechar a página */ } }
  function reiniciar() { S = semente(); salvar(); }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const papelDe = (id) => PAPEIS.find((x) => x.id === id);
  const nome = (pessoa) => (S.pessoas[pessoa] || {}).nome || pessoa;

  /* ---------- endereço ---------- */
  function lerRota() {
    const q = new URLSearchParams(location.hash.slice(1));
    const r = { p: q.get('p'), papel: q.get('papel'), tela: q.get('tela') || 'trilho', item: q.get('item'), vista: q.get('vista'), est: q.get('est'), etapa: q.get('etapa') };
    /* No trilho, o endereço fica coerente: a subetapa em foco manda no estágio; o seu dia e o que é de fora não têm estágio; o resto sai. */
    if (r.tela === 'trilho' && r.est) {
      const x = ESTACOES.find((s) => s.id === r.est);
      if (x) r.etapa = x.e;
      else if (['dia', 'plataforma'].includes(r.est)) r.etapa = null;
      else r.est = null;
    }
    return r;
  }
  function hashDe(r) {
    const q = new URLSearchParams();
    for (const k of ['p', 'papel', 'tela', 'vista', 'etapa', 'est', 'item']) if (r[k]) q.set(k, r[k]);
    return '#' + q.toString();
  }
  /* Ir para o mesmo endereço não dispara hashchange: aí a tela é refeita na hora, para mostrar o estado novo. */
  function ir(r) { const h = hashDe(r); if (location.hash === h) render(); else location.hash = h; }

  /* ---------- leituras do estado ---------- */
  /* Quem escreveu o PR não o revisa: a revisão do próprio PR nunca aparece para o autor, nem no Início nem em Revisões. */
  const autorDoPr = (id) => { const it = S.itens[id]; const pr = it && (it.tipo === 'pr' ? it : S.itens[it.pr]); return pr && pr.autor; };
  const abertas = (pessoa, papel, bloco) => S.pendencias.filter((x) => x.estado !== 'feita' && x.pessoa === pessoa && x.papel === papel && (!bloco || x.bloco === bloco) && !(x.tipo === 'revisar-pr' && autorDoPr(x.item) === pessoa));
  const PRAZO_REVISAO = 1;
  const pendenciaDoItem = (item, pessoa, papel, bloco) => S.pendencias.find((x) => x.estado !== 'feita' && x.item === item && x.pessoa === pessoa && x.papel === papel && x.bloco === bloco);
  function prazo(n) { return n < 0 ? 'venceu' : n === 0 ? 'vence hoje' : n === 1 ? 'vence amanhã' : 'vence em ' + n + ' dias úteis'; }
  const escalada = (x) => x.semNivelAcima ? 'sem outro nível acima: segue aberto até a sua decisão' : x.ultimoNivel ? 'sem escalada: a Direção é o último nível' : x.escala ? 'se vencer, escala para ' + x.escala : 'sem destino de escalada definido';
  const ROTULO_PAPEL = { cliente: 'o cliente', aipo: 'a AI PO', pm: 'o PM', builder: 'o Builder', pe: 'o Principal Engineer', headops: 'o Head Ops', direcao: 'a Direção', admin: 'o Admin' };

  function comQuem(item, papelVendo, pessoaVendo) {
    const it = S.itens[item];
    if (!it || !it.vez) return '';
    if (it.vez.pessoa === pessoaVendo) return 'Com você';
    if (papelVendo === 'cliente') return it.vez.papel === 'cliente' ? 'Com você' : 'Com a equipe';
    if (it.vez.papel === 'cliente') return 'Com o cliente';
    return 'Com ' + (it.vez.pessoa ? nome(it.vez.pessoa) : ROTULO_PAPEL[it.vez.papel]);
  }

  const ESTADO_PR = { 'revisado': 'revisão aprovada, aguardando a liberação da prévia', 'com-o-cliente': 'prévia com o cliente', 'em-revisao': 'em revisão', 'ajuste-na-revisao': 'ajuste pedido na revisão', 'mesclado': 'mesclado, com a entrega no ambiente de homologação' };
  function resumoTasks(ids) {
    const conta = {};
    for (const id of ids) { const e = S.itens[id].estado; conta[e] = (conta[e] || 0) + 1; }
    const NOMES = { 'planejada': 'planejadas', 'aguardando-limite': 'aguardando a decisão de carga', 'conferido': 'conferidas pelo cliente', 'aguardando-homologacao': 'com o cliente para aprovar', 'para-conferir': 'com o cliente para conferir', 'revisado': 'revisadas', 'em-construcao': 'em construção', 'em-revisao': 'em revisão', 'proposta': 'propostas pelo agente', 'rascunho': 'em rascunho', 'homologado': 'homologadas' };
    return Object.entries(conta).map(([e, n]) => n + ' ' + (NOMES[e] || e)).join(' · ');
  }

  function faseDoPedido(id) {
    const ped = S.itens[id];
    const est = (ped.tasks || []).map((t) => S.itens[t].estado);
    if (!est.length) return ped.requisito ? 1 : 0;
    if (est.some((e) => e === 'aguardando-homologacao' || e === 'para-conferir')) return 3;
    if (est.every((e) => e === 'homologado')) return 4;
    if (est.some((e) => ['em-construcao', 'revisado', 'em-revisao', 'conferido'].includes(e))) return 2;
    return 1;
  }
  const FASES = ['Recebido', 'Em análise pela equipe', 'Em construção', 'Com você', 'Entregue'];

  function cargaDaSprint() {
    const carga = {};
    for (const [id, it] of Object.entries(S.itens)) {
      if (it.tipo !== 'task' || it.sprint !== S.projeto.sprint || FORA_DA_CARGA.includes(it.estado)) continue;
      carga[it.resp] = (carga[it.resp] || 0) + it.pf;
    }
    return carga;
  }

  /* Em andamento: o que está na mão da pessoa agora, por papel. */
  function emAndamento(pessoa, papel) {
    const L = [];
    if (papel === 'builder') {
      for (const [id, it] of Object.entries(S.itens)) {
        if (it.tipo !== 'task' || it.resp !== pessoa) continue;
        if (it.estado === 'em-construcao') L.push({ id, t: it.titulo + ' · ' + id, m: it.pf + ' PF · em construção' });
        if (it.estado === 'em-revisao') L.push({ id, t: it.titulo + ' · ' + id, m: 'PR #' + S.itens[it.pr].numero + ' em revisão · ' + comQuem(it.pr, papel, pessoa) });
      }
    } else if (papel === 'aipo') {
      for (const [id, it] of Object.entries(S.itens)) if (it.tipo === 'requisito' && it.rascunho) L.push({ id, t: it.titulo + ', versão ' + it.rascunho.versao, m: 'Rascunho do agente de requisitos, a partir de um comentário do cliente · aguardando a sua aprovação' });
      for (const [id, it] of Object.entries(S.itens)) if (it.tipo === 'pedido' && faseDoPedido(id) <= 1) L.push({ id, t: it.titulo, m: it.tasks.length ? 'Em análise · ' + resumoTasks(it.tasks) : 'Recebido · ainda sem requisito' });
    } else if (papel === 'pm') {
      const c = cargaDaSprint();
      const n = Object.values(S.itens).filter((it) => it.tipo === 'task' && it.sprint === S.projeto.sprint && !FORA_DA_CARGA.includes(it.estado));
      L.push({ id: 'sprint', carga: c, t: S.projeto.sprint + ': ' + n.length + ' tasks planejadas · ' + n.reduce((a, b) => a + b.pf, 0) + ' PF', m: resumoTasks(Object.keys(S.itens).filter((k) => S.itens[k].tipo === 'task' && S.itens[k].sprint === S.projeto.sprint && !FORA_DA_CARGA.includes(S.itens[k].estado))) });
    } else if (papel === 'pe') {
      for (const [id, it] of Object.entries(S.itens)) if (it.tipo === 'pr' && it.estado === 'em-revisao') {
        const p = S.pendencias.find((x) => x.item === id && x.tipo === 'revisar-pr' && x.estado !== 'feita');
        L.push({ id, t: 'PR #' + it.numero + ' · ' + it.titulo, m: (p ? comQuemPessoa(p.pessoa, pessoa) + ' · a revisão ' + prazo(p.prazo) + (p.pessoa !== pessoa && p.escala === 'o Principal Engineer' ? '; se vencer, escala para você' : '') : 'Com ' + nome(it.revisor)) });
      }
    } else if (papel === 'admin') {
      L.push({ id: 'plataforma', t: S.carteira.length + ' projetos · ' + Object.keys(S.pessoas).length + ' pessoas', m: 'Agentes ativos no Painel de Contas: ' + Object.values(S.agentes).filter((a) => a.estado === 'ativo').length + ' · agente de código desligado' });
    } else if (papel === 'cliente') {
      for (const [id, it] of Object.entries(S.itens)) if (it.tipo === 'comentario' && it.autor === pessoa) L.push({ id, t: '"' + it.texto + '"', m: it.estado === 'em-construcao' ? 'Em construção · você verá a correção na próxima prévia' : it.estado === 'corrigido' ? 'Corrigido na prévia nova · confira em Conferir' : it.estado === 'virou-pedido' ? 'Virou o pedido: ' + S.itens[it.pedidoNovo].titulo : 'Em análise pela equipe' });
    }
    return L;
  }

  /* O que a pessoa entregou e com quem está a vez. */
  function entregou(pessoa, papel) {
    return S.entregas.filter((x) => x.pessoa === pessoa && x.papel === papel).map((x) => {
      const it = S.itens[x.item];
      if (papel === 'cliente') {
        if (it.tipo === 'comentario') return null;
        return { id: x.item, t: it.titulo, m: comQuem(x.item, papel, pessoa) };
      }
      if (it.tipo === 'pr' && !x.como && S.pendencias.some((q) => q.estado !== 'feita' && q.tipo === 'ajuste-no-pr' && q.pr === x.item)) return { id: x.item, t: 'PR #' + it.numero + ': ' + it.titulo, m: 'Ajuste pedido no PR · ' + comQuem(x.item, papel, pessoa) };
      if (it.tipo === 'pr' && it.tasks.some((t) => S.pendencias.some((x) => x.estado !== 'feita' && x.tipo === 'ajuste-pedido' && x.item === t))) return { id: x.item, t: 'PR #' + it.numero + ': ' + it.titulo, m: 'Ajuste pedido pelo cliente na entrega · ' + comQuem(x.item, papel, pessoa) };
      if (it.tipo === 'pr' && it.tasks.some((t) => S.itens[t].estado === 'recusada')) return { id: x.item, t: 'PR #' + it.numero + ': ' + it.titulo, m: 'Entrega recusada pelo cliente · ' + comQuem(x.item, papel, pessoa) };
      if (it.tipo === 'pr' && it.tasks.every((t) => S.itens[t].estado === 'homologado')) return { id: x.item, t: 'PR #' + it.numero + ': ' + it.titulo, m: 'Entrega aprovada pelo cliente · homologada' };
      if (it.tipo === 'pr') return { id: x.item, t: (x.como === 'revisão' || x.como === 'ajuste na revisão' ? 'Revisão do PR #' : x.como === 'liberação' ? 'Prévia do PR #' : 'PR #') + it.numero + ': ' + it.titulo, m: (x.como === 'revisão' ? 'Você aprovou · ' : x.como === 'ajuste na revisão' ? 'Você pediu ajuste · ' : x.como === 'liberação' ? 'Você liberou · ' : '') + (ESTADO_PR[it.estado] || it.estado) + ' · ' + comQuem(x.item, papel, pessoa) };
      if (it.tipo === 'comentario') return { id: x.item, t: 'Triagem do comentário "' + (it.texto.length > 50 ? it.texto.slice(0, 47) + '...' : it.texto) + '"', m: 'Destino: ' + it.destino + ' · ' + comQuem(x.item, papel, pessoa) };
      if (it.tipo === 'requisito') return { id: x.item, t: it.titulo + ', versão ' + it.versao, m: 'Virou ' + it.tasks.length + ' tasks: ' + resumoTasks(it.tasks) };
      if (it.tipo === 'relato') return { id: x.item, t: it.titulo, m: it.estado === 'liberado' ? 'Liberado ao cliente pela AI PO · Com o cliente' : 'Em rascunho' };
      return { id: x.item, t: it.titulo || x.item, m: comQuem(x.item, papel, pessoa) };
    }).filter(Boolean);
  }

  /* Pedidos do cliente, com a fase de cada um. */
  function pedidosDoCliente() {
    return Object.entries(S.itens).filter(([, it]) => it.tipo === 'pedido').map(([id, it]) => ({ id, t: it.titulo, fase: faseDoPedido(id) }));
  }

  /* Uma linha por pessoa e item em "O que você entregou": a revisão guarda a última decisão de quem revisou. */
  function registrarEntrega(pessoa, papel, item, como) {
    const REVISAO = ['revisão', 'ajuste na revisão'];
    const ja = S.entregas.find((x) => x.pessoa === pessoa && x.papel === papel && x.item === item && (x.como === como || (REVISAO.includes(x.como) && REVISAO.includes(como))));
    if (ja) ja.como = como; else S.entregas.push({ pessoa, papel, item, como });
  }

  /* ---------- ações ---------- */
  const ACOES = {
    'liberar-previa': (pend) => {
      const pr = S.itens[pend.item];
      pr.estado = 'com-o-cliente';
      pr.previaLiberada = true;
      const tituloCli = (pr.tituloCli || pr.titulo).toLowerCase();
      pr.vez = { papel: 'cliente', pessoa: 'cli1' };
      for (const t of pr.tasks) { S.itens[t].estado = 'para-conferir'; S.itens[t].passo = 6; delete S.itens[t].vez; }
      /* O comentário corrigido e revisado chega ao cliente junto com a prévia nova. */
      for (const [cid, c] of Object.entries(S.itens)) {
        if (c.tipo !== 'comentario' || c.pr !== pend.item || !c.ajustado || c.estado !== 'em-construcao') continue;
        c.estado = 'corrigido'; c.vez = pr.vez;
        S.trilha.push({ item: cid, quando: 'agora', quem: nome(pend.pessoa), texto: 'Liberou a prévia nova, com a correção deste comentário.', cli: 'A correção do seu comentário está na prévia nova.' });
      }
      for (const x of S.pendencias) if (x.estado !== 'feita' && x.tipo === 'conferir-previa' && x.item === pend.item) { x.estado = 'feita'; x.substituida = true; }
      const nConf = S.pendencias.filter((x) => x.tipo === 'conferir-previa' && x.item === pend.item).length;
      S.pendencias.push({ id: 'CONF-' + pend.item + (nConf ? '-' + (nConf + 1) : ''), tipo: 'conferir-previa', bloco: 'com', pessoa: 'cli1', papel: 'cliente', item: pend.item, titulo: 'Conferir a prévia: ' + tituloCli, pediu: 'AI PO do projeto, que decide o que você vê', prazo: 3, escala: 'o PM do projeto', acao: 'Abrir a prévia', tela: 'conferir' });
      registrarEntrega(pend.pessoa, pend.papel, pend.item, 'liberação');
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Liberou ao cliente a prévia do PR #' + pr.numero + '.', cli: 'A equipe liberou a prévia: ' + tituloCli + '.' });
      return 'Prévia liberada. A vez agora é do Cliente 1.';
    },
    'conferir-previa': (pend) => {
      const pr = S.itens[pend.item];
      const n = Object.values(S.itens).filter((x) => x.tipo === 'comentario' && x.pr === pend.item && x.estado !== 'corrigido').length;
      for (const t of pr.tasks) if (S.itens[t].estado === 'para-conferir') S.itens[t].estado = 'conferido';
      /* Se uma correção já voltou à equipe, a vez fica com quem está nela. */
      if (!pr.vez || pr.vez.papel === 'cliente') pr.vez = { papel: 'aipo', pessoa: 'aipo1' };
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Concluiu a conferência da prévia do PR #' + pr.numero + (n ? ', com ' + n + (n === 1 ? ' comentário.' : ' comentários.') : ', sem comentário.'), cli: 'Você concluiu a conferência' + (n ? ', com ' + n + (n === 1 ? ' comentário.' : ' comentários.') : ', sem comentário.') });
      return 'Conferência concluída. A vez agora é da equipe.';
    },
    'triar-comentario': (pend, d) => {
      const cmt = S.itens[pend.item], pr = S.itens[cmt.pr];
      let destino = cmt.triagem.sugestao, nota = 'Aprovou a triagem sugerida: ' + cmt.triagem.sugestao + ', para ' + cmt.triagem.destino + '.';
      if (d.saida === 'outro') {
        if (!DESTINOS.some((x) => x[0] === d.destino)) return { erro: 'Escolha o destino.' };
        if (d.destino === cmt.triagem.sugestao) return { erro: 'Esse é o destino sugerido: use Aprovar a sugestão.' };
        if (!MOTIVOS_EQUIPE.includes(d.motivo)) return { erro: 'Escolha o motivo da lista.' };
        if (d.motivo === OUTRO && !(d.linha || '').trim()) return { erro: 'Escreva uma linha sobre o motivo "outro".' };
        destino = d.destino;
        /* Trocar a sugestão do agente é um rótulo humano: o motivo vira sinal de aprimoramento (docs/22). */
        nota = 'Trocou a sugestão do agente (' + cmt.triagem.sugestao + ') por ' + destino + '. Motivo: ' + d.motivo + (d.motivo === OUTRO ? ' (' + d.linha.trim() + ')' : '') + '.';
      } else if (d.saida !== 'aprovar') return { erro: 'Escolha o que fazer com o comentário.' };
      if (destino === 'ajuste de escopo' && S.itens[S.itens[S.itens[pr.tasks[0]].pedido].requisito].rascunho) return { erro: 'Este requisito já tem uma versão nova em rascunho. Decida aquela antes.' };
      cmt.destino = destino;
      const curto = cmt.texto.length > 50 ? cmt.texto.slice(0, 47) + '...' : cmt.texto;
      let cli = 'A equipe recebeu o seu comentário e está analisando.';
      if (destino === 'correção') {
        const alvo = pr.tasks[0], t = S.itens[alvo];
        t.estado = 'em-construcao'; t.passo = 5; t.vez = { papel: 'builder', pessoa: t.resp };
        pr.vez = t.vez;
        cmt.estado = 'em-construcao'; cmt.vez = t.vez;
        S.pendencias.push({ id: 'AJ-' + pend.item, tipo: 'ajuste-no-pr', bloco: 'com', pessoa: t.resp, papel: 'builder', item: alvo, cmt: pend.item, pr: cmt.pr, titulo: 'Ajuste pedido no PR #' + pr.numero + ': "' + curto + '"', pediu: nome(pend.pessoa) + ', a partir do comentário do Cliente 1 no trecho ' + cmt.rotuloTrecho.toLowerCase(), prazo: 2, escala: 'o PM', acao: 'Abrir a task', tela: 'task' });
        cli = 'A equipe recebeu o seu comentário como correção e começou a construção.';
      } else if (destino === 'dado a conferir') {
        /* No v2, o dado a conferir vai ao PM e à AI PO como aviso, sem decisão nova. */
        cmt.estado = 'em-analise'; cmt.vez = { papel: 'pm', pessoa: 'pm1' };
        S.pendencias.push({ id: 'DADO-' + pend.item, tipo: 'aviso-dado', bloco: 'prep', pessoa: 'pm1', papel: 'pm', item: pend.item, agente: 'sistema', titulo: 'Dado a conferir com o órgão no trecho ' + cmt.rotuloTrecho.toLowerCase(), motivo: 'O cliente aponta divergência entre o dado e a evidência, e a AI PO enviou ao PM e a ela.', fonte: 'Comentário do Cliente 1 na prévia do PR #' + pr.numero, efeito: 'É aviso: nada muda até alguém do projeto conferir com o órgão.', tela: 'riscos' });
      } else if (destino === 'ajuste de escopo') {
        /* Quem escreve não decide (docs/21, D04): a versão nova é rascunho do agente de requisitos, e a AI PO aprova (P04, 2 dias úteis, escala ao PM). */
        const reqId = S.itens[S.itens[pr.tasks[0]].pedido].requisito, req = S.itens[reqId];
        req.rascunho = { versao: req.versao + 1, origem: pend.item, texto: cmt.texto, porAgente: 'requisitos', confianca: 'média', motivo: 'O comentário pede mudar um termo que está no texto aprovado do requisito.' };
        req.rascunho.impacto = calcularImpacto(reqId, req.versao);
        cmt.estado = 'em-analise'; cmt.vez = { papel: 'aipo', pessoa: pend.pessoa };
        S.pendencias.push({ id: 'VER-' + reqId + '-v' + req.rascunho.versao, tipo: 'aprovar-versao', bloco: 'com', pessoa: pend.pessoa, papel: 'aipo', item: reqId, agente: 'requisitos', titulo: 'Aprovar a versão ' + req.rascunho.versao + ' do requisito ' + req.titulo.toLowerCase(), pediu: 'Agente de requisitos, a partir do comentário do Cliente 1 que você triou como ajuste de escopo', prazo: 2, escala: 'o PM', acao: 'Abrir o requisito', tela: 'requisitos', motivo: req.rascunho.motivo, confianca: 'média' });
      } else {
        let k = 4; while (S.itens['PED-0' + k]) k++;
        const novo = 'PED-0' + k;
        S.itens[novo] = { tipo: 'pedido', titulo: cmt.texto, tasks: [], origem: pend.item };
        cmt.estado = 'virou-pedido'; cmt.pedidoNovo = novo; cmt.vez = { papel: 'aipo', pessoa: pend.pessoa };
        cli = 'A equipe recebeu o seu comentário como ideia nova, e ele virou um pedido.';
      }
      S.entregas.push({ pessoa: pend.pessoa, papel: 'aipo', item: pend.item, como: 'triagem' });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: nota, cli });
      return 'Comentário triado: ' + destino + '.';
    },
    'aprovar-versao': (pend, d) => {
      const req = S.itens[pend.item], rasc = req.rascunho;
      const linha = (d.linha || '').trim();
      if (d.saida === 'recusar') {
        if (!MOTIVOS_EQUIPE.includes(d.motivo)) return { erro: 'Escolha o motivo da lista.' };
        if (d.motivo === OUTRO && !linha) return { erro: 'Escreva uma linha sobre o motivo "outro".' };
        delete req.rascunho;
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Recusou a versão ' + rasc.versao + ' proposta pelo agente de requisitos. Motivo: ' + d.motivo + (linha ? ' (' + linha + ')' : '') + '.' });
        if (rasc.origem && S.itens[rasc.origem]) S.trilha.push({ item: rasc.origem, quando: 'agora', quem: nome(pend.pessoa), texto: 'A versão nova do requisito foi recusada.', cli: 'A equipe analisou o seu comentário e manteve o combinado. A resposta vem na reunião semanal.' });
        return 'Versão ' + rasc.versao + ' recusada. O requisito segue na versão ' + req.versao + '.';
      }
      if (d.saida !== 'aprovar') return { erro: 'Escolha o que fazer com a versão.' };
      const de = req.versao;
      req.versao = rasc.versao;
      req.ondas = (req.ondas || []).concat([{ de, para: req.versao, impacto: rasc.impacto }]);
      delete req.rascunho;
      /* Um cartão Mudança a revisar por pessoa atingida (docs/40; D50 no v2): sinal, sem prazo, que não trava nada. Cada item se decide no cartão. */
      const porDono = {};
      for (const row of rasc.impacto) { const k = row.dono + '|' + row.papel; (porDono[k] = porDono[k] || []).push(Object.assign({ decisao: null }, row)); }
      for (const [k, rows] of Object.entries(porDono)) {
        const [dono, papel] = k.split('|');
        S.pendencias.push({ id: 'MUD-' + pend.item + '-v' + req.versao + '-' + dono + '-' + papel, tipo: 'mudanca-a-revisar', bloco: 'com', semPrazo: true, pessoa: dono, papel, item: pend.item, onda: req.versao, linhas: rows, titulo: 'Mudança a revisar: requisito ' + req.titulo.toLowerCase() + ' na versão ' + req.versao, pediu: nome(pend.pessoa) + ' aprovou a versão ' + req.versao + ' · ' + rows.length + (rows.length === 1 ? ' item seu' : ' itens seus'), acao: 'Abrir o cartão', tela: 'inicio' });
      }
      if (rasc.origem && S.itens[rasc.origem]) S.trilha.push({ item: rasc.origem, quando: 'agora', quem: nome(pend.pessoa), texto: 'O requisito foi para a versão ' + req.versao + ' a partir deste comentário.', cli: 'O que você pediu entrou no combinado. A equipe vai planejar a construção.' });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Aprovou a versão ' + req.versao + ' do requisito, proposta pelo agente de requisitos.' });
      return 'Versão ' + req.versao + ' aprovada. Cada pessoa atingida recebe a mudança a revisar.';
    },
    'mudanca-a-revisar': (pend, d) => {
      const row = pend.linhas.find((x) => x.item === d.item && x.etapa === d.etapa && !x.decisao);
      if (!row) return { erro: 'Esse item já foi decidido.' };
      const linha = (d.linha || '').trim();
      if (d.saida === 'manter') {
        if (!linha) return { erro: 'Escreva em uma linha por que o item fica como está.' };
        row.decisao = 'mantido'; row.motivo = linha;
        S.trilha.push({ item: row.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Manteve o item na versão ' + (pend.onda - 1) + ' do requisito (' + row.etapa + '): ' + linha });
      } else if (d.saida === 'aplicar') {
        row.decisao = 'aplicada';
        let cli = null;
        if (/Aprovação da entrega/.test(row.etapa)) {
          const a = S.pendencias.find((x) => x.estado !== 'feita' && x.tipo === 'aprovar-entrega' && x.item === row.item);
          if (a) { a.estado = 'feita'; a.cancelada = true; }
          const t = S.itens[row.item]; t.vez = { papel: 'aipo', pessoa: pend.pessoa };
          S.pendencias.push({ id: 'LIB-ENT-' + row.item + '-v' + pend.onda, tipo: 'liberar-entrega', bloco: 'com', pessoa: pend.pessoa, papel: 'aipo', item: row.item, titulo: 'Liberar de novo ao cliente a entrega: ' + t.titulo.toLowerCase(), pediu: 'Você aplicou a versão ' + pend.onda + ' do requisito', prazo: 1, escala: 'o PM', acao: 'Abrir a entrega', tela: 'liberacao' });
          cli = 'A equipe atualizou a entrega para o combinado novo. Ela volta para você aprovar.';
        } else if (/Prévia/.test(row.etapa)) {
          const c = S.pendencias.find((x) => x.estado !== 'feita' && x.tipo === 'conferir-previa' && x.item === row.item);
          if (c) { c.estado = 'feita'; c.cancelada = true; }
          const pr = S.itens[row.item]; pr.previaLiberada = false; pr.vez = { papel: 'aipo', pessoa: pend.pessoa };
          S.pendencias.push({ id: 'LIB-' + row.item + '-v' + pend.onda, tipo: 'liberar-previa', bloco: 'com', pessoa: pend.pessoa, papel: 'aipo', item: row.item, titulo: 'Liberar de novo ao cliente a prévia do PR #' + pr.numero, pediu: 'Você aplicou a versão ' + pend.onda + ' do requisito', prazo: 1, escala: 'o PM', acao: 'Abrir a prévia', tela: 'liberacao' });
          cli = 'A prévia foi recolhida para seguir o combinado novo. Ela volta para você conferir.';
        }
        S.trilha.push({ item: row.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Aplicou a versão ' + pend.onda + ' do requisito (' + row.etapa + ').', cli });
      } else return { erro: 'Escolha Aplicar a mudança ou Manter o item.' };
      if (pend.linhas.some((x) => !x.decisao)) { salvar(); render(); return { parcial: true }; }
      return 'Mudança revisada em todos os itens.';
    },
    'liberar-entrega': (pend) => {
      const t = S.itens[pend.item];
      t.vez = { papel: 'cliente', pessoa: 'cli1' };
      S.pendencias.push({ id: 'APR-' + pend.item.replace('PCX-T-', '') + '-' + (pend.sufixo || pend.id.split('-v')[1]), tipo: 'aprovar-entrega', bloco: 'com', pessoa: 'cli1', papel: 'cliente', item: pend.item, titulo: 'Aprovar a entrega: ' + t.titulo.toLowerCase(), pediu: pend.pediuCli || 'Equipe do projeto, com o combinado novo', prazo: 5, escala: 'o PM do projeto', acao: 'Abrir a entrega', tela: 'entregas' });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Liberou de novo ao cliente a entrega.', cli: pend.cliTexto || 'A equipe liberou a entrega de novo, com o combinado novo.' });
      return 'Entrega liberada. A vez agora é do Cliente 1.';
    },
    /* P05 das tasks propostas, uma task por vez (v2): aprovar a que cabe; a que passa do limite se passa a outra pessoa,
       vira pedido de exceção ao Head Ops (P06, 1 dia útil, escala à Direção) ou fica para a sprint seguinte. */
    'aprovar-tasks': (pend, d) => {
      const ped = S.itens[pend.item];
      const t = S.itens[d.task];
      if (!t || !ped.tasks.includes(d.task) || t.estado !== 'proposta') return { erro: 'Essa task já foi decidida.' };
      const carga = cargaDaSprint(), lim = S.projeto.limite;
      const cabe = (ps) => (carga[ps] || 0) + t.pf <= lim;
      const linha = (d.linha || '').trim();
      let nota;
      if (d.saida === 'aprovar') {
        if (!cabe(t.resp)) return { erro: 'Esta task passa do limite de carga de ' + nome(t.resp) + '. Passe a outra pessoa, peça exceção ao Head Ops ou adie.' };
        t.estado = 'planejada'; t.vez = { papel: 'builder', pessoa: t.resp };
        nota = 'Aprovou a task ' + d.task + ' para ' + nome(t.resp) + '.';
      } else if (d.saida === 'passar') {
        if (!d.para || !S.pessoas[d.para] || !cabe(d.para)) return { erro: 'Escolha uma pessoa que caiba no limite de carga.' };
        nota = 'Passou a task ' + d.task + ' de ' + nome(t.resp) + ' para ' + nome(d.para) + ', que cabe no limite de carga.';
        t.resp = d.para; t.estado = 'planejada'; t.vez = { papel: 'builder', pessoa: d.para };
      } else if (d.saida === 'excecao') {
        t.estado = 'aguardando-limite'; t.vez = { papel: 'headops', pessoa: 'headops' };
        /* O Head Ops vê só números (ADR-049): o item da exceção guarda o projeto, a sprint e a carga, sem a task nem a pessoa. */
        S.itens['EXC-' + d.task] = { tipo: 'excecao', titulo: 'Exceção ao limite de carga no ' + S.projeto.nome, task: d.task, projeto: S.projeto.nome, sprint: S.projeto.sprint, iria: (carga[t.resp] || 0) + t.pf, limite: lim };
        S.trilha.push({ item: 'EXC-' + d.task, quando: 'agora', quem: 'PM do ' + S.projeto.nome, texto: 'Pediu exceção ao limite de carga: uma pessoa passaria a ' + ((carga[t.resp] || 0) + t.pf) + ' de ' + lim + ' PF na ' + S.projeto.sprint + '.' });
        S.pendencias.push({ id: 'EXC-' + d.task, tipo: 'excecao-limite', bloco: 'com', pessoa: 'headops', papel: 'headops', item: 'EXC-' + d.task, projeto: S.projeto.nome, titulo: 'Exceção ao limite de carga no ' + S.projeto.nome + ': uma pessoa passaria a ' + ((carga[t.resp] || 0) + t.pf) + ' de ' + lim + ' PF na ' + S.projeto.sprint, pediu: 'PM do ' + S.projeto.nome, prazo: 1, escala: 'a Direção', acao: 'Abrir a capacidade', tela: 'capacidade' });
        nota = 'Pediu ao Head Ops exceção ao limite de carga para a task ' + d.task + '.';
      } else if (d.saida === 'adiar') {
        const k = S.projeto.sprints.indexOf(S.projeto.sprint) + 1;
        if (!S.projeto.sprints[k]) return { erro: 'Não há sprint seguinte planejada.' };
        t.sprint = S.projeto.sprints[k]; t.estado = 'planejada'; t.vez = { papel: 'builder', pessoa: t.resp };
        nota = 'Adiou a task ' + d.task + ' para a ' + t.sprint + '.';
      } else if (d.saida === 'ajuste' || d.saida === 'recusar') {
        if (!MOTIVOS_EQUIPE.includes(d.motivo)) return { erro: 'Escolha o motivo da lista.' };
        if (d.motivo === OUTRO && !linha) return { erro: 'Escreva uma linha sobre o motivo "outro".' };
        t.estado = d.saida === 'ajuste' ? 'rascunho' : 'recusada';
        nota = (d.saida === 'ajuste' ? 'Pediu ajuste na task ' + d.task + ' ao agente de planejamento' : 'Recusou a task ' + d.task) + '. Motivo: ' + d.motivo + (linha ? ' (' + linha + ')' : '') + '.';
      } else return { erro: 'Escolha o que fazer com a task.' };
      S.trilha.push({ item: d.task, quando: 'agora', quem: nome(pend.pessoa), texto: nota });
      if (ped.tasks.some((x) => S.itens[x].estado === 'proposta')) { salvar(); render(); return { parcial: true }; }
      return 'Tasks propostas decididas.';
    },
    /* P24 do PM (v2): o risco se encerra com a evidência ou se assume com o motivo; o impedimento só se encerra, com a evidência,
       e o que nasceu de uma recusa diz o que foi combinado com o cliente. Bloqueado, não se decide. Escalar leva ao Head Ops, o último nível. */
    'impedimento': (pend, d) => {
      const it = S.itens[pend.item];
      const ev = (d.linha || '').trim();
      const nomeIt = it.forma === 'risco' ? 'o risco' : 'o impedimento';
      if (d.saida === 'escalar') {
        if (pend.papel !== 'pm') return { erro: 'Não há outro nível acima.' };
        const esc2 = 'ESC-' + pend.item;
        S.itens[esc2] = { tipo: 'escalada', titulo: (it.forma === 'risco' ? 'Risco' : 'Impedimento') + ' escalado do ' + S.projeto.nome, forma: it.forma, saude: it.saude, aberto: it.aberto, origem: pend.item };
        S.pendencias.push({ id: pend.id + '-HO', tipo: 'impedimento-escalado', bloco: 'com', pessoa: 'headops', papel: 'headops', item: esc2, projeto: S.projeto.nome, titulo: S.itens[esc2].titulo + (it.saude ? ' · ' + it.saude : ''), pediu: 'PM do ' + S.projeto.nome + ' escalou', prazo: pend.prazo, semNivelAcima: true, acao: 'Abrir', tela: 'capacidade' });
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Escalou ao Head Ops.' });
        S.trilha.push({ item: esc2, quando: 'agora', quem: 'PM do ' + S.projeto.nome, texto: 'Escalou ' + nomeIt + ' ao Head Ops.' });
        return 'Escalado ao Head Ops.';
      }
      if (d.saida !== 'encerrar') return { erro: 'Escolha o que fazer.' };
      if (it.bloqueadoPor) return { erro: 'Bloqueado: ' + it.bloqueadoPor };
      if (it.forma === 'risco' && d.modo === 'assumir') {
        if (!(d.motivo || '').trim()) return { erro: 'Escreva o motivo para assumir o risco.' };
        it.estado = 'assumido';
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Assumiu o risco: ' + d.motivo.trim() });
        return 'Risco assumido, com o motivo.';
      }
      if (!ev) return { erro: 'Escreva a evidência do encerramento.' };
      if (it.origemRecusa && !['ajuste', 'aditivo', 'cancelamento'].includes(d.decisao)) return { erro: 'Diga o que foi combinado com o cliente: ajuste, aditivo ou cancelamento.' };
      it.estado = 'encerrado'; it.evidencia = ev;
      if (it.origemRecusa) {
        const t = S.itens[it.origemRecusa];
        it.decisao = d.decisao;
        if (d.decisao === 'ajuste') {
          t.estado = 'em-construcao'; t.passo = 5; t.vez = { papel: 'builder', pessoa: t.resp };
          S.pendencias.push({ id: 'AJ-' + pend.item, tipo: 'ajuste-pedido', bloco: 'com', pessoa: t.resp, papel: 'builder', item: it.origemRecusa, titulo: 'Ajuste combinado com o cliente na entrega: ' + t.titulo.toLowerCase(), pediu: nome(pend.pessoa) + ', depois da recusa do cliente', prazo: 2, escala: 'o PM', acao: 'Abrir a task', tela: 'task' });
        }
        else if (d.decisao === 'cancelamento') { t.estado = 'cancelada'; t.vez = null; }
        S.trilha.push({ item: it.origemRecusa, quando: 'agora', quem: nome(pend.pessoa), texto: 'Combinado com o cliente depois da recusa: ' + ({ ajuste: 'ajuste na entrega', aditivo: 'termo aditivo', cancelamento: 'cancelamento' })[d.decisao] + '.', cli: 'A equipe combinou com você o próximo passo: ' + ({ ajuste: 'um ajuste na entrega', aditivo: 'um termo aditivo', cancelamento: 'o cancelamento da entrega' })[d.decisao] + '.' });
      }
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Encerrou ' + nomeIt + ', com a evidência: ' + ev });
      return (it.forma === 'risco' ? 'Risco' : 'Impedimento') + ' encerrado, com a evidência na trilha.';
    },
    /* Relato da semana: o sistema monta, o PM escreve a redação e envia; a AI PO libera ao cliente (P08, 1 dia útil, escala à Direção, como no v2). */
    'relato': (pend, d) => {
      const rel = S.itens[pend.item];
      const red = (d.linha || '').trim();
      if (!red) return { erro: 'Escreva a redação do relato antes de enviar.' };
      rel.redacao = red; rel.estado = 'para-liberar'; rel.linhas = linhasDoRelato(pend.item);
      const rasc = S.pendencias.find((x) => x.estado !== 'feita' && x.tipo === 'rascunho-relato' && x.item === pend.item);
      if (rasc) rasc.estado = 'feita';
      S.pendencias.push({ id: 'LIB-' + pend.item, tipo: 'liberar-relato', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: pend.item, titulo: 'Liberar ao cliente o ' + rel.titulo.toLowerCase(), pediu: nome(pend.pessoa) + ' escreveu a redação', prazo: 1, escala: 'a Direção', acao: 'Abrir o relato', tela: 'liberacao' });
      S.entregas.push({ pessoa: pend.pessoa, papel: 'pm', item: pend.item });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Escreveu a redação e enviou o relato para a AI PO liberar.' });
      return 'Relato enviado. A AI PO libera ao cliente.';
    },
    'liberar-medicao': (pend) => {
      const m = S.itens[pend.item];
      S.pendencias.push({ id: 'P12-CLI-' + pend.item, tipo: 'aceitar-medicao', bloco: 'com', pessoa: 'cli1', papel: 'cliente', item: pend.item, titulo: 'Aprovar a medição da ' + m.sprint, pediu: 'PM do projeto, com ' + m.entra.length + (m.entra.length === 1 ? ' entrega homologada' : ' entregas homologadas'), prazo: 5, escala: 'o PM, que avisa a Direção', acao: 'Abrir a medição', tela: 'entregas' });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Liberou ao cliente a medição.', cli: 'A equipe enviou a medição da ' + m.sprint + ' para você aprovar.' });
      return 'Medição liberada ao cliente.';
    },
    'liberar-relato': (pend) => {
      const rel = S.itens[pend.item];
      rel.estado = 'liberado';
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Liberou ao cliente o relato.', cli: 'A equipe enviou o ' + rel.titulo.toLowerCase() + '.' });
      return 'Relato liberado ao cliente.';
    },
    /* P11 do PM: fecha a medição só com o que foi homologado; o aceite é do cliente e da Direção (P12, 5 dias úteis, como no v2). */
    'fechar-medicao': (pend) => {
      const med = medicaoDe(pend.item);
      if (!med.entra.length) return { erro: 'Nenhuma entrega homologada nesta sprint: a medição não fecha.' };
      const id = 'MED-S' + med.n;
      if (S.itens[id]) return { erro: 'A medição desta sprint já foi fechada.' };
      S.itens[id] = { tipo: 'medicao', titulo: 'Medição da ' + med.sprint, sprint: med.sprint, entra: med.entra.map((x) => x.id), pf: med.pf, estado: 'fechada' };
      /* Como no v2: o P11 abre o P08 da AI PO (1 dia útil, escala ao PM) e o P12 da Direção; o cliente vê o cartão quando a AI PO liberar. */
      S.pendencias.push({ id: 'LIB-' + id, tipo: 'liberar-medicao', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: id, titulo: 'Liberar ao cliente a medição da ' + med.sprint, pediu: nome(pend.pessoa) + ' fechou a medição', prazo: 1, escala: 'o PM', acao: 'Abrir a medição', tela: 'liberacao' });
      S.pendencias.push({ id: 'P12-DIR-' + id, tipo: 'aceitar-medicao', bloco: 'com', pessoa: 'direcao', papel: 'direcao', item: id, titulo: 'Aprovar a medição da ' + med.sprint + ' do ' + S.projeto.nome, pediu: 'PM do projeto', prazo: 5, ultimoNivel: true, acao: 'Abrir a medição', tela: 'inicio' });
      S.entregas.push({ pessoa: pend.pessoa, papel: 'pm', item: id });
      S.trilha.push({ item: id, quando: 'agora', quem: nome(pend.pessoa), texto: 'Fechou a medição da ' + med.sprint + ': ' + med.pf + ' PF faturáveis.' });
      return 'Medição fechada. A Direção já pode decidir. O cliente vê quando a AI PO liberar.';
    },
    /* O Builder responde ao cartão de ajuste: diz o que mudou, e outra pessoa revisa só o ajuste (P07, 1 dia útil, escala ao Principal Engineer). */
    'ajuste-no-pr': (pend, d) => enviarAjuste(pend, d),
    'ajuste-pedido': (pend, d) => enviarAjuste(pend, d),
    /* P07: quem escreveu o PR nunca o revisa. Aprovar passa a vez à AI PO; pedir mudança volta ao autor como cartão. */
    'revisar-pr': (pend, d) => {
      const alvo = S.itens[pend.item], prId = alvo.tipo === 'pr' ? pend.item : alvo.pr, pr = S.itens[prId];
      if (pr.autor === pend.pessoa) return { erro: 'Quem escreveu o PR não o revisa.' };
      const naEntrega = alvo.tipo === 'task';
      const oque = (d.linha || '').trim();
      if (d.saida === 'ajuste') {
        if (!oque) return { erro: 'Escreva o que precisa mudar.' };
        const curto = oque.length > 60 ? oque.slice(0, 57) + '...' : oque;
        const tId = naEntrega ? pend.item : pr.tasks[0];
        const volta = { papel: 'builder', pessoa: pr.autor };
        /* O ajuste volta ao autor, e a revisão seguinte é de quem pediu. */
        pr.revisor = pend.pessoa; pr.vez = volta;
        if (naEntrega) { alvo.estado = 'em-construcao'; alvo.vez = volta; }
        else { pr.estado = 'ajuste-na-revisao'; for (const t of pr.tasks) if (S.itens[t].estado === 'em-revisao') { S.itens[t].estado = 'em-construcao'; S.itens[t].vez = volta; } }
        if (pend.cmt) S.itens[pend.cmt].vez = volta;
        S.pendencias.push({ id: 'AJR-' + pend.id, tipo: 'ajuste-no-pr', bloco: 'com', pessoa: pr.autor, papel: 'builder', item: tId, pr: prId, cmt: pend.cmt, daRevisao: true, titulo: 'Ajuste pedido na revisão do PR #' + pr.numero + ': "' + curto + '"', pediu: nome(pend.pessoa) + ', na revisão', prazo: 2, escala: 'o PM', acao: 'Abrir a task', tela: 'task' });
        registrarEntrega(pend.pessoa, pend.papel, prId, 'ajuste na revisão');
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Pediu ajuste na revisão: ' + oque });
        return 'Ajuste pedido. A vez agora é de ' + nome(pr.autor) + '.';
      }
      if (d.saida !== 'aprovar') return { erro: 'Escolha o que fazer com a revisão.' };
      if (naEntrega) {
        /* Ajuste numa entrega já mesclada: revisado, volta à AI PO para liberar de novo ao cliente. */
        const n = S.pendencias.filter((x) => x.tipo === 'liberar-entrega' && x.item === pend.item).length + 1;
        alvo.estado = 'aguardando-homologacao'; alvo.passo = 7; alvo.vez = { papel: 'aipo', pessoa: 'aipo1' }; pr.vez = alvo.vez;
        S.pendencias.push({ id: 'LIB-ENT-' + pend.item + '-aj' + n, sufixo: 'aj' + n, pediuCli: 'Equipe do projeto, com o ajuste que você pediu', cliTexto: 'A equipe liberou a entrega de novo, com o ajuste que você pediu.', tipo: 'liberar-entrega', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: pend.item, titulo: 'Liberar de novo ao cliente a entrega: ' + alvo.titulo.toLowerCase(), pediu: nome(pr.autor) + ', com o ajuste revisado por ' + nome(pend.pessoa), prazo: 1, escala: 'o PM', acao: 'Abrir a entrega', tela: 'liberacao' });
      } else {
        pr.estado = 'revisado'; pr.revisor = pend.pessoa;
        for (const t of pr.tasks) if (['em-revisao', 'em-construcao'].includes(S.itens[t].estado)) { S.itens[t].estado = 'revisado'; S.itens[t].passo = 6; delete S.itens[t].vez; }
        /* Só o comentário deste ajuste fica corrigido; com outro cartão de ajuste aberto no PR, a prévia espera por ele. */
        if (pend.cmt) S.itens[pend.cmt].ajustado = true;
        const outro = S.pendencias.find((x) => x.estado !== 'feita' && AJUSTES.includes(x.tipo) && (x.pr || prDoItem(x.item)) === prId);
        const jaParaLiberar = S.pendencias.some((x) => x.estado !== 'feita' && x.tipo === 'liberar-previa' && x.item === prId);
        if (outro) {
          pr.vez = { papel: 'builder', pessoa: outro.pessoa };
        } else if (jaParaLiberar) {
          pr.vez = { papel: 'aipo', pessoa: 'aipo1' };
        } else if (pr.previa) {
          pr.vez = { papel: 'aipo', pessoa: 'aipo1' }; pr.previaLiberada = false;
          const n = S.pendencias.filter((x) => x.tipo === 'liberar-previa' && x.item === prId).length + 1;
          S.pendencias.push({ id: 'LIB-' + prId + '-' + n, tipo: 'liberar-previa', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: prId, titulo: (pend.ajuste ? 'Liberar de novo ao cliente a prévia do PR #' : 'Liberar ao cliente a prévia do PR #') + pr.numero, pediu: nome(pr.autor) + ', com ' + (pend.ajuste ? 'o ajuste revisado' : 'a revisão aprovada') + ' por ' + nome(pend.pessoa), prazo: 1, escala: 'o PM', acao: 'Abrir a prévia', tela: 'liberacao' });
        } else {
          /* Como no conjunto de exemplo: quem escreveu o PR não libera a prévia dele; a liberação fica com outra pessoa no papel de AI PO. */
          pr.vez = { papel: 'aipo', pessoa: null };
        }
        if (pend.cmt) S.itens[pend.cmt].vez = pr.vez;
      }
      registrarEntrega(pend.pessoa, pend.papel, prId, 'revisão');
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: (pend.subiu ? 'Revisou, depois que a revisão escalou por prazo vencido, e aprovou ' : 'Revisou e aprovou ') + (pend.ajuste ? 'o ajuste ' + (naEntrega ? 'na entrega.' : 'no PR #' + pr.numero + '.') : 'o PR #' + pr.numero + '.') });
      const v = naEntrega ? alvo.vez : pr.vez;
      return 'Revisão aprovada. A vez agora é ' + (v.pessoa ? 'de ' + nome(v.pessoa) : 'da AI PO') + '.';
    },
    'aprovar-entrega': (pend, d) => {
      const t = S.itens[pend.item], pr = t.pr && S.itens[t.pr];
      if (d.saida === 'aprovar') {
        t.estado = 'homologado'; t.aprovadoPor = pend.pessoa; t.vez = { papel: 'pm', pessoa: 'pm1' };
        if (pr && pr.tasks.every((x) => S.itens[x].estado === 'homologado')) pr.vez = t.vez;
        /* No v2, a homologação libera a medição da sprint para o PM (P11, 2 dias úteis, escala para a Direção). */
        S.pendencias.push({ id: 'MED-' + t.sprint.replace(/\D/g, ''), tipo: 'fechar-medicao', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: pend.item, titulo: 'Fechar a medição da ' + t.sprint, pediu: 'Cliente 1 aprovou a entrega: ' + t.titulo.toLowerCase(), prazo: 2, escala: 'a Direção', acao: 'Abrir o fechamento', tela: 'fechamento' });
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Aprovou a entrega.', cli: 'Você aprovou a entrega.' });
        return 'Entrega aprovada.';
      }
      if (d.saida !== 'ajuste' && d.saida !== 'recusar') return { erro: 'Escolha o que fazer com a entrega.' };
      const motivo = MOTIVOS_AJUSTE.find((m) => m[0] === d.motivo);
      if (!motivo) return { erro: 'Escolha o que aconteceu.' };
      const oque = (d.linha || '').trim();
      if (!oque) return { erro: 'Escreva o que precisa mudar.' };
      const n = S.pendencias.filter((x) => x.item === pend.item && /^(AJ|IMP)-/.test(x.id)).length + 1;
      if (d.saida === 'recusar') {
        t.estado = 'recusada'; t.vez = { papel: 'pm', pessoa: 'pm1' };
        if (pr) pr.vez = t.vez;
        /* No v2, a recusa do cliente abre um impedimento para o PM (P24, 2 dias úteis, escala ao Head Ops), que decide com ele o próximo passo. */
        const impId = 'IMP-REC-' + pend.item.replace('PCX-T-', '') + '-' + n;
        S.itens[impId] = { tipo: 'risco', forma: 'impedimento', titulo: 'O cliente recusou a entrega: o PM decide com ele o próximo passo', trava: t.titulo, responde: 'Cliente 1', saude: 'Em risco', aberto: 'aberto agora', estado: 'aberto', origemRecusa: pend.item };
        S.pendencias.push({ id: 'P24-' + impId, tipo: 'impedimento', bloco: 'com', pessoa: 'pm1', papel: 'pm', item: impId, titulo: 'O cliente recusou a entrega: o PM decide com ele o próximo passo', pediu: 'Cliente 1, na entrega ' + t.titulo.toLowerCase() + ' · ' + motivo[1].toLowerCase() + ' · ' + oque, prazo: 2, escala: 'o Head Ops', acao: 'Abrir o impedimento', tela: 'riscos' });
        S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Recusou a entrega (' + motivo[0] + '): ' + oque, cli: 'Você recusou a entrega: ' + oque });
        return 'Entrega recusada. A vez agora é da equipe.';
      }
      t.estado = 'em-construcao'; t.passo = 5; t.vez = { papel: 'builder', pessoa: t.resp };
      if (pr) pr.vez = t.vez;
      S.pendencias.push({ id: 'AJ-' + pend.item + '-' + n, tipo: 'ajuste-pedido', bloco: 'com', pessoa: t.resp, papel: 'builder', item: pend.item, titulo: 'Ajuste pedido pelo cliente na entrega: ' + t.titulo.toLowerCase(), pediu: 'Cliente 1 · ' + motivo[1].toLowerCase() + ' · ' + oque, prazo: 2, escala: 'o PM', acao: 'Abrir a task', tela: 'task' });
      S.trilha.push({ item: pend.item, quando: 'agora', quem: nome(pend.pessoa), texto: 'Pediu ajuste na entrega (' + motivo[0] + '): ' + oque, cli: 'Você pediu ajuste: ' + oque });
      return 'Ajuste pedido. A vez agora é da equipe.';
    }
  };

  function enviarAjuste(pend, d) {
    const oque = (d.linha || '').trim();
    if (!oque) return { erro: 'Escreva o que você mudou.' };
    const t = S.itens[pend.item], prId = pend.pr || t.pr, pr = prId && S.itens[prId];
    if (!pr) return { erro: 'Esta task ainda não tem PR para revisar.' };
    /* Revisa quem já revisou o PR; se foi o próprio autor, o primeiro Builder do projeto que não é ele. */
    const revisor = pr.revisor && pr.revisor !== pend.pessoa ? pr.revisor : Object.keys(S.pessoas).find((ps) => ps !== pend.pessoa && S.pessoas[ps].papeis[0] === 'builder');
    const papelRev = S.pessoas[revisor].papeis.includes('builder') ? 'builder' : 'pe';
    const vez = { papel: papelRev, pessoa: revisor };
    const naEntrega = pr.estado === 'mesclado';
    if (naEntrega) { t.estado = 'em-revisao'; t.passo = 5; t.vez = vez; pr.vez = vez; }
    else { pr.estado = 'em-revisao'; pr.vez = vez; for (const x of pr.tasks) if (S.itens[x].estado === 'em-construcao') { S.itens[x].estado = 'em-revisao'; S.itens[x].vez = vez; } }
    const origem = pend.daRevisao ? 'pedido na revisão' : pend.cmt ? 'pedido pelo cliente na prévia' : pend.tipo === 'ajuste-pedido' ? 'pedido pelo cliente na entrega' : 'pedido na revisão';
    const k = S.pendencias.filter((x) => x.tipo === 'revisar-pr' && x.origem === pend.id).length;
    S.pendencias.push({ id: 'REV-' + pend.id + (k ? '-' + (k + 1) : ''), tipo: 'revisar-pr', bloco: 'com', pessoa: revisor, papel: papelRev, item: naEntrega ? pend.item : prId, ajuste: oque, cmt: pend.cmt, origem: pend.id,
      titulo: naEntrega ? 'Revisar o ajuste na entrega: ' + t.titulo.toLowerCase() : 'Revisar o ajuste no PR #' + pr.numero + ': ' + pr.titulo.toLowerCase(), pediu: nome(pend.pessoa) + ', com o ajuste ' + origem, prazo: PRAZO_REVISAO, escala: papelRev === 'pe' ? 'o Head Ops' : 'o Principal Engineer', acao: 'Abrir a revisão', tela: 'revisoes' });
    if (pend.cmt) { S.itens[pend.cmt].vez = vez; S.trilha.push({ item: pend.cmt, quando: 'agora', quem: nome(pend.pessoa), texto: 'Fez a correção e pediu a revisão de ' + nome(revisor) + '.', cli: 'A equipe fez a correção, e outra pessoa da equipe está revisando.' }); }
    S.trilha.push({ item: naEntrega ? pend.item : prId, quando: 'agora', quem: nome(pend.pessoa), texto: 'Enviou o ajuste para a revisão de ' + nome(revisor) + ': ' + oque });
    return 'Ajuste enviado. A vez agora é de ' + nome(revisor) + ', que revisa só o ajuste.';
  }

  /* Revisão vencida (P07): o prazo vencido não aprova nada. A revisão escala ao Principal Engineer, com quem deveria ter revisado e desde quando. */
  function escalarVencidas() {
    let mudou = false;
    for (const x of S.pendencias.slice()) {
      if (x.estado === 'feita' || x.tipo !== 'revisar-pr' || x.papel === 'pe' || !(x.prazo < 0)) continue;
      const pe = Object.keys(S.pessoas).find((ps) => S.pessoas[ps].papeis.includes('pe'));
      const dias = -x.prazo;
      x.estado = 'feita'; x.substituida = true;
      /* A revisão escalada tem o mesmo prazo e, depois do Principal Engineer, escala ao Head Ops (docs/21). */
      S.pendencias.push({ id: x.id + '-PE', tipo: 'revisar-pr', bloco: 'com', pessoa: pe, papel: 'pe', item: x.item, ajuste: x.ajuste, cmt: x.cmt, origem: x.origem, subiu: true, deveria: x.pessoa, venceuHa: dias, prazoDeQuem: PRAZO_REVISAO,
        titulo: x.titulo, pediu: nome(x.pessoa) + ' deveria ter revisado; o prazo venceu há ' + dias + (dias === 1 ? ' dia útil' : ' dias úteis'), prazo: PRAZO_REVISAO, escala: 'o Head Ops', acao: 'Abrir a revisão', tela: 'revisoes' });
      const alvo = S.itens[x.item], pr = alvo.tipo === 'pr' ? alvo : S.itens[alvo.pr], vez = { papel: 'pe', pessoa: pe };
      if (alvo.tipo === 'pr') { pr.vez = vez; for (const t of pr.tasks) if (S.itens[t].vez && S.itens[t].vez.pessoa === x.pessoa) S.itens[t].vez = vez; } else alvo.vez = vez;
      if (x.cmt) S.itens[x.cmt].vez = vez;
      S.trilha.push({ item: x.item, quando: 'agora', quem: 'Sistema', texto: 'A revisão de ' + nome(x.pessoa) + ' venceu o prazo e escalou para ' + nome(pe) + '.' });
      mudou = true;
    }
    if (mudou) salvar();
  }

  /* O cliente comenta um trecho da prévia: o comentário vira item, e a triagem sugerida cai em Com você da AI PO. */
  function comentar(prId, trechoId, texto, conferido) {
    const pr = S.itens[prId];
    const tr = pr.previa.trechos.find((x) => x.id === trechoId);
    texto = (texto || '').trim();
    if (!tr || !texto) return { erro: 'Escreva o comentário antes de enviar.' };
    if (/\b(senha|password|token|chave)\s*[:=]|\b[A-Za-z0-9_\-]{32,}\b/i.test(texto)) return { erro: 'O texto parece ter uma senha ou uma chave de acesso. Tire esse trecho antes de enviar.' };
    const limpo = texto.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '[dado pessoal retirado]').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[dado pessoal retirado]').replace(/\(?\b\d{2}\)?\s?9?\d{4}-?\d{4}\b/g, '[dado pessoal retirado]');
    if (limpo !== texto && !conferido) return { erro: 'Um dado pessoal foi retirado do texto. Confira como ficou e envie de novo.', limpo };
    let id = tr.cmt, k = 3;
    while (S.itens[id]) id = 'CMT-' + String(k++).padStart(2, '0');
    S.itens[id] = { tipo: 'comentario', autor: 'cli1', pr: prId, pedido: S.itens[pr.tasks[0]].pedido, trecho: trechoId, rotuloTrecho: tr.rotulo, tela: pr.previa.tela, texto, estado: 'triagem', vez: { papel: 'aipo', pessoa: 'aipo1' }, triagem: tr.triagem };
    texto = limpo;
    const curto = texto.length > 60 ? texto.slice(0, 57) + '...' : texto;
    S.pendencias.push({ id: 'TRI-' + id, tipo: 'triar-comentario', bloco: 'com', pessoa: 'aipo1', papel: 'aipo', item: id, agente: 'triagem', titulo: 'Triar o comentário do cliente: "' + curto + '"', pediu: 'Cliente 1, na prévia do PR #' + pr.numero + ', trecho ' + tr.rotulo.toLowerCase(), prazo: 1, escala: 'o PM', acao: 'Abrir o comentário', tela: 'entrada', motivo: 'Sugestão: ' + tr.triagem.sugestao + ', para ' + tr.triagem.destino + '. ' + tr.triagem.motivo, confianca: tr.triagem.confianca });
    S.entregas.push({ pessoa: 'cli1', papel: 'cliente', item: id });
    S.trilha.push({ item: id, quando: 'agora', quem: 'Cliente 1', texto: 'Comentou na prévia do PR #' + pr.numero + ', trecho ' + tr.rotulo.toLowerCase() + ': "' + texto + '"', cli: 'Você comentou o trecho ' + tr.rotulo.toLowerCase() + ': "' + texto + '"' });
    salvar();
    return { ok: 'Comentário enviado. A equipe responde por aqui.' };
  }
  function decidir(idPend, dados = {}) {
    const pend = S.pendencias.find((x) => x.id === idPend);
    if (!pend || pend.estado === 'feita' || !ACOES[pend.tipo]) return;
    const msg = ACOES[pend.tipo](pend, dados);
    if (msg && msg.erro) { const e = document.querySelector(dados.item ? `[data-linha="${dados.item}|${dados.etapa}"] .erro` : dados.task ? `[data-task-proposta="${dados.task}"] .erro` : `[data-acao-de="${pend.id}"] .erro`); if (e) { e.textContent = msg.erro; e.hidden = false; } return; }
    if (msg && msg.parcial) { aviso('Item decidido. Faltam outros neste cartão.'); return; }
    pend.estado = 'feita';
    salvar();
    aviso(msg);
    const r = lerRota();
    /* No painel do trilho: se ainda há decisão sua na mesma etapa, o painel continua aberto. */
    const resta = r.est && abertas(r.p, r.papel, 'com').some((x) => (r.est === 'plataforma' ? !estDe(x) : estDe(x) === r.est));
    /* Sem outra decisão ali, o painel fecha e a linha volta com o estágio aberto (D74), com o foco de teclado nele. */
    const etDec = r.etapa || (ESTACOES.find((s) => s.id === r.est) || {}).e;
    if (!resta && r.tela === 'trilho' && etDec) focoDepois = `.etapa[data-etapa="${etDec}"]`;
    ir({ p: r.p, papel: r.papel, tela: r.tela, etapa: r.etapa || (ESTACOES.find((s) => s.id === r.est) || {}).e, est: resta ? r.est : undefined });
  }

  /* ---------- pedaços de tela ---------- */
  const linha = (x, extra = '') => `<button type="button" class="linha" data-abrir="${esc(x.id)}">${extra}<span class="t">${esc(x.t)}</span>${x.m ? `<span class="m">${esc(x.m)}</span>` : ''}</button>`;
  const faixa = (c) => `<span class="faixa faixa-${esc(c)}">Confiança ${esc(c)}</span>`;

  const autoria = (x) => x.agente === 'sistema' ? 'Sistema · montado por regra' : faixa(x.confianca) + ' · ' + esc(nomeAgente(x.agente));
  function itemCom(x) {
    const agente = x.agente && S.agentes[x.agente] ? `<span class="por-agente">Preparado pelo ${esc(S.agentes[x.agente].nome.toLowerCase())}</span>` : '';
    return `<div class="pend" data-pendencia="${esc(x.id)}">
      <button type="button" class="linha" data-abrir="${esc(x.item)}"><span class="t">${esc(x.titulo)}</span>
      <span class="m">${esc(x.pediu)} · ${x.semPrazo ? 'sinal, sem prazo: não trava nada' : prazo(x.prazo) + ' · ' + esc(escalada(x))}</span></button>
      ${agente}${x.motivo ? `<div class="motivo">${esc(x.motivo)} ${faixa(x.confianca)}</div>` : ''}
      <div class="acoes"><button type="button" class="btn prim" data-principal="${esc(x.id)}">${esc(x.acao)}</button></div></div>`;
  }
  function itemPrep(x) {
    return `<div class="pend prep" data-pendencia="${esc(x.id)}">
      <button type="button" class="linha" data-abrir="${esc(x.item)}"><span class="t">${esc(x.titulo)}</span></button>
      <div class="motivo">${esc(x.motivo)}</div>
      <div class="m">Fonte: ${esc(x.fonte)} · ${autoria(x)}</div>
      ${x.efeito ? `<div class="m">Se você seguir: ${esc(x.efeito)}</div>` : ''}</div>`;
  }

  function nomeAgente(id) { return id === 'sistema' ? 'Sistema' : (S.agentes[id] && S.agentes[id].nome) || 'Agente'; }

  function blocoPrep(pessoa, papel) {
    const L = abertas(pessoa, papel, 'prep');
    let h = '';
    if (papel === 'builder' && S.agentes.codigo.estado === 'desligado') h += `<p class="vazio" id="agente-codigo">Agente de código desligado neste projeto. ${esc(S.agentes.codigo.motivo)}</p>`;
    h += L.map(itemPrep).join('');
    if (!h) h = '<p class="vazio">Nenhum agente adiantou trabalho para você agora.</p>';
    return h;
  }

  function inicio(r) {
    const { p, papel } = r;
    const cli = papel === 'cliente';
    const com = abertas(p, papel, 'com');
    const VAZIO_COM = {
      pe: 'Nenhum PR escalado para você. Um PR chega aqui quando toca área sensível ou quando a revisão passa do prazo.',
      cliente: 'Nada aguardando você agora. Quando a equipe liberar uma prévia ou uma entrega, ela aparece aqui.'
    };
    const andamento = emAndamento(p, papel);
    const ent = cli ? pedidosDoCliente() : entregou(p, papel);
    const titulos = cli
      ? ['Com você', 'Seus comentários', 'Seus pedidos', 'O que mudou desde a última prévia']
      : ['Com você', 'Em andamento', 'O que você entregou', 'Preparado para você'];
    const subs = cli
      ? ['O que a equipe espera de você, com o prazo.', 'O que você comentou e a resposta de cada um.', 'Cada pedido seu e em que fase está.', 'Preparado com apoio de IA e revisado por uma pessoa da equipe.']
      : ['Decisões e ações aguardando você, com o prazo e para quem escalam.', 'O que está na sua mão agora.', 'Onde está o que saiu da sua mão e com quem está a vez.', 'O que um agente ou o sistema adiantou. Nada vale até uma pessoa aprovar.'];
    const carga = (x) => x.carga ? Object.entries(x.carga).map(([ps, pf]) => barra(nome(ps), pf, S.projeto.limite)).join('') : '';
    const mudou = Object.entries(S.itens).filter(([, it]) => it.tipo === 'pr' && it.previaLiberada && it.mudouCli && it.tasks.some((t) => S.itens[t].estado !== 'homologado')).map(([id, it]) => ({ id, t: it.mudouCli }));
    return `
      <div class="saudacao"><h1>${cli ? 'O que precisa de você' : 'Seu dia, ' + esc(nome(p))}</h1>
        <p class="contexto">${papel === 'admin' ? 'Plataforma · ' + S.carteira.length + ' projetos' : esc(S.projeto.nome) + ' · ' + esc(S.projeto.org) + ' · ' + esc(S.projeto.sprint)}${cli ? '' : ' · Você vê como ' + esc(papelDe(papel).nome)}</p></div>
      <div class="blocos">
        <section class="bloco destaque" data-bloco="com" aria-labelledby="b-com"><h2 id="b-com">${titulos[0]} <span class="conta">${com.length}</span></h2><p class="sub">${subs[0]}</p>
          ${com.length ? com.map(itemCom).join('') : `<p class="vazio">${esc(VAZIO_COM[papel] || 'Nada aguardando você agora.')}</p>`}</section>
        <section class="bloco" data-bloco="andamento" aria-labelledby="b-and"><h2 id="b-and">${titulos[1]}</h2><p class="sub">${subs[1]}</p>
          ${andamento.length ? andamento.map((x) => carga(x) + linha(x)).join('') : '<p class="vazio">Nada na sua mão agora.</p>'}</section>
        <section class="bloco" data-bloco="entregou" aria-labelledby="b-ent"><h2 id="b-ent">${titulos[2]}</h2><p class="sub">${subs[2]}</p>
          ${ent.length ? ent.map((x) => cli ? linha(x, '') + fases(x.fase) : linha(x)).join('') : `<p class="vazio">${papel === 'admin' ? 'Nada ativado por você nesta semana.' : 'Nada entregue por você ainda neste projeto.'}</p>`}</section>
        <section class="bloco agente" data-bloco="prep" aria-labelledby="b-prep"><h2 id="b-prep">${titulos[3]}</h2><p class="sub">${subs[3]}</p>
          ${cli ? relatoCli() + (mudou.length ? mudou.map((x) => `<p class="mudou">${esc(x.t)}</p>`).join('') : '<p class="vazio">Nenhuma prévia nova.</p>') : blocoPrep(p, papel)}</section>
      </div>`;
  }
  const fases = (k) => `<div class="fases" aria-label="Fase do pedido: ${FASES[k]}">${FASES.map((f, i) => `<span class="${i < k ? 'feita' : i === k ? 'atual' : ''}">${f}</span>`).join('')}</div>`;
  const barra = (quem, pf, lim) => `<div class="carga" data-carga="${esc(quem)}"><div class="rot"><span>${esc(quem)}</span><span>${pf} de ${lim} PF</span></div><div class="trilho-carga"><b style="width:${Math.min(100, pf / lim * 100)}%"></b></div></div>`;

  /* O relato chega ao cliente só depois que a AI PO libera. */
  function relatoCli() {
    const rel = Object.entries(S.itens).filter(([, x]) => x.tipo === 'relato' && x.estado === 'liberado' && x.redacao).pop();
    if (!rel) return '';
    const [id, x] = rel;
    const sec = (k, rot) => { const L = (x.linhas || []).filter((l) => l.secao === k); return L.length ? `<p class="m">${rot}</p><ul>${L.map((l) => `<li>${esc(l.texto)}</li>`).join('')}</ul>` : ''; };
    return `<div class="relato-cli" data-relato="${esc(id)}"><b>${esc(x.titulo)}</b><p>${esc(x.redacao)}</p>${sec('aconteceu', 'O que aconteceu')}${sec('trava', 'O que trava')}${sec('numeros', 'Números')}</div>`;
  }
  function carteira(r) {
    const { p, papel } = r;
    const ho = papel === 'headops';
    const subiu = abertas(p, papel, 'com');
    const abertasTodas = S.pendencias.filter((x) => x.estado !== 'feita');
    const perto = abertasTodas.filter((x) => x.prazo >= 0 && x.prazo <= 1).length;
    const vencidas = abertasTodas.filter((x) => x.prazo < 0).length;
    return `
      <div class="saudacao"><h1>Carteira</h1><p class="contexto">${S.carteira.length} projetos · só números, sem conteúdo de item</p></div>
      <div class="blocos">
        <section class="bloco destaque" data-bloco="escalado" aria-labelledby="b-esc"><h2 id="b-esc">Com você <span class="conta">${subiu.length}</span></h2>
          <p class="sub">O que escalou ou foi pedido a você, com o prazo.</p>
          ${subiu.length ? subiu.map(itemCom).join('') : `<p class="vazio">Nada com você. ${ho ? 'Se um PM pedir exceção ao limite de carga, ela chega aqui com o prazo.' : 'Quando uma decisão vencer o prazo ou passar de um limite, ela chega aqui.'}</p>`}</section>
        <section class="bloco" data-bloco="saude" aria-labelledby="b-sau"><h2 id="b-sau">Saúde da carteira</h2><p class="sub">Atualizada pelo relato de cada PM.</p>
          <table class="tab"><thead><tr><th>Projeto</th><th>Saúde</th><th>Sprint</th>${ho ? '<th>Carga planejada</th>' : ''}</tr></thead><tbody>
          ${S.carteira.map((c) => `<tr data-projeto="${c.id}"><td>${esc(c.nome)}</td><td>${c.saude ? `<span class="saude saude-${c.saude === 'No rumo' ? 'ok' : 'atencao'}">${esc(c.saude)}</span>` : ''}${c.nota ? (c.saude ? ' · ' : '') + esc(c.nota) : ''}</td><td>${esc(c.sprint || 'sem sprint aberta')}</td>${ho ? `<td>${c.planejado != null ? c.planejado + ' de ' + c.capacidade + ' PF' : 'sem dado'}</td>` : ''}</tr>`).join('')}
          </tbody></table></section>
        <section class="bloco" data-bloco="prazo" aria-labelledby="b-pra"><h2 id="b-pra">Perto do prazo</h2><p class="sub">Decisões da carteira que vencem em até 1 dia útil.</p>
          <p class="numero"><b>${perto}</b> ${perto === 1 ? 'decisão vence' : 'decisões vencem'} em até 1 dia útil · ${vencidas ? vencidas + (vencidas === 1 ? ' vencida' : ' vencidas') : 'nenhuma vencida'}</p></section>
      </div>`;
  }

  /* ---------- vista do projeto: por pedido e por sprint ---------- */
  /* De quem é a vez numa task, e a cor: pessoa da equipe, cliente, agente (proposta esperando pessoa) ou sem dono. */
  /* A vez diz quem age agora, em texto: pessoa da equipe, cliente ou ninguém ainda. A cor de destaque vai só na task que está com
     quem olha (D73). A proposta de agente é de uma pessoa decidir e leva a marca do agente que a preparou. */
  function vezDaTask(id, quemVe) {
    const it = S.itens[id];
    const com = (ps) => ps === quemVe ? 'Com você' : 'Com ' + nome(ps);
    if (it.estado === 'rascunho') return { cor: 'sem-dono', texto: 'Rascunho, sem dono ainda' };
    if (it.estado === 'aguardando-limite') {
      const pend = S.pendencias.find((x) => x.estado !== 'feita' && x.tipo === 'excecao-limite' && S.itens[x.item] && S.itens[x.item].task === id);
      return { cor: 'pessoa', voce: !!pend && pend.pessoa === quemVe, texto: 'Aguardando a decisão de carga' + (pend ? ' · ' + com(pend.pessoa) : '') };
    }
    if (it.estado === 'proposta') {
      const pend = S.pendencias.find((x) => x.estado !== 'feita' && (x.item === id || (x.tipo === 'aprovar-tasks' && x.item === it.pedido)));
      return { cor: pend ? 'pessoa' : 'sem-dono', voce: !!pend && pend.pessoa === quemVe, agente: it.porAgente, texto: 'Proposta do ' + nomeAgente(it.porAgente).toLowerCase() + (pend ? ' · ' + com(pend.pessoa) + ' para decidir' : ', sem pessoa para decidir') };
    }
    const v = ('vez' in it ? it.vez : null) || (!('vez' in it) && it.pr && S.itens[it.pr].vez) || { papel: 'builder', pessoa: it.resp };
    if (v.papel === 'cliente') return { cor: 'cliente', texto: 'Com o cliente' };
    return { cor: 'pessoa', voce: v.pessoa === quemVe, texto: v.pessoa ? com(v.pessoa) : 'Com ' + ROTULO_PAPEL[v.papel] };
  }
  function chipTask(id, quemVe, extra = '') {
    const v = vezDaTask(id, quemVe);
    return `<button type="button" class="tk tk-${v.cor}${v.voce ? ' tk-voce' : ''}${extra ? ' ' + extra : ''}" data-abrir="${esc(id)}" data-task="${esc(id)}" data-vez="${v.cor}"${v.agente ? ` data-agente="${esc(v.agente)}"` : ''}><span class="tk-t">${esc(S.itens[id].titulo)}</span><span class="tk-vez">${v.agente ? '<i class="ponto-agente" aria-hidden="true"></i>' : ''}${esc(v.texto)}</span><span class="tk-id">Task ${esc(id)}</span></button>`;
  }
  function marcos() {
    const atual = S.projeto.sprints.indexOf(S.projeto.sprint);
    return `<ol class="marcos" aria-label="Sprints do projeto">${S.projeto.sprints.map((x, i) => `<li class="${i < atual ? 'feita' : i === atual ? 'atual' : ''}">${esc(x)}${i === atual ? ' (em curso)' : ''}</li>`).join('')}</ol>`;
  }
  function limiteDe(pessoa, carga) {
    const propostas = Object.entries(S.itens).filter(([, it]) => it.tipo === 'task' && it.sprint === S.projeto.sprint && ['proposta', 'aguardando-limite'].includes(it.estado) && it.resp === pessoa);
    return { carga: carga[pessoa] || 0, propostas, iria: (carga[pessoa] || 0) + propostas.reduce((a, [, it]) => a + it.pf, 0) };
  }
  function projeto(r) {
    const vista = r.vista === 'sprint' ? 'sprint' : 'pedido';
    const alterna = `<div class="alterna" role="group" aria-label="Agrupar a vista">${[['pedido', 'Por pedido'], ['sprint', 'Por sprint']].map(([v, n]) => `<button type="button" class="seg${v === vista ? ' ativo' : ''}" data-vista="${v}" aria-pressed="${v === vista}">${n}</button>`).join('')}</div>`;
    const legenda = `<p class="legenda"><span><span class="tk-mini tk-pessoa tk-voce"></span>com você</span><span><span class="tk-mini tk-pessoa"></span>com outra pessoa da equipe</span><span><span class="tk-mini tk-cliente"></span>com o cliente</span><span><span class="tk-mini tk-sem-dono"></span>sem dono ainda</span><span><i class="ponto-agente"></i>preparado por agente, uma pessoa decide</span></p>`;
    let corpo;
    if (vista === 'pedido') {
      const pedidos = Object.entries(S.itens).filter(([, it]) => it.tipo === 'pedido');
      corpo = `<div class="rola"><table class="quadro" id="por-pedido"><thead><tr><th>Pedido</th>${PASSOS.map((x, i) => `<th>${i + 1} · ${esc(x)}</th>`).join('')}</tr></thead><tbody>
        ${pedidos.map(([id, ped]) => `<tr data-pedido="${esc(id)}"><th scope="row"><button type="button" class="linha" data-abrir="${esc(id)}"><span class="t">${esc(ped.titulo)}</span><span class="m">Pedido ${esc(id)}</span></button></th>
          ${PASSOS.map((x, i) => `<td data-passo-n="${i + 1}">${ped.tasks.filter((t) => S.itens[t].passo === i + 1).map((t) => chipTask(t, r.p)).join('')}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>`;
    } else {
      const carga = cargaDaSprint();
      const pessoas = [...new Set(Object.values(S.itens).filter((it) => it.tipo === 'task' && it.sprint === S.projeto.sprint).map((it) => it.resp))].sort((x, y) => nome(x).localeCompare(nome(y)));
      const barras = pessoas.map((ps) => {
        const l = limiteDe(ps, carga), lim = S.projeto.limite, acima = l.iria > lim;
        return `<div class="carga${acima ? ' acima' : ''}" data-carga="${esc(nome(ps))}"><div class="rot"><span>${esc(nome(ps))}</span><span>${l.carga} de ${lim} PF${l.propostas.length ? ' · com ' + (l.propostas.length === 1 ? (l.propostas[0][1].estado === 'proposta' ? 'a task proposta ' : 'a task aguardando a decisão de carga ') : 'as tasks ainda fora da sprint ') + l.propostas.map(([id, it]) => it.titulo + ' (' + id + ')').join(' e ') + ', iria a ' + l.iria + ' PF' + (acima ? ', acima do limite' : '') : ''}</span></div>
          <div class="trilho-carga"><b style="width:${Math.min(100, l.carga / lim * 100)}%"></b>${l.propostas.length ? `<i style="left:${Math.min(100, l.carga / lim * 100)}%;width:${Math.min(100 - l.carga / lim * 100, (l.iria - l.carga) / lim * 100)}%"></i>` : ''}</div></div>`;
      }).join('');
      const daSprint = Object.keys(S.itens).filter((k) => S.itens[k].tipo === 'task' && S.itens[k].sprint === S.projeto.sprint);
      const acimaIds = new Set(pessoas.flatMap((ps) => { const l = limiteDe(ps, carga); return l.iria > S.projeto.limite ? l.propostas.map(([id]) => id) : []; }));
      corpo = `<section class="bloco" id="carga-sprint" aria-labelledby="t-carga"><h2 id="t-carga">Carga de ${esc(S.projeto.sprint)}, contra o limite de ${S.projeto.limite} PF por pessoa</h2>${barras}</section>
        <div class="rola"><table class="quadro" id="por-sprint"><thead><tr>${PASSOS.slice(3).map((x, i) => `<th>${i + 4} · ${esc(x)}</th>`).join('')}</tr></thead><tbody><tr>
        ${PASSOS.slice(3).map((x, i) => `<td data-passo-n="${i + 4}">${daSprint.filter((t) => S.itens[t].passo === i + 4).map((t) => chipTask(t, r.p, acimaIds.has(t) ? 'acima' : '') + (acimaIds.has(t) ? '<span class="aviso-limite" data-acima="' + esc(t) + '">Acima do limite de carga</span>' : '')).join('')}</td>`).join('')}
        </tr></tbody></table></div>`;
    }
    return `<div class="saudacao"><div><h1>Projeto</h1><p class="contexto">${esc(S.projeto.nome)} · ${esc(S.projeto.org)}</p></div>${alterna}</div>
      ${marcos()}${corpo}${legenda}`;
  }

  /* ---------- telas da AI PO ---------- */
  const radios = (nomeCampo, lista) => lista.map((m) => { const [v, rot] = Array.isArray(m) ? m : [m, m]; return `<label class="radio"><input type="radio" name="${nomeCampo}" value="${esc(v)}">${esc(rot)}</label>`; }).join('');
  const motivoEquipe = () => `<fieldset><legend>Motivo</legend>${radios('motivo', MOTIVOS_EQUIPE)}</fieldset><label>Uma linha, se o motivo for "outro"<textarea name="linha" rows="2"></textarea></label><p class="m">O motivo vira sinal de aprimoramento de quem propôs.</p>`;
  function cartaoTriagem(pend) {
    const c = S.itens[pend.item];
    return `<div class="pend triagem" data-pendencia="${esc(pend.id)}" data-acao-de="${esc(pend.id)}">
      <button type="button" class="linha" data-abrir="${esc(pend.item)}"><span class="t">"${esc(c.texto)}"</span><span class="m">${esc(pend.pediu)} · ${prazo(pend.prazo)} · ${esc(escalada(pend))}</span></button>
      <div class="motivo"><b>Sugestão do agente de triagem: ${esc(c.triagem.sugestao)}, para ${esc(c.triagem.destino)}.</b> ${esc(c.triagem.motivo)} ${faixa(c.triagem.confianca)}</div>
      <form data-form="triar" data-pendencia="${esc(pend.id)}">
        <div class="acoes"><button type="submit" class="btn prim" name="saida" value="aprovar">Aprovar a sugestão</button></div>
        <details class="ajuste"><summary>Escolher outro destino</summary>
          <fieldset><legend>Destino</legend>${radios('destino', DESTINOS.filter((x) => x[0] !== c.triagem.sugestao))}</fieldset>${motivoEquipe()}
          <button type="submit" class="btn" name="saida" value="outro">Usar este destino</button></details>
        <p class="erro" role="alert" hidden></p></form></div>`;
  }
  function telaEntrada(r) {
    const L = abertas(r.p, r.papel, 'com').filter((x) => x.tipo === 'triar-comentario');
    const cards = L.map(cartaoTriagem).join('');
    return `<div class="saudacao"><div><h1>Entrada</h1><p class="contexto">O que chega do cliente e das fontes do projeto, com a triagem sugerida</p></div></div><div class="blocos">
      <section class="bloco destaque" data-bloco="comentarios" aria-labelledby="t-cm"><h2 id="t-cm">Comentários do cliente <span class="conta">${L.length}</span></h2><p class="sub">Cada um com o destino que o agente de triagem sugere. Nada vale até você decidir.</p>
        ${cards || '<p class="vazio">Nenhum comentário do cliente para triar. Quando ele comentar uma prévia, o comentário chega aqui.</p>'}</section>
      <section class="bloco" data-bloco="sinais" aria-labelledby="t-si"><h2 id="t-si">Sinais das fontes do projeto</h2><p class="sub">Reuniões, documentos e mensagens já normalizados.</p><p class="vazio">Nenhum sinal novo para triar.</p></section></div>`;
  }

  /* O impacto de uma versão nova do requisito, como o calcularImpacto do v2: por task ligada, as etapas atingidas, o dono de cada uma
     e o que perde a validade. É calculado quando o rascunho nasce e fica congelado nele (docs/43, "O efeito de um ajuste"). */
  function calcularImpacto(reqId, de) {
    const req = S.itens[reqId], rows = [], vistos = new Set();
    const ESTADO = { 'aguardando-homologacao': 'com o cliente para aprovar a entrega', 'para-conferir': 'prévia com o cliente', 'conferido': 'prévia conferida pelo cliente', 'em-construcao': 'em construção', 'revisado': 'revisada', 'em-revisao': 'em revisão', 'homologado': 'homologada', 'planejada': 'planejada' };
    for (const id of req.tasks) {
      const t = S.itens[id];
      rows.push({ item: id, nomeItem: t.titulo, dono: 'pm1', papel: 'pm', etapa: 'Task e sprint (passo 4)', estado: ESTADO[t.estado] || t.estado, perde: null, ord: 400 });
      if (t.estado === 'em-construcao') rows.push({ item: id, nomeItem: t.titulo, dono: t.resp, papel: 'builder', etapa: 'Construção (passo 5)', estado: 'código em andamento, escrito sobre a versão ' + de, perde: null, ord: 500 });
      if (S.pendencias.some((x) => x.estado !== 'feita' && x.tipo === 'aprovar-entrega' && x.item === id)) rows.push({ item: id, nomeItem: t.titulo, dono: 'aipo1', papel: 'aipo', etapa: 'Aprovação da entrega (passo 7)', estado: 'a aprovação da entrega está aberta com o cliente', perde: 'A aprovação da entrega aberta, pedida sobre a versão ' + de + '. Ela só chega ao cliente de novo quando a AI PO liberar a versão nova.', ord: 700 });
      const prId = t.pr, pr = prId && S.itens[prId];
      if (pr && !vistos.has(prId) && pr.estado !== 'mesclado') {
        vistos.add(prId);
        const nomePr = 'PR #' + pr.numero + ': ' + pr.titulo;
        rows.push({ item: prId, nomeItem: nomePr, dono: pr.autor, papel: 'builder', etapa: 'PR (passo 5)', estado: pr.estado === 'em-revisao' ? 'em revisão por ' + nome(pr.revisor) : 'revisado por ' + nome(pr.revisor), perde: 'A revisão atual, feita sobre a versão ' + de, ord: 520 });
        if (pr.previaLiberada) rows.push({ item: prId, nomeItem: nomePr, dono: 'aipo1', papel: 'aipo', etapa: 'Prévia e liberação (passo 6)', estado: 'prévia liberada ao cliente', perde: 'A liberação da prévia do PR #' + pr.numero + ': ela deixa de valer para o cliente', ord: 600 });
      }
    }
    return rows.map((r, i) => Object.assign(r, { ord: r.ord + i })).sort((a, b) => a.ord - b.ord);
  }
  const tabelaImpacto = (rows) => `<div class="rola"><table class="tab impacto-tab"><thead><tr><th>Etapa</th><th>Item</th><th>Dono</th><th>Situação</th><th>O que perde a validade</th></tr></thead><tbody>
    ${rows.map((x) => `<tr data-afeta="${esc(x.item)}" data-etapa="${esc(x.etapa)}"><td>${esc(x.etapa)}</td><td>${esc(x.nomeItem)}${x.item.startsWith('PR-') ? '' : ' · ' + esc(x.item)}</td><td>${esc(nome(x.dono))}</td><td>${esc(x.estado)}</td><td>${esc(x.perde || 'nada')}</td></tr>`).join('')}</tbody></table></div>`;
  function caixaVersao(r, id, req, vpend) {
    const rasc = req.rascunho;
    return `<div class="caixa-acao" data-acao-de="${esc(vpend.id)}" data-impacto="${esc(id)}"><h3>Versão ${rasc.versao} em rascunho: impacto antes de aprovar</h3>
      ${rasc.porAgente ? `<span class="por-agente">Preparado pelo ${esc(nomeAgente(rasc.porAgente).toLowerCase())}</span>` : ''}
      <div class="motivo">${esc(rasc.motivo)} ${faixa(rasc.confianca)}</div>
      <p class="m">A partir do comentário: "${esc(rasc.texto)}" · ${prazo(vpend.prazo)} · ${esc(escalada(vpend))}</p>
      <h4>Impacto</h4>${tabelaImpacto(rasc.impacto)}
      <form data-form="versao" data-pendencia="${esc(vpend.id)}"><div class="acoes"><button type="submit" class="btn prim" name="saida" value="aprovar">Aprovar a versão ${rasc.versao}</button></div>
        <details class="ajuste"><summary>Recusar a versão</summary>${motivoEquipe()}<button type="submit" class="btn" name="saida" value="recusar">Recusar</button></details><p class="erro" role="alert" hidden></p></form></div>`;
  }
  function telaRequisitos(r) {
    const reqs = Object.entries(S.itens).filter(([, x]) => x.tipo === 'requisito');
    const blocos = reqs.map(([id, req]) => {
      const vpend = abertas(r.p, r.papel, 'com').find((x) => x.tipo === 'aprovar-versao' && x.item === id);
      const props = S.itens[req.pedido].tasks.filter((t) => S.itens[t].estado === 'proposta');
      const tpend = S.pendencias.find((x) => x.estado !== 'feita' && x.tipo === 'aprovar-tasks' && x.item === req.pedido);
      let extra = req.rascunho && vpend ? caixaVersao(r, id, req, vpend) : '';
      if (props.length) extra += `<div class="caixa" data-propostas="${esc(req.pedido)}"><h3>Tasks propostas pelo agente de planejamento</h3>
        <ul class="impacto">${props.map((t) => `<li data-proposta="${esc(t)}">${esc(S.itens[t].titulo)} · ${esc(t)} · ${S.itens[t].pf} PF, para ${esc(nome(S.itens[t].resp))}</li>`).join('')}</ul>
        <p class="m">${tpend ? esc(comQuemPessoa(tpend.pessoa, r.p)) + ' para decidir, porque a carga da sprint é do PM · ' + prazo(tpend.prazo) : ''}</p></div>`;
      return `<section class="bloco" data-requisito="${esc(id)}" aria-labelledby="t-${esc(id)}"><h2 id="t-${esc(id)}"><button type="button" class="linha-titulo" data-abrir="${esc(id)}">${esc(req.titulo)}</button> <span class="m">versão ${req.versao}</span></h2>
        <p class="sub">${req.porque ? esc(req.porque) + ' ' : ''}${req.tasks.length} tasks: ${esc(resumoTasks(req.tasks))}</p>${extra}</section>`;
    }).join('');
    return `<div class="saudacao"><div><h1>Requisitos</h1><p class="contexto">O que foi combinado com o cliente, com as tasks de cada requisito</p></div></div>${blocos}`;
  }
  const comQuemPessoa = (ps, quemVe) => ps === quemVe ? 'Com você' : 'Com ' + nome(ps);
  /* O cartão Mudança a revisar, no detalhe: cada item atingido com Aplicar a mudança ou Manter o item, um por vez. */
  function caixaOnda(pend) {
    return `<div class="caixa-acao onda" data-acao-de="${esc(pend.id)}" data-onda="${esc(pend.id)}"><h3>${esc(pend.titulo)}</h3>
      <p class="m">${esc(pend.pediu)} · sinal, sem prazo: não trava nada. Nada muda nos seus itens sem a sua decisão.</p>
      ${pend.linhas.map((x) => `<div class="onda-item" data-linha="${esc(x.item)}|${esc(x.etapa)}"><b>${esc(x.nomeItem)}</b><span class="m">${esc(x.etapa)} · ${esc(x.estado)}${x.perde ? ' · perde: ' + esc(x.perde) : ''}</span>
        ${x.decisao ? `<span class="decidido">${x.decisao === 'aplicada' ? 'Mudança aplicada' : 'Item mantido: ' + esc(x.motivo)}</span>` : `<form data-form="onda" data-pendencia="${esc(pend.id)}" data-item="${esc(x.item)}" data-etapa="${esc(x.etapa)}"><div class="acoes"><button type="submit" class="btn prim" name="saida" value="aplicar">Aplicar a mudança</button></div>
          <details class="ajuste"><summary>Manter o item</summary><label>Por que fica como está<textarea name="linha" rows="2"></textarea></label><button type="submit" class="btn" name="saida" value="manter">Manter o item</button></details><p class="erro" role="alert" hidden></p></form>`}</div>`).join('')}</div>`;
  }
  function telaLiberacao(r) {
    const para = abertas(r.p, r.papel, 'com').filter((x) => ['liberar-previa', 'liberar-entrega', 'liberar-relato', 'liberar-medicao'].includes(x.tipo));
    const feitos = S.entregas.filter((x) => x.pessoa === r.p && x.papel === r.papel && x.como === 'liberação');
    return `<div class="saudacao"><div><h1>Liberação</h1><p class="contexto">O que o cliente vê só depois que você libera</p></div></div><div class="blocos">
      <section class="bloco destaque" data-bloco="para-liberar" aria-labelledby="t-pl"><h2 id="t-pl">Para liberar <span class="conta">${para.length}</span></h2><p class="sub">Prévias com a revisão aprovada e entregas que voltam ao cliente.</p>
        ${para.length ? para.map(itemCom).join('') : '<p class="vazio">Nada para liberar agora.</p>'}</section>
      <section class="bloco" data-bloco="liberados" aria-labelledby="t-li"><h2 id="t-li">Liberado por você</h2><p class="sub">E o que o cliente fez depois.</p>
        ${feitos.length ? feitos.map((x) => linha({ id: x.item, t: 'Prévia do PR #' + S.itens[x.item].numero + ': ' + S.itens[x.item].titulo, m: comQuem(x.item, r.papel, r.p) })).join('') : '<p class="vazio">Nada liberado por você nesta sprint.</p>'}</section></div>`;
  }

  /* ---------- telas do PM ---------- */
  /* O relato, como no v2: o que aconteceu, cada linha com o evento da trilha de onde veio; o que trava, e o que está em risco entra sempre;
     e os percentuais, que nunca regridem: se o calculado ficar abaixo do relato anterior, vale o anterior. */
  function percentuais(rel) {
    const ant = Object.values(S.itens).filter((x) => x.tipo === 'relato' && x !== rel && x.estado === 'liberado').pop() || {};
    const reg = (k) => (ant[k] != null && rel[k] < ant[k] ? ant[k] : rel[k]);
    return { req: reg('requisito'), dev: reg('desenvolvimento'), reqAnt: ant.requisito, devAnt: ant.desenvolvimento, segurou: rel.requisito < (ant.requisito || 0) || rel.desenvolvimento < (ant.desenvolvimento || 0) };
  }
  function linhasDoRelato(relId) {
    const rel = S.itens[relId], pc = percentuais(rel);
    const aconteceu = S.trilha.filter((x) => x.cli && x.item !== relId && !/^Você /.test(x.cli)).map((x) => ({ secao: 'aconteceu', texto: x.cli, origem: 'evento da trilha: ' + x.quem + ', ' + x.quando }));
    const trava = Object.entries(S.itens).filter(([, x]) => x.tipo === 'risco' && x.estado === 'aberto').map(([id, x]) => ({ secao: 'trava', texto: x.titulo + (x.saude ? ' (' + x.saude + ')' : ''), origem: 'risco aberto ' + x.aberto + (x.saude === 'Em risco' ? '; o que está em risco entra sempre' : '') }));
    const nums = [
      { secao: 'numeros', texto: 'Requisitos: ' + pc.req + '% combinados (eram ' + pc.reqAnt + '% no relato anterior).', origem: 'requisitos aprovados, contados pela trilha' + (pc.segurou ? '; o calculado ficou abaixo do anterior, e vale o anterior' : '') },
      { secao: 'numeros', texto: 'Desenvolvimento: ' + pc.dev + '% (era ' + pc.devAnt + '% no relato anterior).', origem: 'tasks homologadas e em construção, contadas pela trilha' }
    ];
    return aconteceu.concat(trava, nums);
  }
  function medicaoDe(item) {
    const sprint = S.itens[item].sprint, n = sprint.replace(/\D/g, '');
    const daSprint = Object.entries(S.itens).filter(([, x]) => x.tipo === 'task' && x.sprint === sprint);
    const entra = daSprint.filter(([, x]) => x.estado === 'homologado').map(([id, x]) => ({ id, t: x.titulo, pf: x.pf }));
    const nao = daSprint.filter(([, x]) => x.estado !== 'homologado').map(([id, x]) => ({ id, t: x.titulo, motivo: 'ainda não homologada pelo cliente' }));
    return { sprint, n, entra, nao, pf: entra.reduce((a, x) => a + x.pf, 0) };
  }
  /* O P05 das tasks propostas, uma task por vez: na tela Sprint e no painel do trilho. */
  function blocoPropostas(tp) {
    const carga = cargaDaSprint(), lim = S.projeto.limite;
    const ids = S.itens[tp.item].tasks.filter((t) => S.itens[t].estado === 'proposta');
    return `<section class="bloco destaque" data-bloco="propostas" data-acao-de="${esc(tp.id)}" aria-labelledby="t-pr"><h2 id="t-pr">Tasks propostas <span class="conta">${ids.length}</span></h2>
      <p class="sub">${esc(tp.pediu)} · ${prazo(tp.prazo)} · ${esc(escalada(tp))}</p><span class="por-agente">Preparado pelo agente de planejamento</span><div class="motivo">${esc(tp.motivo)} ${faixa(tp.confianca)}</div>
      ${ids.map((id) => {
        const t = S.itens[id], iria = (carga[t.resp] || 0) + t.pf, passa = iria > lim;
        /* Como no v2: o primeiro Builder do projeto que cabe no limite; quem é Builder só como segundo papel vem por último. */
        const outro = Object.keys(S.pessoas).filter((ps) => ps !== t.resp && S.pessoas[ps].papeis.includes('builder') && (carga[ps] || 0) + t.pf <= lim).sort((x, y) => (S.pessoas[x].papeis[0] === 'builder' ? 0 : 1) - (S.pessoas[y].papeis[0] === 'builder' ? 0 : 1) || nome(x).localeCompare(nome(y)))[0];
        return `<div class="proposta" data-task-proposta="${esc(id)}"><b>${esc(t.titulo)} · ${esc(id)}</b><span class="m">${t.pf} PF, para ${esc(nome(t.resp))} · ${passa ? '<span class="aviso-limite">levaria a ' + iria + ' de ' + lim + ' PF, acima do limite de carga</span>' : 'cabe no limite: ficaria com ' + iria + ' de ' + lim + ' PF'}</span>
          <form data-form="p05" data-pendencia="${esc(tp.id)}" data-task="${esc(id)}"><div class="acoes">
            ${passa ? (outro ? `<input type="hidden" name="para" value="${esc(outro)}"><button type="submit" class="btn prim" name="saida" value="passar">Passar para ${esc(nome(outro))}</button>` : '') + `<button type="submit" class="btn${outro ? '' : ' prim'}" name="saida" value="excecao">Pedir exceção de limite de carga ao Head Ops</button>` : `<button type="submit" class="btn prim" name="saida" value="aprovar">Aprovar</button>`}
            <button type="submit" class="btn" name="saida" value="adiar">Passar para a ${esc(S.projeto.sprints[S.projeto.sprints.indexOf(S.projeto.sprint) + 1] || 'próxima sprint')}</button></div>
            <details class="ajuste"><summary>Pedir ajuste ou recusar</summary>${motivoEquipe()}<div class="acoes"><button type="submit" class="btn" name="saida" value="ajuste">Pedir ajuste</button><button type="submit" class="btn" name="saida" value="recusar">Recusar</button></div></details>
            <p class="erro" role="alert" hidden></p></form></div>`;
      }).join('')}</section>`;
  }
  function telaSprint(r) {
    const carga = cargaDaSprint(), lim = S.projeto.limite;
    const pessoas = [...new Set(Object.values(S.itens).filter((it) => it.tipo === 'task' && it.sprint === S.projeto.sprint).map((it) => it.resp))].sort((x, y) => nome(x).localeCompare(nome(y)));
    const barras = pessoas.map((ps) => { const l = limiteDe(ps, carga); return `<div class="carga${l.iria > lim ? ' acima' : ''}" data-carga="${esc(nome(ps))}"><div class="rot"><span>${esc(nome(ps))}</span><span>${l.carga} de ${lim} PF${l.iria > l.carga ? ' · com o que está fora da sprint, iria a ' + l.iria + ' PF' : ''}</span></div><div class="trilho-carga"><b style="width:${Math.min(100, l.carga / lim * 100)}%"></b></div></div>`; }).join('');
    const tp = abertas(r.p, r.papel, 'com').find((x) => x.tipo === 'aprovar-tasks');
    const propostas = tp ? blocoPropostas(tp) : '';
    const daSprint = Object.keys(S.itens).filter((k) => S.itens[k].tipo === 'task' && S.itens[k].sprint === S.projeto.sprint && !['proposta', 'recusada'].includes(S.itens[k].estado));
    return `<div class="saudacao"><div><h1>Sprint</h1><p class="contexto">${esc(S.projeto.nome)} · ${esc(S.projeto.sprint)} · limite de carga de ${lim} PF por pessoa</p></div></div>
      <div class="blocos">${propostas}<section class="bloco" id="carga-sprint" aria-labelledby="t-cg"><h2 id="t-cg">Carga de ${esc(S.projeto.sprint)}</h2>${barras}</section>
      <section class="bloco" data-bloco="tasks-sprint" aria-labelledby="t-ts"><h2 id="t-ts">Tasks da sprint <span class="conta">${daSprint.length}</span></h2><p class="sub">Com quem está cada uma.</p>${daSprint.map((t) => chipTask(t, r.p)).join('')}</section></div>`;
  }
  function cartaoRisco(pend) {
    const it = S.itens[pend.item];
    return `<div class="pend" data-pendencia="${esc(pend.id)}" data-acao-de="${esc(pend.id)}"><button type="button" class="linha" data-abrir="${esc(pend.item)}"><span class="t">${esc(pend.titulo)}</span><span class="m">${it.tipo === 'risco' ? (it.forma === 'risco' ? 'Risco' : 'Impedimento') + ' · ' + esc(it.saude) + ' · trava: ' + esc(it.trava) + ' · responde: ' + esc(it.responde) + ' · ' : ''}${prazo(pend.prazo)} · ${esc(escalada(pend))}</span></button>
        ${it.bloqueadoPor ? `<p class="bloqueado" data-bloqueado>Bloqueado: ${esc(it.bloqueadoPor)}</p>` : ''}
        <form data-form="p24" data-pendencia="${esc(pend.id)}">
          ${it.forma === 'risco' ? `<fieldset><legend>Como o risco se encerra</legend><label class="radio"><input type="radio" name="modo" value="encerrar" checked>O risco deixou de existir, com a evidência</label><label class="radio"><input type="radio" name="modo" value="assumir">Assumir o risco, com o motivo</label></fieldset><label>Motivo para assumir<textarea name="motivo" rows="2"></textarea></label>` : ''}
          ${it.origemRecusa ? `<fieldset><legend>O que foi combinado com o cliente</legend>${radios('decisao', [['ajuste', 'Ajuste na entrega'], ['aditivo', 'Termo aditivo'], ['cancelamento', 'Cancelamento']])}</fieldset>` : ''}
          <label>Evidência do encerramento<textarea name="linha" rows="2"></textarea></label>
          <div class="acoes"><button type="submit" class="btn prim" name="saida" value="encerrar"${it.bloqueadoPor ? ' disabled' : ''}>${it.forma === 'risco' ? 'Encerrar o risco' : 'Encerrar o impedimento'}</button><button type="submit" class="btn" name="saida" value="escalar">Escalar</button></div><p class="erro" role="alert" hidden></p></form></div>`;
  }
  function telaRiscos(r) {
    const L = abertas(r.p, r.papel, 'com').filter((x) => x.tipo === 'impedimento');
    const avisos = abertas(r.p, r.papel, 'prep').filter((x) => x.tipo === 'aviso-dado');
    return `<div class="saudacao"><div><h1>Riscos</h1><p class="contexto">O que pode travar o projeto, com quem responde e o prazo</p></div></div><div class="blocos">
      <section class="bloco destaque" data-bloco="riscos" aria-labelledby="t-ri"><h2 id="t-ri">Abertos <span class="conta">${L.length}</span></h2><p class="sub">Encerre com a evidência, ou escale ao Head Ops.</p>
      ${L.map(cartaoRisco).join('') || '<p class="vazio">Nenhum risco nem impedimento aberto.</p>'}</section>
      <section class="bloco" data-bloco="avisos" aria-labelledby="t-av"><h2 id="t-av">Avisos</h2><p class="sub">Dados a conferir com o órgão, vindos da triagem.</p>${avisos.map(itemPrep).join('') || '<p class="vazio">Nenhum aviso.</p>'}</section></div>`;
  }
  function telaFechamento(r) {
    const rp = abertas(r.p, r.papel, 'com').find((x) => x.tipo === 'relato');
    const relato = rp ? secaoRelato(rp)
      : `<section class="bloco" data-bloco="relato"><h2>Relato da semana</h2><p class="vazio">Nenhum relato para escrever agora.</p></section>`;
    const mp = abertas(r.p, r.papel, 'com').find((x) => x.tipo === 'fechar-medicao');
    const medicao = mp ? secaoMedicao(mp)
      : `<section class="bloco" data-bloco="medicao"><h2>Medição</h2><p class="vazio">A medição de uma sprint abre quando o cliente aprova as entregas dela.</p></section>`;
    return `<div class="saudacao"><div><h1>Fechamento</h1><p class="contexto">Relato ao cliente e medição da sprint</p></div></div><div class="blocos">${relato}${medicao}</div>`;
  }
  /* O relato da semana, montado da trilha, e a medição da sprint: na tela Fechamento e no painel do trilho. */
  function secaoRelato(rp) {
    const rel = S.itens[rp.item];
    return `<section class="bloco destaque" data-bloco="relato" data-acao-de="${esc(rp.id)}" aria-labelledby="t-re"><h2 id="t-re">${esc(rel.titulo)} <span class="m">${rel.estado === 'rascunho' ? 'rascunho' : esc(rel.estado)}</span></h2>
        <p class="sub">Montado pelo sistema a partir da trilha. Cada linha mostra de onde veio. O cliente só recebe depois que você enviar e a AI PO liberar.</p>
        ${[['aconteceu', 'O que aconteceu'], ['trava', 'O que trava'], ['numeros', 'Números']].map(([k, rot]) => { const L = linhasDoRelato(rp.item).filter((x) => x.secao === k); return `<h3>${rot}</h3><ul class="linhas-relato" data-secao="${k}">${L.map((x) => `<li><span>${esc(x.texto)}</span><span class="m">Origem: ${esc(x.origem)}</span></li>`).join('') || '<li><span class="m">Nada nesta semana.</span></li>'}</ul>`; }).join('')}
        <form data-form="relato" data-pendencia="${esc(rp.id)}"><label>Sua redação para o cliente<textarea name="linha" rows="3"></textarea></label><p class="m">${prazo(rp.prazo)} · ${esc(escalada(rp))}</p><div class="acoes"><button type="submit" class="btn prim" name="saida" value="enviar">Enviar para a AI PO liberar</button></div><p class="erro" role="alert" hidden></p></form></section>`;
  }
  function secaoMedicao(mp) {
    const m = medicaoDe(mp.item);
    return `<section class="bloco destaque" data-bloco="medicao" data-acao-de="${esc(mp.id)}" aria-labelledby="t-me"><h2 id="t-me">Medição da ${esc(m.sprint)}</h2><p class="sub">${esc(mp.pediu)} · ${prazo(mp.prazo)} · ${esc(escalada(mp))}</p>
        <h3>O que entra</h3><ul class="impacto" data-entra>${m.entra.map((x) => `<li data-mede="${esc(x.id)}">${esc(x.t)} · ${esc(x.id)} · ${x.pf} PF faturáveis</li>`).join('')}</ul>
        <h3>Não entra</h3><ul class="impacto" data-nao-entra>${m.nao.map((x) => `<li data-fora="${esc(x.id)}">${esc(x.t)} · ${esc(x.id)}: ${esc(x.motivo)}</li>`).join('') || '<li>Nada</li>'}</ul>
        <p class="numero"><b>${m.pf}</b> PF faturáveis</p><p class="erro" role="alert" hidden></p><button type="button" class="btn prim" data-decidir="${esc(mp.id)}">Aprovar o fechamento da medição</button></section>`;
  }

  /* ---------- telas do Builder e do Principal Engineer ---------- */
  const AJUSTES = ['ajuste-no-pr', 'ajuste-pedido'];
  const prDoItem = (id) => { const it = S.itens[id]; return it.tipo === 'pr' ? id : it.pr; };
  const lista = (L, vazio) => L.length ? `<ul>${L.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p class="m">${esc(vazio)}</p>`;
  const territorios = (pr) => [...new Set([pr.territorio].concat(pr.tasks.map((t) => S.itens[t].territorio)).filter(Boolean))];
  /* O resumo do PR pelo que mudou: o que foi verificado, o que foi suposto e o que não foi feito. */
  function resumoPr(pr) {
    if (!pr.resumo) return '';
    return `<div class="resumo-pr" data-resumo><h3>Resumo pelo que mudou</h3>
      <div data-leitura="verificado"><b>Verificado</b> ${lista(pr.resumo.verificado, 'Nada verificado ainda.')}</div>
      <div data-leitura="suposto"><b>Suposto</b> ${lista(pr.resumo.suposto, 'Nada suposto.')}</div>
      <div data-leitura="nao-feito"><b>Não feito</b> ${lista(pr.resumo.naoFeito, 'Nada ficou de fora.')}</div></div>`;
  }
  /* O ajuste chega como cartão no PR. O que veio depois da revisão não a desfaz: quem revisa olha só o ajuste. */
  function cartaoAjuste(pend) {
    const c = pend.cmt && S.itens[pend.cmt];
    const pr = S.itens[pend.pr || S.itens[pend.item].pr];
    return `<div class="pend cartao-ajuste" data-pendencia="${esc(pend.id)}" data-acao-de="${esc(pend.id)}">
      <button type="button" class="linha" data-abrir="${esc(pend.item)}"><span class="t">${esc(pend.titulo)}</span><span class="m">${esc(pend.pediu)} · ${prazo(pend.prazo)} · ${esc(escalada(pend))}</span></button>
      ${c ? `<div class="citacao"><span class="m">${esc(c.tela)} · trecho ${esc(c.rotuloTrecho.toLowerCase())}</span><p>"${esc(c.texto)}"</p></div>` : ''}
      ${pend.daRevisao || !pr || !pr.revisor ? '' : `<p class="m" data-nao-trava>Não trava a revisão: a aprovação de ${esc(nome(pr.revisor))} continua valendo, e quem revisa olha só o ajuste.</p>`}
      <form data-form="ajuste" data-pendencia="${esc(pend.id)}"><label>O que você mudou<textarea name="linha" rows="2"></textarea></label>
        <div class="acoes"><button type="submit" class="btn prim" name="saida" value="enviar">Enviar o ajuste para revisão</button></div><p class="erro" role="alert" hidden></p></form></div>`;
  }
  function telaTask(r) {
    const ajustes = abertas(r.p, r.papel, 'com').filter((x) => AJUSTES.includes(x.tipo));
    const prep = abertas(r.p, r.papel, 'prep');
    const tasks = Object.entries(S.itens).filter(([, t]) => t.tipo === 'task' && t.resp === r.p && t.estado === 'em-construcao' && !t.pr);
    const blocosTask = tasks.map(([id, t]) => {
      const req = S.itens[S.itens[t.pedido].requisito];
      const crit = req && req.criterios ? `<h3>Critérios</h3><ol class="criterios">${req.criterios.map(([dado, quando, entao]) => `<li>Dado ${esc(dado)}, quando ${esc(quando)}, então ${esc(entao)}.</li>`).join('')}</ol>` : '';
      return `<section class="bloco" data-task-aberta="${esc(id)}" aria-labelledby="t-${esc(id)}"><h2 id="t-${esc(id)}"><button type="button" class="linha-titulo" data-abrir="${esc(id)}">${esc(t.titulo)}</button> <span class="m">Task ${esc(id)} · ${t.pf} PF · ${esc(t.sprint)}</span></h2>
        <dl class="ficha"><dt>Spec</dt><dd data-spec>${esc(t.spec || 'sem spec ainda')}, ${req ? 'a partir do requisito ' + esc(req.titulo) + ', versão ' + req.versao : 'sem requisito: nasce de uma correção pedida pelo cliente'}</dd>
          <dt>Território</dt><dd data-territorio><code>${esc(t.territorio || 'a definir')}</code>${t.branch ? ` · branch <code>${esc(t.branch)}</code>` : ''}</dd></dl>
        ${crit}${prep.filter((x) => x.item === id).map(itemPrep).join('')}</section>`;
    }).join('');
    const prs = Object.entries(S.itens).filter(([id, pr]) => pr.tipo === 'pr' && pr.autor === r.p && (pr.estado !== 'mesclado' || ajustes.some((a) => prDoItem(a.item) === id || a.pr === id)));
    const blocosPr = prs.map(([id, pr]) => {
      const cartoes = ajustes.filter((a) => (a.pr || prDoItem(a.item)) === id);
      return `<section class="bloco${cartoes.length ? ' destaque' : ''}" data-pr="${esc(id)}" aria-labelledby="t-${esc(id)}"><h2 id="t-${esc(id)}"><button type="button" class="linha-titulo" data-abrir="${esc(id)}">PR #${pr.numero}: ${esc(pr.titulo)}</button> <span class="m">${esc(ESTADO_PR[pr.estado] || pr.estado)} · ${esc(comQuem(id, r.papel, r.p))}</span></h2>
        <p class="sub">${pr.tasks.map((t) => esc(S.itens[t].titulo) + ' (task ' + esc(t) + ')').join(' e ')} · território <code>${territorios(pr).map(esc).join('</code>, <code>')}</code>${pr.revisor ? ' · revisão de ' + esc(nome(pr.revisor)) : ''}</p>
        ${cartoes.map(cartaoAjuste).join('')}${resumoPr(pr)}</section>`;
    }).join('');
    const soltos = ajustes.filter((a) => !prs.some(([id]) => (a.pr || prDoItem(a.item)) === id));
    return `<div class="saudacao"><div><h1>Task e PR</h1><p class="contexto">${esc(S.projeto.nome)} · ${esc(S.projeto.sprint)}</p></div></div><div class="blocos">
      ${soltos.map(cartaoAjuste).join('')}${blocosTask}${blocosPr}
      ${blocosTask || blocosPr || soltos.length ? '' : '<section class="bloco"><p class="vazio">Nenhuma task em construção com você. Quando o PM planejar uma, ela aparece aqui com a spec, os critérios e o território.</p></section>'}</div>`;
  }
  function cartaoRevisao(pend) {
    const prId = prDoItem(pend.item), pr = S.itens[prId];
    return `<div class="pend revisao" data-pendencia="${esc(pend.id)}" data-acao-de="${esc(pend.id)}" data-revisao="${esc(prId)}">
      <button type="button" class="linha" data-abrir="${esc(pend.item)}"><span class="t">${esc(pend.titulo)}</span><span class="m">${esc(pend.pediu)} · ${prazo(pend.prazo)} · ${esc(escalada(pend))}</span></button>
      ${pend.subiu ? `<p class="subiu" data-subiu>Escalou para você porque ${esc(nome(pend.deveria))} não revisou no prazo de ${pend.prazoDeQuem} ${pend.prazoDeQuem === 1 ? 'dia útil' : 'dias úteis'}.</p>` : ''}
      <p class="m">Autor: ${esc(nome(pr.autor))} · território <code>${territorios(pr).map(esc).join('</code>, <code>')}</code></p>
      ${pend.ajuste ? `<div class="nota-ajuste" data-ajuste>O que mudou no ajuste: ${esc(pend.ajuste)}</div>` : ''}${resumoPr(pr)}
      <form data-form="revisao" data-pendencia="${esc(pend.id)}"><div class="acoes"><button type="submit" class="btn prim" name="saida" value="aprovar">Aprovar ${pend.ajuste ? 'o ajuste' : 'o PR'}</button></div>
        <details class="ajuste"><summary>Pedir ajuste</summary><label>O que precisa mudar<textarea name="linha" rows="2"></textarea></label><button type="submit" class="btn" name="saida" value="ajuste">Pedir ajuste</button></details><p class="erro" role="alert" hidden></p></form></div>`;
  }
  function telaRevisoes(r) {
    const pe = r.papel === 'pe';
    /* Quem escreveu o PR não o revisa: a revisão do próprio PR nunca aparece para o autor. */
    const minhas = abertas(r.p, r.papel, 'com').filter((x) => x.tipo === 'revisar-pr' && S.itens[prDoItem(x.item)].autor !== r.p);
    const proprios = Object.entries(S.itens).filter(([, pr]) => pr.tipo === 'pr' && pr.autor === r.p && pr.estado === 'em-revisao');
    const outras = S.pendencias.filter((x) => x.estado !== 'feita' && x.tipo === 'revisar-pr' && x.pessoa !== r.p);
    const prep = abertas(r.p, r.papel, 'prep').filter((x) => x.tela === 'revisoes');
    return `<div class="saudacao"><div><h1>Revisões</h1><p class="contexto">${esc(S.projeto.nome)} · ${pe ? 'o PR que escala ou toca área sensível' : 'o PR de outra pessoa, nunca o seu'}</p></div></div><div class="blocos">
      <section class="bloco destaque" data-bloco="para-revisar" aria-labelledby="t-rv"><h2 id="t-rv">Para você revisar <span class="conta">${minhas.length}</span></h2><p class="sub">${pe ? 'O que escalou para você, com quem deveria ter revisado e desde quando.' : 'PRs de outras pessoas, com o prazo e para quem escalam.'}</p>
        ${minhas.map(cartaoRevisao).join('') || `<p class="vazio">${pe ? 'Nenhum PR escalou para você. Um PR chega aqui quando toca área sensível ou quando a revisão passa do prazo.' : 'Nenhum PR de outra pessoa esperando a sua revisão.'}</p>`}</section>
      ${pe ? `<section class="bloco" data-bloco="abertas" aria-labelledby="t-ab"><h2 id="t-ab">Revisões abertas na equipe <span class="conta">${outras.length}</span></h2><p class="sub">Se uma passar do prazo, ela escala para você.</p>
        ${outras.map((x) => linha({ id: x.item, t: x.titulo, m: 'Com ' + nome(x.pessoa) + ' · ' + prazo(x.prazo) })).join('') || '<p class="vazio">Nenhuma revisão aberta.</p>'}</section>`
        : `<section class="bloco" data-bloco="meus-em-revisao" aria-labelledby="t-mr"><h2 id="t-mr">Seus PRs em revisão <span class="conta">${proprios.length}</span></h2><p class="sub">Quem escreveu o PR não o revisa: outra pessoa revisa.</p>
        ${proprios.map(([id, pr]) => linha({ id, t: 'PR #' + pr.numero + ': ' + pr.titulo, m: 'Em revisão · ' + comQuem(id, r.papel, r.p) })).join('') || '<p class="vazio">Nenhum PR seu em revisão.</p>'}</section>`}
      ${prep.length ? `<section class="bloco agente" data-bloco="prep" aria-labelledby="t-pp"><h2 id="t-pp">Preparado para você</h2>${prep.map(itemPrep).join('')}</section>` : ''}</div>`;
  }

  /* ---------- telas do cliente ---------- */
  function conferir(r) {
    const abertasC = abertas(r.p, r.papel, 'com').filter((x) => x.tipo === 'conferir-previa');
    if (!abertasC.length) return `<div class="saudacao"><h1>Conferir</h1></div><section class="bloco"><p class="vazio" id="sem-previa">Nenhuma prévia para conferir agora. Quando a equipe liberar uma, ela aparece aqui e em Com você.</p></section>`;
    const pend = abertasC[0], pr = S.itens[pend.item];
    const meus = Object.entries(S.itens).filter(([, x]) => x.tipo === 'comentario' && x.pr === pend.item);
    const aberto = r.vista && r.vista.startsWith('trecho-') ? r.vista.slice(7) : null;
    const trechos = pr.previa.trechos.map((t) => {
      const ja = meus.filter(([, c]) => c.trecho === t.id);
      return `<div class="trecho${aberto === t.id ? ' aberto' : ''}" data-trecho="${esc(t.id)}"><div class="trecho-conteudo"><span class="m">${esc(t.rotulo)}</span><b>${esc(t.conteudo)}</b></div>
        ${ja.map(([id, c]) => `<p class="comentado" data-comentario="${esc(id)}">Seu comentário: "${esc(c.texto)}" · ${c.estado === 'corrigido' ? 'Corrigido nesta prévia' : 'Com a equipe'}</p>`).join('')}
        ${aberto === t.id ? `<form data-form="comentar" data-pr="${esc(pend.item)}" data-trecho="${esc(t.id)}"><label>Seu comentário sobre este trecho<textarea name="texto" rows="3" required></textarea></label><p class="m">Não escreva senha, chave de acesso nem dado pessoal de outra pessoa.</p><p class="erro" role="alert" hidden></p><div class="acoes"><button type="submit" class="btn prim">Enviar comentário</button><button type="button" class="btn" data-fechar-trecho>Cancelar</button></div></form>`
          : `<button type="button" class="btn" data-comentar="${esc(t.id)}">Comentar este trecho</button>`}</div>`;
    }).join('');
    return `<div class="saudacao"><div><h1>Conferir</h1><p class="contexto">${esc(pend.titulo)} · ${prazo(pend.prazo)}</p></div></div>
      <section class="bloco previa" id="previa" aria-labelledby="t-previa"><h2 id="t-previa">Prévia: ${esc(pr.previa.tela)}</h2><p class="sub">Comente qualquer trecho direto na tela. Cada comentário vai para quem resolve.</p>${trechos}</section>
      <section class="bloco caixa-acao" data-acao-de="${esc(pend.id)}"><h2>Terminou de conferir?</h2><p class="sub">Avise a equipe, com ou sem comentários. Os comentários já enviados seguem com ela.</p><p class="erro" role="alert" hidden></p><button type="button" class="btn prim" data-decidir="${esc(pend.id)}">Terminar a conferência</button></section>`;
  }
  function entregas(r) {
    const para = abertas(r.p, r.papel, 'com').filter((x) => x.tipo === 'aprovar-entrega');
    const homologadas = Object.entries(S.itens).filter(([, x]) => x.tipo === 'task' && x.estado === 'homologado');
    return `<div class="saudacao"><h1>Entregas</h1></div><div class="blocos">
      <section class="bloco destaque" data-bloco="para-aprovar" aria-labelledby="t-pa"><h2 id="t-pa">Para aprovar <span class="conta">${para.length}</span></h2><p class="sub">Entregas no ambiente de homologação, aguardando a sua aprovação.</p>
        ${para.length ? para.map((x) => `<div class="pend" data-pendencia="${esc(x.id)}"><button type="button" class="linha" data-abrir="${esc(x.item)}"><span class="t">${esc(S.itens[x.item].titulo)}</span><span class="m">${esc(x.pediu)} · ${prazo(x.prazo)}</span></button><div class="acoes"><button type="button" class="btn prim" data-principal="${esc(x.id)}">${esc(x.acao)}</button></div></div>`).join('') : '<p class="vazio">Nenhuma entrega aguardando você.</p>'}</section>
      <section class="bloco" data-bloco="homologadas" aria-labelledby="t-ho"><h2 id="t-ho">Homologadas</h2><p class="sub">O que você já aprovou.</p>
        ${homologadas.length ? homologadas.map(([id, x]) => linha({ id, t: x.titulo, m: x.aprovadoPor === r.p ? 'Aprovada por você' : 'Aprovada pelo órgão' })).join('') : '<p class="vazio">Nenhuma entrega aprovada ainda.</p>'}</section></div>`;
  }

  function telaAinda(r) {
    return `<div class="saudacao"><h1>${esc(TELAS[r.tela])}</h1></div><section class="bloco"><p class="vazio" id="tela-ainda">Em preparação. As decisões desta tela já aparecem no Início, em Com você.</p></section>`;
  }
  function naoEncontrada() { return '<div class="saudacao"><h1>Não encontrada</h1></div><section class="bloco"><p class="vazio" id="nao-encontrada">Esta tela não existe para o seu papel.</p></section>'; }

  /* ---------- decisões que cabem num cartão: no detalhe do item e no painel do trilho ---------- */
  const SO_NA_TELA = ['conferir-previa', 'triar-comentario', 'aprovar-versao', 'aprovar-tasks', 'mudanca-a-revisar', 'impedimento', 'relato', 'fechar-medicao', 'revisar-pr', 'ajuste-no-pr', 'ajuste-pedido'];
  function caixaAprovarEntrega(pend) {
    return `<div class="caixa-acao" data-acao-de="${esc(pend.id)}"><h3>${esc(pend.titulo)}</h3><p class="m">${esc(pend.pediu)} · ${prazo(pend.prazo)} · ${esc(escalada(pend))}</p>
      <form data-form="aprovar-entrega" data-pendencia="${esc(pend.id)}">
        <button type="submit" class="btn prim" name="saida" value="aprovar">Aprovar a entrega</button>
        <details class="ajuste"><summary>Pedir ajuste ou recusar</summary>
          <fieldset><legend>O que aconteceu?</legend>${MOTIVOS_AJUSTE.map((m) => `<label class="radio"><input type="radio" name="motivo" value="${esc(m[0])}">${esc(m[1])}</label>`).join('')}</fieldset>
          <label>O que precisa mudar<textarea name="linha" rows="3"></textarea></label>
          <div class="acoes"><button type="submit" class="btn" name="saida" value="ajuste">Pedir ajuste</button><button type="submit" class="btn" name="saida" value="recusar">Recusar</button></div></details>
        <p class="erro" role="alert" hidden></p></form></div>`;
  }
  /* A decisão de um clique (liberar) decide ali; a que ainda não tem cartão leva à tela dela. */
  function caixaSimples(pend) {
    const pronta = !!ACOES[pend.tipo] && !SO_NA_TELA.includes(pend.tipo);
    return `<div class="caixa-acao" data-acao-de="${esc(pend.id)}"><h3>${esc(pend.titulo)}</h3><p class="m">${esc(pend.pediu)} · ${prazo(pend.prazo)} · ${esc(escalada(pend))}</p>
      ${pronta ? `<button type="button" class="btn prim" data-decidir="${esc(pend.id)}">${esc(pend.tipo === 'liberar-previa' ? 'Liberar a prévia' : pend.tipo === 'liberar-entrega' ? 'Liberar a entrega' : pend.tipo === 'liberar-relato' ? 'Liberar o relato' : pend.tipo === 'liberar-medicao' ? 'Liberar a medição' : pend.acao)}</button>` : `<button type="button" class="btn prim" data-ir-tela="${esc(pend.tela)}">Ir para ${esc(TELAS[pend.tela])}</button>`}</div>`;
  }

  /* ---------- detalhe do item, ao lado ---------- */
  function detalhe(r) {
    const it = S.itens[r.item];
    if (!it) return '';
    const cli = r.papel === 'cliente';
    const pend = pendenciaDoItem(r.item, r.p, r.papel, 'com');
    const prep = pendenciaDoItem(r.item, r.p, r.papel, 'prep');
    const titulo = cli ? (it.tituloCli || it.titulo || '"' + it.texto + '"') : (it.tipo === 'pr' ? 'PR #' + it.numero + ': ' + it.titulo : (it.titulo || it.texto) + (it.tipo === 'task' ? ' · ' + r.item : ''));
    const trilha = S.trilha.filter((x) => x.item === r.item || (cli && it.pr && x.item === it.pr)).map((x) => cli ? (x.cli ? { q: x.quando, t: x.cli } : null) : { q: x.quando, t: x.quem + ': ' + x.texto }).filter(Boolean);
    const vez = it.tipo === 'task' && !cli ? vezDaTask(r.item, r.p).texto : comQuem(r.item, r.papel, r.p);
    let acao = '';
    if (pend && pend.tipo === 'mudanca-a-revisar') {
      acao = caixaOnda(pend);
    } else if (pend && pend.tipo === 'aprovar-versao' && it.rascunho) {
      acao = caixaVersao(r, r.item, it, pend);
    } else if (pend && pend.tipo === 'aprovar-entrega') {
      acao = caixaAprovarEntrega(pend);
    } else if (pend) {
      acao = caixaSimples(pend);
    }
    if (prep) {
      acao += `<div class="caixa-acao agente" data-prep-de="${esc(prep.id)}"><h3>${esc(prep.titulo)}</h3><p class="motivo">${esc(prep.motivo)}</p>
        <p class="m">Fonte: ${esc(prep.fonte)} · ${autoria(prep)}</p>${prep.efeito ? `<p class="m">Se você seguir: ${esc(prep.efeito)}</p>` : ''}
        <p class="m">Nada vale até uma pessoa aprovar.</p><button type="button" class="btn" data-ir-tela="${esc(prep.tela)}">Ir para ${esc(TELAS[prep.tela])}</button></div>`;
    }
    if (it.tipo === 'comentario') acao = `<div class="citacao"><span class="m">${esc(it.tela || '')}${it.rotuloTrecho ? ' · trecho ' + esc(it.rotuloTrecho.toLowerCase()) : ''}</span><p>"${esc(it.texto)}"</p></div>` + acao;
    const porque = it.porque || (pend && pend.motivo) || '';
    return `<aside id="detalhe" data-item="${esc(r.item)}" aria-label="Detalhe">
      <div class="det-topo"><span class="m">${esc(vez)}</span><button type="button" class="btn" id="fechar-detalhe">Fechar</button></div>
      <h2>${esc(titulo)}</h2>${acao}
      ${porque ? `<h3>Por quê</h3><p>${esc(porque)}</p>` : ''}
      <h3>Trilha do item</h3>${trilha.length ? `<ol class="trilha">${trilha.map((x) => `<li><span class="m">${esc(x.q)}</span> ${esc(x.t)}</li>`).join('')}</ol>` : '<p class="vazio">Nada registrado ainda.</p>'}
    </aside>`;
  }

  /* ---------- trilho do pedido ao uso (D72, com os cinco estágios da D73): a tela principal de todo papel ---------- */
  const ETAPAS = [['intencao', 'Intenção'], ['definicao', 'Definição'], ['trabalho', 'Trabalho'], ['entrega', 'Entrega'], ['operacao', 'Operação']];
  /* As subetapas do trilho. `papeis` é a lente: quem tem trabalho ali. `cli` é o nome que o cliente lê; sem ele, a subetapa é
     interna e aparece para o cliente só como ponto, sem nome. `ic` é o ícone de traço fino. */
  const ESTACOES = [
    { id: 'pedido', e: 'intencao', ic: 'pedido', t: 'Pedido recebido', cli: 'Recebido', papeis: ['cliente', 'aipo', 'pm'] },
    { id: 'conversas', e: 'intencao', ic: 'conversa', t: 'Em discussão', papeis: ['aipo'] },
    { id: 'resultado', e: 'intencao', ic: 'alvo', t: 'Resultado esperado', papeis: ['aipo', 'pm'] },
    { id: 'requisito', e: 'definicao', ic: 'requisito', t: 'Requisito', cli: 'Em análise pela equipe', papeis: ['aipo', 'pm', 'cliente'] },
    { id: 'spec', e: 'definicao', ic: 'spec', t: 'Spec', papeis: ['aipo', 'builder', 'pe'] },
    { id: 'decisao', e: 'definicao', ic: 'decisao', t: 'Decisão técnica', papeis: ['pm', 'pe', 'headops'] },
    { id: 'backlog', e: 'trabalho', ic: 'planejado', t: 'Planejado', papeis: ['pm', 'aipo'] },
    { id: 'sprint', e: 'trabalho', ic: 'sprint', t: 'Sprint', papeis: ['pm', 'aipo', 'headops'] },
    { id: 'tasks', e: 'trabalho', ic: 'construcao', t: 'Em construção', cli: 'Em construção', papeis: ['pm', 'builder', 'cliente'] },
    { id: 'codigo', e: 'trabalho', ic: 'pr', t: 'PR e revisão', papeis: ['builder', 'pe'] },
    { id: 'previa', e: 'entrega', ic: 'previa', t: 'Para conferir', cli: 'Prévia', papeis: ['aipo', 'cliente'] },
    { id: 'homolog', e: 'entrega', ic: 'homologado', t: 'Homologado', cli: 'Homologado', papeis: ['cliente', 'pm', 'aipo'] },
    { id: 'implant', e: 'entrega', ic: 'producao', t: 'Ida à produção', cli: 'Ida à produção', papeis: ['pm', 'builder', 'cliente'] },
    { id: 'liberado', e: 'operacao', ic: 'liberado', t: 'Liberado ao uso', cli: 'Liberado ao uso', papeis: ['pm', 'builder', 'cliente'] },
    { id: 'medicao', e: 'operacao', ic: 'medido', t: 'Medido', cli: 'Medido', papeis: ['pm', 'cliente', 'direcao', 'headops', 'aipo'] },
    { id: 'uso', e: 'operacao', ic: 'uso', t: 'Resultado no uso', papeis: ['pm', 'aipo', 'direcao'] }
  ];
  /* Ícones de traço fino, desenhados aqui, sem biblioteca. */
  const IC = {
    pedido: '<path d="M5 5h14v14H5z"/><path d="M9 9h6M9 13h4"/>', conversa: '<path d="M5 6h14v9H9l-4 3z"/>', alvo: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/>',
    requisito: '<path d="M7 4h7l3 3v13H7z"/><path d="M10 11h5M10 15h5"/>', spec: '<path d="M8 6l-4 6 4 6M16 6l4 6-4 6"/>', decisao: '<path d="M12 4v16M6 8h12M6 8l-2 5h4zM18 8l-2 5h4z"/>',
    planejado: '<path d="M5 7h14M5 12h14M5 17h9"/>', sprint: '<path d="M18 9a7 7 0 1 0 1 5"/><path d="M19 4v5h-5"/>', construcao: '<path d="M14 6l4 4-8 8H6v-4z"/>',
    pr: '<circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M7 8v8M17 16V10a3 3 0 0 0-3-3h-3"/>',
    previa: '<rect x="4" y="5" width="16" height="12" rx="2"/><path d="M10 9l4 2-4 2z"/>', homologado: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    producao: '<path d="M12 4v10M8 10l4 4 4-4M5 19h14"/>', liberado: '<circle cx="12" cy="12" r="8"/><path d="M8 12h8M13 9l3 3-3 3"/>',
    medido: '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>', uso: '<path d="M4 16l5-5 4 3 7-7"/>',
    ok: '<path d="M5 12l4 4 10-10"/>', cadeado: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>'
  };
  const icone = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
  const tasksDe = () => Object.values(S.itens).filter((x) => x.tipo === 'task');
  const prsDe = () => Object.values(S.itens).filter((x) => x.tipo === 'pr');
  const aberta = (tipos) => S.pendencias.some((x) => x.estado !== 'feita' && tipos.includes(x.tipo));
  /* O estado de cada subetapa sai do estado do mock: feito, atual (onde o projeto está), parado (esperando decisão de fora)
     ou vazio (ainda sem registro). Sem estado, é o que vem depois. */
  function estadoEst(id) {
    const base = estadoBase(id);
    /* Decisão aberta de qualquer pessoa numa etapa feita ou próxima a faz atual. */
    if (['feito', '', 'vazio'].includes(base) && S.pendencias.some((x) => x.estado !== 'feita' && x.bloco === 'com' && estDe(x) === id)) return 'atual';
    return base;
  }
  function estadoBase(id) {
    const T = tasksDe();
    switch (id) {
      case 'pedido': return Object.values(S.itens).some((x) => x.tipo === 'pedido' && !x.requisito && !(x.tasks || []).length) ? 'atual' : 'feito';
      case 'conversas': case 'spec': return 'feito';
      case 'resultado': return Object.values(S.itens).some((x) => x.tipo === 'requisito' && x.resultadoEsperado) ? 'feito' : 'vazio';
      case 'requisito': return Object.values(S.itens).some((x) => x.tipo === 'requisito' && x.rascunho) || aberta(['mudanca-a-revisar']) ? 'atual' : 'feito';
      case 'decisao': return S.itens['IMP-01'] && S.itens['IMP-01'].estado === 'aberto' ? 'parado' : 'feito';
      case 'backlog': return T.some((x) => ['proposta', 'rascunho', 'aguardando-limite'].includes(x.estado)) ? 'atual' : 'feito';
      case 'sprint': return 'atual';
      case 'tasks': return T.some((x) => x.sprint === S.projeto.sprint && ['em-construcao', 'em-revisao', 'planejada'].includes(x.estado)) ? 'atual' : 'feito';
      case 'codigo': return prsDe().some((x) => ['em-revisao', 'ajuste-na-revisao'].includes(x.estado)) || aberta(['ajuste-no-pr', 'ajuste-pedido', 'revisar-pr']) ? 'atual' : 'feito';
      case 'previa': return aberta(['liberar-previa', 'conferir-previa', 'triar-comentario']) ? 'atual' : 'feito';
      case 'homolog': return T.some((x) => x.estado === 'aguardando-homologacao') || aberta(['aprovar-entrega', 'liberar-entrega']) ? 'atual' : T.some((x) => x.estado === 'homologado') ? 'feito' : '';
      case 'implant': return '';
      case 'medicao': return aberta(['fechar-medicao', 'liberar-medicao', 'aceitar-medicao']) ? 'atual' : Object.values(S.itens).some((x) => x.tipo === 'medicao') ? 'feito' : '';
      default: return '';
    }
  }
  const NOME_ESTADO = { feito: 'feito', atual: 'atual', parado: 'Bloqueado', vazio: 'não registrado', '': 'próximo' };
  /* Em que subetapa cada pendência acontece. A da plataforma (Admin) fica fora do trilho do projeto. */
  function estDe(x) {
    const PORTIPO = {
      'triar-comentario': 'previa', 'conferir-previa': 'previa', 'liberar-previa': 'previa', 'aviso-dado': 'previa',
      'aprovar-versao': 'requisito', 'mudanca-a-revisar': 'requisito',
      'aprovar-tasks': 'backlog', 'excecao-limite': 'sprint', 'relato': 'sprint', 'rascunho-relato': 'sprint', 'liberar-relato': 'sprint',
      'fechar-medicao': 'medicao', 'liberar-medicao': 'medicao', 'aceitar-medicao': 'medicao',
      'aprovar-entrega': 'homolog', 'liberar-entrega': 'homolog',
      'revisar-pr': 'codigo', 'ajuste-no-pr': 'codigo', 'ajuste-pedido': 'codigo', 'contexto': 'codigo', 'mapa-prs': 'codigo'
    };
    if (PORTIPO[x.tipo]) return PORTIPO[x.tipo];
    if (x.tipo === 'impedimento' || x.tipo === 'impedimento-escalado') {
      const it = S.itens[x.item] || {};
      const origem = it.origem || x.item;
      if (/^IMP-REC/.test(origem) || (S.itens[origem] || {}).origemRecusa) return 'homolog';
      return origem === 'RIS-01' ? 'implant' : 'decisao';
    }
    return null;
  }
  const VAZIO_TRILHO = { pe: 'Nada escalou para você', headops: 'Nenhuma decisão escalada para você', direcao: 'Nada escalou para você', admin: 'Nada da plataforma com você' };
  /* O estado do estágio sai das subetapas que o papel lê: Bloqueado com alguma bloqueada, atual com alguma atual, feito quando
     nada ali está em andamento nem por vir (o que falta registrar aparece na subetapa), próximo no resto. */
  function estadoEtapa(et, cli) {
    const sts = ESTACOES.filter((x) => x.e === et && (!cli || x.cli)).map((x) => estadoEst(x.id));
    /* Bloqueado vem primeiro: com o estágio fechado, é o nó dele que avisa. */
    if (sts.includes('parado')) return 'parado';
    if (sts.includes('atual')) return 'atual';
    return sts.length && !sts.includes('') ? 'feito' : '';
  }
  /* Três camadas (D74), uma dentro da outra: 0, a linha com os cinco estágios; 1, o estágio aberto, com as subetapas ligadas por um
     ramo curvo; 2, o foco: a subetapa escolhida leva o estágio para a esquerda, com ela destacada abaixo, e o painel abre ao lado.
     O estágio aberto é o do endereço ou o da subetapa em foco; sem nenhum dos dois, só a linha. */
  function etapaAberta(r) {
    if (ETAPAS.some((x) => x[0] === r.etapa)) return r.etapa;
    const daEst = ESTACOES.find((x) => x.id === r.est);
    return daEst ? daEst.e : null;
  }
  const FOCO_SEM_ESTACAO = { dia: 'Seu dia', plataforma: 'Fora do projeto' };
  function trilho(r) {
    const cli = r.papel === 'cliente';
    const com = abertas(r.p, r.papel, 'com');
    const prep = abertas(r.p, r.papel, 'prep');
    const noTrilho = com.filter((x) => estDe(x));
    const fora = com.filter((x) => !estDe(x));
    const primeira = noTrilho[0] || fora[0];
    const pilula = primeira
      ? `<button type="button" class="pilula" data-est="${esc(estDe(primeira) || 'plataforma')}">Com você: ${esc(primeira.titulo)}${com.length > 1 ? ' · e mais ' + (com.length - 1) : ''}</button>`
      : `<span class="pilula calma">${esc(VAZIO_TRILHO[r.papel] || 'Nada com você agora')}</span>`;
    const aberta = etapaAberta(r);
    const focoEst = ESTACOES.find((x) => x.id === r.est);
    const emFoco = !!(focoEst || FOCO_SEM_ESTACAO[r.est]);
    const estacoes = (et) => ESTACOES.filter((x) => x.e === et).map((x) => {
      const minha = x.papeis.includes(r.papel);
      const n = noTrilho.filter((p) => estDe(p) === x.id).length;
      const np = prep.filter((p) => estDe(p) === x.id).length;
      const interna = cli && !x.cli;
      const st = estadoEst(x.id);
      const rot = interna ? '' : (cli ? x.cli : x.t);
      const sinal = (st === 'feito' ? `<span class="sinal">${icone('ok')}</span>` : st === 'parado' ? `<span class="sinal bloq">${icone('cadeado')}</span>` : '') + (n ? '<span class="sinal-vez"></span>' : '');
      /* A contagem e o preparado ficam para o leitor de tela; na tela, o ponto de "com você" basta (D74). */
      return `<button type="button" class="est${minha ? ' minha' : ''}${n ? ' com-voce' : ''}${interna ? ' interna' : ''}" data-est="${x.id}" data-estado="${st}" title="${esc((rot || 'Trabalho da equipe') + ': ' + NOME_ESTADO[st])}"${interna ? ' aria-label="Trabalho da equipe"' : ''}><span class="ponto">${interna ? '' : icone(x.ic)}${interna ? '' : sinal}</span>${rot ? `<b>${esc(rot)}</b>` : ''}${n ? `<span class="marca-vez">${n === 1 ? '1 decisão' : n + ' decisões'}</span>` : np ? '<span class="marca-prep">preparado</span>' : ''}</button>`;
    }).join('');
    /* O traço une a primeira à última bolinha; o trecho já percorrido vai mais escuro, até o estágio mais adiantado em andamento. */
    let ate = 0;
    ETAPAS.forEach(([id], i) => { if (['feito', 'atual', 'parado'].includes(estadoEtapa(id, cli))) ate = i; });
    const etapas = ETAPAS.map(([id, nm]) => {
      const st = estadoEtapa(id, cli);
      const minha = ESTACOES.some((x) => x.e === id && x.papeis.includes(r.papel));
      const vez = noTrilho.some((p) => ESTACOES.find((x) => x.id === estDe(p)).e === id);
      return `<li><button type="button" class="etapa${aberta === id ? ' aberta' : ''}${minha ? '' : ' apagada'}" data-etapa="${id}" data-estado="${st}" aria-expanded="${aberta === id && !emFoco}" aria-controls="cacho-${id}"><span class="no">${st === 'parado' ? icone('cadeado') : ''}</span><span class="rot">${nm}${vez ? '<i class="vez" title="Uma decisão com você"></i>' : ''}</span><span class="estado-etapa">${NOME_ESTADO[st]}</span></button></li>`;
    }).join('');
    const cachos = ETAPAS.map(([id]) => `<div class="estacoes" id="cacho-${id}" data-etapa="${id}"${aberta === id && !emFoco ? '' : ' hidden'}>${estacoes(id)}</div>`).join('');
    /* A camada de foco: o estágio à esquerda (ou o seu dia, ou o que é de fora do projeto) e a subetapa destacada abaixo dele. */
    let foco = '';
    if (emFoco) {
      const et = focoEst ? ETAPAS.find((e) => e[0] === focoEst.e) : null;
      const stE = et ? estadoEtapa(et[0], cli) : '';
      const nmEst = focoEst ? (cli ? focoEst.cli || 'Trabalho da equipe' : focoEst.t) : '';
      const vezAqui = focoEst && noTrilho.some((p) => estDe(p) === focoEst.id);
      foco = `<div class="foco" data-foco="${esc(r.est)}">
        <button type="button" class="foco-estagio${et ? '' : ' sem-estagio'}" data-voltar="${et ? et[0] : ''}" data-estado="${stE}" title="Voltar à linha inteira" aria-label="${esc((et ? et[1] : FOCO_SEM_ESTACAO[r.est]) + ': voltar à linha inteira')}"><span class="no">${stE === 'parado' ? icone('cadeado') : ''}</span><span class="rot">${esc(et ? et[1] : FOCO_SEM_ESTACAO[r.est])}</span></button>
        ${focoEst ? `<div class="foco-item"><span class="circ">${focoEst.cli || !cli ? icone(focoEst.ic) : ''}${vezAqui ? '<span class="sinal-vez"></span>' : ''}</span><span class="nome">${esc(nmEst)}</span></div>` : ''}
        <svg class="ramo ramo-foco" aria-hidden="true"><path/></svg></div>`;
    }
    return `<div class="trilho-topo"><button type="button" class="seu-dia" data-est="dia" title="Abrir o seu dia">Seu dia</button>${pilula}${fora.length ? `<span class="fora">${fora.map((x) => `<button type="button" class="linha" data-est="plataforma"><span class="k">Fora do projeto</span> <span class="t">${esc(x.titulo)}</span></button>`).join('')}</span>` : ''}</div>
      <h1 class="so-leitor">Trilho do ${esc(S.projeto.nome || 'projeto')}</h1>
      <div class="trilho${emFoco ? ' em-foco' : ''}" id="trilho" data-camada="${emFoco ? 2 : aberta ? 1 : 0}" style="--ate:${ate * 20}%"><ol class="linha-etapas"${emFoco ? ' inert' : ''}>${etapas}</ol><svg class="ramo ramo-cacho" aria-hidden="true"><path/></svg>${cachos}${foco}</div>`;
  }
  /* Ramo curvo: desce do ponto (x0, y0), faz uma curva larga e chega ao ponto (x1, y1). */
  function curva(x0, y0, x1, y1) {
    if (Math.abs(x1 - x0) < 2) return `M${x0} ${y0} V${y1}`;
    const ym = y0 + (y1 - y0) * 0.55, r = Math.min(34, Math.abs(x1 - x0) / 2, (y1 - y0) / 3), s = Math.sign(x1 - x0);
    return `M${x0} ${y0} V${ym - r} Q${x0} ${ym} ${x0 + s * r} ${ym} H${x1 - s * r} Q${x1} ${ym} ${x1} ${ym + r} V${y1}`;
  }
  /* Depois de desenhar: o cacho fica um pouco ao lado do estágio, para o ramo descer numa curva larga; no foco, o ramo liga o
     estágio da esquerda à subetapa destacada. */
  function posicionarTrilho() {
    const T = document.getElementById('trilho');
    if (!T) return;
    const base = T.getBoundingClientRect();
    const centro = (el) => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2 - base.left, y: b.top - base.top, b: b.bottom - base.top }; };
    const cacho = T.querySelector('.estacoes:not([hidden])'), no = T.querySelector('.etapa.aberta .no');
    const p = T.querySelector('.ramo-cacho path');
    if (cacho && no && !T.classList.contains('em-foco')) {
      const n = centro(no), w = cacho.offsetWidth, lado = n.x - 150 - w / 2 >= 0 ? -150 : 150;
      const x = Math.min(Math.max(n.x + lado - w / 2, 0), T.clientWidth - w);
      cacho.style.marginLeft = x + 'px';
      const c = centro(cacho), pontos = [...cacho.querySelectorAll('.est .ponto')].map(centro);
      /* Numa linha só, o ramo chega ao meio das subetapas; quando elas quebram de linha (tela estreita), ao ponto mais perto do estágio. */
      const umaLinha = pontos.every((q) => Math.abs(q.y - pontos[0].y) < 2);
      const alvo = umaLinha ? (pontos[0].x + pontos[pontos.length - 1].x) / 2 : pontos.reduce((m, q) => (Math.abs(q.x - n.x) < Math.abs(m.x - n.x) ? q : m)).x;
      p.setAttribute('d', curva(n.x, n.b + 34, alvo, c.y - 4));
    } else if (p) p.setAttribute('d', '');
    const pf = T.querySelector('.ramo-foco path'), fe = T.querySelector('.foco-estagio .no'), fi = T.querySelector('.foco-item .circ');
    if (pf && fe && fi) { const a = centro(fe), b = centro(fi); pf.setAttribute('d', curva(a.x, a.b + 30, b.x, b.y)); }
    /* O painel abre ao lado do foco e abaixo do topo do trilho, sem cobrir nenhum dos dois. */
    const pn = document.querySelector('#corpo.no-trilho #detalhe.painel-trilho'), foco = T.querySelector('.foco');
    if (pn && foco && matchMedia('(min-width: 901px)').matches) {
      const topo = document.querySelector('.trilho-topo').getBoundingClientRect();
      const dir = Math.max(...[...foco.children].map((el) => el.getBoundingClientRect().right));
      const esq = Math.round(dir + 48), cima = Math.round(Math.max(topo.bottom + 20, T.getBoundingClientRect().top));
      pn.style.left = esq + 'px'; pn.style.top = cima + 'px';
      pn.style.width = `min(760px, calc(100vw - ${esq + 40}px))`; pn.style.maxHeight = `calc(100vh - ${cima + 24}px)`;
    } else if (pn) ['left', 'top', 'width', 'max-height'].forEach((k) => pn.style.removeProperty(k));
  }
  /* Movimento das camadas: o estágio desliza para a esquerda ao entrar no foco e volta ao lugar ao sair. */
  const SUAVE = 'cubic-bezier(.22,.8,.24,1)';
  let transicao = null;
  function animarTrilho() {
    const t = transicao; transicao = null;
    const T = document.getElementById('trilho');
    if (!T || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const desenhar = (path, atraso) => { if (!path || !path.getAttribute('d')) return; const n = path.getTotalLength(); path.animate([{ strokeDasharray: n, strokeDashoffset: n }, { strokeDasharray: n, strokeDashoffset: 0 }], { duration: 480, delay: atraso, easing: SUAVE, fill: 'backwards' }); };
    const deslizar = (el, de) => {
      if (!el || !de) return;
      const a = el.getBoundingClientRect(), fim = getComputedStyle(el).transform, base = fim === 'none' ? '' : ' ' + fim;
      el.animate([{ transform: `translate(${de.left - a.left}px, ${de.top - a.top}px)${base}` }, { transform: fim }], { duration: 600, easing: SUAVE });
    };
    if (!t) return;
    if (t.tipo === 'abrir') {
      desenhar(T.querySelector('.ramo-cacho path'), 0);
      T.querySelectorAll('.estacoes:not([hidden]) .est').forEach((b, i) => b.animate([{ opacity: 0, transform: 'translateY(8px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 140 + i * 60, easing: SUAVE, fill: 'backwards' }));
    }
    if (t.tipo === 'focar') {
      deslizar(T.querySelector('.foco-estagio .no'), t.de);
      T.querySelector('.foco-estagio .rot').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 300, fill: 'backwards' });
      desenhar(T.querySelector('.ramo-foco path'), 380);
      const fi = T.querySelector('.foco-item');
      if (fi) fi.animate([{ opacity: 0, transform: 'translateY(10px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 500, easing: SUAVE, fill: 'backwards' });
      const pn = document.querySelector('.painel-trilho');
      if (pn) pn.animate([{ opacity: 0, transform: 'translateX(18px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 260, easing: SUAVE, fill: 'backwards' });
    }
    if (t.tipo === 'voltar') {
      deslizar(T.querySelector('.etapa.aberta .no'), t.de);
      desenhar(T.querySelector('.ramo-cacho path'), 320);
      T.querySelectorAll('.estacoes:not([hidden]) .est').forEach((b, i) => b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 380 + i * 50, fill: 'backwards' }));
    }
  }
  /* O que a subetapa mostra no painel quando não há decisão sua ali: só para a equipe que trabalha no projeto, e nunca conteúdo
     para o Head Ops, a Direção e o Admin (ADR-049, ADR-017). */
  function contextoEst(id, r) {
    if (['headops', 'direcao', 'admin'].includes(r.papel)) return '';
    const cli = r.papel === 'cliente';
    const linhas = [];
    const T = Object.entries(S.itens).filter(([, x]) => x.tipo === 'task');
    if (id === 'pedido') for (const [pid, x] of Object.entries(S.itens)) if (x.tipo === 'pedido') linhas.push(x.titulo + (cli ? '' : ' · ' + pid));
    if (id === 'requisito' && !cli) for (const [rid, x] of Object.entries(S.itens)) if (x.tipo === 'requisito') linhas.push(x.titulo + ', versão ' + x.versao + ' · ' + rid);
    if (id === 'requisito' && cli) for (const x of Object.values(S.itens)) if (x.tipo === 'requisito') linhas.push(x.titulo);
    if (id === 'resultado') linhas.push('Nenhum requisito tem o resultado esperado registrado ainda.');
    if (id === 'decisao' && S.itens['IMP-01']) linhas.push(S.itens['IMP-01'].titulo);
    if (id === 'implant' && S.itens['RIS-01'] && !cli) linhas.push(S.itens['RIS-01'].titulo);
    if (id === 'backlog') for (const [tid, x] of T) if (x.estado === 'proposta') linhas.push(x.titulo + ' · ' + tid + ' · proposta do agente');
    if (id === 'tasks' && !cli) linhas.push(resumoTasks(T.filter(([, x]) => x.sprint === S.projeto.sprint).map(([tid]) => tid)));
    if (id === 'codigo') for (const x of prsDe()) if (x.estado !== 'mesclado') linhas.push('PR #' + x.numero + ': ' + x.titulo + ' · ' + (ESTADO_PR[x.estado] || x.estado));
    if (id === 'previa' && !cli) for (const x of prsDe()) if (x.previa || x.previaLiberada) linhas.push('Prévia do PR #' + x.numero + ' · ' + (x.previaLiberada ? 'com o cliente' : 'por liberar'));
    if (id === 'previa' && cli) for (const [pid, x] of Object.entries(S.itens)) if (x.tipo === 'pr' && x.tituloCli && x.previaLiberada) linhas.push(x.tituloCli + ' · ' + (S.pendencias.some((q) => q.estado !== 'feita' && q.tipo === 'conferir-previa' && q.item === pid) ? 'Com você' : 'conferida por você'));
    /* Com você só quando a aprovação da entrega está aberta com o cliente; antes da liberação de novo, está com a equipe. */
    const comCli = (tid) => S.pendencias.some((q) => q.estado !== 'feita' && q.tipo === 'aprovar-entrega' && q.item === tid);
    if (id === 'homolog') for (const [tid, x] of T) if (['aguardando-homologacao', 'homologado'].includes(x.estado)) linhas.push(x.titulo + ' · ' + (x.estado === 'homologado' ? 'Homologado' : comCli(tid) ? (cli ? 'Com você' : 'Com o cliente') : 'Com a equipe'));
    if (id === 'medicao') linhas.push('Só o que foi homologado entra na medição.');
    if (['liberado', 'uso'].includes(id)) linhas.push('Entra quando uma função for liberada a quem usa.');
    if (id === 'sprint') linhas.push(S.projeto.sprint + ' de ' + S.projeto.sprints.length + ', com o limite de ' + S.projeto.limite + ' PF por pessoa.');
    return (linhas.length ? `<ul class="contexto-est">${linhas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
  }
  /* A carga da sprint, no painel da Sprint (D74): por pessoa para a equipe; o Head Ops e a Direção leem só o total (ADR-049). */
  function cargaNoPainel(r) {
    const carga = cargaDaSprint();
    const total = Object.values(carga).reduce((a, b) => a + b, 0), cap = Object.keys(carga).length * S.projeto.limite;
    const barra = (v, m) => `<div class="barra"><i style="width:${Math.min(100, Math.round(v / m * 100))}%"></i></div>`;
    if (['headops', 'direcao'].includes(r.papel)) return `<div class="cargas" data-carga="total"><span>Carga da ${esc(S.projeto.sprint)} <b>${total} de ${cap} PF</b></span>${barra(total, cap)}</div>`;
    return `<div class="cargas" data-carga="pessoas">${Object.entries(carga).sort((a, b) => nome(a[0]).localeCompare(nome(b[0]))).map(([ps, pf]) => `<span>${esc(nome(ps))} <b>${pf} de ${S.projeto.limite} PF</b></span>${barra(pf, S.projeto.limite)}`).join('')}</div>`;
  }
  /* A decisão no painel: o mesmo cartão da tela da decisão. */
  function cartaoDecisao(r, pend) {
    switch (pend.tipo) {
      case 'triar-comentario': return cartaoTriagem(pend);
      case 'conferir-previa': return conferir(r).replace('<div class="saudacao">', '<div class="saudacao painel-sub">');
      case 'aprovar-versao': return S.itens[pend.item].rascunho ? caixaVersao(r, pend.item, S.itens[pend.item], pend) : caixaSimples(pend);
      case 'mudanca-a-revisar': return caixaOnda(pend);
      case 'aprovar-tasks': return blocoPropostas(pend);
      case 'impedimento': return cartaoRisco(pend);
      case 'relato': return secaoRelato(pend);
      case 'fechar-medicao': return secaoMedicao(pend);
      case 'revisar-pr': return cartaoRevisao(pend);
      case 'ajuste-no-pr': case 'ajuste-pedido': return cartaoAjuste(pend);
      case 'aprovar-entrega': return caixaAprovarEntrega(pend);
      default: return caixaSimples(pend);
    }
  }
  function trilhaDoItem(item, cli) {
    const it = S.itens[item] || {};
    const L = S.trilha.filter((x) => x.item === item || (cli && it.pr && x.item === it.pr)).map((x) => cli ? (x.cli ? { q: x.quando, t: x.cli } : null) : { q: x.quando, t: x.quem + ': ' + x.texto }).filter(Boolean);
    return L.length ? `<ol class="trilha">${L.map((x) => `<li><span class="m">${esc(x.q)}</span> ${esc(x.t)}</li>`).join('')}</ol>` : '';
  }
  /* Veio de e levou a (consultas Por quê e Impacto do grafo de ligações, docs/38): as ligações que o estado do mock já guarda. */
  function ligacoes(item, cli) {
    const it = S.itens[item];
    if (!it || cli) return '';
    const de = [], para = [];
    const nomeDe = (id) => { const x = S.itens[id]; return x ? (x.tipo === 'pr' ? 'PR #' + x.numero + ': ' + x.titulo : (x.titulo || '"' + x.texto + '"') + ' · ' + id) : id; };
    if (it.tipo === 'task') { if (it.pedido) de.push(it.pedido); const req = it.pedido && S.itens[it.pedido].requisito; if (req) de.push(req); if (it.pr) para.push(it.pr); }
    if (it.tipo === 'pr') de.push(...it.tasks);
    if (it.tipo === 'pedido') { if (it.requisito) para.push(it.requisito); para.push(...(it.tasks || [])); }
    if (it.tipo === 'requisito') { if (it.pedido) de.push(it.pedido); para.push(...(it.tasks || [])); }
    if (it.tipo === 'comentario') { if (it.pr) de.push(it.pr); if (it.task) para.push(it.task); if (it.pedidoNovo) para.push(it.pedidoNovo); }
    if (!de.length && !para.length) return '';
    const lista = (L) => L.filter((x) => S.itens[x]).map((x) => `<button type="button" class="linha" data-abrir="${esc(x)}"><span class="t">${esc(nomeDe(x))}</span></button>`).join('');
    return `<div class="ligacoes" data-ligacoes="${esc(item)}">${de.length ? `<h3>Veio de</h3>${lista(de)}` : ''}${para.length ? `<h3>Levou a</h3>${lista(para)}` : ''}</div>`;
  }
  /* Os itens que a etapa mostra, para o veio de e levou a: o que o estado já liga àquela etapa. */
  function itensDaEtapa(id) {
    const ent = Object.entries(S.itens);
    const de = (f) => ent.filter(([, x]) => f(x)).map(([k]) => k);
    return ({
      pedido: de((x) => x.tipo === 'pedido'), requisito: de((x) => x.tipo === 'requisito'),
      backlog: de((x) => x.tipo === 'task' && x.estado === 'proposta'), tasks: de((x) => x.tipo === 'task' && x.estado === 'em-construcao'),
      codigo: de((x) => x.tipo === 'pr' && x.estado !== 'mesclado'), previa: de((x) => x.tipo === 'pr' && (x.previa || x.previaLiberada)),
      homolog: de((x) => x.tipo === 'task' && ['aguardando-homologacao', 'homologado'].includes(x.estado))
    })[id] || [];
  }
  function painelEstacao(r) {
    const cli = r.papel === 'cliente';
    let topo, corpo, topoLinha = '';
    if (r.est === 'dia') {
      topo = 'Seu dia';
      corpo = papelDe(r.papel).carteira ? carteira(r) : inicio(r);
    } else {
      const com = abertas(r.p, r.papel, 'com').filter((x) => (r.est === 'plataforma' ? !estDe(x) : estDe(x) === r.est));
      const prep = abertas(r.p, r.papel, 'prep').filter((x) => (r.est === 'plataforma' ? !estDe(x) : estDe(x) === r.est));
      const x = ESTACOES.find((e) => e.id === r.est);
      topo = r.est === 'plataforma' ? 'Fora do projeto' : x ? (cli ? x.cli || 'Trabalho da equipe' : x.t) : '';
      const etapa = x ? ETAPAS.find((e) => e[0] === x.e)[1] + ' · ' + NOME_ESTADO[estadoEst(x.id)] : '';
      topoLinha = etapa;
      const imp = S.itens['IMP-01'];
      if (x && x.id === 'decisao' && estadoEst('decisao') === 'parado' && imp && !['headops', 'direcao', 'admin', 'cliente'].includes(r.papel)) topoLinha += ': ' + imp.bloqueadoPor;
      /* A carga da sprint fica no painel da Sprint (D74), com ou sem decisão ali. */
      const carga = x && x.id === 'sprint' && !['cliente', 'admin'].includes(r.papel) ? cargaNoPainel(r) : '';
      corpo = `${carga}${com.map((pend) => `<div class="decisao-painel" data-decisao="${esc(pend.id)}">${cartaoDecisao(r, pend)}${pend.tipo === 'conferir-previa' ? '' : (() => { const t = trilhaDoItem(pend.item, cli); return t ? `<h3>Trilha do item</h3>${t}` : ''; })()}${['headops', 'direcao', 'admin'].includes(r.papel) ? '' : ligacoes(pend.item, cli)}</div>`).join('')}
        ${prep.map(itemPrep).join('')}
        ${!com.length && !prep.length ? `<p class="vazio">${x && !x.papeis.includes(r.papel) ? 'Esta etapa é de outro papel.' : 'Nada com você nesta etapa agora.'}</p>${x && x.papeis.includes(r.papel) && !(cli && !x.cli) ? contextoEst(x.id, r) + (['headops', 'direcao', 'admin'].includes(r.papel) ? '' : itensDaEtapa(x.id).slice(0, 3).map((i) => ligacoes(i, cli)).join('')) : ''}` : ''}`;
    }
    return `<aside id="detalhe" class="painel-trilho" data-est="${esc(r.est)}" aria-label="${esc(topo)}">
      <div class="det-topo"><span class="m" data-estado-est>${esc(topoLinha || topo)}</span><button type="button" class="btn" id="fechar-detalhe">Fechar</button></div>
      ${r.est === 'dia' ? '' : `<h2>${esc(topo)}</h2>`}${corpo}</aside>`;
  }

  /* ---------- casca ---------- */
  function entrada() {
    return `<main id="entrada"><div class="ent-topo">${MARCA}</div>
      <h1>Escolha um papel para ver o produto pelos olhos dele</h1>
      <p class="lead">Cada papel tem uma tela inicial que responde ao que esperam dele, ao que ele está fazendo e a onde está o que ele entregou. Os dados são de exemplo.</p>
      <div class="cartoes">${PAPEIS.map((x) => `<button type="button" class="cartao-papel" data-papel="${x.id}"><b>${esc(x.nome)}</b><span>${esc(x.frase)}</span></button>`).join('')}</div>
      <p class="rodape-ent">Dados de exemplo</p></main>`;
  }

  function casca(r, corpo) {
    const pap = papelDe(r.papel);
    const seus = S.pessoas[r.p].papeis || [];
    const trocar = seus.length > 1 ? `<span id="papel-ativo" role="group" aria-label="Seu papel neste projeto">Seu papel aqui:${seus.map((x) => x === r.papel ? `<span class="seg ativo" aria-current="true">${esc(papelDe(x).nome)}</span>` : `<button type="button" class="seg" data-trocar-papel="${x}">${esc(papelDe(x).nome)}</button>`).join('')}</span>` : '';
    const menu = pap.telas.map((t) => `<a href="${hashDe({ p: r.p, papel: r.papel, tela: t })}" data-tela="${t}"${t === r.tela ? ' aria-current="page"' : ''}>${esc(TELAS[t])}</a>`).join('');
    return `<header id="topo">${MARCA}
        <nav id="menu" aria-label="Telas do papel">${menu}</nav>
        <div class="quem"><span>${esc(nome(r.p))}${seus.length > 1 ? '' : ' · ' + esc(pap.nome)}</span>${trocar}${seletorTema()}<button type="button" class="btn" id="btn-demo">Modo demonstração</button></div></header>
      <div id="corpo" class="${r.item || r.est ? 'com-detalhe' : ''}${r.tela === 'trilho' ? ' no-trilho' : ''}"><main id="conteudo">${corpo}</main>${r.item ? detalhe(r) : r.est ? painelEstacao(r) : ''}</div>
      <footer id="rodape">Dados de exemplo</footer>`;
  }

  function seletorTema() {
    const t = temaSalvo();
    return `<span class="tema" role="group" aria-label="Tema">${TEMAS.map(([id, nm]) => `<button type="button" data-tema="${id}" aria-pressed="${id === t}">${nm}</button>`).join('')}</span>`;
  }

  /* Ver como (D72): a lista de papéis da demonstração. Fica fora da tela do produto, como o modo demonstração. */
  function demo(papel) {
    return `<label class="ver-como"><span class="demo-tag">demonstração</span>Ver como<select id="ver-como">${PAPEIS.map((x) => `<option value="${x.id}"${x.id === papel ? ' selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></label>
      <dialog id="demo" aria-labelledby="demo-t"><h2 id="demo-t">Modo demonstração</h2>
      <p class="sub">Para quem está mostrando o produto. Nada daqui aparece para quem usa.</p>
      <h3>Trocar de papel</h3><div class="demo-papeis">${PAPEIS.map((x) => `<button type="button" class="btn" data-demo-papel="${x.id}">${esc(x.nome)}</button>`).join('')}</div>
      <h3>Começo</h3><button type="button" class="btn" id="demo-entrada">Voltar à escolha do papel</button>
      <h3>Dados de exemplo</h3><button type="button" class="btn" id="demo-reiniciar">Reiniciar os dados de exemplo</button>
      <div class="demo-fim"><button type="button" class="btn prim" id="demo-fechar">Fechar</button></div></dialog>`;
  }

  function aviso(msg) {
    const t = document.getElementById('aviso');
    t.textContent = msg; t.hidden = false;
    clearTimeout(aviso.tm); aviso.tm = setTimeout(() => { t.hidden = true; }, 4000);
  }

  let ultimaPessoa = null;
  let focoDepois = null;
  function render() {
    const r = lerRota();
    /* O aviso é de quem agiu: trocar de pessoa o tira da tela, para um papel não ver o aviso de outro. */
    if (r.p !== ultimaPessoa) { const t = document.getElementById('aviso'); if (t) { t.hidden = true; t.textContent = ''; } ultimaPessoa = r.p; }
    const app = document.getElementById('app');
    app.removeAttribute('data-pronto');
    if (!r.p || !S.pessoas[r.p]) { app.innerHTML = entrada(); document.getElementById('demo-raiz').innerHTML = ''; app.setAttribute('data-pronto', ''); return; }
    if (!r.papel || !(S.pessoas[r.p].papeis || []).includes(r.papel)) r.papel = S.pessoas[r.p].papeis[0];
    escalarVencidas();
    const pap = papelDe(r.papel);
    let corpo;
    /* O Início segue aberto pelo endereço e no painel do trilho, como "seu dia" (D72). */
    if (!pap.telas.includes(r.tela) && r.tela !== 'inicio') corpo = naoEncontrada();
    else if (r.tela === 'trilho') corpo = trilho(r);
    else if (r.tela === 'inicio') corpo = pap.carteira ? carteira(r) : inicio(r);
    else if (r.tela === 'projeto') corpo = projeto(r);
    else if (r.tela === 'conferir') corpo = conferir(r);
    else if (r.tela === 'entregas') corpo = entregas(r);
    else if (r.tela === 'entrada') corpo = telaEntrada(r);
    else if (r.tela === 'requisitos') corpo = telaRequisitos(r);
    else if (r.tela === 'liberacao') corpo = telaLiberacao(r);
    else if (r.tela === 'sprint') corpo = telaSprint(r);
    else if (r.tela === 'riscos') corpo = telaRiscos(r);
    else if (r.tela === 'fechamento') corpo = telaFechamento(r);
    else if (r.tela === 'task') corpo = telaTask(r);
    else if (r.tela === 'revisoes') corpo = telaRevisoes(r);
    else corpo = telaAinda(r);
    app.innerHTML = casca(r, corpo);
    document.getElementById('demo-raiz').innerHTML = demo(r.papel);
    document.title = (TELAS[r.tela] || 'Volunder') + ' · Volunder';
    if (r.tela === 'trilho') { posicionarTrilho(); animarTrilho(); }
    /* O foco de teclado acompanha a camada: entra no estágio à esquerda e volta ao estágio (ou ao Seu dia, ou ao que é de fora). */
    if (focoDepois) { const b = document.querySelector(focoDepois); focoDepois = null; if (b) b.focus({ preventScroll: true }); }
    app.setAttribute('data-pronto', '');
  }

  /* Para onde vai o foco de teclado ao sair do foco: o estágio, o Seu dia ou o que é de fora do projeto. */
  const volta = (r) => r.etapa ? `.etapa[data-etapa="${r.etapa}"]` : r.est === 'dia' ? '.seu-dia' : r.est === 'plataforma' ? '.fora .linha' : null;
  document.addEventListener('click', (e) => {
    const r = lerRota();
    const el = e.target.closest('button, a');
    if (!el) return;
    if (el.matches('.cartao-papel')) { const x = papelDe(el.dataset.papel); ir({ p: x.pessoa, papel: x.id, tela: 'trilho' }); return; }
    if (el.id === 'demo-entrada') { document.getElementById('demo').close(); history.pushState(null, '', location.pathname); render(); return; }
    if (el.matches('[data-abrir]')) { ir({ p: r.p, papel: r.papel, tela: r.tela, vista: r.vista, etapa: r.etapa, est: r.est, item: el.dataset.abrir }); return; }
    if (el.matches('.etapa[data-etapa]')) { const fechar = r.etapa === el.dataset.etapa && !r.est; focoDepois = `.etapa[data-etapa="${el.dataset.etapa}"]`; transicao = fechar ? null : { tipo: 'abrir' }; ir({ p: r.p, papel: r.papel, tela: 'trilho', etapa: fechar ? undefined : el.dataset.etapa }); return; }
    if (el.matches('.foco-estagio')) { const no = el.querySelector('.no'); transicao = { tipo: 'voltar', de: no.getBoundingClientRect() }; focoDepois = volta(r); ir({ p: r.p, papel: r.papel, tela: 'trilho', etapa: el.dataset.voltar || undefined }); return; }
    if (el.matches('[data-est]')) { const x = ESTACOES.find((s) => s.id === el.dataset.est); const no = x && document.querySelector(`.etapa[data-etapa="${x.e}"] .no`); if (no && r.tela === 'trilho' && !r.est) transicao = { tipo: 'focar', de: no.getBoundingClientRect() }; if (r.tela === 'trilho') focoDepois = '.foco-estagio'; ir({ p: r.p, papel: r.papel, tela: 'trilho', etapa: x ? x.e : r.etapa, est: el.dataset.est }); return; }
    if (el.matches('[data-tema]')) { aplicarTema(el.dataset.tema); document.querySelectorAll('.tema [data-tema]').forEach((b) => b.setAttribute('aria-pressed', String(b === el))); return; }
    if (el.matches('[data-comentar]')) { ir({ p: r.p, papel: r.papel, tela: r.tela, etapa: r.etapa, est: r.est, vista: 'trecho-' + el.dataset.comentar }); return; }
    if (el.matches('[data-fechar-trecho]')) { ir({ p: r.p, papel: r.papel, tela: r.tela, etapa: r.etapa, est: r.est }); return; }
    if (el.matches('[data-vista]')) { ir({ p: r.p, papel: r.papel, tela: r.tela, vista: el.dataset.vista, etapa: r.etapa, est: r.est, item: r.item }); return; }
    if (el.matches('[data-principal]')) { const pend = S.pendencias.find((x) => x.id === el.dataset.principal); ir({ p: r.p, papel: r.papel, tela: r.tela, etapa: r.etapa, est: r.est, item: pend.item }); return; }
    if (el.matches('[data-decidir]')) { decidir(el.dataset.decidir); return; }
    if (el.matches('[data-ir-tela]')) { ir({ p: r.p, papel: r.papel, tela: el.dataset.irTela }); return; }
    /* Fechar o item aberto de dentro do painel volta ao painel; fechar o painel volta ao trilho. */
    if (el.id === 'fechar-detalhe' && !r.item && r.tela === 'trilho') { const no = document.querySelector('.foco-estagio .no'); if (no) transicao = { tipo: 'voltar', de: no.getBoundingClientRect() }; focoDepois = volta(r); }
    if (el.id === 'fechar-detalhe') { ir({ p: r.p, papel: r.papel, tela: r.tela, vista: r.vista, etapa: r.etapa || (ESTACOES.find((s) => s.id === r.est) || {}).e, est: r.item ? r.est : undefined }); return; }
    if (el.matches('[data-trocar-papel]')) { const novo = el.dataset.trocarPapel; ir({ p: r.p, papel: novo, tela: r.tela === 'inicio' || papelDe(novo).telas.includes(r.tela) ? r.tela : 'trilho' }); return; }
    if (el.id === 'btn-demo') { document.getElementById('demo').showModal(); return; }
    if (el.id === 'demo-fechar') { document.getElementById('demo').close(); return; }
    if (el.matches('[data-demo-papel]')) { const x = papelDe(el.dataset.demoPapel); document.getElementById('demo').close(); ir({ p: x.pessoa, papel: x.id, tela: 'trilho' }); return; }
    if (el.id === 'demo-reiniciar') { reiniciar(); document.getElementById('demo').close(); render(); aviso('Dados de exemplo reiniciados.'); }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    const r = lerRota();
    if (f.dataset.form === 'comentar') {
      const ta = f.querySelector('[name="texto"]');
      const res = comentar(f.dataset.pr, f.dataset.trecho, ta.value, f.dataset.conferido === '1');
      if (res.erro) { if (res.limpo) { ta.value = res.limpo; f.dataset.conferido = '1'; } const er = f.querySelector('.erro'); er.textContent = res.erro; er.hidden = false; return; }
      aviso(res.ok);
      ir({ p: r.p, papel: r.papel, tela: r.tela, etapa: r.etapa, est: r.est });
      return;
    }
    if (['p05', 'p24', 'relato'].includes(f.dataset.form)) {
      if (!e.submitter) return;
      const v = (n) => { const x = f.querySelector(`[name="${n}"]:checked`) || f.querySelector(`textarea[name="${n}"], input[type="hidden"][name="${n}"]`); return x ? x.value : ''; };
      decidir(f.dataset.pendencia, { saida: e.submitter.value, task: f.dataset.task, para: v('para'), motivo: v('motivo'), linha: v('linha'), modo: v('modo'), decisao: v('decisao') });
      return;
    }
    if (['ajuste', 'revisao'].includes(f.dataset.form)) {
      if (!e.submitter) return;
      decidir(f.dataset.pendencia, { saida: e.submitter.value, linha: f.querySelector('textarea[name="linha"]').value });
      return;
    }
    if (f.dataset.form === 'onda') {
      if (!e.submitter) return;
      decidir(f.dataset.pendencia, { saida: e.submitter.value, item: f.dataset.item, etapa: f.dataset.etapa, linha: f.querySelector('textarea[name="linha"]').value });
      return;
    }
    if (['triar', 'versao'].includes(f.dataset.form)) {
      if (!e.submitter) return;
      const v = (n) => { const x = f.querySelector(`[name="${n}"]:checked`) || f.querySelector(`textarea[name="${n}"]`); return x ? x.value : ''; };
      decidir(f.dataset.pendencia, { saida: e.submitter.value, destino: v('destino'), motivo: v('motivo'), linha: v('linha') });
      return;
    }
    if (f.dataset.form === 'aprovar-entrega') {
      if (!e.submitter) return;
      const m = f.querySelector('[name="motivo"]:checked');
      decidir(f.dataset.pendencia, { saida: e.submitter.value, motivo: m ? m.value : '', linha: f.querySelector('[name="linha"]').value });
    }
  });
  /* Ver como: o seletor de papel da demonstração abre o trilho da pessoa de exemplo do papel. */
  document.addEventListener('change', (e) => {
    if (e.target.id !== 'ver-como') return;
    const x = papelDe(e.target.value);
    ir({ p: x.pessoa, papel: x.id, tela: 'trilho' });
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', () => posicionarTrilho());
  window.addEventListener('DOMContentLoaded', render);
})();
