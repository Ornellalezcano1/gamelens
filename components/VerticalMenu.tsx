'use client'; // Necesario para usar onClick y useRouter en Next.js App Router

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importamos el hook de navegación
// CAMBIO: Importamos 'auth' desde nuestra configuración centralizada
// Esto asegura que Firebase esté inicializado antes de usarlo
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 

import { 
  LayoutDashboard, 
  Gamepad2, 
  TrendingUp, 
  Trophy, 
  Heart, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface VerticalMenuProps {
  // Tipos permitidos para resaltar el ítem activo
  activeItem?: 'home' | 'all-games' | 'favorites' | 'top-selling' | 'most-played' | 'profile' | 'settings';
}

export const VerticalMenu = ({ activeItem = 'home' }: VerticalMenuProps) => {
  const router = useRouter(); // Inicializamos el router
  
  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    // Ya no necesitamos 'const auth = getAuth();' aquí, usamos el importado
    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
      // Redirigir al usuario al Login después de cerrar sesión
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. Contenedor del Menú Principal */}
      <div className="bg-neutral-900/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
        
        {/* Sección Superior: Navegación Principal */}
        <nav className="space-y-2">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Menu Principal</p>
          
          {/* HOME */}
          <Link 
            href="/" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group mt-3 ${
              activeItem === 'home' 
                ? 'bg-[#50a2ff]/10 border border-[#50a2ff]/20 text-[#50a2ff]' 
                : 'text-gray-400 hover:text-[#50a2ff] hover:bg-[#50a2ff]/10'
            }`}
          >
            <LayoutDashboard size={20} className={`transition-transform ${activeItem === 'home' ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>Home</span>
          </Link>
          
          {/* ALL GAMES */}
          <Link 
            href="/all-games" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
              activeItem === 'all-games'
                ? 'bg-[#C471F2]/10 border border-[#C471F2]/20 text-[#C471F2] font-semibold'
                : 'text-gray-400 hover:text-[#C471F2] hover:bg-[#C471F2]/10'
            }`}
          >
            <Gamepad2 size={20} className={`transition-colors ${activeItem === 'all-games' ? '' : 'group-hover:text-[#C471F2]'}`} />
            <span>All Games</span>
          </Link>
          
          {/* TOP SELLING */}
          <Link 
            href="/top-selling" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
              activeItem === 'top-selling'
                ? 'bg-[#00FF62]/10 border border-[#00FF62]/20 text-[#00FF62] font-semibold'
                : 'text-gray-400 hover:text-[#00FF62] hover:bg-[#00FF62]/10'
            }`}
          >
            <TrendingUp size={20} className={`transition-colors ${activeItem === 'top-selling' ? '' : 'group-hover:text-[#00FF62]'}`} />
            <span>Top-Selling</span>
          </Link>
          
          {/* MOST PLAYED */}
          <Link 
            href="/most-played" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
              activeItem === 'most-played'
                ? 'bg-[#efb537]/10 border border-[#efb537]/20 text-[#efb537] font-semibold'
                : 'text-gray-400 hover:text-[#efb537] hover:bg-[#efb537]/10'
            }`}
          >
            <Trophy size={20} className={`transition-colors ${activeItem === 'most-played' ? '' : 'group-hover:text-[#efb537]'}`} />
            <span>Most Played</span>
          </Link>

          <div className="my-4 h-px bg-white/5 mx-4"></div>
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tu Colección</p>

          {/* Favoritos */}
          <Link 
            href="/favorites" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                activeItem === 'favorites'
                  ? 'bg-[#f6339a]/10 border border-[#f6339a]/20 text-[#f6339a] font-semibold'
                  : 'text-gray-400 hover:text-[#f6339a] hover:bg-[#f6339a]/10'
            }`}
          >
            <Heart size={20} className={`transition-colors ${activeItem === 'favorites' ? '' : 'group-hover:text-[#f6339a]'}`} />
            <span>Favoritos</span>
          </Link>
          
          {/* Perfil */}
          <Link 
            href="/profile" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                activeItem === 'profile'
                  ? 'bg-[#2DD4E0]/10 border border-[#2DD4E0]/20 text-[#2DD4E0] font-semibold'
                  : 'text-gray-400 hover:text-[#2DD4E0] hover:bg-[#2DD4E0]/10'
            }`}
          >
            <User size={20} className={`transition-colors ${activeItem === 'profile' ? '' : 'group-hover:text-[#2DD4E0]'}`} />
            <span>Perfil</span>
          </Link>
        </nav>

        {/* Sección Inferior: Sistema y Salida */}
        <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
              activeItem === 'settings'
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={20} className={`transition-colors ${activeItem === 'settings' ? 'text-white' : 'group-hover:text-gray-200'}`} />
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

      {/* 2. Banner PRO */}
      <div className="mt-auto p-5 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-700 text-white relative overflow-hidden shadow-2xl border border-white/10 flex flex-col shrink-0">
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
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/40 rounded-full blur-xl"></div>
      </div>

    </div>
  );
};