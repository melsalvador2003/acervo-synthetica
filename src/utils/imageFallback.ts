/**
 * Utilitário de imagens confiáveis para o acervo Synthetica (1980 até Hoje)
 * Garante que nenhuma obra exiba o ícone de imagem quebrada no navegador ou no mobile.
 */
import React from 'react';

export const RELIABLE_ITEM_COVERS: Record<string, string> = {
  // Cinema
  'syn-cin-01': 'https://upload.wikimedia.org/wikipedia/en/9/9f/Blade_Runner_%281982_poster%29.png', // Blade Runner
  'syn-cin-02': 'https://upload.wikimedia.org/wikipedia/en/5/5d/AKIRA_%281988_poster%29.jpg', // Akira
  'syn-cin-03': 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png', // The Matrix
  'syn-cin-04': 'https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg', // Her

  // Música
  'syn-mus-01': 'https://upload.wikimedia.org/wikipedia/en/a/a6/Kraftwerk_-_Computer_World.png', // Kraftwerk Computer World
  'syn-mus-02': 'https://upload.wikimedia.org/wikipedia/pt/f/fd/Da_lama_ao_caos.jpg', // Chico Science Manguebeat
  'syn-mus-03': 'https://upload.wikimedia.org/wikipedia/en/a/af/Bj%C3%B6rk_-_Homogenic.png', // Björk Homogenic
  'syn-mus-04': 'https://upload.wikimedia.org/wikipedia/en/b/b7/DaftPunkDiscovery.jpg', // Daft Punk Discovery

  // Dança
  'syn-dan-01': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg/960px-Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg', // Moonwalk Michael Jackson
  'syn-dan-02': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Voguing_Masquerade_Ball_%2830471245435%29.jpg/960px-Voguing_Masquerade_Ball_%2830471245435%29.jpg', // Voguing Ballroom
  'syn-dan-03': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80', // Glow / Mortal Engine (mantido)
  'syn-dan-04': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Aespa_Love_Your_W_2025_1.jpg/960px-Aespa_Love_Your_W_2025_1.jpg', // Dança Holográfica Virtual Avatar

  // Artes Plásticas / Visuais
  'syn-art-01': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', // Sexy Robot Sorayama (mantido)
  'syn-art-02': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Electronic_Superhighway_Continental_US_Alaska_Hawaii.mpg/500px--Electronic_Superhighway_Continental_US_Alaska_Hawaii.mpg.jpg', // Electronic Superhighway Nam June Paik
  'syn-art-03': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80', // teamLab Borderless (mantido)
  'syn-art-04': 'https://upload.wikimedia.org/wikipedia/en/d/d4/Everydays%2C_the_First_5000_Days.jpg', // Beeple Everydays

  // Eletrônicos
  'syn-ele-01': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Computer_macintosh_128k%2C_1984_%28all_about_Apple_onlus%29.jpg/960px-Computer_macintosh_128k%2C_1984_%28all_about_Apple_onlus%29.jpg', // Apple Macintosh 128K
  'syn-ele-02': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Game-Boy-FL.png/960px-Game-Boy-FL.png', // Game Boy Original
  'syn-ele-03': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PSX-Console-wController.jpg/960px-PSX-Console-wController.jpg', // Sony PlayStation 1
  'syn-ele-04': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/IPhone_First_Generation.jpg/960px-IPhone_First_Generation.jpg', // Apple iPhone 2G
  'syn-ele-05': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Oculus-Rift-CV1-Headset-Front.jpg/960px-Oculus-Rift-CV1-Headset-Front.jpg', // Oculus Rift VR
};

export const CATEGORY_FALLBACKS: Record<string, string> = {
  cinema: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
  musica: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  danca: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
  'artes-plasticas': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  eletronicos: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
};

export function getSafeCover(itemId: string, category: string, primaryUrl?: string): string {
  if (primaryUrl && primaryUrl.startsWith('http')) {
    return primaryUrl;
  }
  return RELIABLE_ITEM_COVERS[itemId] || CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.eletronicos;
}

export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  itemId: string,
  category: string
) {
  const target = e.currentTarget;
  const reliable = RELIABLE_ITEM_COVERS[itemId];
  const catFallback = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.eletronicos;

  if (reliable && target.src !== reliable) {
    target.src = reliable;
  } else if (target.src !== catFallback) {
    target.src = catFallback;
  }
}
