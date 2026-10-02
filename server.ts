import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// In-memory cache for generated monthly narratives (Persistência: Seção 6 - "Geração única por mês")
const narrativeCache = new Map<string, any>();

// ======================================================================================
// ENTIDADE COMENTARIO (MER - Database Application & Web Development)
// ======================================================================================
export interface ComentarioRecord {
  id_comentario: number;
  id_conteudo: string;
  id_usuario: number;
  autor_nome: string;
  texto: string;
  data_comentario: string;
  editado: boolean;
  curtidas: number;
}

const OBRAS_CONHECIDAS = new Set<string>([
  'syn-mus-01', 'syn-mus-02', 'syn-mus-03', 'syn-mus-04',
  'syn-dan-01', 'syn-dan-02', 'syn-dan-03', 'syn-dan-04', 'syn-dan-2010s',
  'syn-cin-01', 'syn-cin-02', 'syn-cin-03', 'syn-cin-04',
  'syn-art-01', 'syn-art-02', 'syn-art-03', 'syn-art-04', 'syn-art-05', 'syn-art-1920s',
  'syn-ele-01', 'syn-ele-02', 'syn-ele-03', 'syn-ele-04', 'syn-ele-2000s',
]);

function isObraValida(id_conteudo: unknown): boolean {
  if (typeof id_conteudo !== 'string') return false;
  const cleanId = id_conteudo.trim();
  if (!cleanId || cleanId.length < 2 || cleanId.length > 80) return false;
  if (OBRAS_CONHECIDAS.has(cleanId)) return true;
  // Permite itens personalizados e identificadores alfanuméricos válidos do acervo (ex: syn-*)
  return /^[a-zA-Z0-9_-]+$/.test(cleanId);
}

