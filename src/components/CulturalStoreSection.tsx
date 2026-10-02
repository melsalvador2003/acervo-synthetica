import React, { useState } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { CulturalStoreProduct, Category } from '../types';
import { CULTURAL_STORE_PRODUCTS } from '../data/monetizationData';

interface CulturalStoreSectionProps {
  onShowToast: (msg: string) => void;
}

export const CulturalStoreSection: React.FC<CulturalStoreSectionProps> = ({
  onShowToast,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [activeProduct, setActiveProduct] = useState<CulturalStoreProduct | null>(
    null
  );

  const filteredProducts = CULTURAL_STORE_PRODUCTS.filter((prod) => {
    if (selectedFilter === 'todos') return true;
    return prod.category === selectedFilter;
  });

  const handleBuyClick = (product: CulturalStoreProduct) => {
    onShowToast(
      `🛍️ Redirecionando para a loja parceira (${product.partnerName}). ${product.commissionValue}.`
    );
  };

  return (
    <section
      id="secao-loja-cultural"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0d1514] border-t border-slate-200 dark:border-[#223632] transition-colors"
      aria-label="Loja Cultural do Acervo e Parcerias de E-commerce"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#273a36]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A9A]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#E07A9A] dark:text-[#EFAEC4] uppercase">
                Parceria com E-commerce Cultural
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Boutique de Artefatos &amp; Loja do Acervo
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Curadoria de produtos físicos vinculados aos movimentos e suportes históricos catalogados: prensagens originais em vinil, câmeras analógicas restauradas, livros de arte e fones audiófilos. Cada aquisição repassa uma comissão direta para a manutenção pública do acervo.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#14211e] rounded-2xl border border-slate-200 dark:border-[#273a36] self-start md:self-auto">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'musica', label: 'Vinis' },
              { id: 'cinema', label: 'Fotografia' },
              { id: 'danca', label: 'Livros' },
              { id: 'eletronicos', label: 'Hi-Fi' },
              { id: 'artes-plasticas', label: 'Gravuras' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-[#153833] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl bg-slate-50/70 dark:bg-[#101b18] border border-slate-200 dark:border-[#223632] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md text-white border border-white/20">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Commission Pill on image corner */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EFAEC4] text-[#153833] shadow-md">
                    {product.commissionRate} comissão p/ acervo
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                    <span>{product.partnerName}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {product.stockCount} disponíveis
                    </span>
                  </div>

                  <h3
                    className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug group-hover:text-[#E07A9A] dark:group-hover:text-[#EFAEC4] transition-colors"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Specs list */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-[#182724] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#273a36]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 border-t border-slate-200 dark:border-[#273a36] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-mono text-slate-400 line-through ml-2">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#E07A9A] dark:text-[#EFAEC4]">
                      {product.commissionValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#182724] border border-slate-300 dark:border-[#273a36] text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                    >
                      Ver Detalhes
                    </button>
                    <a
                      href={product.partnerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleBuyClick(product)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Comprar</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {activeProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveProduct(null);
            }}
          >
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#14211e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#273a36] overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col focus-visible:outline-none">
              <div className="relative aspect-16/9 bg-slate-950">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white backdrop-blur-md hover:bg-slate-900 transition-colors cursor-pointer"
                  aria-label="Fechar detalhes"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Parceiro Oficial: {activeProduct.partnerName}</span>
                  <span className="text-[#E07A9A] font-bold">
                    {activeProduct.commissionValue}
                  </span>
                </div>

                <h3
                  id="product-detail-title"
                  className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  {activeProduct.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeProduct.description}
                </p>

                <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200 dark:border-[#E07A9A]/30 text-xs text-slate-700 dark:text-slate-300 italic">
                  <strong>Nota do Curador:</strong> "{activeProduct.curatorNote}"
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#273a36]">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      R$ {activeProduct.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-mono text-slate-400 block">
                      Frete e entrega gerenciados pela loja parceira
                    </span>
                  </div>

                  <a
                    href={activeProduct.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      handleBuyClick(activeProduct);
                      setActiveProduct(null);
                    }}
                    className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ir para Loja Parceira</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
