import { HomeData } from '@/types';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard'; 

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
    // CAMBIO 1: 'h-screen' y 'overflow-hidden' para bloquear el scroll de la página completa
    <div className="h-screen bg-[#131119] text-white selection:bg-pink-500/30 overflow-hidden flex flex-col">
      
      {/* Estilos Globales: Mantenemos hover y scrollbar oculto, quitamos los hacks de sticky */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

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
      `}} />

      {/* ➡️ Header Importado (Componente reutilizable) */}
      <Header user={user} />
      
      {/* ➡️ Contenedor Principal: Se adapta al espacio restante sin scroll propio */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col overflow-hidden">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch h-full">
          
          {/* Área del Dashboard: Ocupa todo el alto disponible */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-4 h-full">
            <Dashboard data={data} />
          </div>

        </div>

      </main>
    </div>
  );
}