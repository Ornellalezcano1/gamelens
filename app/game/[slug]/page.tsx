/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

// --- IMPORTACIONES DE TUS COMPONENTES ---
import { Header } from '@/components/Header';
import { VerticalMenu } from '@/components/VerticalMenu';
// IMPORTAMOS EL CONTEXTO DE IDIOMA
import { useLanguage } from '@/app/context/LanguageContext';

// --- ICONOS ---
import { 
  Users, Trophy, Calendar, Star, TrendingUp, Users2, 
  LineChart as LineChartIcon, Globe, Monitor, 
  Clock, Heart, LucideIcon, Cpu, HardDrive, Zap, Image as ImageIcon,
  X, ChevronLeft, ChevronRight, Gamepad2, Shield, Languages, Box, 
  Info, FileText, Timer, Target, LocateFixed
} from 'lucide-react';

// --- RECHARTS ---
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Pie, PieChart as RechartsPieChart, LabelList,
  RadialBarChart, RadialBar
} from 'recharts';

// ==========================================
// 1. TIPOS Y MOCKS INTEGRADOS
// ==========================================

interface ChartPayloadItem {
  name: string;
  value: number | string;
  color?: string;
  fill?: string;
  dataKey?: string;
  payload?: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartPayloadItem[];
  label?: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
  payload?: unknown;
  value?: number;
}

interface SentimentEntry {
    name: string;
    value: number;
    fill: string;
    color: string;
    [key: string]: string | number;
}

export interface ExtendedGameDetail {
  id?: number;
  slug: string;
  name: string;
  storeUrl?: string;
  isFavorite?: boolean;
  images?: {
    hero: string;
    cover: string;
    screenshots: string[];
  };
  meta?: {
    genres: string[];
    platforms: string[];
    developer: string;
    publisher: string;
    publisherUrl?: string;
    releaseDate: string;
    description?: string;
    description_en?: string;
    description_es?: string;
    ageRating?: string;
    gameModes?: string[];
    downloadSize?: string;
    controllerSupport?: boolean;
    engine?: string;
    languages?: string[];
    externalLinks?: {
      website?: string;
      wiki?: string;
      reddit?: string;
    };
  };
  playerGrowth14d?: { day: string; players: number }[];
  kpiSeries?: {
    topCountries?: { country: string; code: string; weight: number }[];
    peakPlayers: number;
    score: number;
    currentPlayers: number;
    players24hChangePercent: number;
  };
  rankingMovement?: {
    currentRank: number;
    change: number;
    history: { day: string; rank: number }[];
  };
  platformDistribution?: { platform: string; percent: number }[];
  retention?: { [key: string]: number }; 
  userReviews?: {
    total?: number;
    positivePercent: number;
    mixedPercent: number;
    negativePercent: number;
    starsDistribution: Record<string, number>;
  };
  criticReviews?: {
    total: number;
    positivePercent: number;
    mixedPercent: number;
    negativePercent: number;
  };
  communitySentiment?: {
    positivePercent: number;
    mixedPercent: number;
    negativePercent: number;
  };
  peakHours?: { hour: string; players: number }[];
}

// --- HELPERS GENERADORES ---
const generateTimeline = (base: number, volatility: number) => {
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      day: date.toISOString().split('T')[0],
      players: Math.max(100, Math.floor(base + (Math.sin(i) * volatility) + (Math.random() - 0.5) * volatility * 0.5))
    };
  });
};

const generateHourly = (base: number) => {
  return Array.from({ length: 12 }, (_, i) => ({
    hour: `${String(i * 2).padStart(2, '0')}:00`,
    players: Math.floor(base * (0.8 + Math.random() * 0.4))
  }));
};

const generateRankHistory = (currentRank: number) => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const variation = Math.floor(Math.random() * 3) - 1; 
        let r = currentRank + variation;
        if(r < 1) r = 1;
        return {
            day: date.toISOString().split('T')[0],
            rank: r
        };
      });
}

