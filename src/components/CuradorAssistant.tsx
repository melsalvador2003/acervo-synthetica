import React, { useState } from 'react';
import { Sparkles, Send, X, Compass, BookOpen, MessageSquare, ArrowUpRight, Loader2 } from 'lucide-react';
import { ArchiveItem } from '../types';
import { consultarCurador, gerarRoteiroCuratorial, CuradorRoteiroResponse } from '../utils/curadorApi';

interface CuradorAssistantProps {
  items: ArchiveItem[];
  onOpenArticle: (item: ArchiveItem) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialTab?: 'consultar' | 'roteiro';
}

interface Message {
  sender: 'user' | 'curador';
  text: string;
  obrasSugeridas?: ArchiveItem[];
}

export const CuradorAssistant: React.FC<CuradorAssistantProps> = ({
  items,
  onOpenArticle,
  isOpen: externalIsOpen,
  onOpenChange,
  initialTab = 'consultar',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const [activeTab, setActiveTab] = useState<'consultar' | 'roteiro'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'curador',
      text: 'Olá! Sou o Curador do Synthetica. Como posso orientar sua visita pelo acervo de Dança, Música, Cinema, Artes e Eletrônicos hoje?',
    },
  ]);

  // Roteiro state
  const [roteiroTema, setRoteiroTema] = useState('');
  const [roteiroResultado, setRoteiroResultado] = useState<CuradorRoteiroResponse | null>(null);
  const [isGeneratingRoteiro, setIsGeneratingRoteiro] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const input = (textToSend || query).trim();
    if (!input || isLoading) return;

    const userMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await consultarCurador(input, items);
      const suggestedItems = (res.obrasSugeridas || [])
        .map((id) => items.find((it) => it.id === id))
        .filter((it): it is ArchiveItem => Boolean(it));

      const curadorMsg: Message = {
        sender: 'curador',
        text: res.resposta,
        obrasSugeridas: suggestedItems.length > 0 ? suggestedItems : undefined,
      };
      setMessages((prev) => [...prev, curadorMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'curador',
          text: 'O acervo abriga registros memoráveis do século XX e XXI. Experimente navegar pelas seções de Música e Cinema para descobrir novas pontes históricas.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGerarRoteiro = async (temaPredefinido?: string) => {
    const tema = temaPredefinido || roteiroTema || 'Conexões entre música analógica e cultura jovem';
    setIsGeneratingRoteiro(true);

    try {
      const res = await gerarRoteiroCuratorial(tema, items);
      setRoteiroResultado(res);
    } catch {
      // fallback
    } finally {
      setIsGeneratingRoteiro(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill on bottom-right of viewport */}
      <button
        id="btn-trigger-curador-ia"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#153833] text-white shadow-2xl hover:shadow-[#153833]/40 border border-[#EFAEC4]/50 flex items-center gap-2 sm:gap-2.5 group hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Consultar o Curador do Acervo"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#EFAEC4] animate-pulse" />
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
          Curador Synthetica
        </span>
        <Sparkles className="w-4 h-4 text-[#EFAEC4] group-hover:rotate-12 transition-transform" />
      </button>

      {/* Slide-over Drawer / Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div
            id="panel-curador-synthetica"
            className="w-full sm:max-w-md md:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[85vh] sm:h-[680px] overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#153833] text-white flex items-center justify-between border-b border-[#153833]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EFAEC4] text-[#153833] flex items-center justify-center font-black text-xs">
                  CS
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wide uppercase font-mono text-[#EFAEC4]">
                    Curador Synthetica
                  </h4>
                  <p className="text-[11px] text-[#EFAEC4] font-mono">
                    Guia Cultural Permanente
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-mono font-bold">
              <button
                onClick={() => setActiveTab('consultar')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'consultar'
                    ? 'border-[#153833] text-[#153833] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#E07A9A]" />
                <span>Consultar Acervo</span>
              </button>
              <button
                onClick={() => setActiveTab('roteiro')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'roteiro'
                    ? 'border-[#153833] text-[#153833] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#E07A9A]" />
                <span>Gerar Percurso</span>
              </button>
            </div>

            {/* Content Area */}
            {activeTab === 'consultar' ? (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#153833] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Suggested works if any */}
                      {msg.obrasSugeridas && msg.obrasSugeridas.length > 0 && (
                        <div className="mt-2 space-y-1.5 w-full max-w-[85%]">
                          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                            Obras citadas no acervo:
                          </p>
                          {msg.obrasSugeridas.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setIsOpen(false);
                                onOpenArticle(item);
                              }}
                              className="w-full text-left p-2 rounded-xl bg-white hover:bg-pink-50 border border-slate-200 text-xs font-bold text-[#153833] flex items-center justify-between transition-colors group cursor-pointer shadow-2xs"
                            >
                              <div className="truncate">
                                <span className="text-[10px] font-mono text-slate-400 mr-1.5 uppercase">
                                  [{item.category}]
                                </span>
                                <span>{item.title}</span>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[#E07A9A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic p-2 bg-white rounded-xl border border-slate-200 w-fit">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E07A9A]" />
                      <span>O Curador está analisando o acervo...</span>
                    </div>
                  )}
                </div>

                {/* Suggested prompt chips */}
                <div className="p-2.5 bg-white border-t border-slate-150 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    'O que conecta o Walkman ao Hip Hop?',
                    'Quem revolucionou a dança nos anos 70?',
                    'Me recomende um álbum essencial',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pergunte sobre qualquer obra, década ou artista..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#153833] text-slate-800"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!query.trim() || isLoading}
                    className="w-9 h-9 rounded-full bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Tab: Gerar Roteiro */
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                <div className="space-y-1.5">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                    Percurso Curatorial Personalizado
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Escolha um tema ou curiosidade cultural e o Curador montará uma trilha de 3 obras conectadas no acervo.
                  </p>
                </div>

                {/* Preset Themes */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Revolução dos Anos 70',
                    'A quebra do balé clássico',
                    'Do vinil ao som de bolso',
                    'Vanguardas visuais e cinema',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setRoteiroTema(preset);
                        handleGerarRoteiro(preset);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-pink-50 border border-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roteiroTema}
                    onChange={(e) => setRoteiroTema(e.target.value)}
                    placeholder="Ou digite seu tema de interesse..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#153833]"
                  />
                  <button
                    onClick={() => handleGerarRoteiro()}
                    disabled={isGeneratingRoteiro}
                    className="px-4 py-2.5 rounded-xl bg-[#153833] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#1e4e47] disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    {isGeneratingRoteiro ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EFAEC4]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#EFAEC4]" />
                    )}
                    <span>Montar</span>
                  </button>
                </div>

                {/* Roteiro Result Display */}
                {roteiroResultado && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5 animate-in fade-in duration-200">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-mono text-[#E07A9A] font-bold uppercase">
                        Trilha Gerada pelo Curador
                      </span>
                      <h6 className="text-sm font-black text-slate-900 leading-snug">
                        {roteiroResultado.tituloRoteiro}
                      </h6>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {roteiroResultado.introducao}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {roteiroResultado.etapas.map((etapa, idx) => {
                        const targetItem = items.find((i) => i.id === etapa.obraId);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (targetItem) {
                                setIsOpen(false);
                                onOpenArticle(targetItem);
                              }
                            }}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-pink-50/70 border border-slate-200 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                              <span className="font-bold text-[#153833]">
                                ETAPA {idx + 1} • {etapa.categoria.toUpperCase()}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E07A9A] group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#153833]">
                              {etapa.titulo}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {etapa.conexaoCuratorial}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
