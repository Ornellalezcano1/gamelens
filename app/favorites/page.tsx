'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Search, User, Filter, SortAsc, 
  Gamepad2, Star, Calendar, Trash2 
} from 'lucide-react';
import { VerticalMenu } from '@/components/VerticalMenu';

// --- PALETA GAMELENS ---
const PALETTE = {
  CEL_AZUL: '#50a2ff',
  VERDE: '#00FF62',
  AMARILLO: '#efb537',
  LILA: '#b340bf',
  VIOLETA: '#a855f7',
  CYAN: '#2DD4E0',
  ROSA: '#f6339a',
  MORADO: '#4530BE',
  ROJO: '#FF4444',
  BLANCO: '#FFFFFF',
  GRIS: '#9CA3AF'
};

// --- MOCK DATA: JUEGOS FAVORITOS ---
const initialFavorites = [
  {
    id: 1,
    slug: "elden-ring",
    name: "Elden Ring",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg",
    addedDate: "2023-11-15",
    genres: ["RPG", "Mundo Abierto"],
    score: 96
  },
  {
    id: 2,
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg",
    addedDate: "2023-10-20",
    genres: ["RPG", "FPS"],
    score: 86
  },
  {
    id: 6,
    slug: "hades-ii",
    name: "Hades II",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900.jpg",
    addedDate: "2023-12-01",
    genres: ["Indie", "Roguelike"],
    score: 94
  },
  {
    id: 10,
    slug: "hollow-knight",
    name: "Hollow Knight",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg",
    addedDate: "2023-09-05",
    genres: ["Indie", "Metroidvania"],
    score: 95
  },
  {
    id: 13,
    slug: "the-witcher-3",
    name: "The Witcher 3: Wild Hunt",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg",
    addedDate: "2023-08-12",
    genres: ["RPG", "Aventura"],
    score: 93
  },
  {
    id: 25,
    slug: "gta-v",
    name: "Grand Theft Auto V",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg",
    addedDate: "2023-07-30",
    genres: ["Acción", "Mundo Abierto"],
    score: 96
  },
  {
    id: 9,
    slug: "baldurs-gate-3",
    name: "Baldur's Gate 3",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg",
    addedDate: "2024-01-10",
    genres: ["RPG", "Estrategia"],
    score: 98
  },
  {
    id: 20,
    slug: "terraria",
    name: "Terraria",
    cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900.jpg",
    addedDate: "2023-06-15",
    genres: ["Indie", "Sandbox"],
    score: 88
  }
];

const FILTERS = ['Todos', 'RPG', 'Indie', 'Acción', 'Mundo Abierto'];
type SortOption = 'score_desc' | 'score_asc' | 'name' | 'date_desc';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Lógica de Filtrado y Ordenamiento
  const filteredFavorites = favorites.filter(game => {
    const matchesFilter = activeFilter === 'Todos' || game.genres.some(g => g.includes(activeFilter));
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'score_desc') return b.score - a.score;
    if (sortBy === 'score_asc') return a.score - b.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date_desc') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    return 0;
  });

  const handleRemoveFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    e.stopPropagation();
    setFavorites(prev => prev.filter(game => game.id !== id));
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white bg-[#131119]">Cargando tu colección...</div>;
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 1. HEADER (Consistente) */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-white/5 bg-[#131119]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/Logo_Game.svg" alt="GameLens Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block font-display">
              GameLens
            </h1>
          </div>
          <div className="relative hidden md:block group ml-14">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar en favoritos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-neutral-900 focus:border-pink-500/50 focus:text-white focus:ring-1 focus:ring-pink-500/20 transition-all w-64 lg:w-80 placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 text-pink-500 rounded-full font-semibold border border-pink-600/50 shadow-[0_0_15px_-5px_rgba(246,51,154,0.3)]">
            <Heart size={18} fill="currentColor" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-none">Valentín</p>
              <p className="text-xs text-blue-400 font-medium mt-1">PC</p>
            </div>
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                 <User size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WRAPPER */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          {/* Menú Lateral */}
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
                <VerticalMenu activeItem="favorites" />
             </div>
          </aside>

          {/* Área Derecha: Contenido de Favoritos */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            
            {/* Header Sticky con Filtros (Estilo All Games) */}
            <div className="sticky top-[73px] z-40 bg-[#131119] pt-2 pb-6 -mt-2 border-b border-white/5 md:border-none">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
                
                {/* Título */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2 font-display tracking-tight">
                    <Heart size={24} style={{ color: PALETTE.ROSA, fill: PALETTE.ROSA }} /> Favoritos
                    <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded ml-2 font-sans">
                      {filteredFavorites.length} Resultados
                    </span>
                  </h2>
                  <p className="text-gray-400 text-sm">Tu colección personal de joyas.</p>
                </div>

                {/* Filtros y Ordenamiento */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mr-4 max-w-[calc(100vw-4rem)] xl:max-w-none">
                    {FILTERS.map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeFilter === filter 
                            ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' 
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
                          <button onClick={() => { setSortBy('date_desc'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'date_desc' ? 'bg-pink-600/20 text-pink-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <Calendar size={16} /> <span>Agregado Reciente</span>
                          </button>
                          <button onClick={() => { setSortBy('score_desc'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'score_desc' ? 'bg-pink-600/20 text-pink-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <Star size={16} /> <span>Mayor Puntaje</span>
                          </button>
                          <button onClick={() => { setSortBy('name'); setShowSortMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'name' ? 'bg-pink-600/20 text-pink-400' : 'text-gray-400 hover:bg-white/5'}`}>
                            <SortAsc size={16} /> <span>Nombre (A-Z)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Grilla de Juegos (Card Design from All Games but with Pink accent & Remove logic) */}
            {filteredFavorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredFavorites.map((game) => (
                        <Link 
                            href={`/game/${game.slug}`} 
                            key={game.id}
                            className="group relative bg-[#1A1A20] rounded-2xl p-3 border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10 block"
                        >
                            <div className="relative w-full aspect-[5/6] rounded-xl overflow-hidden mb-3 bg-gray-800">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                                <div className="w-full h-full bg-gray-800 group-hover:scale-105 transition-transform duration-500 relative">
                                    <Image
                                        src={game.cover}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        unoptimized
                                    />
                                </div>
                                <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-white">{game.score}</span>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 z-20">
                                    <h3 className="font-bold text-white text-base leading-tight drop-shadow-md text-left line-clamp-2">{game.name}</h3>
                                </div>
                            </div>

                            <div className="px-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[60%]">
                                        {game.genres[0]}
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-400" title={`Agregado el ${game.addedDate}`}>
                                        <Calendar size={12} className="text-gray-500" />
                                        <span className="text-xs font-medium">
                                            {new Date(game.addedDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-medium text-pink-400 group-hover:text-pink-300 flex items-center gap-1">Ver Detalles</span>
                                    <button 
                                        onClick={(e) => handleRemoveFavorite(e, game.id)}
                                        className="p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-red-500/80 transition-colors z-20"
                                        title="Eliminar de favoritos"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-[#1A1A20]/30">
                    <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
                        <Heart size={40} className="text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No tienes favoritos aún</h3>
                    <p className="text-gray-400 max-w-md mb-8">
                        {activeFilter !== 'Todos' || searchQuery 
                            ? "No se encontraron juegos con los filtros actuales." 
                            : "Explora la biblioteca y marca los juegos que más te gusten con el corazón para verlos aquí."}
                    </p>
                    <Link 
                        href="/all-games" 
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/10"
                    >
                        <Gamepad2 size={20} />
                        Explorar Juegos
                    </Link>
                </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}