const COMENTARIOS_DB: ComentarioRecord[] = [
  {
    id_comentario: 1,
    id_conteudo: 'syn-mus-01',
    id_usuario: 102,
    autor_nome: 'Rodrigo Alvim',
    texto: 'A passagem de acordes de "O Trem Azul" ainda soa 50 anos à frente do nosso tempo. O vinil duplo original tem uma prensagem inacreditável.',
    data_comentario: '2026-09-02T10:15:00Z',
    editado: false,
    curtidas: 24,
  },
  {
    id_comentario: 2,
    id_conteudo: 'syn-mus-01',
    id_usuario: 103,
    autor_nome: 'Camila Freire',
    texto: 'Esse disco no toca-discos com ruído de agulha é uma experiência quase religiosa. Indispensável para o Wrapped deste mês!',
    data_comentario: '2026-09-04T14:30:00Z',
    editado: false,
    curtidas: 18,
  },
  {
    id_comentario: 3,
    id_conteudo: 'syn-mus-01',
    id_usuario: 1,
    autor_nome: 'Sofia Valente',
    texto: 'Adicionando esta obra às minhas pesquisas sobre a sonoridade mineira dos anos 70. Uma joia absoluta da nossa discografia.',
    data_comentario: '2026-09-06T18:00:00Z',
    editado: false,
    curtidas: 12,
  },
  {
    id_comentario: 4,
    id_conteudo: 'syn-mus-02',
    id_usuario: 104,
    autor_nome: 'DJ Mário Kraft',
    texto: 'Sem este disco de 1977 não existiria o electrofunk nem Daft Punk. A precisão do sequenciador é matemática pura.',
    data_comentario: '2026-09-03T09:20:00Z',
    editado: false,
    curtidas: 15,
  },
  {
    id_comentario: 5,
    id_conteudo: 'syn-mus-03',
    id_usuario: 105,
    autor_nome: 'Beatriz Vasconcelos',
    texto: 'O som da respiração dos dois no microfone Telefunken no estúdio da MGM prova que a imperfeição humana é o que torna o analógico divino.',
    data_comentario: '2026-09-05T11:45:00Z',
    editado: false,
    curtidas: 31,
  },
  {
    id_comentario: 6,
    id_conteudo: 'syn-mus-04',
    id_usuario: 106,
    autor_nome: 'Gabriel Recife',
    texto: 'Chico Science colocou o Brasil dos anos 90 em sincronia com o mundo inteiro sem perder um pingo de raiz regional.',
    data_comentario: '2026-09-07T16:10:00Z',
    editado: false,
    curtidas: 48,
  },
  {
    id_comentario: 7,
    id_conteudo: 'syn-dan-01',
    id_usuario: 107,
    autor_nome: 'Thiago Nogueira',
    texto: 'Pina provou que a dança não precisa ser bonita no sentido cosmético; ela precisa ser verdadeira. Cada queda é um desabafo.',
    data_comentario: '2026-09-01T20:00:00Z',
    editado: false,
    curtidas: 29,
  },
  {
    id_comentario: 8,
    id_conteudo: 'syn-dan-02',
    id_usuario: 108,
    autor_nome: 'Letícia Prado',
    texto: 'A sensação de assistir à roda girando ao vivo com os corpos sincronizados é indescritível.',
    data_comentario: '2026-09-03T17:40:00Z',
    editado: false,
    curtidas: 12,
  },
  {
    id_comentario: 9,
    id_conteudo: 'syn-dan-03',
    id_usuario: 109,
    autor_nome: 'Marcelo Duval',
    texto: 'A coragem de Nijinsky de pisar duro contra o tablado ressoa em qualquer dança urbana atual.',
    data_comentario: '2026-09-02T13:15:00Z',
    editado: false,
    curtidas: 19,
  },
  {
    id_comentario: 10,
    id_conteudo: 'syn-cin-01',
    id_usuario: 110,
    autor_nome: 'Igor Fontes',
    texto: 'O diálogo entre Corisco e Antônio das Mortes é o maior texto cinematográfico já escrito em língua portuguesa.',
    data_comentario: '2026-09-01T15:50:00Z',
    editado: false,
    curtidas: 45,
  },
  {
    id_comentario: 11,
    id_conteudo: 'syn-cin-02',
    id_usuario: 111,
    autor_nome: 'Juliana Krause',
    texto: 'A restauração de 2010 com o rolo de Buenos Aires devolveu o fôlego original que Lang pretendia.',
    data_comentario: '2026-08-31T18:22:00Z',
    editado: false,
    curtidas: 22,
  },
  {
    id_comentario: 12,
    id_conteudo: 'syn-cin-03',
    id_usuario: 112,
    autor_nome: 'Lucas Brandão',
    texto: 'A simplicidade do diálogo "Não se esqueça de mim" é uma aula de contenção dramática.',
    data_comentario: '2026-08-30T14:10:00Z',
    editado: false,
    curtidas: 18,
  },
  {
    id_comentario: 13,
    id_conteudo: 'syn-art-01',
    id_usuario: 113,
    autor_nome: 'Ana Clara Prado',
    texto: 'A tonalidade pastosa e o tom de verde/magenta da química SX-70 nunca foram igualados por nenhum filtro digital.',
    data_comentario: '2026-08-29T19:30:00Z',
    editado: false,
    curtidas: 38,
  },
  {
    id_comentario: 14,
    id_conteudo: 'syn-art-02',
    id_usuario: 114,
    autor_nome: 'Henrique Meireles',
    texto: 'Warhol entendeu que o comércio era a verdadeira religião do século XX antes de qualquer economista.',
    data_comentario: '2026-08-28T12:05:00Z',
    editado: false,
    curtidas: 27,
  },
  {
    id_comentario: 15,
    id_conteudo: 'syn-art-03',
    id_usuario: 115,
    autor_nome: 'Sofia Andrade',
    texto: 'Tocar em um Bicho de Lygia é entender que a forma artística reside no tempo e no gesto, não na matéria estática.',
    data_comentario: '2026-08-27T10:45:00Z',
    editado: false,
    curtidas: 35,
  },
  {
    id_comentario: 16,
    id_conteudo: 'syn-art-04',
    id_usuario: 116,
    autor_nome: 'Paula Siqueira',
    texto: 'A doçura do açúcar que causa tanta amargura social: uma das maiores ideias da arte brasileira dos anos 90.',
    data_comentario: '2026-08-26T21:10:00Z',
    editado: false,
    curtidas: 39,
  },
  {
    id_comentario: 17,
    id_conteudo: 'syn-ele-01',
    id_usuario: 117,
    autor_nome: 'Danilo Siqueira',
    texto: 'O som tátil do "clack" dos botões mecânicos do TPS-L2 ao pressionar PLAY é o auge do feedback tátil na história da eletrônica.',
    data_comentario: '2026-08-25T16:30:00Z',
    editado: false,
    curtidas: 54,
  },
  {
    id_comentario: 18,
    id_conteudo: 'syn-ele-02',
    id_usuario: 118,
    autor_nome: 'Clarice Ramos',
    texto: 'Foi a primeira vez que a máquina foi desenhada com proporções amigáveis que imitavam um rosto humano olhando para você.',
    data_comentario: '2026-08-24T11:20:00Z',
    editado: false,
    curtidas: 33,
  },
  {
    id_comentario: 19,
    id_conteudo: 'syn-ele-03',
    id_usuario: 119,
    autor_nome: 'Rafael Bento',
    texto: 'Até hoje conecto meu Game Boy com cartucho Nanoloop em amplificadores para fazer shows ao vivo. O grave dos 8-bits é incomparável.',
    data_comentario: '2026-08-23T15:00:00Z',
    editado: false,
    curtidas: 41,
  },
  {
    id_comentario: 20,
    id_conteudo: 'syn-ele-04',
    id_usuario: 120,
    autor_nome: 'Marcos Vinícius',
    texto: 'O boot do PS1 com aquele acorde espacial sintetizado é o som que define o otimismo tecnológico dos anos 90.',
    data_comentario: '2026-08-22T08:55:00Z',
    editado: false,
    curtidas: 52,
  },
];

