'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  X, 
  LayoutDashboard, 
  Gamepad2, 
  TrendingUp, 
  Trophy, 
  Heart, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK AUTH (Borrar en producción) ---
const signOut = async () => console.log('Cerrando sesión...');
// ---------------------------------------

interface VerticalMenuProps {
  activeItem?: string; 
  isOpen?: boolean;     
  onClose?: () => void; 
}

export const VerticalMenu = ({ isOpen, onClose }: VerticalMenuProps) => {
  const router = useRouter(); 
  const pathname = usePathname(); 
  
  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Sesión cerrada correctamente");
      if (onClose) onClose();
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const getLinkClass = (path: string, itemKey: string) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group";
    
    const colors: Record<string, string> = {
      'home': 'text-[#50a2ff] bg-[#50a2ff]/10 border-[#50a2ff]/20',
      'all-games': 'text-[#C471F2] bg-[#C471F2]/10 border-[#C471F2]/20',
      'top-selling': 'text-[#00FF62] bg-[#00FF62]/10 border-[#00FF62]/20',
      'most-played': 'text-[#efb537] bg-[#efb537]/10 border-[#efb537]/20',
      'favorites': 'text-[#f6339a] bg-[#f6339a]/10 border-[#f6339a]/20',
      'profile': 'text-[#2DD4E0] bg-[#2DD4E0]/10 border-[#2DD4E0]/20',
      'settings': 'text-white bg-white/10 border-white/10'
    };

    if (isActive) {
      return `${baseClass} ${colors[itemKey] || ''} border font-semibold`;
    }
    
    const hoverClass: Record<string, string> = {
        'home': 'hover:text-[#50a2ff] hover:bg-[#50a2ff]/10',
        'all-games': 'hover:text-[#C471F2] hover:bg-[#C471F2]/10',
        'top-selling': 'hover:text-[#00FF62] hover:bg-[#00FF62]/10',
        'most-played': 'hover:text-[#efb537] hover:bg-[#efb537]/10',
        'favorites': 'hover:text-[#f6339a] hover:bg-[#f6339a]/10',
        'profile': 'hover:text-[#2DD4E0] hover:bg-[#2DD4E0]/10',
        'settings': 'hover:text-white hover:bg-white/5'
    };

    return `${baseClass} text-gray-400 ${hoverClass[itemKey] || ''}`;
  };

  return (
    <>
      {/* 1. OVERLAY OSCURO (Fondo) */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. CAJÓN DEL MENÚ */}
      <div className={`
        flex flex-col gap-4 lg:gap-6
        /* Estilos Móvil: Drawer Fixed + Inset-y-0 para altura completa fija */
        fixed inset-y-0 left-0 z-[9999] w-72 bg-[#131119] p-4 border-r border-white/10 transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        
        /* Estilos Desktop: Reset a estático */
        lg:static lg:h-full lg:translate-x-0 lg:bg-transparent lg:p-0 lg:border-none lg:w-full lg:z-auto lg:transition-none lg:shadow-none
      `}>
        
        {/* CABECERA MÓVIL (BOTÓN CERRAR) */}
        <div className="flex items-center justify-end lg:hidden mb-0 px-1 shrink-0">
          <button 
            onClick={() => onClose && onClose()} 
            className="p-1 text-gray-400 hover:text-white active:scale-95 transition-transform cursor-pointer"
            aria-label="Cerrar menú"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENIDO DEL MENÚ */}
        {/* CAMBIO: Agregado 'flex flex-col' para que los hijos internos se distribuyan verticalmente */}
        <div className="bg-neutral-900/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl flex-1 overflow-y-auto no-scrollbar animate-fade-up flex flex-col">
          
          {/* CAMBIO: Agregado 'flex-1' para empujar la sección de settings/logout hacia abajo */}
          <nav className="space-y-2 flex-1">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Menu Principal</p>
            
            <Link 
              href="/" 
              className={getLinkClass('/', 'home')} 
              onClick={handleLinkClick}
            >
              <LayoutDashboard size={20} className="transition-transform group-hover:scale-110" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/all-games" 
              className={getLinkClass('/all-games', 'all-games')}
              onClick={handleLinkClick}
            >
              <Gamepad2 size={20} />
              <span>All Games</span>
            </Link>
            
            <Link 
              href="/top-selling" 
              className={getLinkClass('/top-selling', 'top-selling')}
              onClick={handleLinkClick}
            >
              <TrendingUp size={20} />
              <span>Top-Selling</span>
            </Link>
            
            <Link 
              href="/most-played" 
              className={getLinkClass('/most-played', 'most-played')}
              onClick={handleLinkClick}
            >
              <Trophy size={20} />
              <span>Most Played</span>
            </Link>

            <div className="my-4 h-px bg-white/5 mx-4"></div>
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tu Colección</p>

            <Link 
              href="/favorites" 
              className={getLinkClass('/favorites', 'favorites')}
              onClick={handleLinkClick}
            >
              <Heart size={20} />
              <span>Favoritos</span>
            </Link>
            
            <Link 
              href="/profile" 
              className={getLinkClass('/profile', 'profile')}
              onClick={handleLinkClick}
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>
          </nav>

          {/* Sección Inferior (Settings + Logout) */}
          {/* Ahora esto quedará pegado al fondo de la tarjeta gris */}
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <Link 
              href="/settings" 
              className={getLinkClass('/settings', 'settings')}
              onClick={handleLinkClick}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all group cursor-pointer"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>LogOut</span>
            </button>
          </div>
        </div>

        {/* BANNER PRO */}
        <div className="hidden lg:flex mt-auto p-5 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-700 text-white relative overflow-hidden shadow-2xl border border-white/10 flex-col shrink-0 animate-fade-up delay-200">
          <div className="relative z-10 flex flex-col justify-center gap-3">
            <div className="space-y-1">
                <p className="font-bold text-lg leading-tight">GameLens Pro</p>
                <p className="text-sm text-pink-100 opacity-90 font-medium leading-snug">Accede a métricas avanzadas y exporta reportes.</p>
            </div>
            <div className="pt-2">
              <button className="w-full px-4 py-2 bg-white text-pink-600 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-100 transition transform hover:scale-105 active:scale-95">
                Mejorar Plan
              </button>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/40 rounded-full blur-xl"></div>
        </div>
      </div>
    </>
  );
};