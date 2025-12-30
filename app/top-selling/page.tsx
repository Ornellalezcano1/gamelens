'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VerticalMenu } from '@/components/VerticalMenu'; 
import { Heart, Search, User, TrendingUp, TrendingDown, Minus, Calendar, Star } from 'lucide-react';

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

// --- TIPOS LOCALES ---
interface UserData {
  id?: number;
  name: string;
  avatarUrl: string;
  favoritePlatform: string;
}

interface TopSellingGame {
  rank: number;
  id: number;
  slug: string;
  name: string;
  publisher: string;
  price: number;
  coverUrl: string;
  change: number; 
  weeksOnChart: number;
  peakPlayers: number;
  score: number;
}

// --- HELPER: Formatear moneda ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

// --- COMPONENTE RANK MEDAL (Estilo Unificado) ---
const RankMedal = ({ rank }: { rank: number }) => {
    if (rank > 3) return <span className="font-bold text-gray-500 w-6 text-center text-sm font-mono">{rank}</span>;

    let styles = "";
    if (rank === 1) styles = "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-lg shadow-yellow-500/10"; 
    if (rank === 2) styles = "bg-gray-400/20 text-gray-300 border border-gray-400/50"; 
    if (rank === 3) styles = "bg-orange-700/20 text-orange-400 border border-orange-700/50"; 
      
    return (
        <div className={`flex items-center justify-center w-6 h-6 rounded-md font-bold text-sm ${styles}`}>
            {rank}
        </div>
    );
};

// --- DATOS MOCK: TOP SELLING ---
const topSellingData: TopSellingGame[] = [
  {
    rank: 1,
    id: 3,
    slug: "black-myth-wukong",
    name: "Black Myth: Wukong",
    publisher: "Game Science",
    price: 59.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg",
    change: 12.5,
    weeksOnChart: 3,
    peakPlayers: 2400000,
    score: 81
  },
  {
    rank: 2,
    id: 26,
    slug: "cs2",
    name: "Counter-Strike 2",
    publisher: "Valve",
    price: 0,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg",
    change: 5.2,
    weeksOnChart: 54,
    peakPlayers: 1200000,
    score: 83
  },
  {
    rank: 3,
    id: 1,
    slug: "elden-ring",
    name: "Elden Ring",
    publisher: "FromSoftware",
    price: 59.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg",
    change: -2.1,
    weeksOnChart: 120,
    peakPlayers: 953000,
    score: 96
  },
  {
    rank: 4,
    id: 9,
    slug: "baldurs-gate-3",
    name: "Baldur's Gate 3",
    publisher: "Larian Studios",
    price: 59.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg",
    change: 0,
    weeksOnChart: 45,
    peakPlayers: 875000,
    score: 98
  },
  {
    rank: 5,
    id: 2,
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    publisher: "CD PROJEKT RED",
    price: 29.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg",
    change: 8.4,
    weeksOnChart: 80,
    peakPlayers: 1054000,
    score: 86
  },
  {
    rank: 6,
    id: 25,
    slug: "gta-v",
    name: "Grand Theft Auto V",
    publisher: "Rockstar Games",
    price: 29.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg",
    change: -1.5,
    weeksOnChart: 500,
    peakPlayers: 360000,
    score: 96
  },
  {
    rank: 7,
    id: 27,
    slug: "palworld",
    name: "Palworld",
    publisher: "Pocketpair",
    price: 29.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg",
    change: -5.8,
    weeksOnChart: 15,
    peakPlayers: 2100000,
    score: 80
  },
  {
    rank: 8,
    id: 12,
    slug: "apex-legends",
    name: "Apex Legends",
    publisher: "Electronic Arts",
    price: 0,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg",
    change: 3.2,
    weeksOnChart: 200,
    peakPlayers: 620000,
    score: 84
  },
  {
    rank: 9,
    id: 4,
    slug: "fortnite",
    name: "Fortnite",
    publisher: "Epic Games",
    price: 0,
    coverUrl: "https://static-cdn.jtvnw.net/ttv-boxart/33214-600x900.jpg",
    change: 1.1,
    weeksOnChart: 300,
    peakPlayers: 3000000,
    score: 81
  },
  {
    rank: 10,
    id: 22,
    slug: "diablo-iv",
    name: "Diablo IV",
    publisher: "Blizzard Entertainment",
    price: 69.99,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2344520/library_600x900.jpg",
    change: -8.5,
    weeksOnChart: 20,
    peakPlayers: 150000,
    score: 87
  }
];

