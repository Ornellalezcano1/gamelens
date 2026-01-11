'use client';

import React, { useState } from 'react';
// Importamos Link e Image de Next.js para cumplir con las reglas de ESLint
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Search, User, Menu } from 'lucide-react';
import { VerticalMenu } from '@/components/VerticalMenu';

interface HeaderProps {
  user: {
    name: string;
    favoritePlatform: string;
    avatarUrl?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MENÚ MÓVIL */}
      <div className="lg:hidden">
        <VerticalMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>

      {/* Se añade animate-fade-up para la animación de entrada */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 border-b border-white/5 bg-[#131119]/80 backdrop-blur-xl shrink-0 animate-fade-up">
        
        {/* GRUPO IZQUIERDO */}
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* BOTÓN HAMBURGUESA */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden transition-colors relative z-50"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>

          {/* LOGO - Corregido con Link e Image */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
              <Image 
                src="/Logo_Game.svg" 
                alt="GameLens Logo" 
                width={40} 
                height={40} 
                className="object-contain" 
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block font-display group-hover:from-white group-hover:to-white transition-all">
              GameLens
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="relative hidden md:block group ml-6 lg:ml-14">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar juegos, creadores..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-neutral-900 focus:border-blue-500/50 focus:text-white focus:ring-1 focus:ring-blue-500/20 transition-all w-48 lg:w-80 placeholder:text-gray-600"
            />
          </div>
        </div>
        
        {/* GRUPO DERECHO */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/favorites" 
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-500 rounded-full transition-colors font-semibold border border-pink-600/50"
          >
            <Heart size={18} fill="currentColor" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          {/* PERFIL - Corregido con Link */}
          <Link href="/profile" className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-purple-400 transition-colors">{user.name}</p>
              <p className="text-xs text-blue-400 font-medium mt-1">{user.favoritePlatform}</p>
            </div>
            
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-gray-400" />
              </div>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}