import { NextResponse } from 'next/server';
import gameDetailData from '@/mocks/game-detail.mock.json';

// 1. Configuración CRÍTICA para evitar caché en Next.js App Router
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: Context) {
  // Await de params para compatibilidad con Next.js 15
  const { slug } = await context.params;

  console.log(`⚡ API HIT: Solicitando datos para slug="${slug}"`);

  // 2. Si es 'elden-ring', devolvemos el mock original (pero aseguramos que sea un objeto nuevo)
  if (slug === 'elden-ring') {
    console.log('🔙 Retornando datos estáticos de Elden Ring');
    return NextResponse.json({ ...gameDetailData }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }

  // 3. Generamos datos dinámicos para cualquier otro juego
  const simulatedName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  console.log(`🎲 Generando datos falsos para: ${simulatedName}`);

  // Creamos una copia profunda básica simulada para evitar mutaciones
  const dynamicGameData = {
    ...gameDetailData,
    id: Math.floor(Math.random() * 100000), // ID aleatorio
    slug: slug,
    name: simulatedName, // Nombre basado en la URL
    images: {
      hero: `https://placehold.co/1920x1080/1a1a1a/white?text=${encodeURIComponent(simulatedName)}+Hero`,
      cover: `https://placehold.co/600x900/2a2a2a/white?text=${encodeURIComponent(simulatedName)}`,
      screenshots: [
        `https://placehold.co/1280x720/333/white?text=${encodeURIComponent(simulatedName)}+1`,
        `https://placehold.co/1280x720/444/white?text=${encodeURIComponent(simulatedName)}+2`,
        `https://placehold.co/1280x720/555/white?text=${encodeURIComponent(simulatedName)}+3`,
      ]
    },
    meta: {
      ...gameDetailData.meta,
      developer: "Simulated Studio",
      publisher: "Simulated Publisher",
      genres: ["Action", "Generated"],
    },
    score: Math.floor(Math.random() * 40) + 50, // Score aleatorio
    // Ajustamos KPIs para que se vea diferente
    kpiSeries: {
      ...gameDetailData.kpiSeries,
      score: Math.floor(Math.random() * 40) + 50,
      currentPlayers: Math.floor(Math.random() * 500000),
    }
  };

  // 4. Retornamos con headers Anti-Caché explícitos
  return NextResponse.json(dynamicGameData, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'CDN-Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    },
  });
}