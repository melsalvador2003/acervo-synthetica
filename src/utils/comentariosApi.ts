/**
 * src/utils/comentariosApi.ts
 * Camada de integração HTTP cliente para o microsserviço de comentários (FastAPI).
 *
 * =====================================================================================
 * DECISÕES TÉCNICAS E ARQUITETURAIS:
 * =====================================================================================
 * 1. Separação de Persistência (Por que saiu do localStorage?):
 *    - O localStorage persiste dados estritamente no navegador daquele cliente específico.
 *      Para um museu digital com vida comunitária, os comentários precisam ser compartilhados,
 *      auditados e sincronizados entre diferentes curadores e visitantes em tempo real.
 *    - O desacoplamento através de uma API RESTful permite que a interface React permaneça
 *      reativa e agnóstica à infraestrutura de armazenamento, respeitando a arquitetura
 *      em camadas e o modelo relacional (MER) da disciplina.
 *
 * 2. Validação e Segurança no Servidor (Por que validar autoria no backend?):
 *    - Validar autoria apenas no frontend (desabilitando botões) é uma camada cosmética que
 *      não oferece segurança real. Usuários mal-intencionados podem forjar requisições HTTP
 *      com cURL ou ferramentas como Postman. O backend FastAPI atua como autoridade final,
 *      retornando HTTP 403 Forbidden caso o id_usuario não coincida com o registro da tupla.
 *
 * 3. Restrição de Integridade (Limite de 1000 caracteres):
 *    - Mapeia diretamente para a restrição de integridade da coluna VARCHAR2(1000) no banco
 *      de dados Oracle/SQL, evitando estouro de buffer, economizando tráfego de rede e
 *      preservando a ergonomia e legibilidade das fichas curatoriais.
 */

import { CommentItem, BackendComment } from '../types';

/**
 * URL base da API de comentários.
 *
 * Por padrão fica vazia, o que faz o fetch usar caminho relativo e falar com o
 * servidor que já está servindo a página. Só precisa de valor se a API estiver
 * hospedada em outro domínio.
 *
 * A normalização abaixo existe porque painéis de deploy costumam devolver o
 * valor com aspas literais ou com o texto de exemplo ainda preenchido. Sem
 * limpar isso, a URL montada vira algo como ""/api/... e a requisição cai em
 * 404 sem motivo aparente.
 */
function resolverUrlBase(): string {
  const bruto = (import.meta as any).env?.VITE_API_URL;

  if (typeof bruto !== 'string') return '';

  const limpo = bruto
    .trim()
    .replace(/^["']+|["']+$/g, '') // remove aspas que o painel possa ter incluído
    .replace(/\/+$/, '') // remove barras no final
    .trim();

  // Placeholders de arquivos de exemplo não são endereços válidos.
  const placeholders = ['MY_API_URL', 'MY_APP_URL', 'undefined', 'null'];
  if (!limpo || placeholders.includes(limpo)) return '';

  return limpo;
}

const API_BASE_URL = resolverUrlBase();

/**
 * Converte data ISO 8601 para formato amigável de exibição em português.
 */
function formatarDataComentario(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Recentemente';

    const agora = new Date();
    const diffMs = agora.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return 'Agora mesmo';
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHoras < 24) return `Há ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `Há ${diffDias} dias`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Recentemente';
  }
}

/**
 * Normaliza o registro retornado pelo FastAPI (BackendComment) para o modelo da UI (CommentItem).
 */
export function normalizarComentarioBackend(backendItem: BackendComment): CommentItem {
  return {
    id: String(backendItem.id_comentario),
    authorName: backendItem.autor_nome,
    authorRole: backendItem.id_usuario === 1 ? 'Curadora Registrada' : 'Visitante do Acervo',
    authorAvatar:
      backendItem.id_usuario === 1
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
        : undefined,
    content: backendItem.texto,
    timestamp: formatarDataComentario(backendItem.data_comentario),
    likes: backendItem.curtidas,
    userLiked: false,

    // Propriedades relacionais nativas do backend:
    id_comentario: backendItem.id_comentario,
    id_conteudo: backendItem.id_conteudo,
    id_usuario: backendItem.id_usuario,
    autor_nome: backendItem.autor_nome,
    texto: backendItem.texto,
    data_comentario: backendItem.data_comentario,
    editado: backendItem.editado,
    curtidas: backendItem.curtidas,
  };
}

/**
 * Trata erros de requisição HTTP e falhas de conexão de rede com mensagens claras.
 */
async function processarErroHttp(res: Response, operacao: string): Promise<never> {
  let mensagemErro = `Erro (${res.status}) ao ${operacao}.`;
  try {
    const errorData = await res.json();
    if (errorData && errorData.detail) {
      if (typeof errorData.detail === 'string') {
        mensagemErro = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // Erro de validação Pydantic (HTTP 422)
        const primeirosErros = errorData.detail
          .map((e: any) => `${e.loc?.slice(-1)?.[0] || 'campo'}: ${e.msg}`)
          .join('; ');
        mensagemErro = `Validação de dados: ${primeirosErros}`;
      }
    }
  } catch {
    // Mantém mensagem padrão se a resposta não for JSON
  }

  if (res.status === 403) {
    mensagemErro = 'Apenas o autor original tem permissão para editar ou excluir este comentário.';
  } else if (res.status === 404) {
    mensagemErro = mensagemErro || 'Comentário ou obra não encontrada no acervo.';
  } else if (res.status === 422) {
    mensagemErro = 'O texto do comentário não pode ser vazio e deve ter no máximo 1000 caracteres.';
  }

  throw new Error(mensagemErro);
}

/**
 * 1. LISTAR COMENTÁRIOS DE UMA OBRA
 * GET /api/conteudos/{id_conteudo}/comentarios
 * Retorna os comentários ordenados cronologicamente do mais antigo para o mais recente.
 */
export async function listarComentarios(idConteudo: string): Promise<CommentItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conteudos/${encodeURIComponent(idConteudo)}/comentarios`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      await processarErroHttp(res, 'carregar comentários da obra');
    }

    const data: BackendComment[] = await res.json();
    return data.map(normalizarComentarioBackend);
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        'Não foi possível carregar os comentários da obra. Verifique se o servidor backend está ativo.'
      );
    }
    throw err;
  }
}

