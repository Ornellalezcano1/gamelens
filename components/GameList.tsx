'use client';

import { useState } from 'react';
import { GameBasic } from '@/types';
import { GameCard } from '@/components/GameCard';
import { Filter, Star, SortAsc, ArrowDown } from 'lucide-react'; 

interface GameListProps {
  games: GameBasic[];
  onGameHover: (game: GameBasic | null) => void;
}

// Filtros funcionales basados en tus datos
const FILTERS = ['Todos', 'RPG', 'Acción', 'FPS', 'Estrategia', 'Indie', 'Shooter', 'Mundo Abierto'];

// Actualizamos el tipo para incluir el orden ascendente de score
type SortOption = 'score_desc' | 'score_asc' | 'name';

export const GameList: React.FC<GameListProps> = ({ games, onGameHover }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('score_desc'); // Por defecto: Mayor puntaje
  const [showSortMenu, setShowSortMenu] = useState(false);   

  // 1. Filtrar
  const filteredGames = games.filter((game) => {
    if (activeFilter === 'Todos') return true;
    return game.genres && game.genres.includes(activeFilter);
  });

  // 2. Ordenar (Sobre la lista ya filtrada)
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'score_desc') {
      return b.score - a.score; // Mayor a menor (Descendente)
    }
    if (sortBy === 'score_asc') {
      return a.score - b.score; // Menor a mayor (Ascendente)
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name); // A-Z
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Barra de Herramientas */}
      <div className="flex items-center justify-between relative z-20"> {/* z-20 para que el menú quede encima */}
        
        {/* Chips de Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mr-4">
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

        {/* Botón de Ordenar con Menú Desplegable */}
        <div className="relative">
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={`p-2 rounded-xl border border-white/5 transition-colors flex items-center gap-2 ${
                showSortMenu ? 'bg-white text-black' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
            title="Ordenar por..."
          >
            <Filter size={20} />
          </button>

          {/* Menú Dropdown */}
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
              <div className="p-2 space-y-1">
                {/* Opción: Mayor Puntaje */}
                <button
                  onClick={() => { setSortBy('score_desc'); setShowSortMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'score_desc' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Star size={16} />
                  <span>Mayor Puntaje</span>
                </button>

                {/* Opción: Menor Puntaje (NUEVA) */}
                <button
                  onClick={() => { setSortBy('score_asc'); setShowSortMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'score_asc' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ArrowDown size={16} />
                  <span>Menor Puntaje</span>
                </button>

                {/* Opción: Nombre */}
                <button
                  onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'name' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <SortAsc size={16} />
                  <span>Nombre (A-Z)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Juegos Ordenados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGames.map((game) => (
          <div 
            key={game.id}
            onMouseEnter={() => onGameHover(game)}
            onMouseLeave={() => onGameHover(null)} 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};