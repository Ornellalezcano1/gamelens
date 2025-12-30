'use client';

import { useState } from 'react';
import { HomeData, GameBasic } from '@/types';
import { HeroBanner } from '@/components/HeroBanner';
import { GameList } from '@/components/GameList';
import { MetricsSidebar } from '@/components/MetricsSidebar';
import { VerticalMenu } from '@/components/VerticalMenu';

interface DashboardProps {
  data: HomeData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [hoveredGame, setHoveredGame] = useState<GameBasic | null>(null);

  // El juego que se muestra en la derecha: El que tiene hover O el destacado por defecto
  const activeGame = hoveredGame || data.featuredGame;

  return (
    // 1. AJUSTE DE GRID:
    // - Izquierda: 260px (Fijo)
    // - Derecha: 420px (Fijo, antes era 340px, lo subimos para que no sea tan angosto)
    // - Centro: 1fr (El resto del espacio)
    // - gap-8: Espacio idéntico (32px) entre cada columna
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_420px] gap-8 h-[calc(100vh-9rem)]">
      
      {/* 2. MENÚ IZQUIERDO */}
      <aside className="hidden lg:block h-full overflow-hidden">
        <VerticalMenu />
      </aside>

      {/* 3. CENTRO */}
      {/* Eliminé 'pr-2' para asegurar que el espacio visual contra la derecha sea exactamente igual al de la izquierda */}
      <section className="space-y-8 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <HeroBanner game={data.featuredGame} />
        
        <div className="pb-10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-display tracking-tight">
            Trending Games
            <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded ml-2 font-sans">
              {data.games.length} Resultados
            </span>
          </h3>
          <GameList 
            games={data.games} 
            onGameHover={setHoveredGame} 
          />
        </div>
      </section>

      {/* 4. DERECHA (Sidebar) */}
      <aside className="hidden xl:block h-full overflow-hidden">
        <MetricsSidebar 
          game={activeGame} 
          defaultGame={data.featuredGame} 
        />
      </aside>

    </div>
  );
};