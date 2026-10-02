import React, { useState } from 'react';
import { X, Plus, Sparkles, Disc, Film, Image as ImageIcon } from 'lucide-react';
import { ArchiveItem, Category } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: Omit<ArchiveItem, 'id' | 'createdAt'>) => void;
}

const PRESET_COVERS = [
  {
    label: 'Disco de Vinil Clássico',
    url: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=800&q=80',
    category: 'musica',
  },
  {
    label: 'Palco & Dança Contemporânea',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    category: 'danca',
  },
  {
    label: 'Cineclube & Projetor de Película',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    category: 'cinema',
  },
  {
    label: 'Estúdio de Gravação Vintage',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    category: 'musica',
  },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [category, setCategory] = useState<Category>('musica');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [role, setRole] = useState('Compositor & Intérprete');
  const [year, setYear] = useState<number>(1975);
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0].url);
  const [mediaFormat, setMediaFormat] = useState("Vinil 12'' 33⅓ RPM");
  const [curatorialNotes, setCuratorialNotes] = useState('');
  const [historyText, setHistoryText] = useState('');
  const [tagsString, setTagsString] = useState('Acervo, Clássico, Memória');
  const [rating, setRating] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creator.trim()) return;

    // Calculate decade
    let decade = '1970s';
    if (year < 1960) decade = '1950s';
    else if (year < 1970) decade = '1960s';
    else if (year < 1980) decade = '1970s';
    else if (year < 1990) decade = '1980s';
    else if (year < 2000) decade = '1990s';
    else decade = '2000s';

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAdd({
      title: title.trim(),
      category,
      creator: creator.trim(),
      role: role.trim() || (category === 'musica' ? 'Músico' : category === 'danca' ? 'Coreógrafo' : 'Diretor'),
      year: Number(year) || 1975,
      decade,
      genre: genre.trim() || (category === 'musica' ? 'MPB' : category === 'danca' ? 'Contemporânea' : 'Drama'),
      country: country.trim() || 'Brasil',
      coverUrl: coverUrl.trim() || PRESET_COVERS[0].url,
      mediaFormat: mediaFormat.trim() || "Vinil 12''",
      curatorialNotes: curatorialNotes.trim() || 'Obra fundamental preservada no acervo pessoal.',
      historyText: historyText.trim() || 'Catalogada para preservação de patrimônio cultural imaterial.',
      tags: tags.length > 0 ? tags : ['Acervo', category],
      rating,
      isFavorite: true,
      audioTrackName: title.trim(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-2xl bg-white dark:bg-[#14211e] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-slate-200 dark:border-white/10 my-0 sm:my-8 text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div
          className="p-6 text-white flex items-center justify-between"
          style={{ backgroundColor: '#153833' }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EFAEC4]" />
            <div>
              <h2
                className="text-lg sm:text-xl font-black uppercase text-[#EFAEC4]"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Cadastrar Obra no Acervo
              </h2>
              <p className="text-xs text-pink-200/90">
                Registre uma nova memória cultural de Música, Dança ou Cinema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Categoria da Obra *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'musica', label: 'Música', icon: <Disc className="w-4 h-4" /> },
                { id: 'danca', label: 'Dança', icon: <span className="w-2.5 h-2.5 rounded-full bg-current" /> },
                { id: 'cinema', label: 'Cinema', icon: <Film className="w-4 h-4" /> },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    const newCat = c.id as Category;
                    setCategory(newCat);
                    if (newCat === 'musica') {
                      setRole('Compositor & Intérprete');
                      setMediaFormat("Vinil 12'' 33⅓ RPM");
                      setCoverUrl(PRESET_COVERS[0].url);
                    } else if (newCat === 'danca') {
                      setRole('Coreógrafa & Bailarina');
                      setMediaFormat('Registro Cênico / Apresentação');
                      setCoverUrl(PRESET_COVERS[1].url);
                    } else {
                      setRole('Diretor de Cinema');
                      setMediaFormat('Película 35mm');
                      setCoverUrl(PRESET_COVERS[2].url);
                    }
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-[#153833] text-white border-[#153833] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Creator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Título da Obra / Álbum / Espetáculo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Chega de Saudade"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Artista / Coreógrafo / Diretor *
              </label>
              <input
                type="text"
                required
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Ex: João Gilberto"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>
          </div>

          {/* Role, Year & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Papel Artístico</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Compositor"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ano de Lançamento</label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">País / Origem</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ex: Brasil"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>
          </div>

          {/* Genre & Media Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gênero / Movimento</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: Bossa Nova, Cinema Novo, Balé Moderno"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Suporte Físico / Formato</label>
              <input
                type="text"
                value={mediaFormat}
                onChange={(e) => setMediaFormat(e.target.value)}
                placeholder="Ex: Vinil 12'', Fita VHS, Película 35mm"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>
          </div>

          {/* Cover URL & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Imagem de Capa (URL)
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833] mb-2"
            />
            {/* Quick preset selector */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium self-center">Presets de capa:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setCoverUrl(preset.url)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#EFAEC4]/40 text-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curatorial Notes & History */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nota Curatorial Pessoal ("Por que esta obra está no seu acervo?")
            </label>
            <textarea
              rows={2}
              value={curatorialNotes}
              onChange={(e) => setCuratorialNotes(e.target.value)}
              placeholder="Descreva o impacto emocional e a relevância artística desta obra na sua história..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contexto Histórico & Técnico
            </label>
            <textarea
              rows={2}
              value={historyText}
              onChange={(e) => setHistoryText(e.target.value)}
              placeholder="Detalhes sobre a gravação, elenco, premiações, direção de fotografia ou bastidores..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
            />
          </div>

          {/* Tags & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Bossa Nova, Vinil, Clássico"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avaliação do Curador (1 a 5 estrelas)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#153833] cursor-pointer"
              >
                <option value={5}>★★★★★ (5 estrelas - Obra-Prima)</option>
                <option value={4}>★★★★☆ (4 estrelas - Excelente)</option>
                <option value={3}>★★★☆☆ (3 estrelas - Relevante)</option>
                <option value={2}>★★☆☆☆ (2 estrelas - Curiosidade)</option>
                <option value={1}>★☆☆☆☆ (1 estrela - Histórico)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-[#153833] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: '#EFAEC4' }}
            >
              <Plus className="w-4 h-4" />
              <span>Salvar no Acervo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
