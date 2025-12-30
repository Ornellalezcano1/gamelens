import { HomeData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Dashboard } from '@/components/Dashboard'; // Importamos el componente "cerebro"
// Se eliminó la importación manual de VerticalMenu para evitar duplicados, ya que viene dentro de Dashboard
import { Heart, Search, User } from 'lucide-react';

// 1. Función para obtener los datos de la API falsa (Home)
async function getHomeData(): Promise<HomeData> {
  const res = await fetch('http://localhost:3000/api/home', { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Error cargando los datos de la Home.');
  }
  
  return res.json();
}

// 2. Componente principal (Home Page)
export default async function HomePage() {
  const data = await getHomeData();
  const { user } = data;

  return (
    <div className="min-h-screen bg-[#131119] text-white selection:bg-pink-500/30 overflow-x-hidden flex flex-col">
      
      {/* 1. CORRECCIÓN: Usamos style nativo para evitar el error de 'client-only' en Server Components */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* FUERZA EL ESTILO AL MENÚ DEL DASHBOARD:
           1. padding-top: 0 -> Mantiene el menú arriba (no lo baja).
           2. height: auto -> Elimina la altura forzada de pantalla completa.
              Al hacer esto, el contenedor se ajusta al contenido y la "Card Pro" (que usa mt-auto)
              ya no se empuja al fondo, sino que sube y se queda pegada al menú.
        */
        main aside > div {
          position: sticky !important;
          top: 74px !important;
          height: auto !important; /* Clave para subir la card */
          max-height: calc(100vh - 74px) !important;
          padding-top: 0 !important; /* Clave para no bajar el menú */
          padding-bottom: 2.5rem !important; 
        }
        
        /* Aseguramos que el contenedor flexible interno también se ajuste y no fuerce el espacio */
        main aside > div > div {
          height: auto !important;
        }
      `}} />

      {/* ➡️ Header Global (Sticky) */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-white/5 bg-[#131119]/80 backdrop-blur-xl shrink-0">
        
        {/* GRUPO IZQUIERDO: Logo + Título + Search Bar */}
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

          {/* Ajustado: reduje de ml-16 a ml-14 para un ajuste milimétrico a la izquierda */}
          <div className="relative hidden md:block group ml-14">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar juegos, creadores..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-neutral-900 focus:border-blue-500/50 focus:text-white focus:ring-1 focus:ring-blue-500/20 transition-all w-64 lg:w-80 placeholder:text-gray-600"
            />
          </div>
        </div>
        
        {/* GRUPO DERECHO: Acciones */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/favorites" 
            className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-500 rounded-full transition-colors font-semibold border border-pink-600/50"
          >
            <Heart size={18} fill="currentColor" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-none">{user.name}</p>
              <p className="text-xs text-blue-400 font-medium mt-1">{user.favoritePlatform}</p>
            </div>
            
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                 {user.avatarUrl && user.avatarUrl.startsWith('/') ? 
                   <Image src={user.avatarUrl} alt="User" width={40} height={40} className="object-cover" /> : 
                   <User size={20} className="text-gray-400" />
                 }
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* ➡️ Contenedor Principal con Layout de Sidebar y Márgenes corregidos */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          {/* SE ELIMINÓ EL MENÚ MANUAL (ASIDE) PARA EVITAR DUPLICADOS. 
              El menú que se muestra ahora viene de <Dashboard /> y está estilizado por el CSS de arriba (pt-0, h-auto). */}

          {/* Área Derecha: Contenido del Dashboard con margen inferior idéntico (pb-10) */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            <Dashboard data={data} />
          </div>

        </div>

      </main>
    </div>
  );
}