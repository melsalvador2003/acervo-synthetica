import { ArchiveItem, UserProfile, CuratorRecommendation } from '../types';

export interface WrappedInsumoPayload {
  periodo: { mes: number; ano: number };
  perfil: {
    decada_predominante: number;
    secao_predominante: string;
    decadas_visitadas: number;
    secoes_visitadas: number;
  };
  destaques: Array<{
    id: string;
    titulo: string;
    secao: string;
    ano: number;
    resumo: string;
    sinais: string[];
    posicao: number;
  }>;
  acervo_disponivel: Array<{
    id: string;
    titulo: string;
    secao: string;
    ano: number;
    creator?: string;
  }>;
  forcar_regeneracao?: boolean;
}

export interface WrappedNarrativaResponse {
  sucesso: boolean;
  narrativa: string;
  recomendacoes: CuratorRecommendation[];
  origem: string;
  geradoEm: string;
  periodo?: { mes: number; ano: number };
}

/**
 * Chama o backend para obter ou gerar a narrativa do Curador Synthetica (Gemini 3.8 Flash)
 * Mantém cache local conforme regra de persistência (Seção 6: Geração única por mês)
 */
export async function getOrGenerateWrappedNarrative(
  userId: string,
  insumo: WrappedInsumoPayload
): Promise<WrappedNarrativaResponse> {
  const cacheKey = `synthetica_curador_wrapped_${userId}_${insumo.periodo.mes}_${insumo.periodo.ano}`;

  // Se não estiver forçando regeneração, verifica se já existe no localStorage
  if (!insumo.forcar_regeneracao) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.narrativa && Array.isArray(parsed.recomendacoes)) {
          return {
            ...parsed,
            origem: parsed.origem || 'cache_persistido',
          };
        }
      }
    } catch {
      // continua para a requisição
    }
  }

  try {
    const response = await fetch(`/api/usuarios/${encodeURIComponent(userId)}/wrapped/narrativa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insumo),
    });

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status})`);
    }

    const data: WrappedNarrativaResponse = await response.json();

    // Salva no localStorage para persistência
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // ignore
    }

    return data;
  } catch (error) {
    console.warn('Fallback ativado para Curador Synthetica:', error);

    // Fallback gracioso estipulado na Seção 6 do documento
    const decada = insumo.perfil.decada_predominante || 2040;
    const secao = insumo.perfil.secao_predominante || 'Dança';
    const topItem = insumo.destaques[0];

    const fallbackNarrativa = topItem
      ? `Setembro foi um mês nos anos ${decada} para você. Você leu "${topItem.titulo}" até o fim e interagiu com o registro — um dos momentos de maior atenção do mês. A intersecção estética entre forma e memória na seção de ${secao} parece ter guiado suas descobertas. As próximas recomendações exploram essa mesma inquietação sob outros suportes e épocas.`
      : `Setembro revelou sua atração pelos anos ${decada} e pelas poéticas da seção de ${secao}. Você explorou diálogos entre corpo, técnica e tempo. As sugestões a seguir prolongam esse percurso curatorial pelo acervo.`;

    const fallbackRecs: CuratorRecommendation[] = (insumo.acervo_disponivel.slice(0, 3) || []).map((item) => ({
      id: item.id,
      titulo: item.titulo,
      razao: `Aprofunda a sua pesquisa sobre os anos ${item.ano ? Math.floor(item.ano / 10) * 10 : decada}s e as linguagens de ${item.secao}.`,
      categoria: (item.secao?.toLowerCase() as any) || 'danca',
      ano: item.ano,
    }));

    return {
      sucesso: true,
      narrativa: fallbackNarrativa,
      recomendacoes: fallbackRecs,
      origem: 'curador_heuristico_seguranca',
      geradoEm: new Date().toISOString(),
      periodo: insumo.periodo,
    };
  }
}

/**
 * Obtém sugestão de próximo artigo com conexão justificada pela IA (Fim de Artigo - Seção 1)
 */