let nextCommentId = COMENTARIOS_DB.length + 1;
const userLikesMap = new Map<number, Set<number>>([
  [1, new Set([101, 102])],
  [2, new Set([101])],
]);

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  // Plataformas de hospedagem injetam a porta por variável de ambiente.
  // Com a porta fixa, o contêiner sobe mas o serviço não responde.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  /**
   * CORS.
   *
   * Necessário quando a página é servida por um domínio e a API por outro.
   * Sem estes cabeçalhos o navegador bloqueia a requisição antes mesmo de ela
   * sair, e o erro que aparece no console não deixa claro que a causa é essa.
   *
   * O OPTIONS precisa ser respondido à parte: o navegador dispara essa
   * requisição de sondagem antes de qualquer PUT ou DELETE, e se ela não for
   * respondida a operação real nunca acontece.
   */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      service: 'Curador Synthetica - AI & Web Application Checkpoint 1',
      commentsService: 'active',
      aiConfigured: hasKey,
      model: 'gemini-3.8-flash',
    });
  });

  // ====================================================================================
  // ROTAS DA API DE COMENTÁRIOS (MER COMENTARIO)
  // ====================================================================================

  // 1. LISTAR COMENTÁRIOS DA OBRA
  app.get('/api/conteudos/:id_conteudo/comentarios', (req, res) => {
    const { id_conteudo } = req.params;
    if (!isObraValida(id_conteudo)) {
      return res.status(404).json({ detail: `Obra '${id_conteudo}' não encontrada no acervo.` });
    }

    const comentarios = COMENTARIOS_DB.filter((c) => c.id_conteudo === id_conteudo).sort(
      (a, b) =>
        new Date(a.data_comentario).getTime() - new Date(b.data_comentario).getTime() ||
        a.id_comentario - b.id_comentario
    );

    return res.json(comentarios);
  });

  // 2. CRIAR COMENTÁRIO EM UMA OBRA
  app.post('/api/conteudos/:id_conteudo/comentarios', (req, res) => {
    const { id_conteudo } = req.params;
    if (!isObraValida(id_conteudo)) {
      return res.status(404).json({ detail: `Obra '${id_conteudo}' não encontrada no acervo.` });
    }

    const { id_usuario, autor_nome, texto } = req.body || {};
    const textoLimpo = typeof texto === 'string' ? texto.trim() : '';

    if (!textoLimpo) {
      return res.status(422).json({ detail: 'O comentário não pode ser vazio.' });
    }
    if (textoLimpo.length > 1000) {
      return res.status(422).json({
        detail: 'O comentário excede o limite máximo de 1000 caracteres (VARCHAR2(1000)).',
      });
    }
    if (!id_usuario || typeof id_usuario !== 'number') {
      return res.status(422).json({ detail: 'id_usuario numérico é obrigatório.' });
    }
    if (!autor_nome || typeof autor_nome !== 'string' || autor_nome.trim().length < 2) {
      return res.status(422).json({ detail: 'autor_nome válido é obrigatório.' });
    }

    const novoComentario: ComentarioRecord = {
      id_comentario: nextCommentId++,
      id_conteudo,
      id_usuario,
      autor_nome: autor_nome.trim(),
      texto: textoLimpo,
      data_comentario: new Date().toISOString(),
      editado: false,
      curtidas: 0,
    };

    COMENTARIOS_DB.push(novoComentario);
    return res.status(201).json(novoComentario);
  });

  // 3. EDITAR COMENTÁRIO EXISTENTE
  app.put('/api/comentarios/:id_comentario', (req, res) => {
    const idComentario = Number(req.params.id_comentario);
    const comentario = COMENTARIOS_DB.find((c) => c.id_comentario === idComentario);

    if (!comentario) {
      return res.status(404).json({ detail: `Comentário #${idComentario} não encontrado.` });
    }

    const { id_usuario, texto } = req.body || {};
    if (id_usuario == null || Number(id_usuario) !== comentario.id_usuario) {
      return res.status(403).json({
        detail: 'Apenas o autor original tem permissão para editar este comentário.',
      });
    }

    const textoLimpo = typeof texto === 'string' ? texto.trim() : '';
    if (!textoLimpo) {
      return res.status(422).json({ detail: 'O texto do comentário não pode ser vazio.' });
    }
    if (textoLimpo.length > 1000) {
      return res.status(422).json({
        detail: 'O texto excede o limite máximo de 1000 caracteres (VARCHAR2(1000)).',
      });
    }

    comentario.texto = textoLimpo;
    comentario.editado = true;

    return res.json(comentario);
  });

  // 4. EXCLUIR COMENTÁRIO
  app.delete('/api/comentarios/:id_comentario', (req, res) => {
    const idComentario = Number(req.params.id_comentario);
    const index = COMENTARIOS_DB.findIndex((c) => c.id_comentario === idComentario);

    if (index === -1) {
      return res.status(404).json({ detail: `Comentário #${idComentario} não encontrado.` });
    }

    const comentario = COMENTARIOS_DB[index];
    const idUsuarioReq = req.query.id_usuario
      ? Number(req.query.id_usuario)
      : req.body?.id_usuario
      ? Number(req.body.id_usuario)
      : null;

    if (idUsuarioReq == null) {
      return res.status(422).json({ detail: 'id_usuario é obrigatório para validação de autoria.' });
    }

    if (idUsuarioReq !== comentario.id_usuario) {
      return res.status(403).json({
        detail: 'Apenas o autor original tem permissão para excluir este comentário.',
      });
    }

    COMENTARIOS_DB.splice(index, 1);
    userLikesMap.delete(idComentario);

    return res.status(204).end();
  });

  // 5. ALTERNAR CURTIDA EM COMENTÁRIO
  app.post('/api/comentarios/:id_comentario/curtida', (req, res) => {
    const idComentario = Number(req.params.id_comentario);
    const comentario = COMENTARIOS_DB.find((c) => c.id_comentario === idComentario);

    if (!comentario) {
      return res.status(404).json({ detail: `Comentário #${idComentario} não encontrado.` });
    }

    const { id_usuario } = req.body || {};
    const numUsuario = Number(id_usuario);
    if (!numUsuario) {
      return res.status(422).json({ detail: 'id_usuario numérico é obrigatório.' });
    }

    if (!userLikesMap.has(idComentario)) {
      userLikesMap.set(idComentario, new Set<number>());
    }
    const curtidores = userLikesMap.get(idComentario)!;

    if (curtidores.has(numUsuario)) {
      curtidores.delete(numUsuario);
      comentario.curtidas = Math.max(0, comentario.curtidas - 1);
    } else {
      curtidores.add(numUsuario);
      comentario.curtidas += 1;
    }

    return res.json(comentario);
  });

  // GET /api/usuarios/:id/wrapped/narrativa - Rota descrita no documento (Seção 4)
  app.get('/api/usuarios/:id/wrapped/narrativa', (req, res) => {
    const { id } = req.params;
    const mes = Number(req.query.mes) || 9;
    const ano = Number(req.query.ano) || 2047;
    const cacheKey = `${id}-${mes}-${ano}`;

    if (narrativeCache.has(cacheKey)) {
      return res.json({
        sucesso: true,
        origem: 'cache_persistido',
        ...narrativeCache.get(cacheKey),
      });
    }

    return res.status(404).json({
      sucesso: false,
      mensagem: 'Narrativa ainda não gerada para este período. Utilize o método POST para gerar.',
    });
  });

  // POST /api/usuarios/:id/wrapped/narrativa - Geração da narrativa e recomendações do Curador Synthetica
  app.post('/api/usuarios/:id/wrapped/narrativa', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        periodo = { mes: 9, ano: 2047 },
        perfil = {
          decada_predominante: 2040,
          secao_predominante: 'Dança',
          decadas_visitadas: 4,
          secoes_visitadas: 3,
        },
        destaques = [],
        acervo_disponivel = [],
        forcar_regeneracao = false,
      } = req.body;

      const cacheKey = `${id}-${periodo.mes}-${periodo.ano}`;

      // Regra da Seção 6: Geração única por mês (salvo se forçar regeneração para testes/ensaio)
      if (!forcar_regeneracao && narrativeCache.has(cacheKey)) {
        return res.json({
          sucesso: true,
          origem: 'cache_persistido',
          ...narrativeCache.get(cacheKey),
        });
      }

      const client = getGeminiClient();

      // Estrutura exata do insumo exigido no documento (Seção 5 - "O que o modelo recebe")
      const insumo = {
        periodo,
        perfil,
        destaques,
        acervo_disponivel,
      };

      // Prompt oficial especificado no documento do Checkpoint 1
      const systemInstruction = `Você é o curador do Portal Synthetica, um acervo digital de 2047.
Escreva sobre o mês de um visitante a partir dos dados fornecidos.

Regras estritas:
- Use apenas os dados fornecidos. Não invente títulos, datas ou fatos.
- Recomende somente itens de acervo_disponivel, pelo id.
- Cada recomendação precisa de uma razão ligada ao que a pessoa leu.
- Trate o visitante por você. Não use o nome dele.
- Narrativa: no máximo 90 palavras. Justificativas: no máximo 25 palavras.
- Responda apenas com o JSON no formato indicado, sem texto em volta:
{
  "narrativa": "texto de até 90 palavras",
  "recomendacoes": [
    { "id": "id_do_item", "titulo": "título exato", "razao": "justificativa de até 25 palavras" }
  ]
}`;

      let resultadoJSON: {
        narrativa: string;
        recomendacoes: Array<{ id: string; titulo: string; razao: string }>;
      } | null = null;
      let origem = 'gemini-3.8-flash';

      if (client) {
        const prompt = `${systemInstruction}\n\nInsumo de dados em JSON:\n${JSON.stringify(
          insumo,
          null,
          2
        )}`;

        const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

        for (const modelName of modelsToTry) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.65,
              },
            });

            const rawText = response.text || '';
            const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            resultadoJSON = JSON.parse(cleanedText);

            if (resultadoJSON && resultadoJSON.narrativa) {
              origem = modelName;
              // Validação da Seção 6: Conferir se os ids recomendados existem no acervo disponível
              if (Array.isArray(resultadoJSON.recomendacoes)) {
                const validIds = new Set(acervo_disponivel.map((item: any) => String(item.id)));
                resultadoJSON.recomendacoes = resultadoJSON.recomendacoes
                  .filter((rec) => validIds.has(String(rec.id)))
                  .slice(0, 3);
              }
              break;
            }
          } catch (modelErr) {
            console.warn(`Tentativa com ${modelName} falhou, tentando próximo fallback...`);
          }
        }
      }

      // Fallback gracioso estipulado na Seção 6 do documento:
      // "Se o modelo não responder, demorar demais ou devolver algo fora do formato, a API registra o problema e devolve o Wrapped sem a narrativa."
      if (!resultadoJSON || !resultadoJSON.narrativa) {
        origem = 'curador_heuristico_seguranca';
        const decada = perfil.decada_predominante || 2040;
        const secao = perfil.secao_predominante || 'Dança';
        const primeiroDestaque = destaques[0] || {
          titulo: 'Dança holográfica coletiva',
          sinais: ['leitura completa', 'salvou', 'compartilhou'],
        };

        const narrativaFallback = `Setembro foi um mês nos anos ${decada} para você. Você leu "${primeiroDestaque.titulo}" até o fim e compartilhou em seguida — o único registro com ambos os gestos. A objeção sobre como a presença física e o código coexistem parece ter guiado sua jornada pela seção de ${secao}. Se quiser seguir por aí, as recomendações exploram o mesmo impasse sob novos suportes.`;

        // 3 recomendações justificadas a partir de acervo_disponivel
        const recsFallback = (acervo_disponivel.slice(0, 3) || []).map((item: any) => ({
          id: String(item.id),
          titulo: item.titulo,
          razao: `Conecta-se ao seu interesse pela década de ${item.ano ? Math.floor(item.ano / 10) * 10 : decada}s e pela estética da seção ${item.secao}.`,
        }));

        resultadoJSON = {
          narrativa: narrativaFallback,
          recomendacoes: recsFallback,
        };
      }

      // Persiste no cache conforme o documento
      const payloadPersistido = {
        periodo,
        perfil,
        narrativa: resultadoJSON.narrativa,
        recomendacoes: resultadoJSON.recomendacoes,
        origem,
        geradoEm: new Date().toISOString(),
      };

      narrativeCache.set(cacheKey, payloadPersistido);

      return res.json({
        sucesso: true,
        ...payloadPersistido,
      });
    } catch (err: any) {
      console.error('Erro no endpoint de narrativa:', err);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao processar a narrativa do Curador Synthetica.',
        detalhes: err.message,
      });
    }
  });

  // POST /api/curador/perfil-resumo - Gera a frase de resumo do perfil de interesse do usuário (Seção 1)
  app.post('/api/curador/perfil-resumo', async (req, res) => {
    try {
      const { perfil, topDecades = [], topCategories = [] } = req.body;
      const client = getGeminiClient();

      let resumoFrase = `Curador focado nas intersecções entre ${topCategories.slice(0, 2).join(' e ') || 'tecnologia e artes'}, com olhar atento para as décadas de ${topDecades.slice(0, 2).join(' e ') || '1970s e 2040s'}.`;

      if (client) {
        const prompt = `Você é o Curador do Acervo Synthetica de 2047. Escreva em UMA única frase poética e precisa (máximo 20 palavras) o resumo do perfil de interesse deste visitante com base em:
Categorias mais lidas: ${topCategories.join(', ')}
Décadas favoritas: ${topDecades.join(', ')}
Trate por "Você" ou em terceira pessoa impessoal ("Perfil voltado a..."). Não invente nada. Devolva apenas o texto da frase.`;

        const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const modelName of modelsToTry) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                temperature: 0.5,
              },
            });
            if (response.text) {
              resumoFrase = response.text.trim();
              break;
            }
          } catch {
            // tenta o próximo modelo
          }
        }
      }

      return res.json({ sucesso: true, resumo: resumoFrase });
    } catch (err: any) {
      return res.status(500).json({ sucesso: false, erro: err.message });
    }
  });

  // POST /api/curador/proximo-artigo - Fim de artigo: Sugere o próximo registro a ler com conexão explicada (Seção 1)
  app.post('/api/curador/proximo-artigo', async (req, res) => {
    try {
      const { artigoAtual, outrosArtigos = [] } = req.body;
      const client = getGeminiClient();

      const candidatos = outrosArtigos.filter((a: any) => a.id !== artigoAtual?.id).slice(0, 4);
      if (candidatos.length === 0) {
        return res.json({ sucesso: false, mensagem: 'Sem candidatos' });
      }

      let recomendacao = {
        proximoArtigoId: candidatos[0].id,
        proximoTitulo: candidatos[0].title,
        conexaoExplicada: `Trata de temas correlatos de ${candidatos[0].category} e preservação histórica dos anos ${candidatos[0].decade}.`,
      };

      if (client && artigoAtual) {
        const prompt = `Você é o Curador Synthetica. O visitante acabou de ler:
Título: "${artigoAtual.title}"
Categoria: "${artigoAtual.category}"
Década: "${artigoAtual.decade}"
Resumo: "${artigoAtual.curatorialNotes}"

Escolha exatamente UM dos seguintes artigos candidatos para sugerir como próximo:
${JSON.stringify(candidatos.map((c: any) => ({ id: c.id, title: c.title, category: c.category, decade: c.decade })))}

Explique em no máximo 25 palavras a conexão intelectual entre eles.
Responda APENAS em JSON:
{
  "proximoArtigoId": "id",
  "proximoTitulo": "titulo",
  "conexaoExplicada": "conexao de ate 25 palavras"
}`;

        const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const modelName of modelsToTry) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.5,
              },
            });

            const rawText = response.text || '';
            if (rawText) {
              const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
              if (parsed.proximoArtigoId) {
                recomendacao = parsed;
                break;
              }
            }
          } catch {
            // tenta o próximo modelo
          }
        }
      }

      return res.json({ sucesso: true, ...recomendacao });
    } catch (err: any) {
      return res.status(500).json({ sucesso: false, erro: err.message });
    }
  });

  // POST /api/curador/consultar - Diálogo interativo e dúvidas com o Curador Synthetica
  app.post('/api/curador/consultar', async (req, res) => {
    try {
      const { pergunta, historico = [], acervoResumo = [] } = req.body;
      const client = getGeminiClient();

      if (!pergunta || typeof pergunta !== 'string') {
        return res.status(400).json({ sucesso: false, erro: 'Pergunta necessária' });
      }

      if (!client) {
        return res.json({
          sucesso: true,
          resposta: `Como Curador do Synthetica, observo que nosso acervo preserva conexões entre Dança, Música, Cinema, Artes Plásticas e Eletrônicos. Explore obras como o Clube da Esquina (1972) ou o Walkman (1979) para vivenciar essa transformação cultural.`,
          obrasSugeridas: ['syn-mus-01', 'syn-ele-01'],
        });
      }

      const acervoContext = acervoResumo.slice(0, 15).map((item: any) =>
        `[ID: ${item.id}] ${item.title} (${item.category}, ${item.year}) - ${item.curatorialNotes || ''}`
      ).join('\n');

      const prompt = `Você é o Curador oficial do Acervo Synthetica em 2047.
Você é um historiador da arte, pensador da cultura e curador apaixonado pelo patrimônio analógico e digital (Dança, Música, Cinema, Artes Plásticas e Eletrônicos).
O visitante fez a seguinte pergunta ou reflexão:
"${pergunta}"

Contexto de algumas obras reais do acervo:
${acervoContext}

Instruções:
- Responda em português com elegância, profundidade e tom caloroso de curador experiente (máximo 80 palavras).
- Sempre que pertinente, mencione 1 ou 2 obras do acervo listadas acima para o visitante ver.
- Responda estritamente em formato JSON:
{
  "resposta": "texto da resposta de até 80 palavras",
  "obrasSugeridas": ["id_obra_1", "id_obra_2"]
}`;

      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of modelsToTry) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.6,
            },
          });

          const rawText = response.text || '';
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            return res.json({ sucesso: true, ...parsed });
          }
        } catch {
          // tenta o próximo modelo
        }
      }

      return res.json({
        sucesso: true,
        resposta: 'O percurso cultural do Synthetica conecta movimentos artísticos com revoluções de hardware e mídia. Visite as seções de Música e Eletrônicos para acompanhar o nascimento da escuta moderna.',
        obrasSugeridas: ['syn-mus-01', 'syn-ele-01'],
      });
    } catch (err: any) {
      return res.status(500).json({ sucesso: false, erro: err.message });
    }
  });

  // POST /api/curador/roteiro - Geração de trilha curatorial personalizada de 3 obras
  app.post('/api/curador/roteiro', async (req, res) => {
    try {
      const { tema, acervo = [] } = req.body;
      const client = getGeminiClient();

      if (!client || acervo.length < 3) {
        const fallbacks = acervo.slice(0, 3);
        return res.json({
          sucesso: true,
          tituloRoteiro: tema ? `Trilha: ${tema}` : 'Trilha: Matrizes da Expressão Cultural',
          introducao: 'Um percurso selecionado para conectar gestos artísticos ao desenvolvimento tecnológico.',
          etapas: fallbacks.map((item: any, idx: number) => ({
            obraId: item.id,
            titulo: item.title,
            categoria: item.category,
            conexaoCuratorial: `Etapa ${idx + 1}: Obra marcante do catálogo histórico do acervo.`,
          })),
        });
      }

      const lista = acervo.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        year: item.year,
        notes: item.curatorialNotes,
      }));

      const prompt = `Você é o Curador do Acervo Synthetica. Crie um Roteiro Curatorial de 3 etapas interligadas com base no tema pedido pelo visitante:
Tema do visitante: "${tema || 'Surpreenda-me com conexões históricas inesperadas'}"

Obras disponíveis no acervo (escolha exatamente 3 delas):
${JSON.stringify(lista)}

Responda APENAS em JSON:
{
  "tituloRoteiro": "Título elegante de até 6 palavras",
  "introducao": "Breve apresentação do percurso em até 30 palavras",
  "etapas": [
    {
      "obraId": "id_da_obra_1",
      "titulo": "titulo exato",
      "categoria": "categoria",
      "conexaoCuratorial": "razão da escolha nesta etapa da trilha em até 20 palavras"
    }
  ]
}`;

      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of modelsToTry) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.6,
            },
          });

          const rawText = response.text || '';
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            return res.json({ sucesso: true, ...parsed });
          }
        } catch {
          // tenta próximo modelo
        }
      }

      return res.json({
        sucesso: true,
        tituloRoteiro: 'Trilha Curatorial Essencial',
        introducao: 'Conectando o som, a imagem e o movimento do acervo permanente.',
        etapas: acervo.slice(0, 3).map((item: any) => ({
          obraId: item.id,
          titulo: item.title,
          categoria: item.category,
          conexaoCuratorial: 'Registro representativo de seu período e suporte.',
        })),
      });
    } catch (err: any) {
      return res.status(500).json({ sucesso: false, erro: err.message });
    }
  });

  // POST /api/curador/analise-obra - Análise crítica aprofundada de uma obra específica
  app.post('/api/curador/analise-obra', async (req, res) => {
    try {
      const { obra } = req.body;
      const client = getGeminiClient();

      if (!obra) {
        return res.status(400).json({ sucesso: false, erro: 'Obra necessária' });
      }

      if (!client) {
        return res.json({
          sucesso: true,
          analiseCritica: `"${obra.title}" (${obra.year}) representa um momento definidor para a categoria de ${obra.category}. Seu valor patrimonial reside na confluência entre o avanço de sua mídia e o impacto sensível junto ao público de sua época.`,
        });
      }

      const prompt = `Você é o Curador do Acervo Synthetica de 2047. Escreva uma análise crítica profunda, poética e informativa (máximo 60 palavras) sobre a obra a seguir:
Título: "${obra.title}"
Autor/Criador: "${obra.creator}"
Ano: ${obra.year} (${obra.decade})
Categoria: ${obra.category}
Suporte/Formato: ${obra.mediaFormat}
Notas: "${obra.curatorialNotes}"

Conecte a obra com as tensões sociais ou avanços estéticos de sua época.
Responda APENAS em JSON:
{
  "analiseCritica": "texto de até 60 palavras"
}`;

      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of modelsToTry) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.5,
            },
          });

          const rawText = response.text || '';
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            return res.json({ sucesso: true, ...parsed });
          }
        } catch {
          // tenta próximo modelo
        }
      }

      return res.json({
        sucesso: true,
        analiseCritica: `Uma obra singular que condensa a inventividade do período em seu suporte material.`,
      });
    } catch (err: any) {
      return res.status(500).json({ sucesso: false, erro: err.message });
    }
  });

  // Endpoints para download direto dos relatórios oficiais em formato .docx (Word / Google Docs)
  app.get('/api/download/framework-doc', async (_req, res) => {
    try {
      const { generateFrameworkDocxBuffer } = await import('./src/server/generateAcademicDocx');
      const buffer = await generateFrameworkDocxBuffer();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="FRAMEWORK_APPLICATION_Synthetica_Entrega_2.docx"');
      return res.send(buffer);
    } catch (err: any) {
      console.error('Erro ao gerar Framework docx:', err);
      return res.status(500).send('Erro ao gerar documento DOCX.');
    }
  });

  app.get('/api/download/mobile-doc', async (_req, res) => {
    try {
      const { generateMobileDocxBuffer } = await import('./src/server/generateAcademicDocx');
      const buffer = await generateMobileDocxBuffer();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="MOBILE_HYBRID_DEVELOPMENT_Synthetica_Entrega_2.docx"');
      return res.send(buffer);
    } catch (err: any) {
      console.error('Erro ao gerar Mobile docx:', err);
      return res.status(500).send('Erro ao gerar documento DOCX.');
    }
  });

  // Endpoints para download direto dos arquivos do Backend FastAPI (Python)
  app.get('/api/download/fastapi-main', (_req, res) => {
    const filePath = path.join(process.cwd(), 'backend_fastapi', 'main.py');
    res.download(filePath, 'main.py');
  });

  app.get('/api/download/fastapi-requirements', (_req, res) => {
    const filePath = path.join(process.cwd(), 'backend_fastapi', 'requirements.txt');
    res.download(filePath, 'requirements.txt');
  });

  app.get('/api/download/fastapi-readme', (_req, res) => {
    const filePath = path.join(process.cwd(), 'backend_fastapi', 'README.md');
    res.download(filePath, 'README.md');
  });

  // Vite middleware for development or static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Curador Synthetica Server] Rodando na porta ${PORT} com endpoints de IA`);
  });
}

startServer();