/**
 * 2. CRIAR COMENTÁRIO
 * POST /api/conteudos/{id_conteudo}/comentarios
 * Cria um novo comentário na obra especificada.
 */
export async function criarComentario(
  idConteudo: string,
  payload: { id_usuario: number; autor_nome: string; texto: string }
): Promise<CommentItem> {
  const textoLimpo = payload.texto.trim();
  if (!textoLimpo) {
    throw new Error('O comentário não pode ser vazio.');
  }
  if (textoLimpo.length > 1000) {
    throw new Error('O comentário excede o limite de 1000 caracteres (restrição VARCHAR2(1000)).');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/conteudos/${encodeURIComponent(idConteudo)}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id_usuario: payload.id_usuario,
        autor_nome: payload.autor_nome,
        texto: textoLimpo,
      }),
    });

    if (!res.ok) {
      await processarErroHttp(res, 'publicar novo comentário');
    }

    const data: BackendComment = await res.json();
    return normalizarComentarioBackend(data);
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        'Falha de rede ao conectar à API de comentários. Verifique se o servidor backend está ativo.'
      );
    }
    throw err;
  }
}

/**
 * 3. EDITAR COMENTÁRIO
 * PUT /api/comentarios/{id_comentario}
 * Atualiza o texto do comentário e marca editado=true.
 */
export async function editarComentario(
  idComentario: number,
  payload: { id_usuario: number; texto: string }
): Promise<CommentItem> {
  const textoLimpo = payload.texto.trim();
  if (!textoLimpo) {
    throw new Error('O texto do comentário não pode ser vazio.');
  }
  if (textoLimpo.length > 1000) {
    throw new Error('O texto excede o limite de 1000 caracteres (VARCHAR2(1000)).');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/comentarios/${idComentario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id_usuario: payload.id_usuario,
        texto: textoLimpo,
      }),
    });

    if (!res.ok) {
      await processarErroHttp(res, 'atualizar comentário');
    }

    const data: BackendComment = await res.json();
    return normalizarComentarioBackend(data);
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Falha de conexão com a API para salvar as alterações do comentário.');
    }
    throw err;
  }
}

/**
 * 4. EXCLUIR COMENTÁRIO
 * DELETE /api/comentarios/{id_comentario}
 * Remove o comentário da base. Requer id_usuario para verificação de autoria no servidor.
 */
export async function excluirComentario(idComentario: number, idUsuario: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/comentarios/${idComentario}?id_usuario=${idUsuario}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_usuario: idUsuario }),
    });

    if (!res.ok) {
      await processarErroHttp(res, 'excluir comentário');
    }
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Falha de conexão com a API para excluir o comentário.');
    }
    throw err;
  }
}

/**
 * 5. ALTERNAR CURTIDA
 * POST /api/comentarios/{id_comentario}/curtida
 * Registra ou desfaz a curtida de um usuário no comentário.
 */
export async function alternarCurtidaComentario(
  idComentario: number,
  idUsuario: number
): Promise<CommentItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/comentarios/${idComentario}/curtida`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ id_usuario: idUsuario }),
    });

    if (!res.ok) {
      await processarErroHttp(res, 'curtir comentário');
    }

    const data: BackendComment = await res.json();
    return normalizarComentarioBackend(data);
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Falha de conexão com a API ao registrar curtida.');
    }
    throw err;
  }
}