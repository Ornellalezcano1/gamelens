// components/GameCard.tsx
'use client';

import Link from 'next/link';
import { Game } from '@/types';
import { Star, Heart } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

// ✅ CORRECCIÓN: Usamos 'export const' (Named Export) en lugar de 'export default'
// Esto soluciona el error de importación en app/page.tsx
export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const scoreColor = game.score >= 90 ? 'text-green-400' : 
                     game.score >= 80 ? 'text-yellow-400' : 
                                        'text-orange-400';

  return (
    <Link href={`/game/${game.slug}`} className="block w-full">
      <div className="bg-neutral-900 p-3 rounded-2xl flex items-center space-x-4 
                      hover:bg-neutral-800 transition duration-300 transform hover:translate-x-1
                      border border-neutral-800 hover:border-blue-500/80 shadow-2xl relative">
        {/* Imagen de Portada */}
        <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-xl shadow-md bg-cover bg-center border border-neutral-700/50"
             style={{ backgroundImage: `url(${game.coverUrl})` }} />
        
        {/* Información del Juego */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold truncate text-white hover:text-blue-400 transition-colors">{game.name}</h3>
          <div className="flex items-center mt-1">
            <Star size={16} fill="currentColor" className={`mr-1 ${scoreColor}`} />
            <span className={`font-bold text-sm ${scoreColor}`}>{game.score}</span>
            <span className="text-gray-400 text-xs ml-1">/ 100</span>
          </div>
        </div>
        
        {/* Icono de Favorito */}
        <div className="flex-shrink-0">
          {game.isFavorite ? 
            <Heart size={20} fill="currentColor" className="text-pink-500 transition-transform duration-300 hover:scale-110" /> :
            <Heart size={20} className="text-neutral-600 transition-colors duration-300 hover:text-neutral-500" />
          }
        </div>
      </div>
    </Link>
  );
};