export default function TopSellingPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de usuario
    const mockUser = { name: 'Valentín', favoritePlatform: 'PC', avatarUrl: '' };
    const timer = setTimeout(() => {
          setUser(mockUser);
          setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="h-screen bg-[#131119] flex items-center justify-center text-white">Cargando...</div>;
  }

  const safeUser = user || { name: 'Guest', favoritePlatform: 'PC', avatarUrl: '' };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
      {/* 1. ESTILO DE SCROLLBAR (Consistente con Most Played) */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* 2. HEADER (Sticky y Consistente) */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-white/5 bg-[#131119]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image 
                src="/Logo_Game.svg" 
                alt="GameLens Logo" 
                width={40} 
                height={40} 
                className="object-contain" 
                priority 
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block font-display">
              GameLens
            </h1>
          </div>
          <div className="relative hidden md:block group ml-14">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar juegos, creadores..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-neutral-900 focus:border-blue-500/50 focus:text-white focus:ring-1 focus:ring-blue-500/20 transition-all w-64 lg:w-80 placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-500 rounded-full transition-colors font-semibold border border-pink-600/50">
            <Heart size={18} fill="currentColor" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-none">{safeUser.name}</p>
              <p className="text-xs text-blue-400 font-medium mt-1">{safeUser.favoritePlatform}</p>
            </div>
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                  {safeUser.avatarUrl ? (
                    <Image src={safeUser.avatarUrl} alt="User" width={40} height={40} className="object-cover" />
                  ) : (
                    <User size={20} className="text-gray-400" />
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 3. MAIN WRAPPER (Estructura de ProfilePage / MostPlayedPage) */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          {/* Menú Lateral (Sticky) */}
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
                {/* Active Item: 'top-selling' */}
                <VerticalMenu activeItem="top-selling" /> 
             </div>
          </aside>

          {/* Área Derecha: Contenido Específico de Top Selling */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            
            {/* Page Header (Consistente con Most Played, color VERDE) */}
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2 font-display tracking-tight">
                <TrendingUp size={24} style={{ color: PALETTE.VERDE }} /> Top Selling
              </h2>
            </div>

            {/* --- TABLA / LISTA DE RANKING --- */}
            <div className="w-full bg-[#1A1A20] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
                
                {/* Encabezado de la tabla */}
                {/* Distribución 12 columnas: Rank(1) + Juego(4) + Precio(2) + Rating(1) + Cambio(2) + Semanas(2) */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2 md:col-span-1 text-left">Rank</div>
                    <div className="col-span-6 md:col-span-4">Juego</div>
                    <div className="col-span-2 text-left hidden md:block">Precio</div>
                    <div className="col-span-1 text-center hidden md:block">Rating</div>
                    <div className="col-span-2 text-right hidden md:block">Cambio</div>
                    <div className="col-span-3 md:col-span-2 text-right">Semanas</div>
                </div>

                {/* Filas */}
                <div className="divide-y divide-white/5">
                    {topSellingData.map((game) => (
                        <Link 
                            key={game.id} 
                            href={`/game/${game.slug}`}
                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
                        >
                            {/* RANK */}
                            <div className="col-span-2 md:col-span-1 flex justify-start">
                                <RankMedal rank={game.rank} />
                            </div>

                            {/* JUEGO */}
                            <div className="col-span-6 md:col-span-4 flex items-center gap-4">
                                <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 border border-white/10 group-hover:border-white/30 transition-colors">
                                    <Image 
                                        src={game.coverUrl} 
                                        alt={game.name} 
                                        fill 
                                        className="object-cover"
                                        sizes="48px"
                                        unoptimized
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white text-base truncate group-hover:text-blue-400 transition-colors">{game.name}</h3>
                                    <p className="text-xs text-gray-500 truncate">{game.publisher}</p>
                                    {/* Mobile: Mostrar Precio brevemente */}
                                    <div className="flex items-center gap-1 text-[10px] text-green-400 mt-1 md:hidden">
                                        {game.price === 0 ? "Free" : formatPrice(game.price)}
                                    </div>
                                </div>
                            </div>

                            {/* PRECIO (Desktop) */}
                            <div className="col-span-2 hidden md:block text-left">
                                {game.price === 0 ? (
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded uppercase border border-green-500/20">Free</span>
                                ) : (
                                    <span className="text-gray-300 font-medium tabular-nums">{formatPrice(game.price)}</span>
                                )}
                            </div>

                            {/* RATING */}
                            <div className="col-span-1 hidden md:flex items-center justify-center">
                                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 text-yellow-500 font-bold text-sm tabular-nums">
                                    <Star size={12} fill="currentColor" />
                                    {game.score}
                                </div>
                            </div>

                            {/* CAMBIO */}
                            <div className="col-span-2 hidden md:flex items-center justify-end">
                                <div className={`flex items-center gap-1 text-sm font-bold tabular-nums ${
                                    game.change > 0 ? 'text-green-500' : 
                                    game.change < 0 ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                    {game.change > 0 && <TrendingUp size={14} />}
                                    {game.change < 0 && <TrendingDown size={14} />}
                                    {game.change === 0 && <Minus size={14} />}
                                    <span>{Math.abs(game.change)}%</span>
                                </div>
                            </div>

                            {/* SEMANAS */}
                            <div className="col-span-3 md:col-span-2 flex flex-col items-end justify-center">
                                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium tabular-nums">
                                    <Calendar size={14} className="text-purple-400" />
                                    <span>{game.weeksOnChart} sem.</span>
                                </div>
                            </div>

                        </Link>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}