/**
 * src/components/ListaComentarios.tsx
 * Componente modular reutilizável para exibição e gestão interativa (CRUD) de comentários.
 *
 * =====================================================================================
 * DECISÕES TÉCNICAS E ARQUITETURAIS:
 * =====================================================================================
 * 1. Componentização Reutilizável (Boas Práticas React):
 *    - Isolado de ArchiveItemModal para manter responsabilidade única (Single Responsibility Principle).
 *    - Recebe todos os dados e callbacks via props puras, facilitando testes e manutenção.
 *
 * 2. Edição "In-Place" (Inline):
 *    - O próprio parágrafo do comentário se transforma em um <textarea> dinâmico, preservando
 *      o contexto de leitura do usuário sem interromper sua experiência com modais sobrepostos.
 *
 * 3. Confirmação Segura de Exclusão:
 *    - Exclusões de registros no banco de dados não possuem 'desfazer' automático (DELETE definitivo).
 *      Por isso, a interface apresenta uma confirmação explícita antes de disparar o comando para a API.
 *
 * 4. Verificação de Autoria em Duas Camadas:
 *    - Camada 1 (Frontend): Os botões [Editar] e [Excluir] só aparecem para o autor (id_usuario === currentUserId).
 *      Isso melhora a ergonomia e evita frustração visual.
 *    - Camada 2 (Backend): O servidor FastAPI valida obrigatoriamente id_usuario contra a tupla armazenada,
 *      rejeitando com HTTP 403 qualquer requisição não autorizada, garantindo segurança real.
 *
 * 5. Limite de 1000 Caracteres com Contador Visual:
 *    - Restrição de integridade do banco (VARCHAR2(1000)). Um contador dinâmico informa
 *      o usuário em tempo real antes do envio.
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  Check,
  X,
  AlertCircle,
  ThumbsUp,
  Loader2,
  CornerDownRight,
} from 'lucide-react';
import { CommentItem } from '../types';

interface ListaComentariosProps {
  itemId: string;
  comments: CommentItem[];
  currentUserId: number;
  currentUserName: string;
  currentUserAvatar?: string;
  isLoading: boolean;
  error: string | null;
  onAddComment: (texto: string) => Promise<void>;
  onEditComment: (idComentario: number, novoTexto: string) => Promise<void>;
  onDeleteComment: (idComentario: number) => Promise<void>;
  onLikeComment: (idComentario: number) => Promise<void>;
  onClearError?: () => void;
}

export const ListaComentarios: React.FC<ListaComentariosProps> = ({
  itemId: _itemId,
  comments,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  isLoading,
  error,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onClearError,
}) => {
  // Estado local para criação de novo comentário
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado local para edição em linha (in-place)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Estado local para confirmação de exclusão
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Submissão do novo comentário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textoLimpo = newCommentText.trim();
    if (!textoLimpo || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(textoLimpo);
      setNewCommentText('');
    } catch {
      // Erro repassado via prop 'error'
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iniciar edição in-place
  const handleStartEdit = (comment: CommentItem) => {
    const numId = comment.id_comentario ?? Number(comment.id);
    setEditingId(numId);
    setEditingText(comment.content || comment.texto || '');
    setConfirmDeleteId(null);
  };

  // Cancelar edição in-place
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Salvar edição in-place
  const handleSaveEdit = async (idComentario: number) => {
    const textoLimpo = editingText.trim();
    if (!textoLimpo || isSavingEdit) return;

    setIsSavingEdit(true);
    try {
      await onEditComment(idComentario, textoLimpo);
      setEditingId(null);
      setEditingText('');
    } catch {
      // Erro gerenciado via prop
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Disparar confirmação de exclusão
  const handleConfirmDelete = async (idComentario: number) => {
    setIsDeleting(true);
    try {
      await onDeleteComment(idComentario);
      setConfirmDeleteId(null);
    } catch {
      // Erro gerenciado via prop
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="pt-6 border-t border-slate-200 dark:border-white/10" aria-label="Seção de Comentários da Comunidade">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#E07A9A] dark:text-[#EFAEC4]" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Comentários da Comunidade ({comments.length})
          </h4>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
          FastAPI Backend • Tabela COMENTARIO
        </span>
      </div>

      {/* Alerta de Erro Visual (Tratamento de falhas de rede/validação) */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-semibold block">Atenção na operação:</strong>
              <span>{error}</span>
            </div>
          </div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              aria-label="Fechar mensagem de erro"
              className="text-rose-500 dark:text-rose-300 hover:text-rose-800 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Formulário de Envio de Novo Comentário */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              maxLength={1000}
              placeholder={`Comente como ${currentUserName} (máx. 1000 caracteres)...`}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2FD19E] transition-colors shadow-2xs disabled:bg-slate-100 dark:disabled:bg-white/5"
            />
            {newCommentText.length > 800 && (
              <span
                className={`absolute right-3 top-2.5 text-[10px] font-mono ${
                  newCommentText.length >= 980 ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}
              >
                {1000 - newCommentText.length}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-[#EFAEC4] hover:bg-[#e89bb4] disabled:opacity-50 text-[#153833] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:cursor-not-allowed flex-shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-[11px] text-slate-400">
            Identidade ativa: <strong className="text-slate-600 dark:text-slate-300">{currentUserName}</strong> (ID #{currentUserId})
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {newCommentText.length}/1000 chars
          </span>
        </div>
      </form>

      {/* Lista de Comentários com Estados de Carregamento e Vazio */}
      <div className="space-y-3" aria-live="polite">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#E07A9A] dark:text-[#EFAEC4]" />
            <span>Sincronizando comentários com a API FastAPI...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/20 border border-dashed border-slate-300 dark:border-white/10 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Nenhum comentário registrado ainda nesta obra. Seja o primeiro a contribuir com suas impressões e memórias!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const commentNumericId = comment.id_comentario ?? Number(comment.id);
            const isAuthor = comment.id_usuario === currentUserId;
            const isBeingEdited = editingId === commentNumericId;
            const isAwaitingDelete = confirmDeleteId === commentNumericId;

            return (
              <article
                key={comment.id || commentNumericId}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isAuthor
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-700/40 shadow-2xs'
                    : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar do Autor */}
                  <img
                    src={
                      comment.authorAvatar ||
                      (isAuthor && currentUserAvatar) ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={comment.authorName || comment.autor_nome || 'Autor'}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-white/20 mt-0.5 flex-shrink-0"
                  />

                  {/* Conteúdo Principal do Comentário */}
                  <div className="flex-1 min-w-0">
                    {/* Linha Superior: Nome, Cargo, Data e Flag 'Editado' */}
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {comment.authorName || comment.autor_nome || 'Visitante do Acervo'}
                        </span>

                        {isAuthor && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#153833] text-white">
                            Você
                          </span>
                        )}

                        {(comment.authorRole || isAuthor) && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                            {comment.authorRole || 'Curador do Acervo'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span>{comment.timestamp}</span>
                        {/* Marca de Comentário Editado (Requisito Explícito) */}
                        {comment.editado && (
                          <span
                            className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-200 dark:bg-white/15 text-slate-600 dark:text-slate-300 text-[9px] font-sans font-medium"
                            title="Este comentário foi revisado pelo autor após a publicação original."
                          >
                            editado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Corpo do Comentário: Modo Visualização ou Modo Edição In-Place */}
                    {isBeingEdited ? (
                      <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-black/40 border border-amber-300 dark:border-amber-500/40 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300 mb-1.5">
                          <Edit3 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Editando comentário (salvo no backend):</span>
                        </div>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          maxLength={1000}
                          rows={3}
                          disabled={isSavingEdit}
                          className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-black/30 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2FD19E] resize-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {editingText.length}/1000 caracteres
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={isSavingEdit}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Cancelar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(commentNumericId)}
                              disabled={!editingText.trim() || isSavingEdit}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-[#153833] hover:bg-[#1a453f] text-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-50"
                            >
                              {isSavingEdit ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>{isSavingEdit ? 'Salvando...' : 'Salvar Alteração'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed break-words whitespace-pre-line">
                        {comment.content || comment.texto}
                      </p>
                    )}

                    {/* Banner de Confirmação de Exclusão (Requisito Explícito) */}
                    {isAwaitingDelete && (
                      <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-in fade-in">
                        <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          <span>Deseja realmente excluir este comentário permanentemente?</span>
                        </div>
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(commentNumericId)}
                            disabled={isDeleting}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            <span>{isDeleting ? 'Excluindo...' : 'Sim, Excluir'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Barra de Ações: Curtir + (Editar / Excluir se for autor) */}
                    {!isBeingEdited && !isAwaitingDelete && (
                      <div className="mt-2.5 flex items-center justify-between pt-1">
                        {/* Botão de Curtir / Alternar Reação */}
                        <button
                          type="button"
                          onClick={() => onLikeComment(commentNumericId)}
                          className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group"
                          title="Alternar curtida neste comentário"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{comment.likes ?? comment.curtidas ?? 0}</span>
                        </button>

                        {/* Botões de Gestão (EXCLUSIVOS para o Autor Logado - Requisito Explícito) */}
                        {isAuthor && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(comment)}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                              title="Editar o texto deste comentário"
                            >
                              <Edit3 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                              <span>Editar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(commentNumericId)}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                              title="Excluir este comentário do acervo"
                            >
                              <Trash2 className="w-3 h-3 text-rose-500" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