export async function getNextArticleRecommendation(
  artigoAtual: ArchiveItem,
  todosArtigos: ArchiveItem[]
): Promise<{ proximoArtigoId: string; proximoTitulo: string; conexaoExplicada: string }> {
  try {
    const response = await fetch('/api/curador/proximo-artigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artigoAtual: {
          id: artigoAtual.id,
          title: artigoAtual.title,
          category: artigoAtual.category,
          decade: artigoAtual.decade,
          curatorialNotes: artigoAtual.curatorialNotes,
        },
        outrosArtigos: todosArtigos.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          decade: a.decade,
        })),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.proximoArtigoId && data.conexaoExplicada) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Erro ao buscar próximo artigo com IA:', err);
  }

  // Fallback
  const candidatos = todosArtigos.filter((a) => a.id !== artigoAtual.id);
  const sugerido =
    candidatos.find((a) => a.category === artigoAtual.category) ||
    candidatos.find((a) => a.decade === artigoAtual.decade) ||
    candidatos[0];

  return {
    proximoArtigoId: sugerido ? sugerido.id : artigoAtual.id,
    proximoTitulo: sugerido ? sugerido.title : 'Outro registro do acervo',
    conexaoExplicada: sugerido
      ? `Continua a investigação em ${sugerido.category} da década de ${sugerido.decade}, explorando suportes correlatos.`
      : 'Explore os demais registros do acervo.',
  };
}

/**
 * Gera frase de resumo do perfil de interesse do usuário (Perfil - Seção 1)
 */
export async function getUserProfileSummary(
  perfil: UserProfile,
  topCategories: string[],
  topDecades: string[]
): Promise<string> {
  try {
    const response = await fetch('/api/curador/perfil-resumo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perfil, topCategories, topDecades }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.resumo) return data.resumo;
    }
  } catch {
    // fallback
  }

  return `Pesquisador focado nas linguagens de ${topCategories.slice(0, 2).join(' e ') || 'vanguarda'}, com interesse especial pelas memórias de ${topDecades.slice(0, 2).join(' e ') || '1970s e 2040s'}.`;
}

export interface CuradorConsultaResponse {
  sucesso: boolean;
  resposta: string;
  obrasSugeridas?: string[];
}

export async function consultarCurador(
  pergunta: string,
  acervo: ArchiveItem[]
): Promise<CuradorConsultaResponse> {
  try {
    const acervoResumo = acervo.slice(0, 15).map((it) => ({
      id: it.id,
      title: it.title,
      category: it.category,
      year: it.year,
      curatorialNotes: it.curatorialNotes,
    }));

    const response = await fetch('/api/curador/consultar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, acervoResumo }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.resposta) return data;
    }
  } catch (err) {
    console.warn('Erro ao consultar Curador:', err);
  }

  return {
    sucesso: true,
    resposta:
      'O Acervo Synthetica articula obras marcantes de Dança, Música, Cinema, Artes Plásticas e Eletrônicos. Registros como o Clube da Esquina (1972) e o Sony Walkman (1979) ilustram as pontes entre arte e reprodução técnica.',
    obrasSugeridas: ['syn-mus-01', 'syn-ele-01'],
  };
}

export interface CuradorRoteiroResponse {
  sucesso: boolean;
  tituloRoteiro: string;
  introducao: string;
  etapas: Array<{
    obraId: string;
    titulo: string;
    categoria: string;
    conexaoCuratorial: string;
  }>;
}

export async function gerarRoteiroCuratorial(
  tema: string,
  acervo: ArchiveItem[]
): Promise<CuradorRoteiroResponse> {
  try {
    const response = await fetch('/api/curador/roteiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tema,
        acervo: acervo.map((i) => ({
          id: i.id,
          title: i.title,
          category: i.category,
          year: i.year,
          curatorialNotes: i.curatorialNotes,
        })),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.etapas && data.etapas.length > 0) return data;
    }
  } catch (err) {
    console.warn('Erro ao gerar roteiro curatorial:', err);
  }

  const fallbacks = acervo.slice(0, 3);
  return {
    sucesso: true,
    tituloRoteiro: tema ? `Trilha: ${tema}` : 'Trilha: Matrizes da Expressão Cultural',
    introducao: 'Três obras indispensáveis para compreender a pulsação do século XX.',
    etapas: fallbacks.map((item, idx) => ({
      obraId: item.id,
      titulo: item.title,
      categoria: item.category,
      conexaoCuratorial: `Etapa ${idx + 1}: Obra marcante do catálogo histórico do acervo.`,
    })),
  };
}

export async function obterAnaliseCriticaObra(obra: ArchiveItem): Promise<string> {
  try {
    const response = await fetch('/api/curador/analise-obra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ obra }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.analiseCritica) return data.analiseCritica;
    }
  } catch (err) {
    console.warn('Erro ao obter análise crítica:', err);
  }

  return `"${obra.title}" (${obra.year}) representa um momento definidor para a categoria de ${obra.category}. Seu valor patrimonial reside na confluência entre o avanço de sua mídia e o impacto sensível junto ao público de sua época.`;
}
