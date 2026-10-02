import React from 'react';
import {
  ExternalLink,
  Sparkles,
  Disc3,
  Film,
  Radio,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import { ArchiveItem, StreamAffiliateLink } from '../types';
import { DEFAULT_STREAM_AFFILIATES } from '../data/monetizationData';

interface AffiliateStreamWidgetProps {
  item: ArchiveItem;
  onOpenStreamLink?: (link: StreamAffiliateLink) => void;
  onShowToast: (msg: string) => void;
}

export const AffiliateStreamWidget: React.FC<AffiliateStreamWidgetProps> = ({
  item,
  onOpenStreamLink,
  onShowToast,
}) => {
  const isCinema = item.category === 'cinema';
  const isMusic = item.category === 'musica';

  // Retrieve matching streaming partners
  const defaultLinks = isCinema
    ? DEFAULT_STREAM_AFFILIATES.cinema
    : DEFAULT_STREAM_AFFILIATES.musica;

  const links = item.streamLinks || defaultLinks;

  const handleClickLink = (link: StreamAffiliateLink, e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenStreamLink) {
      onOpenStreamLink(link);
    }
    onShowToast(
      `🎧 Redirecionando para ${link.providerName} via parceria de afiliado. ${link.estimatedCommission}.`
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-pink-50/40 dark:from-[#14211e] dark:via-[#101b18] dark:to-[#182724] border border-slate-200 dark:border-[#273a36] shadow-sm space-y-4">
      {/* Widget Header with Commission Transparency Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#273a36]">
        <div className="flex items-center gap-2">
          {isCinema ? (
            <Film className="w-4 h-4 text-[#E07A9A]" />
          ) : (
            <Disc3 className="w-4 h-4 text-[#E07A9A]" />
          )}
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Onde Assistir ou Ouvir na Íntegra (Streaming Parceiro)
          </h4>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-900 dark:text-[#EFAEC4] border border-pink-200 dark:border-[#E07A9A]/30 self-start sm:self-auto">
          Comissão por Redirecionamento
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Acesse a obra completa através dos serviços parceiros de streaming. Cada assinatura ou reprodução iniciada gera uma taxa direta para custear a manutenção e digitalização pública deste acervo.
      </p>

      {/* Stream Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClickLink(link, e)}
            className="group p-3.5 rounded-xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36] hover:border-[#E07A9A] dark:hover:border-[#EFAEC4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white group-hover:text-[#E07A9A] dark:group-hover:text-[#EFAEC4] transition-colors flex items-center gap-1.5">
                  <span>{link.providerName}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </span>

                {link.highlightOffer && (
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {link.highlightOffer}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                {link.actionText}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>{link.estimatedCommission}</span>
              <span className="text-[#E07A9A] font-bold group-hover:translate-x-0.5 transition-transform">
                Acessar &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