// --- LISTA BASE DE JUEGOS ---
const RAW_GAMES_LIST = [
    { id: 28, slug: "black-myth-wukong", name: "Black Myth: Wukong", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg", score: 81, isFavorite: false, genres: ["Action RPG", "Souls-like"] },
    { id: 1, slug: "elden-ring", name: "Elden Ring", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg", score: 96, isFavorite: true, genres: ["RPG", "Action", "Open World"] },
    { id: 2, slug: "cyberpunk-2077", name: "Cyberpunk 2077", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg", score: 86, isFavorite: false, genres: ["RPG", "FPS", "Open World"] },
    { id: 3, slug: "destiny-2", name: "Destiny 2", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg", score: 83, isFavorite: false, genres: ["FPS", "Shooter", "Action"] },
    { id: 4, slug: "fortnite", name: "Fortnite", coverUrl: "https://static-cdn.jtvnw.net/ttv-boxart/33214-600x900.jpg", score: 81, isFavorite: true, genres: ["Shooter", "Action", "Open World"] },
    { id: 5, slug: "league-of-legends", name: "League of Legends", coverUrl: "https://static-cdn.jtvnw.net/ttv-boxart/21779-600x900.jpg", score: 89, isFavorite: false, genres: ["Strategy", "Action"] },
    { id: 6, slug: "hades-ii", name: "Hades II", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900.jpg", score: 94, isFavorite: true, genres: ["Indie", "Action", "RPG"] },
    { id: 7, slug: "stardew-valley", name: "Stardew Valley", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg", score: 97, isFavorite: true, genres: ["Indie", "Strategy", "RPG"] },
    { id: 8, slug: "valorant", name: "Valorant", coverUrl: "https://static-cdn.jtvnw.net/ttv-boxart/516575-600x900.jpg", score: 85, isFavorite: false, genres: ["FPS", "Shooter", "Strategy"] },
    { id: 9, slug: "baldurs-gate-3", name: "Baldur's Gate 3", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg", score: 98, isFavorite: true, genres: ["RPG", "Strategy", "Open World"] },
    { id: 10, slug: "hollow-knight", name: "Hollow Knight", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg", score: 95, isFavorite: false, genres: ["Indie", "Acción"] },
    { id: 11, slug: "civilization-vi", name: "Civilization VI", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/289070/library_600x900.jpg", score: 88, isFavorite: false, genres: ["Estrategia"] },
    { id: 12, slug: "apex-legends", name: "Apex Legends", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg", score: 84, isFavorite: false, genres: ["Shooter", "FPS", "Acción"] },
    { id: 13, slug: "the-witcher-3", name: "The Witcher 3", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg", score: 93, isFavorite: true, genres: ["RPG", "Mundo Abierto", "Acción"] },
    { id: 14, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg", score: 97, isFavorite: false, genres: ["Acción", "Mundo Abierto", "Shooter"] },
    { id: 15, slug: "overwatch-2", name: "Overwatch 2", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2357570/library_600x900.jpg", score: 79, isFavorite: false, genres: ["Shooter", "FPS", "Acción"] },
    { id: 16, slug: "among-us", name: "Among Us", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945360/library_600x900.jpg", score: 82, isFavorite: false, genres: ["Indie", "Estrategia"] },
    { id: 17, slug: "god-of-war-ragnarok", name: "God of War Ragnarok", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg", score: 94, isFavorite: true, genres: ["Acción", "RPG"] },
    { id: 18, slug: "cod-warzone", name: "Call of Duty: Warzone", coverUrl: "https://static-cdn.jtvnw.net/ttv-boxart/512710-600x900.jpg", score: 80, isFavorite: false, genres: ["Shooter", "FPS"] },
    { id: 19, slug: "celeste", name: "Celeste", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/504230/library_600x900.jpg", score: 92, isFavorite: false, genres: ["Indie"] },
    { id: 20, slug: "terraria", name: "Terraria", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900.jpg", score: 88, isFavorite: true, genres: ["Indie", "Mundo Abierto"] },
    { id: 21, slug: "star-wars-jedi-survivor", name: "Star Wars Jedi: Survivor", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1774580/library_600x900.jpg", score: 85, isFavorite: false, genres: ["Acción", "RPG"] },
    { id: 22, slug: "diablo-iv", name: "Diablo IV", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2344520/library_600x900.jpg", score: 87, isFavorite: false, genres: ["RPG", "Acción"] },
    { id: 23, slug: "xcom-2", name: "XCOM 2", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268500/library_600x900.jpg", score: 91, isFavorite: false, genres: ["Estrategia"] },
    { id: 24, slug: "age-of-empires-iv", name: "Age of Empires IV", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1466860/library_600x900.jpg", score: 86, isFavorite: false, genres: ["Estrategia"] },
    { id: 25, slug: "gta-v", name: "Grand Theft Auto V", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg", score: 96, isFavorite: true, genres: ["Mundo Abierto", "Acción", "Shooter"] },
    { id: 26, slug: "cs2", name: "Counter-Strike 2", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg", score: 83, isFavorite: false, genres: ["FPS", "Shooter"] },
    { id: 27, slug: "palworld", name: "Palworld", coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg", score: 80, isFavorite: false, genres: ["Indie", "Mundo Abierto", "RPG"] }
];

// --- DATOS DETALLADOS ESPECÍFICOS (ELDEN RING) ---
const ELDEN_RING_DETAILED: Partial<ExtendedGameDetail> = {
  storeUrl: "https://store.steampowered.com/app/1245620/Elden_Ring/",
  images: {
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg",
    hero: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_hero.jpg",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_9b9d9727dc02e6e3362153549229e68c857732d5.1920x1080.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_89d363d332a498b3374828340d0f40ceb846e9df.1920x1080.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_27690a229875429c0d1591873739775f0f353665.1920x1080.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_496a75df8a513cb3ee99b3524b09c52253000678.1920x1080.jpg"
    ]
  },
  meta: {
    genres: ["Action RPG", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox"],
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "2022-02-25",
    description_es: "Levántate, Tiznado, y déjate guiar por la gracia para esgrimir el poder del Anillo de Elden y convertirte en un Señor de Elden en las Tierras Intermedias. Explora un vasto mundo lleno de emociones donde los campos abiertos y las inmensas mazmorras se conectan con fluidez.",
    description_en: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. Explore a vast world full of excitement where open fields and huge dungeons connect seamlessly.",
    ageRating: "M (17+)",
    downloadSize: "60 GB",
    controllerSupport: true,
    engine: "Proprietary",
    languages: ["Español", "Inglés", "Japonés", "Francés", "Alemán"],
  },
  playerGrowth14d: [
    { "day": "2025-11-15", "players": 180000 },
    { "day": "2025-11-16", "players": 175000 },
    { "day": "2025-11-17", "players": 190000 },
    { "day": "2025-11-18", "players": 210000 },
    { "day": "2025-11-19", "players": 205000 },
    { "day": "2025-11-20", "players": 220000 },
    { "day": "2025-11-21", "players": 230000 },
    { "day": "2025-11-22", "players": 225000 },
    { "day": "2025-11-23", "players": 235000 },
    { "day": "2025-11-24", "players": 240000 },
    { "day": "2025-11-25", "players": 250000 },
    { "day": "2025-11-26", "players": 255000 },
    { "day": "2025-11-27", "players": 262000 },
    { "day": "2025-11-28", "players": 270000 }
  ],
  kpiSeries: {
    topCountries: [
      { "country": "US", "code": "US", "weight": 21 },
      { "country": "GB", "code": "GB", "weight": 9 },
      { "country": "DE", "code": "DE", "weight": 8 },
      { "country": "JP", "code": "JP", "weight": 7 },
      { "country": "BR", "code": "BR", "weight": 6 }
    ],
    peakPlayers: 953000,
    score: 91,
    currentPlayers: 240000,
    players24hChangePercent: 7.5
  },
  rankingMovement: {
    currentRank: 4,
    change: -1,
    history: [
      { "day": "2025-11-21", "rank": 3 },
      { "day": "2025-11-22", "rank": 3 },
      { "day": "2025-11-23", "rank": 4 },
      { "day": "2025-11-24", "rank": 4 },
      { "day": "2025-11-25", "rank": 4 },
      { "day": "2025-11-26", "rank": 5 },
      { "day": "2025-11-27", "rank": 4 }
    ]
  },
  platformDistribution: [
    { platform: "PC", percent: 54 },
    { platform: "PlayStation", percent: 33 },
    { platform: "Xbox", percent: 13 }
  ],
  retention: { "d1": 68, "d2": 49, "d3": 32 },
  userReviews: {
    total: 125000,
    positivePercent: 84,
    mixedPercent: 11,
    negativePercent: 5,
    starsDistribution: { "5": 72, "4": 18, "3": 6, "2": 3, "1": 1 }
  },
  peakHours: generateHourly(200000) // Simplificado
};

// --- BASE DE DATOS MAESTRA GENERADA ---
const GAMES_DATA: ExtendedGameDetail[] = RAW_GAMES_LIST.map((baseGame) => {
    
    // CASO ESPECIAL: ELDEN RING
    if (baseGame.slug === 'elden-ring') {
        return {
            ...baseGame,
            ...ELDEN_RING_DETAILED as ExtendedGameDetail
        };
    }

    // CASO GENERAL: MOCKS
    const basePlayers = Math.floor(20000 + (baseGame.score * 1500));
    const peak = Math.floor(basePlayers * (1.5 + Math.random()));
    const scoreVal = baseGame.score;

    return {
        ...baseGame,
        storeUrl: "#",
        images: {
            hero: baseGame.coverUrl, 
            cover: baseGame.coverUrl,
            screenshots: [
                baseGame.coverUrl,
                "https://placehold.co/1920x1080/1a1a1a/FFF?text=Gameplay+1",
                "https://placehold.co/1920x1080/2a2a2a/FFF?text=Gameplay+2",
                "https://placehold.co/1920x1080/111/FFF?text=Cinematic"
            ]
        },
        meta: {
            genres: baseGame.genres,
            platforms: ["PC", "PlayStation", "Xbox"],
            developer: "Developer Studios",
            publisher: "Publisher Inc",
            releaseDate: "2023-01-01",
            // Mock description genérico
            description_es: `Descubre el increíble mundo de ${baseGame.name}. Una experiencia única en su género que ha cautivado a millones de jugadores.`,
            description_en: `Discover the incredible world of ${baseGame.name}. A unique experience in its genre that has captivated millions of players.`,
            ageRating: "T",
            downloadSize: "45 GB",
            controllerSupport: true,
            engine: "Unreal Engine 5",
            languages: ["Inglés", "Español"]
        },
        playerGrowth14d: generateTimeline(basePlayers, basePlayers * 0.1),
        kpiSeries: {
            peakPlayers: peak,
            score: scoreVal,
            currentPlayers: basePlayers,
            players24hChangePercent: parseFloat(((Math.random() * 10) - 3).toFixed(1)),
            topCountries: [
                { country: "US", code: "US", weight: 30 },
                { country: "DE", code: "DE", weight: 15 },
                { country: "BR", code: "BR", weight: 10 },
                { country: "FR", code: "FR", weight: 5 }
            ]
        },
        rankingMovement: {
            currentRank: Math.floor(Math.random() * 20) + 1,
            change: Math.floor(Math.random() * 3) - 1,
            history: generateRankHistory(Math.floor(Math.random() * 20) + 1)
        },
        userReviews: {
            positivePercent: Math.min(99, scoreVal + 5),
            mixedPercent: 10,
            negativePercent: Math.max(0, 90 - scoreVal),
            starsDistribution: { "5": 60, "4": 20, "3": 10, "2": 5, "1": 5 }
        },
        platformDistribution: [
            { platform: "PC", percent: 60 },
            { platform: "PlayStation", percent: 30 },
            { platform: "Xbox", percent: 10 }
        ],
        retention: {
             d1: Math.floor(Math.random() * 30) + 40,
             d2: Math.floor(Math.random() * 20) + 30,
             d3: Math.floor(Math.random() * 10) + 20
        },
        peakHours: generateHourly(basePlayers)
    };
});

const PALETTE = {
    CEL_AZUL: '#50a2ff',
    VERDE: '#00FF62',
    AMARILLO: '#efb537',
    LILA: '#b340bf',
    CYAN: '#2DD4E0',
    ROSA: '#f6339a',
    MORADO: '#4530BE',
    DARK_BG: '#171717', 
    GRID_COLOR: '#333'
};

const SYSTEM_REQUIREMENTS = {
    min: { os: "Win 10", cpu: "Core i7-6700 / Ryzen 5 1600", ram: "12 GB", gpu: "GTX 1060 6GB / RX 580" },
    rec: { os: "Win 10/11", cpu: "Core i7-12700 / Ryzen 7 7800X3D", ram: "16 GB", gpu: "RTX 2060 Super / RX 5700 XT" }
};

const TRAFFIC_DATA: { source: string; value: number }[] = [
  { source: 'steam', value: 45 },
  { source: 'direct', value: 20 },
  { source: 'search', value: 15 },
  { source: 'social', value: 20 },
];

// --- COMPONENTES AUXILIARES ---

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        let displayLabel = label;
        if (typeof label === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(label)) {
            const parts = label.split('-');
            displayLabel = `${parts[2]}/${parts[1]}`;
        }

        return (
            <div className="bg-neutral-900 border border-neutral-700 p-2 rounded shadow-xl text-xs z-50">
                <p className="font-bold text-white mb-1 border-b border-white/10 pb-1">{displayLabel}</p>
                <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                        {payload[0].name}: <span className="text-gray-300">{payload[0].value?.toLocaleString()}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CircularMetric = ({ value, displayValue, label, gradientId, colors, icon: Icon }: { value: number, displayValue: string, label: string, gradientId: string, colors: string[], icon: LucideIcon }) => {
    const data = [
        { value: value, fill: `url(#${gradientId})` },
        { value: 100 - value, fill: 'rgba(255,255,255,0.05)' }
    ];
    const hoverColor = colors[1];

    return (
        <div
            className="flex flex-col items-center justify-center p-3 bg-neutral-900/70 rounded-xl border border-neutral-800 shadow-lg transition-all duration-300 h-full"
            style={{ '--hover-color': hoverColor } as React.CSSProperties}
            onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = hoverColor + '80';
                target.style.backgroundColor = hoverColor + '1A';
            }}
            onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(38, 38, 38, 1)'; 
                target.style.backgroundColor = 'rgba(23, 23, 23, 0.7)'; 
            }}
        >
            <div className="relative w-16 h-16 mb-2"> 
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={colors[0]} />
                                <stop offset="100%" stopColor={colors[1]} />
                            </linearGradient>
                        </defs>
                        <Pie 
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={24} 
                            outerRadius={32} 
                            startAngle={90} 
                            endAngle={-270} 
                            dataKey="value" 
                            stroke="none" 
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center drop-shadow-lg">
                    <Icon size={20} style={{ color: colors[1] }} />
                </div>
            </div>
            <div className="text-center">
                <p className="text-lg font-black text-white leading-none">{displayValue}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 font-bold">{label}</p>
            </div>
        </div>
    );
};

const CustomActiveDot = (props: CustomDotProps) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return <circle cx={cx} cy={cy} r={6} fill={PALETTE.ROSA} stroke="#fff" strokeWidth={2} />;
};

const CustomActiveDotGrowth = (props: CustomDotProps) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return <circle cx={cx} cy={cy} r={6} fill={PALETTE.CYAN} stroke="#fff" strokeWidth={2} />;
};

const CustomActiveDotRetention = (props: CustomDotProps) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return <circle cx={cx} cy={cy} r={6} fill={PALETTE.LILA} stroke="#fff" strokeWidth={2} />;
};

const CustomActiveDotRanking = (props: CustomDotProps) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return <circle cx={cx} cy={cy} r={6} fill={PALETTE.AMARILLO} stroke="#fff" strokeWidth={2} />;
};

// --- COMPONENTE RANK MEDAL ---
const RankMedal = ({ rank }: { rank: number }) => {
    if (rank > 3) return <span className="font-bold text-gray-500 w-6 text-center text-sm">{rank}</span>;

    let styles = "";
    if (rank === 1) styles = "bg-[#DEC464] text-neutral-900 shadow-[0_0_10px_rgba(222,196,100,0.3)]"; 
    if (rank === 2) styles = "bg-[#C0C0C0] text-neutral-900 shadow-[0_0_10px_rgba(192,192,192,0.3)]"; 
    if (rank === 3) styles = "bg-[#CD9866] text-neutral-900 shadow-[0_0_10px_rgba(205,152,102,0.3)]"; 
      
    return (
        <div className={`flex items-center justify-center w-6 h-6 rounded-md font-bold text-sm ${styles}`}>
            {rank}
        </div>
    );
};

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState<ExtendedGameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [growthRange, setGrowthRange] = useState<'14d' | '30d' | '90d'>('14d');
  const [activityRange, setActivityRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [platformFilter, setPlatformFilter] = useState<'All' | 'PC' | 'PlayStation' | 'Xbox'>('All');
  const [retentionRange, setRetentionRange] = useState<'3d' | '7d' | '30d'>('3d');
  const [sessionRange, setSessionRange] = useState<'24h' | '7d' | '30d'>('30d');

  const [highlightedRank, setHighlightedRank] = useState<number | null>(null);
  const rankListRef = useRef<HTMLDivElement>(null);
  const rankItemRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const safeUser = { name: 'Valentín', favoritePlatform: 'PC', avatarUrl: '' };

  // 1. OBTENEMOS EL IDIOMA ACTUAL
  const { language } = useLanguage();

  // 2. DICCIONARIO DE TRADUCCIONES PARA LA PAGE
  const translations = {
    en: {
      loading: 'Loading game data...',
      active: 'active',
      viewStore: 'View Store',
      totalPlayers: 'Total Players',
      activeNow: 'Active Now',
      trending: 'Trending',
      peakCap: 'Peak Cap.',
      activity: 'Activity',
      growth: 'Growth',
      players: 'Players',
      topCountries: 'Top Countries',
      platforms: 'Platforms',
      all: 'All',
      marketShare: 'Market Share',
      playerReception: 'Player Reception',
      globalScore: 'Global Score',
      scoreDesc: 'Based on text analysis algorithms of recent reviews.',
      positive: 'Positive',
      mixed: 'Mixed',
      negative: 'Negative',
      breakdown: 'Breakdown',
      globalRanking: 'Global Top Ranking',
      currentRank: 'Current Rank',
      viewRank: 'View my rank',
      retentionCurve: 'Retention Curve',
      rankingHistory: 'Ranking History',
      rankingHistoryDesc: 'Evolution of position in the global ranking.',
      sessionDuration: 'Session Duration',
      acquisitionSources: 'Acquisition Sources',
      aboutGame: 'About the Game',
      noDesc: 'No description available.',
      techSpecs: 'Technical Specs',
      developer: 'Developer',
      publisher: 'Publisher',
      release: 'Release',
      rating: 'Rating',
      size: 'Size',
      control: 'Control',
      engine: 'Engine',
      languages: 'Languages',
      supported: 'supported',
      genres: 'Genres',
      modes: 'Modes',
      gallery: 'Gallery',
      viewFullGallery: 'VIEW FULL GALLERY',
      sysReq: 'System Requirements',
      min: 'Minimum',
      rec: 'Recommended',
      singlePlayer: 'Single Player',
      multiPlayer: 'Multiplayer',
      traffic: { steam: 'Steam', direct: 'Direct', search: 'Search', social: 'Social' },
      retentionDay: 'Day',
      retentionLabel: 'Retention Day'
    },
    es: {
      loading: 'Cargando datos del juego...',
      active: 'activos',
      viewStore: 'Ver en Tienda',
      totalPlayers: 'Total Jugadores',
      activeNow: 'Activos Ahora',
      trending: 'Tendencia',
      peakCap: 'Cap. Máx.',
      activity: 'Actividad',
      growth: 'Crecimiento',
      players: 'Jugadores',
      topCountries: 'Top Países',
      platforms: 'Plataformas',
      all: 'Todos',
      marketShare: 'Cuota de Mercado',
      playerReception: 'Recepción de Jugadores',
      globalScore: 'Score Global',
      scoreDesc: 'Basado en algoritmos de análisis de texto de reviews recientes.',
      positive: 'Positivo',
      mixed: 'Mixto',
      negative: 'Negativo',
      breakdown: 'Desglose',
      globalRanking: 'Top Ranking Global',
      currentRank: 'Posición Actual',
      viewRank: 'Ver mi posición',
      retentionCurve: 'Curva de Retención',
      rankingHistory: 'Historial de Ranking',
      rankingHistoryDesc: 'Evolución de la posición en el ranking global.',
      sessionDuration: 'Duración de Sesiones',
      acquisitionSources: 'Fuentes de Adquisición',
      aboutGame: 'Acerca del Juego',
      noDesc: 'Sin descripción disponible.',
      techSpecs: 'Ficha Técnica',
      developer: 'Desarrollador',
      publisher: 'Editor',
      release: 'Lanzamiento',
      rating: 'Clasificación',
      size: 'Tamaño',
      control: 'Control',
      engine: 'Motor',
      languages: 'Idiomas',
      supported: 'soportados',
      genres: 'Géneros',
      modes: 'Modos',
      gallery: 'Galería',
      viewFullGallery: 'VER GALERÍA COMPLETA',
      sysReq: 'Requisitos del Sistema',
      min: 'Mínimos',
      rec: 'Recomendados',
      singlePlayer: 'Un Jugador',
      multiPlayer: 'Multijugador',
      traffic: { steam: 'Steam', direct: 'Directo', search: 'Buscadores', social: 'Social' },
      retentionDay: 'Día',
      retentionLabel: 'Retención Día'
    }
  };

  const t = translations[language.toLowerCase() as 'en' | 'es'];

  // -- CARGA DE DATOS --
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    
    // Safely extract the slug, handling array or string
    const currentSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    const foundGame = GAMES_DATA.find(g => g.slug === currentSlug);
    
    // Simulamos un pequeño delay para realismo
    const timer = setTimeout(() => {
        if (foundGame) {
            setGame(foundGame);
            setIsFavorite(foundGame.isFavorite || false);
        } else {
            setGame(GAMES_DATA[0]);
            setIsFavorite(GAMES_DATA[0].isFavorite || false);
        }
        setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [params]); // Depend on params object

  const openGallery = (index: number) => setSelectedImageIndex(index);
  const closeGallery = () => setSelectedImageIndex(null);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImageIndex]);
  
  const handleScrollToRank = () => {
      const currentRank = game?.rankingMovement?.currentRank;
      if (currentRank && rankItemRefs.current[currentRank]) {
          setHighlightedRank(currentRank);
          rankItemRefs.current[currentRank]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => setHighlightedRank(null), 3000);
      }
  };
  
  // Wrap safeScreenshots in useMemo to fix linter warning
  const safeScreenshots = useMemo(() => game?.images?.screenshots || [], [game]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => 
      prev === null ? null : (prev + 1) % safeScreenshots.length
    );
  }, [selectedImageIndex, safeScreenshots]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => 
      prev === null ? null : (prev - 1 + safeScreenshots.length) % safeScreenshots.length
    );
  }, [selectedImageIndex, safeScreenshots]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, nextImage, prevImage]);
  
  
  // -- LÓGICA DE GRÁFICOS --
  const growthChartData = useMemo<{ day: string; players: number; }[]>(() => {
      if (!game) return [];
      const baseData = game.playerGrowth14d || [];
      if (growthRange === '14d') return baseData;
      
      const count = growthRange === '30d' ? 30 : 90;
      const result = [];
      const now = new Date();
      let lastPlayers = baseData[baseData.length - 1]?.players || 200000;
      
      for (let i = count; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const randomVal = pseudoRandom(i + (game.id || 0) * 100); 
          const change = Math.floor(randomVal * 20000) - 8000;
          lastPlayers += change;
          if (lastPlayers < 5000) lastPlayers = 5000; 

          result.push({
              day: d.toISOString().split('T')[0],
              players: Math.floor(lastPlayers)
          });
      }
      return result;
  }, [game, growthRange]);

  const activityChartData = useMemo<{ time: string; players: number; }[]>(() => {
    if (!game) return [];
    if (activityRange === '24h') {
        const baseActivity = game.peakHours || [];
        return baseActivity.map(item => ({ time: item.hour, players: item.players }));
    } else {
        const count = activityRange === '7d' ? 7 : 30;
        const result = [];
        const now = new Date();
        const baseValue = game.kpiSeries?.currentPlayers || 100000;
        
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const randomVal = pseudoRandom(i + (game.id || 0) * 50);
            const randomVar = Math.floor(randomVal * (baseValue * 0.2)) - (baseValue * 0.1);
            const players = baseValue + randomVar;
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            result.push({ time: `${day}/${month}`, players: players > 0 ? players : 0 });
        }
        return result;
    }
  }, [game, activityRange]);

  const rankingHistoryData = game?.rankingMovement?.history || [];

  const platformData = useMemo<{ name: string; value: number; color: string; fill: string; }[]>(() => {
    if (!game?.platformDistribution) return [];
    return game.platformDistribution.map(p => ({
        name: p.platform,
        value: p.percent,
        color: p.platform.includes('PC') ? PALETTE.VERDE : p.platform.includes('PlayStation') ? PALETTE.CEL_AZUL : PALETTE.LILA,
        fill: p.platform.includes('PC') ? 'url(#gradPlatPC)' : p.platform.includes('PlayStation') ? 'url(#gradPlatPS5)' : 'url(#gradPlatXbox)'
    }));
  }, [game]);

  const activePlatformData = useMemo(() => {
        if (platformFilter === 'All') return platformData;
        const selected = platformData.find(p => p.name.includes(platformFilter));
        if (!selected) return platformData;
        return [
            { ...selected },
            { name: 'Resto', value: 100 - selected.value, fill: 'rgba(255,255,255,0.05)', color: 'transparent' }
        ];
  }, [platformFilter, platformData]);

  const retentionChartData = useMemo<{ day: string; rate: number; }[]>(() => {
      const baseD1 = game?.retention?.d1 || 68;
      
      if (retentionRange === '3d') {
           return [
               { day: `${t.retentionDay} 1`, rate: baseD1 },
               { day: `${t.retentionDay} 2`, rate: Math.floor(baseD1 * 0.7) },
               { day: `${t.retentionDay} 3`, rate: Math.floor(baseD1 * 0.5) },
           ];
      }
      
      const days = retentionRange === '7d' ? 7 : 30;
      return Array.from({ length: days }, (_, i) => ({
          day: `${t.retentionDay} ${i + 1}`,
          rate: Math.max(5, Math.floor(baseD1 * Math.pow(retentionRange === '7d' ? 0.8 : 0.92, i)))
      }));
  }, [game, retentionRange, t.retentionDay]);
  
  const sessionChartData = useMemo<{ range: string; value: number; }[]>(() => {
    let baseData = [
        { range: '< 1h', value: 15 }, { range: '1-2h', value: 30 }, { range: '2-4h', value: 35 }, { range: '> 4h', value: 20 },
    ];
    if (sessionRange === '24h') baseData = [{ range: '< 1h', value: 25 }, { range: '1-2h', value: 35 }, { range: '2-4h', value: 25 }, { range: '> 4h', value: 15 }];
    return baseData;
  }, [sessionRange]);

  const globalRankingList = useMemo(() => {
      return GAMES_DATA
        .map(g => ({
            pos: g.rankingMovement?.currentRank || 99,
            name: g.name,
            change: g.rankingMovement?.change && g.rankingMovement.change > 0 ? 'up' : (g.rankingMovement?.change ?? 0) < 0 ? 'down' : 'same',
            slug: g.slug
        }))
        .sort((a, b) => a.pos - b.pos)
        .slice(0, 15);
  }, []);

  if (loading || !game) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">{t.loading}</div>;
  }

  // --- VARIABLES PARA UI ---
  const score = game.kpiSeries?.score || 0;
  const currentPlayers = game.kpiSeries?.currentPlayers || 0;
  const rank = game.rankingMovement?.currentRank || '-';
  const totalOwners = Math.floor(currentPlayers * 45); 
  const peakAllTime = game.kpiSeries?.peakPlayers || (currentPlayers * 3); 
  
  const trendingScore = Math.min(99, Math.floor(score + (game.kpiSeries?.players24hChangePercent || 0)));
  const peakCapacity = Math.min(95, Math.floor((currentPlayers / peakAllTime) * 100)) || 65;
  
  const currentRetentionRate = retentionChartData.length > 0 ? retentionChartData[retentionChartData.length - 1].rate : 0;
  const currentRetentionLabel = `${t.retentionLabel} ${retentionChartData.length}`;

  const topCountriesData = game.kpiSeries?.topCountries?.map(c => ({
      name: c.country,
      players: Math.floor(currentPlayers * (c.weight / 100)),
      code: c.code.toLowerCase()
  })) || [];

  const sentimentData: SentimentEntry[] = game.userReviews ? [
      { name: t.positive, value: game.userReviews.positivePercent, fill: 'url(#gradSentimentPos)', color: PALETTE.VERDE },
      { name: t.mixed, value: game.userReviews.mixedPercent, fill: '#666', color: '#666' },
      { name: t.negative, value: game.userReviews.negativePercent, fill: 'url(#gradSentimentNeg)', color: PALETTE.ROSA },
  ] : [];

  // MOCK LOGIC: Descripción localizada si existe
  const displayDescription = language === 'EN' && game.meta?.description_en 
    ? game.meta.description_en 
    : game.meta?.description_es || game.meta?.description;

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Animaciones Globales */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0; /* Start hidden to prevent flash */
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
      `}</style>
      
      {/* ➡️ Header Importado */}
      <Header user={safeUser} />
      
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          {/* ➡️ SIDEBAR */}
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
                <VerticalMenu activeItem="all-games" /> 
             </div>
          </aside>

          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            
            {/* --- HERO SECTION --- */}
            <div className="relative min-h-[60vh] md:h-[50vh] h-auto w-full group rounded-2xl overflow-hidden border border-white/5 animate-fade-up">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${game.images?.hero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />
                </div>

                <div className="relative w-full h-full flex flex-col justify-end pb-6 px-4 md:pb-10 md:px-10 pt-20 md:pt-0">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                    <div 
                      className="w-32 h-48 md:w-52 md:h-72 rounded-xl shadow-2xl bg-cover bg-center border-4 border-neutral-800 flex-shrink-0 animate-fade-up delay-100"
                      style={{ backgroundImage: `url(${game.images?.cover})` }}
                    />

                    <div className="flex-grow space-y-4 mb-2 animate-fade-up delay-200 w-full text-center md:text-left">
                      <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                        {game.meta?.platforms?.map((p: string) => (
                          <span key={p} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10 uppercase tracking-wider">
                            {p}
                          </span>
                        ))}
                      </div>

                      <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                        {game.name}
                      </h1>

                      <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-gray-300 font-medium justify-center md:justify-start">
                        {/* 1. Metascore */}
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#00FF62] hover:bg-[#00FF62]/10 hover:shadow-[0_0_15px_rgba(0,255,98,0.2)] group cursor-default">
                          <Star size={18} className="text-green-400 fill-green-400 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-white font-bold">{score}</span>
                          <span className="text-gray-500 group-hover:text-white transition-colors duration-300">Metascore</span>
                        </div>
                        
                        {/* 2. Rank */}
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#efb537] hover:bg-[#efb537]/10 hover:shadow-[0_0_15px_rgba(239,181,55,0.2)] group cursor-default">
                          <Trophy size={18} style={{ color: PALETTE.AMARILLO }} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:text-white transition-colors duration-300">Rank #{rank}</span>
                        </div>
                        
                        {/* 3. Activos */}
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#50a2ff] hover:bg-[#50a2ff]/10 hover:shadow-[0_0_15px_rgba(80,162,255,0.2)] group cursor-default">
                          <Users size={18} style={{ color: PALETTE.CEL_AZUL }} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:text-white transition-colors duration-300">{currentPlayers.toLocaleString()} {t.active}</span>
                        </div>
                        
                        {/* 4. Fecha */}
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#f6339a] hover:bg-[#f6339a]/10 hover:shadow-[0_0_15px_rgba(246,51,154,0.2)] group cursor-default">
                          <Calendar size={18} style={{ color: PALETTE.ROSA }} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:text-white transition-colors duration-300">{game.meta?.releaseDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex items-center gap-4 mb-2 animate-fade-up delay-300 w-full md:w-auto justify-center">
                        <a 
                            href={game.storeUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-12 flex items-center justify-center whitespace-nowrap px-6 md:px-8 text-sm md:text-base rounded-xl font-bold bg-[#50a2ff] text-white hover:bg-[#50a2ff]/90 transition-all shadow-[0_0_20px_rgba(80,162,255,0.3)] hover:shadow-[0_0_30px_rgba(80,162,255,0.6)] hover:scale-105 active:scale-95 font-sans tracking-wide"
                        >
                            {t.viewStore}
                        </a>
                        
                        <button 
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 group ${
                                isFavorite 
                                ? 'bg-[#f6339a]/20 border-[#f6339a] text-[#f6339a]' 
                                : 'bg-black/40 border-white/10 text-white hover:border-[#f6339a]/50 hover:text-[#f6339a]'
                            }`}
                        >
                            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                  </div>
                </div>
            </div>

            {/* --- DASHBOARD GRID --- */}
            <div className="py-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* COLUMNA PRINCIPAL */}
                <div className="xl:col-span-9 space-y-6">
                  
                  {/* 1. KPIs Circulares */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-200">
                      <CircularMetric 
                        value={75} 
                        displayValue={(totalOwners / 1000000).toFixed(1) + "M+"}
                        label={t.totalPlayers}
                        gradientId="gradTotalOwners"
                        colors={['#4530BE', PALETTE.LILA]}
                        icon={Users}
                      />
                    <CircularMetric 
                        value={45} 
                        displayValue={currentPlayers.toLocaleString()}
                        label={t.activeNow}
                        gradientId="gradActiveNow"
                        colors={[PALETTE.CYAN, PALETTE.VERDE]} 
                        icon={Users2}
                    />
                    <CircularMetric 
                        value={trendingScore} 
                        displayValue={trendingScore + "%"}
                        label={t.trending}
                        gradientId="gradTrending"
                        colors={['#4530BE', '#2DD4E0']}
                        icon={TrendingUp}
                    />
                    <CircularMetric 
                        value={peakCapacity} 
                        displayValue={peakCapacity + "%"}
                        label={t.peakCap}
                        gradientId="gradPeak"
                        colors={[PALETTE.LILA, PALETTE.ROSA]}
                        icon={Trophy}
                    />
                  </div>

                  {/* 2. Actividad vs Crecimiento */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-300">
                      
                      {/* --- ACTIVIDAD CHART --- */}
                      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl w-full h-80 flex flex-col transition-all duration-300 hover:border-[#f6339a] hover:shadow-2xl">
                          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <Clock size={20} style={{ color: PALETTE.ROSA }} /> {t.activity}
                            </h3>
                            <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
                                {['24h', '7d', '30d'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setActivityRange(range as '24h' | '7d' | '30d')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                                            activityRange === range 
                                            ? 'bg-neutral-700 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-neutral-800/50'
                                        }`}
                                    >
                                        {range.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                          </div>

                          <div className="flex-1 w-full min-h-0">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                      <defs>
                                          <linearGradient id="activityChartGradient" x1="0" y1="0" x2="1" y2="0">
                                              <stop offset="0%" stopColor={PALETTE.CYAN} />
                                              <stop offset="50%" stopColor={PALETTE.LILA} />
                                              <stop offset="100%" stopColor={PALETTE.MORADO} />
                                          </linearGradient>
                                          <linearGradient id="activityFillGradient" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor={PALETTE.MORADO} stopOpacity={0.3}/>
                                              <stop offset="95%" stopColor={PALETTE.MORADO} stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                      <XAxis 
                                          dataKey="time" 
                                          stroke="#666" 
                                          fontSize={12} 
                                          tickLine={false} 
                                          axisLine={false} 
                                          dy={10} 
                                          minTickGap={30} 
                                      />
                                      <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: PALETTE.ROSA, strokeWidth: 2 }} />
                                      <Area
                                          type="monotone"
                                          dataKey="players"
                                          name={t.players}
                                          stroke="url(#activityChartGradient)" 
                                          fill="url(#activityFillGradient)"    
                                          fillOpacity={1}
                                          strokeWidth={4}
                                          dot={{ r: 0 }}
                                          activeDot={CustomActiveDot}
                                          animationDuration={1000}
                                      />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* --- CRECIMIENTO CHART --- */}
                      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl w-full h-80 flex flex-col transition-all duration-300 hover:border-[#2DD4E0] hover:shadow-2xl">
                          
                          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <LineChartIcon size={20} style={{ color: PALETTE.CYAN }} /> {t.growth}
                            </h3>
                            <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
                                {['14d', '30d', '90d'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setGrowthRange(range as '14d' | '30d' | '90d')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                                            growthRange === range 
                                            ? 'bg-neutral-700 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-neutral-800/50'
                                        }`}
                                    >
                                        {range.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                          </div>

                          <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthChartData}>
                                    <defs>
                                            <linearGradient id="growthStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={PALETTE.VERDE} />
                                                <stop offset="50%" stopColor={PALETTE.CYAN} />
                                                <stop offset="100%" stopColor={PALETTE.CEL_AZUL} />
                                            </linearGradient>
                                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={PALETTE.CEL_AZUL} stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor={PALETTE.CEL_AZUL} stopOpacity={0}/>
                                            </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis 
                                        dataKey="day" 
                                        stroke="#666" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false}
                                        minTickGap={50} 
                                        tickFormatter={(value) => {
                                            const parts = value.split('-');
                                            if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                                            return value;
                                        }}
                                    />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: PALETTE.CYAN }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="players" 
                                        name={t.players}
                                        stroke="url(#growthStrokeGradient)" 
                                        fillOpacity={1} 
                                        fill="url(#colorGrowth)" 
                                        strokeWidth={4} 
                                        dot={{ r: 0 }} 
                                        activeDot={CustomActiveDotGrowth}
                                        animationDuration={1000} 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                          </div>
                      </div>
                  </div>
                  
                  {/* 3. Países vs Plataformas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-400">
                    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col transition-all duration-300 hover:border-[#b340bf] hover:shadow-2xl">
                        <h3 className="font-bold text-lg mb-4 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                            <Globe size={20} style={{ color: PALETTE.LILA }} /> {t.topCountries}
                        </h3>
                        <ul className="space-y-3 pt-2 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {topCountriesData.map((country, index) => (
                                <li key={country.name} className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                                    <span className="text-gray-400 flex items-center gap-3">
                                        <span className="font-mono text-xs opacity-50 w-3">{index + 1}.</span> 
                                        <img 
                                            src={`https://flagcdn.com/w40/${country.code || 'un'}.png`} 
                                            alt={country.name} 
                                            className="w-6 h-4 object-cover rounded-sm"
                                        />
                                        <span>{country.name}</span>
                                    </span>
                                    <span className="font-medium text-white">{country.players.toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col transition-all duration-300 hover:border-[#50a2ff] hover:shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <Monitor size={20} style={{ color: PALETTE.CEL_AZUL }} /> {t.platforms}
                            </h3>
                            <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
                                {['All', 'PC', 'PlayStation', 'Xbox'].map(plat => (
                                    <button
                                        key={plat}
                                        onClick={() => setPlatformFilter(plat as 'All' | 'PC' | 'PlayStation' | 'Xbox')}
                                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                                            platformFilter === plat
                                            ? 'bg-neutral-700 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-white hover:bg-neutral-800/50' 
                                        }`}
                                    >
                                        {plat === 'All' ? t.all : plat === 'PlayStation' ? 'PS' : plat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 items-center min-h-0">
                            <div className="w-full h-full relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <defs>
                                            <linearGradient id="gradPlatPC" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={PALETTE.CYAN} />
                                                <stop offset="100%" stopColor={PALETTE.VERDE} />
                                            </linearGradient>
                                            <linearGradient id="gradPlatPS5" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={PALETTE.CEL_AZUL} />
                                                <stop offset="100%" stopColor="#2563eb" />
                                            </linearGradient>
                                            <linearGradient id="gradPlatXbox" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={PALETTE.LILA} />
                                                <stop offset="100%" stopColor={PALETTE.ROSA} />
                                            </linearGradient>
                                        </defs>
                                        <Pie 
                                            data={activePlatformData} 
                                            innerRadius={55} 
                                            outerRadius={75} 
                                            paddingAngle={platformFilter === 'All' ? 5 : 0} 
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                            cx="50%"
                                            cy="50%"
                                        >
                                            {activePlatformData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.fill} 
                                                    stroke="none" 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="flex flex-col justify-center gap-3 text-sm px-6">
                                {platformFilter === 'All' ? (
                                    platformData.map((p) => (
                                        <div key={p.name} className="flex justify-between items-center group">
                                            <span className="flex items-center gap-3">
                                                <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: p.color, color: p.color }}></span>
                                                <span className="text-gray-400 group-hover:text-white transition-colors">{p.name}</span>
                                            </span>
                                            <span className="font-bold text-white">{p.value}%</span>
                                        </div>
                                    ))
                                ) : (
                                    (() => {
                                        const selected = platformData.find(p => p.name.includes(platformFilter));
                                        if (!selected) return null;
                                        return (
                                            <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                                                <p className="text-gray-400 text-xs uppercase font-bold mb-1">{t.marketShare}</p>
                                                <p className="text-5xl font-black mb-2 drop-shadow-lg" style={{ color: selected.color }}>
                                                    {selected.value}%
                                                </p>
                                                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-white border border-white/10 font-bold">
                                                    {selected.name}
                                                </span>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* 4. Sentimiento, Estrellas y Ranking */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-up delay-500">
                    
                    {/* Tarjeta de Sentimiento y Puntuación */}
                    <div className="lg:col-span-4 bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between h-80 transition-all duration-300 hover:border-[#00FF62] hover:shadow-2xl">
                        <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                            <Heart size={20} style={{ color: PALETTE.VERDE }} /> {t.playerReception}
                        </h3>
                        
                        <div className="flex items-center justify-between py-4">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <defs>
                                            <linearGradient id="gradSentimentPos" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={PALETTE.VERDE} />
                                                <stop offset="100%" stopColor={PALETTE.CYAN} />
                                            </linearGradient>
                                            <linearGradient id="gradSentimentNeg" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={PALETTE.ROSA} />
                                                <stop offset="100%" stopColor={PALETTE.LILA} />
                                            </linearGradient>
                                        </defs>
                                        <Pie 
                                            data={sentimentData} 
                                            innerRadius={35} 
                                            outerRadius={50} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {sentimentData.map((entry: SentimentEntry, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xl font-bold text-white">{game.userReviews?.positivePercent || 0}%</span>
                                </div>
                            </div>

                            <div className="flex-1 pl-6 space-y-3">
                                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                                    <span>{t.globalScore}</span>
                                    <span className="text-white font-bold">{score} / 100</span>
                                  </div>
                                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${score}%` }}></div>
                                  </div>
                                  <p className="text-xs text-gray-500 italic mt-2">{t.scoreDesc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {sentimentData.map((s: SentimentEntry) => (
                                <div key={s.name} className="bg-neutral-800/50 rounded-lg p-2 text-center border border-white/5">
                                    <p className="text-xs text-gray-400">{s.name}</p>
                                    <p className="font-bold text-white" style={{ color: s.color }}>{s.value}%</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Distribución de Estrellas */}
                    <div className="lg:col-span-4 bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col h-80 transition-all duration-300 hover:border-[#efb537] hover:shadow-2xl">
                        <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                            <Star size={20} style={{ color: PALETTE.AMARILLO }} /> {t.breakdown}
                        </h3>
                        <div className="flex-1 flex flex-col justify-center space-y-3">
                            {['5', '4', '3', '2', '1'].map((stars) => {
                                const percent = game.userReviews?.starsDistribution?.[stars] || 0;
                                
                                let backgroundStyle = '';
                                const starNum = parseInt(stars);
                                
                                if (starNum === 5) {
                                    backgroundStyle = `linear-gradient(90deg, ${PALETTE.AMARILLO}, #ffd700)`;
                                } else if (starNum >= 3) {
                                    backgroundStyle = `linear-gradient(90deg, ${PALETTE.VERDE}, ${PALETTE.CYAN})`;
                                } else {
                                    backgroundStyle = `linear-gradient(90deg, ${PALETTE.ROSA}, ${PALETTE.LILA})`;
                                }

                                return (
                                    <div key={stars} className="group flex items-center gap-3 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1 w-8 justify-end text-gray-400">
                                                <span className="font-bold">{stars}</span>
                                                <Star size={10} className="fill-gray-600 text-gray-600" />
                                            </div>
                                            <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110" 
                                                    style={{ 
                                                        width: `${percent}%`, 
                                                        background: backgroundStyle 
                                                    }} 
                                                />
                                            </div>
                                            <span className="w-8 text-right font-mono text-gray-500">{percent}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ranking List */}
                    <div className="lg:col-span-4 bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col h-80 transition-all duration-300 hover:border-[#efb537] hover:shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <Trophy size={20} style={{ color: PALETTE.AMARILLO }} /> {t.globalRanking}
                            </h3>
                            <button 
                                onClick={handleScrollToRank}
                                className="text-xs bg-neutral-800 hover:bg-[#efb537]/20 hover:text-[#efb537] text-gray-400 px-3 py-1.5 rounded-lg border border-neutral-700 transition-all flex items-center gap-2 font-bold"
                            >
                                <LocateFixed size={14}/> {t.viewRank}
                            </button>
                        </div>

                        <div 
                            ref={rankListRef}
                            className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth relative"
                        >
                            {globalRankingList.map((item) => {
                                const isCurrent = item.slug === game.slug;
                                const isHighlighted = highlightedRank === item.pos;
                                
                                return (
                                    <div 
                                        key={item.slug} 
                                        ref={(el) => { if (el && isCurrent) rankItemRefs.current[item.pos] = el; }}
                                        className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-500 ${
                                            isHighlighted 
                                            ? 'bg-[#efb537]/20 border border-[#efb537]/50 shadow-lg shadow-[#efb537]/10' 
                                            : isCurrent 
                                                ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                : 'hover:bg-neutral-800 border border-transparent'
                                        }`}
                                    >
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 flex justify-center">
                                                    <RankMedal rank={item.pos} />
                                                </div>
                                                <span className={`font-medium ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            {item.change === 'up' && <TrendingUp size={14} className="text-green-500" />}
                                            {item.change === 'down' && <TrendingUp size={14} className="text-red-500 rotate-180" />}
                                            {item.change === 'same' && <div className="w-2 h-0.5 bg-gray-600"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                  </div>
                  
                  {/* 5. Retención y Gráficos Finales */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-600">
                      <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col relative overflow-hidden group transition-all duration-300 hover:border-[#f6339a] hover:shadow-2xl">
                        <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-4 z-10">
                            <div>
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <Users2 size={20} style={{ color: PALETTE.ROSA }} /> {t.retentionCurve}
                                </h3>
                                <div className="flex gap-1 mt-2">
                                    {['3d', '7d', '30d'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setRetentionRange(range as '3d' | '7d' | '30d')}
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all border border-transparent ${
                                                retentionRange === range
                                                ? 'bg-neutral-700 text-white shadow-sm border-white/10' 
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-neutral-800/50'
                                            }`}
                                        >
                                            {range.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white">{currentRetentionRate}%</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{currentRetentionLabel}</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={retentionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                            <linearGradient id="gradRetentionStroke" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={PALETTE.ROSA} />
                                                <stop offset="100%" stopColor={PALETTE.LILA} />
                                            </linearGradient>
                                            <linearGradient id="gradRetentionFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={PALETTE.ROSA} stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor={PALETTE.LILA} stopOpacity={0}/>
                                            </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: PALETTE.ROSA, strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    
                                    <Area 
                                        type="monotone" 
                                        dataKey="rate" 
                                        name={t.players}
                                        stroke="url(#gradRetentionStroke)" 
                                        fill="url(#gradRetentionFill)" 
                                        strokeWidth={4} 
                                        animationDuration={2000}
                                        dot={{ r: 0 }} 
                                        activeDot={CustomActiveDotRetention} 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col relative overflow-hidden group transition-all duration-300 hover:border-[#efb537] hover:shadow-2xl">
                         <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-4 z-10">
                            <div>
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <Trophy size={20} style={{ color: PALETTE.AMARILLO }} /> {t.rankingHistory}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{t.rankingHistoryDesc}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white">#{game.rankingMovement?.currentRank}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.currentRank}</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 z-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={rankingHistoryData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                    <defs>
                                            <linearGradient id="gradRankingStroke" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={PALETTE.AMARILLO} />
                                                <stop offset="50%" stopColor="#ff8f6b" />
                                                <stop offset="100%" stopColor={PALETTE.ROSA} />
                                            </linearGradient>
                                            <linearGradient id="gradRankingFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={PALETTE.AMARILLO} stopOpacity={0.6}/>
                                                <stop offset="50%" stopColor={PALETTE.AMARILLO} stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor={PALETTE.ROSA} stopOpacity={0}/>
                                            </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis 
                                        dataKey="day" 
                                        stroke="#666" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        dy={10} 
                                        tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')}
                                    />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} reversed={true} domain={['dataMin - 1', 'dataMax + 1']} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: PALETTE.AMARILLO, strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="rank" 
                                        name="Rank"
                                        stroke="url(#gradRankingStroke)" 
                                        fill="url(#gradRankingFill)"
                                        strokeWidth={4} 
                                        dot={{ r: 0 }} 
                                        activeDot={CustomActiveDotRanking}
                                        baseValue="dataMax"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                      </div>
                  </div>
                  
                  {/* Métricas Adicionales */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-up delay-600">
                      <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col relative overflow-hidden group transition-all duration-300 hover:border-[#50a2ff] hover:shadow-2xl">
                          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <Timer size={20} style={{ color: PALETTE.CEL_AZUL }} /> {t.sessionDuration}
                            </h3>
                            <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
                                {['24h', '7d', '30d'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setSessionRange(range as '24h' | '7d' | '30d')}
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all border border-transparent ${
                                            sessionRange === range
                                            ? 'bg-neutral-700 text-white shadow-sm border-white/10' 
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-neutral-800/50'
                                        }`}
                                    >
                                        {range.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                          </div>

                          <div className="flex-1 w-full min-h-0">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={sessionChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="gradSession" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PALETTE.CYAN} />
                                        <stop offset="100%" stopColor={PALETTE.CEL_AZUL} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="range" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="value" name="%" radius={[4, 4, 0, 0]} barSize={60} fill="url(#gradSession)">
                                      { }
                                      <LabelList 
                                        dataKey="value" 
                                        position="top" 
                                        fill="white" 
                                        fontSize={12} 
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(val: any) => typeof val === 'number' ? `${val}%` : String(val)} 
                                      />
                                    </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* Fuentes de Tráfico */}
                        <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800 shadow-xl h-80 flex flex-col relative overflow-hidden group transition-all duration-300 hover:border-[#00FF62] hover:shadow-2xl">
                            <h3 className="font-bold text-lg mb-2 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                            <Target size={20} style={{ color: PALETTE.VERDE }} /> {t.acquisitionSources}
                            </h3>
                            
                            <div className="flex-1 w-full min-h-0 flex items-center">
                                <div className="w-1/2 h-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius="30%" 
                                            outerRadius="80%" 
                                            barSize={15} 
                                            data={TRAFFIC_DATA.map(d => ({
                                                ...d,
                                                fill: d.source === 'steam' ? 'url(#gradRadialViolet)' : 
                                                    d.source === 'direct' ? 'url(#gradRadialGreen)' :  
                                                    d.source === 'search' ? 'url(#gradRadialCyan)' : 
                                                    'url(#gradRadialPink)' 
                                            })).reverse()} 
                                            startAngle={90} 
                                            endAngle={-270}
                                        >
                                            <defs>
                                                <linearGradient id="gradRadialViolet" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={PALETTE.MORADO} />
                                                    <stop offset="100%" stopColor={PALETTE.LILA} />
                                                </linearGradient>
                                                <linearGradient id="gradRadialGreen" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={PALETTE.VERDE} />
                                                    <stop offset="100%" stopColor="#10b981" />
                                                </linearGradient>
                                                <linearGradient id="gradRadialCyan" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={PALETTE.CYAN} />
                                                    <stop offset="100%" stopColor={PALETTE.CEL_AZUL} />
                                                </linearGradient>
                                                <linearGradient id="gradRadialPink" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={PALETTE.ROSA} />
                                                    <stop offset="100%" stopColor="#be185d" />
                                                </linearGradient>
                                            </defs>
                                            <RadialBar
                                                background={{ fill: '#333' }}
                                                dataKey="value"
                                                cornerRadius={10}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={false} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                        <Globe size={24} className="text-gray-500 animate-pulse" />
                                    </div>
                                </div>

                                <div className="w-1/2 pl-4 flex flex-col justify-center gap-3">
                                    {TRAFFIC_DATA.map((item) => {
                                        let color = PALETTE.MORADO;
                                        if(item.source === 'steam') { color = PALETTE.LILA; } 
                                        if(item.source === 'direct') { color = PALETTE.VERDE; } 
                                        if(item.source === 'search') { color = PALETTE.CYAN; } 
                                        if(item.source === 'social') { color = PALETTE.ROSA; } 

                                        return (
                                            <div key={item.source} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                                {t.traffic[item.source as keyof typeof t.traffic]}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
                                                            <div className="h-full rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out" style={{ width: `${item.value}%`, backgroundColor: color }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                  </div>
                </div>

                {/* SIDEBAR DERECHO */}
                <aside className="xl:col-span-3 flex flex-col gap-6 h-full animate-fade-up delay-600">
                  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl flex-1 min-h-[200px]">
                      <h3 className="font-bold text-lg mb-4 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                         <Info size={18} className="text-gray-400"/> {t.aboutGame}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                          {displayDescription || t.noDesc}
                      </p>
                  </div>
                  
                  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-auto flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl">
                      <h3 className="font-bold text-lg mb-4 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                         <FileText size={18} className="text-gray-400"/> {t.techSpecs}
                      </h3>
                      <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex justify-between">
                          <span>{t.developer}</span>
                          <span className="text-white font-medium">{game.meta?.developer}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.publisher}</span>
                          <span className="text-white font-medium">{game.meta?.publisher}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.release}</span>
                          <span className="text-white font-medium">{game.meta?.releaseDate}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.rating}</span>
                          <span className="text-white font-medium flex items-center gap-1"><Shield size={12}/> {game.meta?.ageRating || "M (17+)"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.size}</span>
                          <span className="text-white font-medium flex items-center gap-1"><HardDrive size={12}/> {game.meta?.downloadSize || "60 GB"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.control}</span>
                          <span className="text-white font-medium flex items-center gap-1"><Gamepad2 size={12}/> {game.meta?.controllerSupport ? "Total" : "Parcial"}</span>
                        </li>
                          <li className="flex justify-between">
                          <span>{t.engine}</span>
                          <span className="text-white font-medium flex items-center gap-1"><Box size={12}/> {game.meta?.engine || "Proprietary"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t.languages}</span>
                          <span className="text-white font-medium flex items-center gap-1"><Languages size={12}/> {game.meta?.languages?.length || "12"} {t.supported}</span>
                        </li>

                        <li className="pt-2">
                          <span className="block mb-2">{t.genres}</span>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {game.meta?.genres?.map((g: string) => (
                              <span key={g} className="px-2 py-1 bg-neutral-800 rounded text-xs text-gray-300 border border-[#b340bf]/50">{g}</span>
                            ))}
                          </div>
                        </li>
                          <li className="pt-2">
                          <span className="block mb-2">{t.modes}</span>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {game.meta?.gameModes?.map((m: string) => (
                              <span key={m} className="px-2 py-1 bg-neutral-800 rounded text-xs text-gray-300 border border-[#50a2ff]/50">{m}</span>
                            )) || [t.singlePlayer, t.multiPlayer].map(m => <span key={m} className="px-2 py-1 bg-neutral-800 rounded text-xs text-gray-300 border border-[#50a2ff]/50">{m}</span>)}
                          </div>
                        </li>
                      </ul>
                  </div>

                  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-96 flex flex-col group/card transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-white border-b border-neutral-800 pb-2 flex-grow flex items-center gap-2">
                            <ImageIcon size={18} className="text-gray-400"/> {t.gallery}
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 mb-4">
                        {Array.from({ length: 4 }).map((_, i) => {
                            const src = safeScreenshots[i] || game.images?.screenshots?.[i];
                            return (
                                <div 
                                    key={i} 
                                    className="relative rounded-xl overflow-hidden cursor-pointer group/img border border-white/5 hover:border-white/20 transition-colors bg-neutral-800 aspect-video w-full" 
                                    onClick={() => openGallery(i)}
                                >
                                    {src ? (
                                        <>
                                            <img 
                                                src={src} 
                                                alt={`Gameplay screenshot ${i + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/0 transition-colors duration-300" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
                                            <ImageIcon size={24} className="text-neutral-700" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={() => openGallery(0)} 
                        className="w-full py-3 bg-neutral-800 border border-neutral-700 text-gray-300 rounded-xl transition-all duration-300 font-bold tracking-wide text-xs flex items-center justify-center gap-2 group/btn shadow-lg hover:bg-[#f6339a] hover:border-[#f6339a] hover:text-white hover:shadow-[0_0_30px_rgba(246,51,154,0.6)]"
                    >
                        <ImageIcon size={16} className="group-hover/btn:scale-110 transition-transform" />
                        {t.viewFullGallery}
                    </button>
                  </div>

                  <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-auto flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl">
                      <h3 className="font-bold text-lg mb-4 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                         <Monitor size={18} className="text-gray-400"/> {t.sysReq}
                      </h3>
                      
                      <div className="flex flex-col justify-center gap-8 px-2 py-4 h-full"> 
                        
                        <div className="flex flex-col gap-3">
                           <p className="font-bold text-gray-500 uppercase tracking-wide text-xs border-b border-neutral-800 pb-2 mb-1">{t.min}</p>
                           <div className="space-y-5">
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><Cpu size={16}/> CPU</div>
                                   <div className="text-gray-300 font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.min.cpu}</div>
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><Zap size={16}/> RAM</div>
                                   <div className="text-gray-300 font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.min.ram}</div>
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><HardDrive size={16}/> GPU</div>
                                   <div className="text-gray-300 font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.min.gpu}</div>
                               </div>
                           </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                           <p className="font-bold text-[#50a2ff] uppercase tracking-wide text-xs border-b border-neutral-800 pb-2 mb-1">{t.rec}</p>
                           <div className="space-y-5">
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><Cpu size={16} className="text-[#50a2ff]"/> CPU</div>
                                   <div className="text-white font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.rec.cpu}</div>
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><Zap size={16} className="text-[#50a2ff]"/> RAM</div>
                                   <div className="text-white font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.rec.ram}</div>
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm uppercase"><HardDrive size={16} className="text-[#50a2ff]"/> GPU</div>
                                   <div className="text-white font-medium text-base leading-tight">{SYSTEM_REQUIREMENTS.rec.gpu}</div>
                               </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </aside>

            </div>

            {/* --- LIGHTBOX (MODAL DE GALERÍA) --- */}
            {selectedImageIndex !== null && safeScreenshots && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300" onClick={closeGallery}>
                    
                    <button 
                        onClick={closeGallery} 
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110]"
                    >
                        <X size={24} />
                    </button>

                    <button 
                        onClick={prevImage} 
                        className="absolute left-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110] hidden md:block"
                    >
                        <ChevronLeft size={36} />
                    </button>

                    <div className="relative max-w-[90vw] max-h-[90vh] shadow-2xl rounded-lg overflow-hidden z-[105]" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={safeScreenshots[selectedImageIndex]} 
                            alt={`Screenshot ${selectedImageIndex + 1}`} 
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm bg-black/50 py-2 backdrop-blur-sm">
                            {selectedImageIndex + 1} / {safeScreenshots.length}
                        </div>
                    </div>

                    <button 
                        onClick={nextImage} 
                        className="absolute right-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110] hidden md:block"
                    >
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}