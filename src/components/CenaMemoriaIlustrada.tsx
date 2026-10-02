import React, { useState } from 'react';
import { Sparkles, Eye, Check, Volume2, Bookmark, Clock, MapPin } from 'lucide-react';
import { FragmentoMemoria80 } from '../data/memoriaAnos80';
import { audioEngine } from '../utils/audioPlayer';

interface CenaMemoriaIlustradaProps {
  memoria: FragmentoMemoria80;
  isColetado: boolean;
  onColetar: (memoria: FragmentoMemoria80) => void;
  onAbrirBau?: () => void;
}

export const CenaMemoriaIlustrada: React.FC<CenaMemoriaIlustradaProps> = ({
  memoria,
  isColetado,
  onColetar,
  onAbrirBau,
}) => {
  const [isHoveringObject, setIsHoveringObject] = useState(false);

  const handleClickObjeto = () => {
    // Toca o efeito sonoro correspondente
    if (memoria.soundEffect === 'arcade') {
      audioEngine.playArcadeCoin();
    } else if (memoria.soundEffect === 'tape') {
      audioEngine.playTapeClick();
    } else if (memoria.soundEffect === 'dream') {
      audioEngine.playDreamAwakening();
    } else {
      audioEngine.playDiscoveryChime();
    }

    onColetar(memoria);
  };

  // Renderiza a arte vetorial analógica customizada para cada cena do dia de Leo
  const renderCenaSvg = () => {
    switch (memoria.id) {
      case 'mem-01-walkman':
        // Quarto de Leo: Rádio-relógio 07:30 e o fone com fita K7
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="pat-stripes-1" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(239, 174, 196, 0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            {/* Parede e piso do quarto */}
            <rect width="400" height="150" fill="#152421" />
            <rect y="150" width="400" height="70" fill="#0d1715" />
            <rect width="400" height="150" fill="url(#pat-stripes-1)" />

            {/* Janela com luz matinal fria */}
            <rect x="30" y="20" width="80" height="100" rx="4" fill="#2d423e" stroke="#46625c" strokeWidth="2" />
            <line x1="70" y1="20" x2="70" y2="120" stroke="#46625c" strokeWidth="2" />
            <line x1="30" y1="70" x2="110" y2="70" stroke="#46625c" strokeWidth="2" />
            <path d="M30 120 L150 220 L80 220 Z" fill="rgba(255,255,255,0.04)" />

            {/* Mesinha de cabeceira */}
            <rect x="230" y="110" width="140" height="90" rx="3" fill="#2a1e16" stroke="#4a3528" strokeWidth="2" />
            <rect x="240" y="145" width="120" height="25" rx="2" fill="#3a2b20" />
            <circle cx="300" cy="157" r="3" fill="#c49a6c" />

            {/* Rádio-relógio LED vermelho com 07:30 */}
            <rect x="245" y="85" width="55" height="25" rx="3" fill="#000000" stroke="#333" strokeWidth="1" />
            <text x="272" y="102" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              07:30
            </text>

            {/* Copo d'água */}
            <path d="M315 90 L320 108 L328 108 L333 90 Z" fill="rgba(147, 197, 253, 0.3)" stroke="#93c5fd" strokeWidth="1" />

            {/* OBJETO ESCONDIDO CLICÁVEL: Fita K7 e Fones de Espuma Laranja */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300 group/obj"
            >
              {/* Brilho de destaque pulsante */}
              <circle
                cx="260"
                cy="125"
                r={isHoveringObject ? '36' : '30'}
                fill="rgba(239, 174, 196, 0.25)"
                className="animate-pulse"
              />

              {/* Fita K7 TDK */}
              <rect x="242" y="116" width="36" height="22" rx="2" fill="#1e1e1e" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="247" y="120" width="26" height="14" rx="1" fill="#f4f4f5" />
              <circle cx="253" cy="127" r="3" fill="#1e1e1e" />
              <circle cx="267" cy="127" r="3" fill="#1e1e1e" />
              <line x1="256" y1="127" x2="264" y2="127" stroke="#e11d48" strokeWidth="1.5" />

              {/* Fones de espuma laranja vintage */}
              <path d="M280 120 C 285 108, 305 108, 310 120" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="280" cy="122" r="6" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
              <circle cx="310" cy="122" r="6" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            </g>
          </svg>
        );

      case 'mem-02-vinil':
        // Loja de discos "Neon Grooves"
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#13181f" />
            {/* Prateleiras com discos na parede */}
            <rect x="20" y="20" width="360" height="7" fill="#334155" />
            <rect x="20" y="70" width="360" height="7" fill="#334155" />

            {/* Capas de discos expostas */}
            <rect x="35" y="27" width="40" height="40" fill="#ec4899" rx="2" />
            <rect x="90" y="27" width="40" height="40" fill="#3b82f6" rx="2" />
            <rect x="145" y="27" width="40" height="40" fill="#eab308" rx="2" />
            <rect x="200" y="27" width="40" height="40" fill="#10b981" rx="2" />
            <rect x="255" y="27" width="40" height="40" fill="#8b5cf6" rx="2" />
            <rect x="310" y="27" width="40" height="40" fill="#f97316" rx="2" />

            {/* Caixotes de vinil no piso */}
            <rect x="30" y="120" width="140" height="75" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <rect x="190" y="120" width="180" height="75" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="30" y1="135" x2="170" y2="135" stroke="#334155" strokeWidth="1" />
            <line x1="190" y1="135" x2="370" y2="135" stroke="#334155" strokeWidth="1" />

            {/* Letreiro neon "NEON GROOVES" */}
            <text x="200" y="18" fill="#f43f5e" fontSize="10" fontFamily="sans-serif" fontWeight="900" letterSpacing="3" textAnchor="middle">
              NEON GROOVES • 1984
            </text>

            {/* Vitrola do balcão */}
            <rect x="210" y="132" width="65" height="45" rx="3" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <circle cx="238" cy="154" r="16" fill="#020617" />
            <circle cx="238" cy="154" r="5" fill="#f43f5e" />
            <line x1="258" y1="138" x2="244" y2="152" stroke="#cbd5e1" strokeWidth="2" />

            {/* OBJETO ESCONDIDO: O Vinil Vermelho de 12'' saindo da capa */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="100" cy="140" r={isHoveringObject ? '34' : '28'} fill="rgba(244, 63, 94, 0.25)" className="animate-pulse" />
              <rect x="75" y="125" width="45" height="45" rx="2" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
              {/* O disco de vinil sobressaindo */}
              <circle cx="110" cy="142" r="18" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              <circle cx="110" cy="142" r="12" fill="none" stroke="#3f3f46" strokeWidth="0.5" />
              <circle cx="110" cy="142" r="6" fill="#fb7185" />
            </g>
          </svg>
        );

      case 'mem-03-cinema':
        // Fachada do Cine Imperial e poças de chuva
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#090d16" />
            {/* Prédio do cinema com marquise */}
            <rect x="40" y="10" width="320" height="150" fill="#111827" stroke="#1f2937" strokeWidth="2" />

            {/* Marquise de neon */}
            <rect x="25" y="60" width="350" height="24" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="200" y="76" fill="#a5b4fc" fontSize="11" fontFamily="sans-serif" fontWeight="900" letterSpacing="4" textAnchor="middle">
              CINE IMPERIAL • SESSÃO 14H
            </text>

            {/* Gotas de chuva diagonais */}
            <g stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1">
              <line x1="20" y1="0" x2="10" y2="40" />
              <line x1="80" y1="10" x2="70" y2="50" />
              <line x1="160" y1="5" x2="150" y2="45" />
              <line x1="260" y1="0" x2="250" y2="40" />
              <line x1="340" y1="10" x2="330" y2="50" />
              <line x1="120" y1="80" x2="110" y2="130" />
              <line x1="220" y1="90" x2="210" y2="140" />
            </g>

            {/* Asfalto molhado com reflexos */}
            <rect y="160" width="400" height="60" fill="#030712" />
            <ellipse cx="200" cy="180" rx="90" ry="12" fill="rgba(129, 140, 248, 0.15)" />
            <ellipse cx="100" cy="195" rx="50" ry="8" fill="rgba(244, 63, 94, 0.12)" />

            {/* Portaria de vidro e bilheteria */}
            <rect x="155" y="90" width="90" height="70" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <circle cx="200" cy="115" r="8" fill="#334155" />

            {/* OBJETO ESCONDIDO: Cartaz de Blade Runner e Canhoto de Ingresso 35mm */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="95" cy="120" r={isHoveringObject ? '34' : '26'} fill="rgba(244, 63, 94, 0.3)" className="animate-pulse" />
              {/* O cartaz vertical iluminado */}
              <rect x="75" y="92" width="38" height="56" rx="2" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <rect x="80" y="96" width="28" height="24" fill="#38bdf8" opacity="0.8" />
              <text x="94" y="132" fill="#fb7185" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                2019
              </text>
              {/* O canhoto amarelo */}
              <rect x="98" y="138" width="16" height="8" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            </g>
          </svg>
        );

      case 'mem-04-arcade':
        // Subsolo do Arcade
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#050508" />
            {/* Linha de gabinetes de fliperama */}
            <path d="M40 50 L85 45 L95 190 L30 190 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" />
            <path d="M120 45 L165 40 L175 190 L110 190 Z" fill="#14532d" stroke="#166534" strokeWidth="1.5" />
            <path d="M280 40 L330 45 L340 190 L270 190 Z" fill="#701a75" stroke="#86198f" strokeWidth="1.5" />

            {/* Telas brilhando */}
            <rect x="48" y="70" width="30" height="30" fill="#0284c7" />
            <rect x="128" y="65" width="30" height="30" fill="#22c55e" />
            <rect x="288" y="65" width="32" height="30" fill="#d946ef" />

            {/* OBJETO ESCONDIDO: Gabinete do meio com Joystick CX40 e Ficha */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="215" cy="115" r={isHoveringObject ? '36' : '30'} fill="rgba(234, 179, 8, 0.25)" className="animate-pulse" />
              {/* Gabinete central de madeira */}
              <path d="M190 35 L245 35 L255 195 L180 195 Z" fill="#451a03" stroke="#92400e" strokeWidth="2" />
              {/* Monitor verde */}
              <rect x="198" y="58" width="40" height="35" rx="3" fill="#052e16" stroke="#22c55e" strokeWidth="1" />
              <text x="218" y="78" fill="#4ade80" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                INSERT
              </text>
              {/* Mesa do controle e Joystick */}
              <polygon points="188,110 248,110 252,135 184,135" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
              {/* Manche e botão vermelho */}
              <rect x="210" y="112" width="5" height="15" fill="#27272a" />
              <circle cx="212" cy="110" r="4" fill="#000000" />
              <circle cx="230" cy="120" r="3.5" fill="#ef4444" />
              {/* Ficha de latão brilhante */}
              <circle cx="202" cy="126" r="5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              <circle cx="202" cy="126" r="1.5" fill="#713f12" />
            </g>
          </svg>
        );

      case 'mem-05-lab':
        // Laboratório Noturno & Terminal Fósforo Verde
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#0b1312" />
            {/* Parede do laboratório e prateleiras técnicas */}
            <rect x="0" y="0" width="400" height="130" fill="#111c19" />
            <rect x="20" y="30" width="360" height="6" fill="#1e2e2a" />
            <rect x="40" y="12" width="50" height="18" fill="#192a26" stroke="#253d37" strokeWidth="1" />
            <text x="65" y="24" fill="#64857c" fontSize="7" fontFamily="monospace" textAnchor="middle">MANUAL C</text>
            <rect x="100" y="10" width="45" height="20" fill="#192a26" stroke="#253d37" strokeWidth="1" />
            <text x="122" y="23" fill="#64857c" fontSize="7" fontFamily="monospace" textAnchor="middle">UNIX 84</text>

            {/* Mesa do laboratório */}
            <rect x="0" y="130" width="400" height="90" fill="#1a2724" stroke="#2b3e39" strokeWidth="1" />

            {/* Terminal CRT grande com tela convexa */}
            <rect x="70" y="45" width="130" height="105" rx="8" fill="#e2d9c8" stroke="#a89f8d" strokeWidth="2" />
            <rect x="80" y="55" width="110" height="78" rx="6" fill="#041209" stroke="#163820" strokeWidth="2" />

            {/* Fósforo verde piscante no tubo CRT */}
            <text x="90" y="75" fill="#22c55e" fontSize="7" fontFamily="monospace" fontWeight="bold">
              LAB 4B • TERMINAL 02
            </text>
            <text x="90" y="90" fill="#4ade80" fontSize="7" fontFamily="monospace">
              {">"} LOAD "DYNA_PARC.BAS"
            </text>
            <text x="90" y="102" fill="#4ade80" fontSize="7" fontFamily="monospace">
              {">"} 64K RAM READY.
            </text>
            <rect x="90" y="110" width="6" height="9" fill="#22c55e" className="animate-pulse" />

            {/* Teclado mecânico bege na mesa */}
            <polygon points="65,160 205,160 215,195 55,195" fill="#d6ccba" stroke="#9e9482" strokeWidth="1.5" />
            <line x1="75" y1="168" x2="195" y2="168" stroke="#8a8070" strokeWidth="1" />
            <line x1="70" y1="176" x2="200" y2="176" stroke="#8a8070" strokeWidth="1" />
            <line x1="68" y1="184" x2="204" y2="184" stroke="#8a8070" strokeWidth="1" />

            {/* OBJETO ESCONDIDO: Disquetes 5.25'' empilhados e caderno com rascunho do Dynabook */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="290" cy="140" r={isHoveringObject ? '42' : '34'} fill="rgba(34, 197, 94, 0.25)" className="animate-pulse" />

              {/* Caderno espiral com esboço de prancheta/Dynabook */}
              <rect x="235" y="115" width="70" height="55" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" transform="rotate(-6 270 142)" />
              {/* Espiral do caderno */}
              <circle cx="236" cy="120" r="2" fill="#475569" />
              <circle cx="238" cy="130" r="2" fill="#475569" />
              <circle cx="240" cy="140" r="2" fill="#475569" />
              <circle cx="242" cy="150" r="2" fill="#475569" />
              <text x="272" y="135" fill="#3b82f6" fontSize="6" fontFamily="sans-serif" fontWeight="bold">DYNABOOK</text>
              <rect x="250" y="140" width="38" height="22" rx="1.5" fill="none" stroke="#2563eb" strokeWidth="0.8" />

              {/* Disquete 5.25 flexível preto */}
              <rect x="270" y="135" width="46" height="46" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" transform="rotate(8 293 158)" />
              <circle cx="293" cy="158" r="9" fill="#09090b" stroke="#71717a" strokeWidth="0.8" />
              <circle cx="293" cy="158" r="4" fill="#18181b" />
              {/* Etiqueta branca do disquete */}
              <rect x="275" y="139" width="36" height="12" rx="1" fill="#f4f4f5" />
              <line x1="278" y1="145" x2="306" y2="145" stroke="#ef4444" strokeWidth="1.2" />
            </g>
          </svg>
        );

      case 'mem-06-rua':
        // Pátio Noturno, Faróis na Neblina & Boombox Prata
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#070b12" />

            {/* Parede industrial escura dos fundos */}
            <rect x="0" y="0" width="400" height="130" fill="#0d1520" />
            <line x1="0" y1="130" x2="400" y2="130" stroke="#1e293b" strokeWidth="2" />

            {/* Faróis do carro da esquerda cruzando feixe luminoso na neblina */}
            <polygon points="10,95 240,30 250,180 10,135" fill="rgba(254, 240, 138, 0.08)" />
            <ellipse cx="10" cy="115" rx="8" ry="14" fill="#fef08a" opacity="0.9" />

            {/* Faróis do carro da direita cruzando em contra-luz */}
            <polygon points="390,95 160,30 150,180 390,135" fill="rgba(191, 219, 254, 0.08)" />
            <ellipse cx="390" cy="115" rx="8" ry="14" fill="#bfdbfe" opacity="0.9" />

            {/* Piso de asfalto com linóleo esticado para o Popping */}
            <rect x="0" y="130" width="400" height="90" fill="#05080f" />
            <polygon points="70,145 330,145 360,210 40,210" fill="#1e293b" stroke="#334155" strokeWidth="1" />

            {/* Silhueta do dançarino ao fundo no centro do palco de linóleo */}
            <ellipse cx="200" cy="100" rx="9" ry="11" fill="#38bdf8" opacity="0.2" />
            <path d="M194,111 L206,111 L209,145 L191,145 Z" fill="#38bdf8" opacity="0.15" />

            {/* Caixote de madeira apoiando o Boombox */}
            <rect x="145" y="142" width="110" height="52" rx="2" fill="#2d1e16" stroke="#4a3525" strokeWidth="1.5" />
            <line x1="145" y1="168" x2="255" y2="168" stroke="#4a3525" strokeWidth="1" />

            {/* OBJETO ESCONDIDO: O Boombox Prata com alça cromada e Óculos Espelhados */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="200" cy="132" r={isHoveringObject ? '42' : '34'} fill="rgba(239, 174, 196, 0.3)" className="animate-pulse" />

              {/* Alça cromada erguida */}
              <path d="M165,116 L165,104 L235,104 L235,116" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />

              {/* Gabinete do Boombox Prateado */}
              <rect x="155" y="112" width="90" height="42" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

              {/* Alto-falantes duplos com grelha preta */}
              <circle cx="174" cy="134" r="13" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <circle cx="174" cy="134" r="5" fill="#334155" />
              <circle cx="226" cy="134" r="13" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <circle cx="226" cy="134" r="5" fill="#334155" />

              {/* Deck central de fita K7 com janelinha */}
              <rect x="193" y="123" width="14" height="18" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="197" cy="132" r="2" fill="#e2e8f0" />
              <circle cx="203" cy="132" r="2" fill="#e2e8f0" />

              {/* Botões de tecla de piano no topo */}
              <rect x="180" y="110" width="40" height="3" fill="#475569" />

              {/* Óculos de sol espelhados tipo aviador anos 80 em cima do caixote */}
              <ellipse cx="194" cy="158" rx="6" ry="4" fill="#38bdf8" stroke="#000" strokeWidth="0.8" />
              <ellipse cx="206" cy="158" rx="6" ry="4" fill="#38bdf8" stroke="#000" strokeWidth="0.8" />
              <line x1="199" y1="157" x2="201" y2="157" stroke="#000" strokeWidth="1" />
            </g>
          </svg>
        );

      case 'mem-07-quarto':
        // Quarto na Madrugada, TV Portátil CRT 5'' e Fotograma 70mm
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#060913" />

            {/* Janela aberta para o céu noturno e cosmos */}
            <rect x="30" y="15" width="130" height="120" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="2" />
            {/* Constelações & Lua Crescente */}
            <circle cx="55" cy="40" r="1.2" fill="#fff" />
            <circle cx="90" cy="30" r="1" fill="#fff" />
            <circle cx="120" cy="55" r="1.5" fill="#fff" />
            <circle cx="75" cy="70" r="1" fill="#fff" />
            <circle cx="110" cy="90" r="1.2" fill="#fff" />
            <path d="M135,28 A 12,12 0 0,0 125,48 A 15,15 0 0,1 135,28" fill="#fef08a" />

            {/* Parapeito da janela com a luneta telescópica */}
            <rect x="20" y="130" width="150" height="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Tripé e tubo da luneta de latão */}
            <line x1="75" y1="130" x2="85" y2="85" stroke="#92400e" strokeWidth="2.5" />
            <line x1="85" y1="85" x2="60" y2="130" stroke="#78350f" strokeWidth="1.5" />
            <line x1="85" y1="85" x2="105" y2="130" stroke="#78350f" strokeWidth="1.5" />
            <polygon points="75,80 120,62 122,69 77,87" fill="#d97706" stroke="#b45309" strokeWidth="1" />

            {/* Mesa de cabeceira com a TV portátil CRT acesa emitindo brilho ciano/azul */}
            <rect x="210" y="90" width="165" height="110" rx="3" fill="#131b26" stroke="#233547" strokeWidth="1.5" />

            {/* Mini TV de tubo CRT de 5 polegadas */}
            <rect x="230" y="65" width="80" height="65" rx="6" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="236" y="72" width="50" height="42" rx="4" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1.5" />
            {/* Brilho da estação espacial de 2001 na telinha */}
            <circle cx="261" cy="93" r="10" fill="none" stroke="#e0f2fe" strokeWidth="1.5" />
            <line x1="251" y1="93" x2="271" y2="93" stroke="#e0f2fe" strokeWidth="1" />
            <circle cx="261" cy="93" r="3" fill="#38bdf8" />
            {/* Botões rotativos analógicos da TV */}
            <circle cx="298" cy="80" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
            <circle cx="298" cy="95" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />

            {/* Cones de luz azul da TV iluminando o quarto */}
            <polygon points="286,93 380,40 380,180 286,130" fill="rgba(56, 189, 248, 0.08)" />

            {/* OBJETO ESCONDIDO: Tira de Película de Filme 70mm e Fotograma Espacial */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="330" cy="140" r={isHoveringObject ? '38' : '30'} fill="rgba(56, 189, 248, 0.25)" className="animate-pulse" />

              {/* Tira vertical de película 70mm com perfurações */}
              <rect x="316" y="105" width="30" height="65" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(-10 331 137)" />
              {/* Perfurações da película dos dois lados */}
              <rect x="318" y="112" width="2" height="4" fill="#e2e8f0" />
              <rect x="318" y="122" width="2" height="4" fill="#e2e8f0" />
              <rect x="318" y="132" width="2" height="4" fill="#e2e8f0" />
              <rect x="318" y="142" width="2" height="4" fill="#e2e8f0" />
              <rect x="342" y="112" width="2" height="4" fill="#e2e8f0" />
              <rect x="342" y="122" width="2" height="4" fill="#e2e8f0" />
              <rect x="342" y="132" width="2" height="4" fill="#e2e8f0" />
              <rect x="342" y="142" width="2" height="4" fill="#e2e8f0" />
              {/* Fotograma central colorido com o Olho Vermelho de HAL */}
              <rect x="323" y="120" width="16" height="24" fill="#1e1b4b" />
              <circle cx="331" cy="132" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.8" />
              <circle cx="331" cy="132" r="2" fill="#fef08a" />
            </g>
          </svg>
        );

      case 'mem-08-sonho':
        // Prancha de Desenho, Luminária Articulada & Futurgrafia de Syd Mead
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#0e131d" />

            {/* Parede do ateliê com esboços e prateleira */}
            <rect x="0" y="0" width="400" height="120" fill="#151b27" />
            <rect x="30" y="25" width="40" height="50" rx="1" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
            <rect x="80" y="20" width="55" height="40" rx="1" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />

            {/* Prancha de desenho grande de madeira com ângulo inclinado */}
            <polygon points="40,90 350,75 365,205 30,215" fill="#3e2a1d" stroke="#5c402d" strokeWidth="2" />

            {/* Folha de papel vegetal fixada com fita adesiva nos cantos */}
            <polygon points="65,98 325,86 335,190 55,200" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

            {/* Régua T transversal de madeira e acrílico */}
            <rect x="25" y="140" width="340" height="10" fill="#d97706" opacity="0.85" stroke="#78350f" strokeWidth="0.8" transform="rotate(-2 195 145)" />

            {/* Esboço conceitual no papel: Carro futurista com asas (Spinner de Syd Mead) */}
            <path d="M120,135 Q170,110 240,125 Q270,135 250,150 Q180,155 120,135 Z" fill="none" stroke="#2563eb" strokeWidth="1.2" />
            <ellipse cx="150" cy="142" rx="12" ry="6" fill="none" stroke="#e11d48" strokeWidth="1" />
            <ellipse cx="230" cy="138" rx="12" ry="6" fill="none" stroke="#e11d48" strokeWidth="1" />

            {/* Luminária articulada de arquiteto projetando cone de luz quente */}
            <path d="M370,15 L320,45 L270,35" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
            <polygon points="270,35 250,30 258,55" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            {/* Feixe de luz amarelo suave caindo na prancha */}
            <polygon points="254,42 100,195 320,185 258,55" fill="rgba(254, 240, 138, 0.15)" />

            {/* OBJETO ESCONDIDO: Caneta técnica de nanquim e pote de gouache metálico */}
            <g
              onClick={handleClickObjeto}
              onMouseEnter={() => setIsHoveringObject(true)}
              onMouseLeave={() => setIsHoveringObject(false)}
              className="cursor-pointer transition-all duration-300"
            >
              <circle cx="270" cy="155" r={isHoveringObject ? '38' : '30'} fill="rgba(245, 158, 11, 0.3)" className="animate-pulse" />

              {/* Pote de tinta nanquim com vidro octogonal */}
              <polygon points="275,145 292,145 297,162 270,162" fill="#09090b" stroke="#71717a" strokeWidth="1" />
              <rect x="279" y="140" width="9" height="5" fill="#e2e8f0" />

              {/* Caneta técnica Nanquim com bico fino metálico */}
              <line x1="235" y1="172" x2="278" y2="148" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              <line x1="230" y1="175" x2="235" y2="172" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Frasco de gouache violeta metálico */}
              <circle cx="295" cy="168" r="8" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1" />
              <circle cx="295" cy="168" r="4" fill="#a78bfa" />
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 400 220" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <rect width="400" height="220" fill="#0f172a" />
            <circle cx="200" cy="110" r="40" fill="rgba(239, 174, 196, 0.2)" className="animate-pulse" />
            <circle cx="200" cy="110" r="15" fill="#E07A9A" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative my-8 overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
        isColetado
          ? 'bg-emerald-950/20 border-emerald-500/40 dark:border-emerald-500/30'
          : 'bg-[#153833]/90 border-[#EFAEC4]/50 hover:border-[#EFAEC4] shadow-xl'
      }`}
    >
      {/* Cabeçalho da Cena: Diário de 1984 */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-full bg-[#E07A9A] text-slate-950 font-bold text-[10px]">
            {memoria.timeOfDay}
          </span>
          <span className="text-[#EFAEC4] font-bold tracking-wider uppercase text-[11px]">
            Fragmento #{memoria.order}: {memoria.sceneTitle}
          </span>
        </div>

        {isColetado ? (
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Coletado no seu Baú</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[#EFAEC4] text-[11px] font-mono animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Há um objeto camuflado aqui...</span>
          </span>
        )}
      </div>

      {/* Grid Principal: Ilustração e Relato do Diário */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Lado Esquerdo: Janela da Cena Ilustrada */}
        <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-950 border-b md:border-b-0 md:border-r border-white/10">
          {renderCenaSvg()}

          {/* Dica flutuante sobre a ilustração */}
          {!isColetado && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="truncate">Local: {memoria.sceneLocation}</span>
              <span className="text-[#EFAEC4] font-bold shrink-0 ml-2">Toque no objeto</span>
            </div>
          )}
        </div>

        {/* Lado Direito: Texto do Diário em Primeira Pessoa */}
        <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between text-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E07A9A]">
              <Clock className="w-3 h-3" />
              <span>Diário Pessoal de Leo • Outono de 1984</span>
            </div>

            <blockquote className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-serif border-l-2 border-[#EFAEC4] pl-3 py-0.5">
              "{memoria.storyExcerpt}"
            </blockquote>

            <div className="pt-2 text-[11px] text-slate-300 space-y-1">
              <p>
                <strong className="text-white">Objeto Camuflado:</strong> {memoria.hiddenObjectName}
              </p>
              <p className="text-slate-400 text-[10px]">
                <strong className="text-slate-300">Pista:</strong> {memoria.hiddenObjectHint}
              </p>
            </div>
          </div>

          {/* Barra de Ação Inferior */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            {!isColetado ? (
              <button
                type="button"
                onClick={handleClickObjeto}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E07A9A] text-slate-950 hover:bg-[#efaec4] active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Despertar Objeto &amp; Guardar</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-emerald-300 font-mono font-bold flex items-center gap-1.5">
                  ✓ {memoria.collectibleBadge} guardado
                </span>

                {onAbrirBau && (
                  <button
                    type="button"
                    onClick={onAbrirBau}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ver no Baú de Memórias</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
