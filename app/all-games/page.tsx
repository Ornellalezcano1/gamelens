'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { VerticalMenu } from '@/components/VerticalMenu'; 
import { Heart, Filter, Star, SortAsc, ArrowDown, Gamepad2 } from 'lucide-react';

// Forzamos a Next.js a tratar la página como dinámica
export const dynamic = 'force-dynamic';

// --- TIPOS LOCALES ---
interface UserData {
  id?: number;
  name: string;
  avatarUrl: string;
  favoritePlatform: string;
}

// --- HELPER: Formatear números ---
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
  return num.toString();
};

// --- PALETA GAMELENS ---
const PALETTE = {
  CEL_AZUL: '#50a2ff',
  VERDE: '#00FF62',
  AMARILLO: '#efb537',
  LILA: '#b340bf',
  VIOLETA: '#a855f7',
  CYAN: '#2DD4E0',
  ROSA: '#f6339a',
  MORADO: '#bd6ce9',
  ROJO: '#FF4444',
  BLANCO: '#FFFFFF',
  GRIS: '#9CA3AF'
};

// --- DATOS MOCK ---
const allGames = [
  {
    id: 1,
    slug: "elden-ring",
    name: "Elden Ring",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg" },
    meta: { genres: ["RPG", "Acción", "Mundo Abierto"] },
    kpiSeries: { score: 96, currentPlayers: 240000 }
  },
  {
    id: 2,
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg" },
    meta: { genres: ["RPG", "FPS", "Mundo Abierto"] },
    kpiSeries: { score: 86, currentPlayers: 60000 }
  },
  {
    id: 3,
    slug: "destiny-2",
    name: "Destiny 2",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg" },
    meta: { genres: ["FPS", "Shooter", "Acción"] },
    kpiSeries: { score: 83, currentPlayers: 120000 }
  },
  {
    id: 4,
    slug: "fortnite",
    name: "Fortnite",
    images: { cover: "https://static-cdn.jtvnw.net/ttv-boxart/33214-600x900.jpg" },
    meta: { genres: ["Shooter", "Acción", "Mundo Abierto"] },
    kpiSeries: { score: 81, currentPlayers: 2100000 }
  },
  {
    id: 5,
    slug: "league-of-legends",
    name: "League of Legends",
    images: { cover: "https://static-cdn.jtvnw.net/ttv-boxart/21779-600x900.jpg" },
    meta: { genres: ["Estrategia", "Acción"] },
    kpiSeries: { score: 89, currentPlayers: 1500000 }
  },
  {
    id: 6,
    slug: "hades-ii",
    name: "Hades II",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900.jpg" },
    meta: { genres: ["Indie", "Acción", "RPG"] },
    kpiSeries: { score: 94, currentPlayers: 45000 }
  },
  {
    id: 7,
    slug: "stardew-valley",
    name: "Stardew Valley",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg" },
    meta: { genres: ["Indie", "Estrategia", "RPG"] },
    kpiSeries: { score: 97, currentPlayers: 80000 }
  },
  {
    id: 8,
    slug: "valorant",
    name: "Valorant",
    images: { cover: "https://static-cdn.jtvnw.net/ttv-boxart/516575-600x900.jpg" },
    meta: { genres: ["FPS", "Shooter", "Estrategia"] },
    kpiSeries: { score: 85, currentPlayers: 850000 }
  },
  {
    id: 9,
    slug: "baldurs-gate-3",
    name: "Baldur's Gate 3",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg" },
    meta: { genres: ["RPG", "Estrategia", "Mundo Abierto"] },
    kpiSeries: { score: 98, currentPlayers: 180000 }
  },
  {
    id: 10,
    slug: "hollow-knight",
    name: "Hollow Knight",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg" },
    meta: { genres: ["Indie", "Acción"] },
    kpiSeries: { score: 95, currentPlayers: 20000 }
  },
  {
    id: 11,
    slug: "civilization-vi",
    name: "Civilization VI",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/289070/library_600x900.jpg" },
    meta: { genres: ["Estrategia"] },
    kpiSeries: { score: 88, currentPlayers: 50000 }
  },
  {
    id: 12,
    slug: "apex-legends",
    name: "Apex Legends",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg" },
    meta: { genres: ["Shooter", "FPS", "Acción"] },
    kpiSeries: { score: 84, currentPlayers: 300000 }
  },
  {
    id: 13,
    slug: "the-witcher-3",
    name: "The Witcher 3",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg" },
    meta: { genres: ["RPG", "Mundo Abierto", "Acción"] },
    kpiSeries: { score: 93, currentPlayers: 70000 }
  },
  {
    id: 14,
    slug: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg" },
    meta: { genres: ["Acción", "Mundo Abierto", "Shooter"] },
    kpiSeries: { score: 97, currentPlayers: 95000 }
  },
  {
    id: 15,
    slug: "overwatch-2",
    name: "Overwatch 2",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/library_600x900.jpg" },
    meta: { genres: ["Shooter", "FPS", "Acción"] },
    kpiSeries: { score: 79, currentPlayers: 150000 }
  },
  {
    id: 16,
    slug: "among-us",
    name: "Among Us",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945360/library_600x900.jpg" },
    meta: { genres: ["Indie", "Estrategia"] },
    kpiSeries: { score: 82, currentPlayers: 25000 }
  },
  {
    id: 17,
    slug: "god-of-war-ragnarok",
    name: "God of War Ragnarok",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg" },
    meta: { genres: ["Acción", "RPG"] },
    kpiSeries: { score: 94, currentPlayers: 40000 }
  },
  {
    id: 18,
    slug: "cod-warzone",
    name: "Call of Duty: Warzone",
    images: { cover: "https://static-cdn.jtvnw.net/ttv-boxart/512710-600x900.jpg" },
    meta: { genres: ["Shooter", "FPS"] },
    kpiSeries: { score: 80, currentPlayers: 400000 }
  },
  {
    id: 19,
    slug: "celeste",
    name: "Celeste",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/504230/library_600x900.jpg" },
    meta: { genres: ["Indie"] },
    kpiSeries: { score: 92, currentPlayers: 5000 }
  },
  {
    id: 20,
    slug: "terraria",
    name: "Terraria",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900.jpg" },
    meta: { genres: ["Indie", "Mundo Abierto"] },
    kpiSeries: { score: 88, currentPlayers: 90000 }
  },
  {
    id: 21,
    slug: "star-wars-jedi-survivor",
    name: "Star Wars Jedi: Survivor",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1774580/library_600x900.jpg" },
    meta: { genres: ["Acción", "RPG"] },
    kpiSeries: { score: 85, currentPlayers: 30000 }
  },
  {
    id: 22,
    slug: "diablo-iv",
    name: "Diablo IV",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2344520/library_600x900.jpg" },
    meta: { genres: ["RPG", "Acción"] },
    kpiSeries: { score: 87, currentPlayers: 30000 }
  },
  {
    id: 23,
    slug: "xcom-2",
    name: "XCOM 2",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268500/library_600x900.jpg" },
    meta: { genres: ["Estrategia"] },
    kpiSeries: { score: 91, currentPlayers: 15000 }
  },
  {
    id: 24,
    slug: "age-of-empires-iv",
    name: "Age of Empires IV",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1466860/library_600x900.jpg" },
    meta: { genres: ["Estrategia"] },
    kpiSeries: { score: 86, currentPlayers: 20000 }
  },
  {
    id: 25,
    slug: "gta-v",
    name: "Grand Theft Auto V",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg" },
    meta: { genres: ["Mundo Abierto", "Acción", "Shooter"] },
    kpiSeries: { score: 96, currentPlayers: 120000 }
  },
  {
    id: 26,
    slug: "cs2",
    name: "Counter-Strike 2",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg" },
    meta: { genres: ["FPS", "Shooter"] },
    kpiSeries: { score: 83, currentPlayers: 1200000 }
  },
  {
    id: 27,
    slug: "palworld",
    name: "Palworld",
    images: { cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg" },
    meta: { genres: ["Indie", "Mundo Abierto", "RPG"] },
    kpiSeries: { score: 80, currentPlayers: 200000 }
  }
];

// Filtros y Tipos
const FILTERS = ['Todos', 'RPG', 'Acción', 'FPS', 'Estrategia', 'Indie', 'Shooter', 'Mundo Abierto'];
type SortOption = 'score_desc' | 'score_asc' | 'name';

export default function AllGamesPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros y Ordenamiento
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('score_desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    // Simulamos la carga del usuario
    const mockUser = { name: 'Valentín', favoritePlatform: 'PC', avatarUrl: '' };
    const timer = setTimeout(() => {
          setUser(mockUser);
          setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredGames = allGames.filter((game) => {
    if (activeFilter === 'Todos') return true;
    let searchGenre = activeFilter;
    if (activeFilter === 'Acción') searchGenre = 'Action';
    if (activeFilter === 'Estrategia') searchGenre = 'Strategy';
    if (activeFilter === 'Mundo Abierto') searchGenre = 'Open World';
    // Busqueda laxa
    return game.meta.genres.some(g => g.toLowerCase().includes(activeFilter.toLowerCase()) || g.includes(searchGenre));
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'score_desc') return b.kpiSeries.score - a.kpiSeries.score;
    if (sortBy === 'score_asc') return a.kpiSeries.score - b.kpiSeries.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  if (loading) {
    return <div className="h-screen bg-[#131119] flex items-center justify-center text-white">Cargando...</div>;
  }

  // Variable segura para cuando user es null (se usa en el Header)
  const safeUser = user || { name: 'Guest', favoritePlatform: 'PC', avatarUrl: '' };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* --- ANIMACIONES DE CARGA (Fade In Up) --- */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0; /* Comienza oculto para evitar flash */
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }

        /* ANIMACIÓN DE TARJETAS (Zoom central limpio) */
        .game-card-hover, 
        [class*="GameCard"],
        section div[role="listitem"] {
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
          transform-origin: center center !important;
          will-change: transform;
        }
        
        .game-card-hover:hover, 
        [class*="GameCard"]:hover,
        section div[role="listitem"]:hover {
          transform: scale(1.04) !important; 
          translate: 0px 0px !important;
          z-index: 50 !important;
          filter: brightness(1.1);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
        }
      `}</style>
      
      {/* ➡️ Header Importado (USANDO safeUser para evitar error de tipos y variable no usada) */}
      <Header user={safeUser} />
      
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
                <VerticalMenu activeItem="all-games" /> 
             </div>
          </aside>

          {/* Se añade animate-fade-up para la animación de entrada */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10 animate-fade-up">
            
            <div className="sticky top-[73px] z-40 bg-[#131119] pt-2 pb-6 -mt-2 border-b border-white/5 md:border-none">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2 font-display tracking-tight">
                    <Gamepad2 size={24} style={{ color: PALETTE.MORADO }} /> All Games
                    <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded ml-2 font-sans">
                      {sortedGames.length} Resultados
                    </span>
                  </h2>
                  <p className="text-gray-400 text-sm">Explora el catálogo completo de juegos disponibles.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mr-4 max-w-[calc(100vw-4rem)] xl:max-w-none">
                    {FILTERS.map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeFilter === filter 
                            ? 'bg-white text-black' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5' 
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className={`p-2 rounded-xl border border-white/5 transition-colors flex items-center gap-2 ${
                          showSortMenu ? 'bg-white text-black' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Filter size={20} />
                    </button>

                    {showSortMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                        <div className="p-2 space-y-1">
                          <button onClick={() => { setSortBy('score_desc'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'score_desc' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <Star size={16} /> <span>Mayor Puntaje</span>
                          </button>
                          <button onClick={() => { setSortBy('score_asc'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'score_asc' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <ArrowDown size={16} /> <span>Menor Puntaje</span>
                          </button>
                          <button onClick={() => { setSortBy('name'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'name' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <SortAsc size={16} /> <span>Nombre (A-Z)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {sortedGames.map((game) => (
                <Link 
                  href={`/game/${game.slug}`} 
                  key={game.id}
                  // Añadimos la clase 'game-card-hover' para la animación de hover
                  className="game-card-hover group relative bg-[#1A1A20] rounded-2xl p-3 border border-white/5 hover:border-purple-500/30 block"
                >
                  <div className="relative w-full aspect-[5/6] rounded-xl overflow-hidden mb-3 bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                    <div className="w-full h-full bg-gray-800 group-hover:scale-105 transition-transform duration-500 relative">
                        <Image
                            src={game.images.cover}
                            alt={game.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            unoptimized
                        />
                    </div>
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{game.kpiSeries.score}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 z-20">
                        <h3 className="font-bold text-white text-base leading-tight drop-shadow-md text-left line-clamp-2">{game.name}</h3>
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[60%]">
                        {game.meta.genres[0]}
                      </span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium">{formatNumber(game.kpiSeries.currentPlayers)}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-400 group-hover:text-purple-300 flex items-center gap-1">Ver Detalles</span>
                      <button className="p-1.5 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 hover:[&_svg]:fill-current transition-colors z-20" onClick={(e) => { e.preventDefault(); }}>
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}