'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Search, User, Settings, Clock, Trophy, Gamepad2, MapPin, Calendar, Edit2, Medal, Users, Activity, Zap, Crown, Swords, X, Star, Shield, Target, Flame, MessageCircle, MoreHorizontal, Camera, ChevronLeft, Check
} from 'lucide-react';
import { VerticalMenu } from '@/components/VerticalMenu';
import { Header } from '@/components/Header';

// --- PALETA GAMELENS ---
const PALETTE = {
  CEL_AZUL: '#50a2ff',
  VERDE: '#00FF62',
  AMARILLO: '#efb537',
  LILA: '#b340bf',
  VIOLETA: '#a855f7',
  CYAN: '#2DD4E0',
  ROSA: '#f6339a',
  MORADO: '#4530BE',
  ROJO: '#FF4444',
  BLANCO: '#FFFFFF',
  GRIS: '#9CA3AF'
};

// --- HELPER: Formatear números grandes ---
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
  return num.toString();
};

// --- DATOS MOCK ---
const allAchievements = [
  { id: 1, title: "Elden Lord", game: "Elden Ring", description: "Obtén todos los demás trofeos.", icon: Crown, color: PALETTE.AMARILLO, date: "2 horas atrás", rarity: "Legendario (0.4%)" },
  { id: 2, title: "Legend of Night City", game: "Cyberpunk 2077", description: "Completa la historia principal.", icon: Zap, color: PALETTE.VERDE, date: "1 día atrás", rarity: "Épico (12%)" },
  { id: 3, title: "God Slayer", game: "Hades II", description: "Derrota a Chronos sin recibir daño.", icon: Swords, color: PALETTE.ROSA, date: "3 días atrás", rarity: "Ultra Raro (2.1%)" },
  { id: 4, title: "Survivor", game: "Minecraft", description: "Sobrevive 100 días en Hardcore.", icon: Trophy, color: PALETTE.CEL_AZUL, date: "1 semana atrás", rarity: "Raro (5.5%)" },
  { id: 5, title: "Ace", game: "Valorant", description: "Elimina a todo el equipo enemigo tú solo.", icon: Target, color: PALETTE.VIOLETA, date: "2 semanas atrás", rarity: "Épico (8%)" },
  { id: 6, title: "Speed Demon", game: "Forza Horizon 5", description: "Alcanza 400km/h en cualquier coche.", icon: Flame, color: PALETTE.VERDE, date: "3 semanas atrás", rarity: "Común (45%)" },
  { id: 7, title: "Master Architect", game: "Satisfactory", description: "Construye el Elevador Espacial Fase 4.", icon: Settings, color: PALETTE.CEL_AZUL, date: "1 mes atrás", rarity: "Raro (15%)" },
  { id: 8, title: "Immortal", game: "Dota 2", description: "Gana una partida sin morir.", icon: Shield, color: PALETTE.AMARILLO, date: "1 mes atrás", rarity: "Legendario (1.2%)" },
  { id: 9, title: "Completionist", game: "Stardew Valley", description: "Envía cada objeto posible.", icon: Star, color: PALETTE.ROSA, date: "2 meses atrás", rarity: "Ultra Raro (0.8%)" },
  { id: 10, title: "Dragonborn", game: "Skyrim", description: "Absorbe 20 almas de dragón.", icon: Crown, color: PALETTE.VERDE, date: "3 meses atrás", rarity: "Común (60%)" },
  { id: 11, title: "Tactician", game: "Baldur's Gate 3", description: "Completa el juego en modo Honor.", icon: Zap, color: PALETTE.AMARILLO, date: "4 meses atrás", rarity: "Legendario (0.1%)" },
  { id: 12, title: "Parkour Master", game: "Dying Light 2", description: "Completa todos los desafíos nocturnos.", icon: Activity, color: PALETTE.CEL_AZUL, date: "5 meses atrás", rarity: "Raro (10%)" },
];

const allActivity = [
  { id: 1, name: "Elden Ring", slug: "elden-ring", action: "Jugando ahora", time: "En línea", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", hours: "124h" },
  { id: 4, name: "Fortnite", slug: "fortnite", action: "Jugó hace", time: "2 horas", cover: "https://static-cdn.jtvnw.net/ttv-boxart/33214-600x900.jpg", hours: "850h" },
  { id: 9, name: "Baldur's Gate 3", slug: "baldurs-gate-3", action: "Jugó hace", time: "1 día", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg", hours: "62h" },
  { id: 15, name: "Red Dead Redemption 2", slug: "rdr2", action: "Jugó hace", time: "3 días", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg", hours: "200h" },
  { id: 22, name: "God of War", slug: "gow", action: "Jugó hace", time: "1 semana", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg", hours: "45h" },
  { id: 33, name: "Hollow Knight", slug: "hollow-knight", action: "Jugó hace", time: "2 semanas", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg", hours: "30h" },
  { id: 44, name: "Terraria", slug: "terraria", action: "Jugó hace", time: "1 mes", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg", hours: "410h" },
  { id: 55, name: "Apex Legends", slug: "apex", action: "Jugó hace", time: "2 meses", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg", hours: "1200h" },
];

const allFavorites = [
  { id: 2, name: "Cyberpunk 2077", slug: "cyberpunk-2077", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg" },
  { id: 13, name: "The Witcher 3", slug: "the-witcher-3", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg" },
  { id: 25, name: "GTA V", slug: "gta-v", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg" },
  { id: 6, name: "Hades II", slug: "hades-ii", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900.jpg" },
  { id: 1, name: "Elden Ring", slug: "elden-ring", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg" },
  { id: 4, name: "Red Dead Redemption 2", slug: "rdr2", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg" },
  { id: 5, name: "God of War", slug: "god-of-war", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900.jpg" },
  { id: 7, name: "Hollow Knight", slug: "hollow-knight", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg" },
  { id: 8, name: "Stardew Valley", slug: "stardew-valley", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg" },
  { id: 9, name: "Terraria", slug: "terraria", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900.jpg" },
  { id: 10, name: "Baldur's Gate 3", slug: "baldurs-gate-3", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg" },
  { id: 11, name: "Sekiro: Shadows Die Twice", slug: "sekiro", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg" },
];

const allFriends = [
  { id: 1, name: "AnaGamer", status: "Jugando Valorant", isOnline: true, level: 45 },
  { id: 2, name: "DarkSoul_99", status: "En línea", isOnline: true, level: 32 },
  { id: 6, name: "Luci_Sky", status: "Jugando Minecraft", isOnline: true, level: 28 },
  { id: 7, name: "KratosFan", status: "En línea", isOnline: true, level: 50 },
  { id: 3, name: "PixelArtist", status: "Hace 5m", isOnline: false, level: 12 },
  { id: 8, name: "NoobMaster", status: "Hace 15m", isOnline: false, level: 5 },
  { id: 4, name: "SpeedRunnerX", status: "Hace 2h", isOnline: false, level: 99 },
  { id: 5, name: "RetroGamer", status: "Hace 1d", isOnline: false, level: 64 },
  { id: 9, name: "NinjaTurtle", status: "Hace 2d", isOnline: false, level: 21 },
  { id: 10, name: "StarWalker", status: "Hace 1 sem", isOnline: false, level: 33 },
  { id: 11, name: "CosmicRay", status: "Hace 1 mes", isOnline: false, level: 18 },
  { id: 12, name: "GlitchUser", status: "Desconectado", isOnline: false, level: 7 },
];

// --- OPCIONES DE BANNERS PREDEFINIDOS (Juegos Populares) ---
const BANNER_OPTIONS = [
  { id: 'b1', name: 'Elden Ring', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg' },
  { id: 'b2', name: 'Cyberpunk 2077', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg' },
  { id: 'b3', name: 'Hades II', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_hero.jpg' },
  { id: 'b4', name: 'Baldurs Gate 3', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_hero.jpg' },
  { id: 'b5', name: 'Hollow Knight', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_hero.jpg' },
  { id: 'b6', name: 'Stardew Valley', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_hero.jpg' }
];

// --- OPCIONES DE AVATARES PERSONALIZADOS (SVG DATA URIs) ---
const AVATAR_OPTIONS = [
  { 
    id: 'a1', 
    name: 'Cyber Blue', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjNTBhMmZmIi8+PHJlY3QgeD0iMjUiIHk9IjM1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iNjAiIHk9IjM1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMzAiIHk9IjcwIiB3aWR0aD0iNDAiIGhlaWdodD0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
  },
  { 
    id: 'a2', 
    name: 'Pixel Green', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjMDBGRjYyIi8+PHJlY3QgeD0iMjAiIHk9IjMwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iNjAiIHk9IjMwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMjAiIHk9IjcwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iNzAiIHk9IjYwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9ImJsYWNrIi8+PC9zdmc+'
  },
  { 
    id: 'a3', 
    name: 'Ghost Purple', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjYTg1NWY3Ii8+PGNpcmNsZSBjeD0iMzUiIGN5PSI0MCIgcj0iOCIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjQwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNzAiIHI9IjEyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=='
  },
  { 
    id: 'a4', 
    name: 'Red Rival', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjRkY0NDQ0Ii8+PHBhdGggZD0iTTI1IDM1IEw0NSA1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNNzUgMzUgTDU1IDUwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxyZWN0IHg9IjMwIiB5PSI3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
  },
  { 
    id: 'a5', 
    name: 'Yellow Star', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjZWZiNTM3Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iMTUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI0MCIgcj0iMTUiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTMwIDcwIFE1MCA5MCA3MCA3MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIi8+PC9zdmc+'
  },
  { 
    id: 'a6', 
    name: 'Pink Heart', 
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9MTAwIiBmaWxsPSIjZjYzMzlhIi8+PHBhdGggZD0iTTUwIDgwIEwyMCA1MCBRMTAgNDAgMjAgMzAgUTMwIDIwIDQwIDMwIEw1MCA0MCBMNjAgMzAgUTcwIDIwIDgwIDMwIFE5MCA0MCA4MCA1MCBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=='
  },
  // Opción por defecto/vacía
  { id: 'a0', name: 'Default', url: '' } 
];

// --- DATOS INICIALES DEL PERFIL ---
const initialUserProfile = {
  id: 101,
  name: "Valentín",
  tag: "@valentin_dev",
  bio: "Amante de los RPGs de mundo abierto y los shooters competitivos. Siempre buscando el próximo 100%.",
  avatarUrl: "", 
  coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg",
  location: "Argentina",
  joinDate: "Nov 2023",
  favoritePlatform: "PC",
  level: 42,
  stats: {
    gamesOwned: 148,
    hoursPlayed: 3450,
    achievements: 1250,
    friends: 86
  },
  recentActivity: allActivity.slice(0, 3), 
  favorites: allFavorites.slice(0, 4),
  achievements: allAchievements.slice(0, 4),
  friendsList: allFriends.slice(0, 8),
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
   
  const [userProfile, setUserProfile] = useState(initialUserProfile);

  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);
   
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [editForm, setEditForm] = useState(initialUserProfile);
  const [selectingMedia, setSelectingMedia] = useState<'cover' | 'avatar' | null>(null);

  const [friendSearch, setFriendSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
          setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showAchievementsModal || showActivityModal || showFavoritesModal || showFriendsModal || showEditProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showAchievementsModal, showActivityModal, showFavoritesModal, showFriendsModal, showEditProfileModal]);

  const handleOpenEditModal = () => {
    setEditForm(userProfile);
    setSelectingMedia(null);
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setShowEditProfileModal(false);
  };

  const handleMediaSelect = (url: string) => {
      if (selectingMedia === 'cover') {
          setEditForm({ ...editForm, coverUrl: url });
      } else if (selectingMedia === 'avatar') {
          setEditForm({ ...editForm, avatarUrl: url });
      }
      setSelectingMedia(null);
  };

  const filteredFriends = allFriends.filter(friend => 
    friend.name.toLowerCase().includes(friendSearch.toLowerCase())
  );

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white bg-[#131119]">Cargando perfil...</div>;
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
      <style jsx global>{`
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-pop {
          animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* --- ANIMACIONES DE CARGA (Fade In Up) --- */
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
          opacity: 0; /* Comienza oculto para evitar flash */
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }

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
      `}</style>

      {showEditProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowEditProfileModal(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#131119] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
            
            {/* Header Modal Editar */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A20]">
              <div className="flex items-center gap-3">
                 {selectingMedia && (
                     <button 
                        onClick={() => setSelectingMedia(null)}
                        className="mr-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                     >
                         <ChevronLeft size={24} className="text-white" />
                     </button>
                 )}
                 <h2 className="text-xl font-black text-white">
                     {selectingMedia === 'cover' ? 'Elige una Portada' : selectingMedia === 'avatar' ? 'Elige un Avatar' : 'Editar Perfil'}
                 </h2>
              </div>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body Scrollable Editar */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#131119] no-scrollbar">
               
               {selectingMedia === 'cover' ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {BANNER_OPTIONS.map((banner) => (
                           <div 
                             key={banner.id}
                             onClick={() => handleMediaSelect(banner.url)}
                             className={`relative h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${editForm.coverUrl === banner.url ? 'border-green-500' : 'border-transparent hover:border-white/30'}`}
                           >
                               <Image src={banner.url} alt={banner.name} fill className="object-cover" unoptimized />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <span className="font-bold text-white text-sm">{banner.name}</span>
                               </div>
                               {editForm.coverUrl === banner.url && (
                                   <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                                            <Check size={14} className="text-black" />
                                   </div>
                               )}
                           </div>
                       ))}
                   </div>

               ) : selectingMedia === 'avatar' ? (
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                       {AVATAR_OPTIONS.map((avatar) => (
                           <div 
                             key={avatar.id}
                             onClick={() => handleMediaSelect(avatar.url)}
                             className="flex flex-col items-center gap-2 cursor-pointer group"
                           >
                               <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${editForm.avatarUrl === avatar.url ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-white/10 group-hover:border-white/50'}`}>
                                    {avatar.url ? (
                                        <Image src={avatar.url} alt={avatar.name} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                            <User size={32} className="text-gray-500" />
                                        </div>
                                    )}
                                    {editForm.avatarUrl === avatar.url && (
                                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                            <Check size={24} className="text-green-500 font-bold drop-shadow-md" />
                                        </div>
                                    )}
                               </div>
                               <span className={`text-xs font-medium ${editForm.avatarUrl === avatar.url ? 'text-green-500' : 'text-gray-400 group-hover:text-white'}`}>
                                   {avatar.name}
                               </span>
                           </div>
                       ))}
                   </div>

               ) : (
                   // FORMULARIO PRINCIPAL
                   <>
                        {/* 1. Imagen de Portada (Preview Editable) */}
                       <div 
                          className="relative w-full h-32 md:h-40 rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
                          onClick={() => setSelectingMedia('cover')}
                       >
                          <Image 
                            src={editForm.coverUrl} 
                            alt="Cover Preview" 
                            fill 
                            className="object-cover" 
                            unoptimized 
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex flex-col items-center text-white">
                                  <Camera size={24} className="mb-1" />
                                  <span className="text-xs font-bold uppercase tracking-wide">Cambiar Portada</span>
                              </div>
                          </div>
                       </div>

                       {/* 2. Avatar (Preview Editable) */}
                       <div className="relative -mt-12 ml-4 w-24 h-24 rounded-full p-1 bg-[#131119]">
                          <div 
                            className="w-full h-full rounded-full overflow-hidden relative group cursor-pointer border border-white/10"
                            onClick={() => setSelectingMedia('avatar')}
                          >
                            {editForm.avatarUrl ? (
                                <Image src={editForm.avatarUrl} alt="Avatar Preview" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                    <User size={32} className="text-gray-500" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                                <Camera size={20} className="text-white" />
                            </div>
                          </div>
                       </div>

                       {/* 3. Inputs */}
                       <div className="mt-6 space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nombre Visible</label>
                                  <input 
                                    type="text" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                    className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Tag (ID)</label>
                                  <div className="relative">
                                      <input 
                                        type="text" 
                                        defaultValue={editForm.tag} 
                                        disabled
                                        className="w-full bg-[#1A1A20]/50 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                                      />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">No editable</span>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Biografía</label>
                              <textarea 
                                value={editForm.bio} 
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                rows={3}
                                className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Ubicación</label>
                              <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                  <input 
                                    type="text" 
                                    value={editForm.location} 
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="w-full bg-[#1A1A20] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                  />
                              </div>
                          </div>
                       </div>
                   </>
               )}

            </div>

            {/* Footer Modal Editar */}
            {!selectingMedia && (
                <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end gap-3">
                <button 
                    onClick={() => setShowEditProfileModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                >
                    Guardar Cambios
                </button>
                </div>
            )}
            
            {/* Footer alternativo para selección (solo botón cancelar/volver) */}
            {selectingMedia && (
                <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end">
                    <button 
                        onClick={() => setSelectingMedia(null)}
                        className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        Volver
                    </button>
                </div>
            )}

          </div>
        </div>
      )}

      {showAchievementsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowAchievementsModal(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#131119] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A20]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                   <Trophy size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">Logros Desbloqueados</h2>
                  <p className="text-sm text-gray-400 mt-1">Total: <span className="text-white font-bold">{userProfile.stats.achievements}</span></p>
                </div>
              </div>
              <button 
                onClick={() => setShowAchievementsModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#131119] no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allAchievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className="group flex gap-4 p-4 rounded-2xl bg-[#1A1A20] border border-white/5 hover:border-white/10 hover:bg-[#202028] transition-all duration-300 overflow-hidden relative"
                  >
                      
                    <div 
                      className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${ach.color}20, transparent)`,
                        border: `1px solid ${ach.color}40`
                      }}
                    >
                      <ach.icon size={32} style={{ color: ach.color }} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-lg leading-tight truncate pr-2">{ach.title}</h4>
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-[0_0_10px_-4px_currentColor]"
                          style={{ borderColor: `${ach.color}60`, color: ach.color, backgroundColor: `${ach.color}10` }}
                        >
                          {ach.rarity.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1 mb-0.5">{ach.game}</p>
                      <p className="text-sm text-gray-300 line-clamp-1">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowAchievementsModal(false)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showActivityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowActivityModal(false)}
          />
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#131119] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
            
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A20]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                   <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">Historial de Actividad</h2>
                  <p className="text-sm text-gray-400 mt-1">Últimos juegos jugados</p>
                </div>
              </div>
              <button 
                onClick={() => setShowActivityModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#131119] no-scrollbar">
              <div className="space-y-3">
                {allActivity.map((game) => (
                  <div 
                    key={game.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A20] border border-white/5 hover:border-blue-500/30 hover:bg-[#1e1e26] transition-all duration-300 group"
                  >
                      <div className="relative w-28 h-16 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:shadow-blue-500/10 transition-shadow">
                         <Image src={game.cover} alt={game.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-lg truncate group-hover:text-blue-400 transition-colors">{game.name}</h4>
                            <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                              {game.hours} total
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                             {game.time === 'En línea' ? (
                               <>
                                 <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                 </span>
                                 <span className="text-green-400 font-medium">Jugando ahora</span>
                               </>
                             ) : (
                               <span>{game.action} <span className="text-gray-200 font-bold">{game.time}</span></span>
                             )}
                          </p>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowActivityModal(false)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFavoritesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowFavoritesModal(false)}
          />
          <div className="relative w-full max-w-5xl max-h-[85vh] bg-[#131119] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A20]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500">
                   <Heart size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">Juegos Favoritos</h2>
                  <p className="text-sm text-gray-400 mt-1">Tu colección personal</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFavoritesModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#131119] no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allFavorites.map((game) => (
                  <Link 
                    href={`/game/${game.slug}`} 
                    key={game.id}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 transition-transform duration-300 ease-out group shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
                  >
                    <Image 
                      src={game.cover} 
                      alt={game.name} 
                      fill 
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      unoptimized 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-sm font-bold text-white leading-tight w-full">{game.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowFavoritesModal(false)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFriendsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowFriendsModal(false)}
          />
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#131119] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
            
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A20]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500">
                   <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">Lista de Amigos</h2>
                  <p className="text-sm text-gray-400 mt-1">{allFriends.length} amigos en total</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFriendsModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-4 bg-[#131119] sticky top-0 z-10 border-b border-white/5">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar amigos..." 
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="w-full bg-[#1A1A20] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#131119] no-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <div 
                      key={friend.id}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group"
                    >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                              <User size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                          {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#131119] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold text-white text-base truncate">{friend.name}</h4>
                             <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">Lvl {friend.level}</span>
                          </div>
                          <p className={`text-sm truncate ${friend.isOnline ? 'text-green-400 font-medium' : 'text-gray-500'}`}>
                             {friend.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Enviar mensaje">
                             <MessageCircle size={18} />
                          </button>
                          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                             <MoreHorizontal size={18} />
                          </button>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No se encontraron amigos con ese nombre.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-[#1A1A20] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowFriendsModal(false)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Header user={userProfile} />
      
      {/* Se añade animate-fade-up para la animación de entrada */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col animate-fade-up">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
               <VerticalMenu activeItem="profile" />
             </div>
          </aside>

          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            
            <div className="relative w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#1A1A20] group">
                <div className="h-48 md:h-64 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A20] via-[#1A1A20]/40 to-transparent z-10" />
                    <Image 
                        src={userProfile.coverUrl} 
                        alt="Profile Cover" 
                        fill 
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        unoptimized
                    />
                </div>

                <div className="relative z-20 px-6 md:px-8 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mb-8">
                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-xl shrink-0">
                        <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                            {userProfile.avatarUrl ? (
                                <Image src={userProfile.avatarUrl} alt={userProfile.name} fill className="object-cover" />
                            ) : (
                                <User size={64} className="text-gray-600" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 mb-2 text-center md:text-left w-full">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{userProfile.name}</h2>
                            <span 
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-opacity-20 border bg-[#00FF62]/20 text-[#00FF62] border-[#00FF62]/30"
                            >
                                Lvl {userProfile.level}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium text-sm mt-1">{userProfile.tag}</p>
                        <p className="text-gray-300 mt-3 max-w-2xl text-sm leading-relaxed">{userProfile.bio}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-gray-400" /> {userProfile.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" /> Se unió en {userProfile.joinDate}
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 w-full md:w-auto flex justify-center md:block">
                        <button 
                          onClick={handleOpenEditModal}
                          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            <Edit2 size={16} /> Editar Perfil
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                    {[
                        { label: "Juegos", value: userProfile.stats.gamesOwned, icon: Gamepad2, color: PALETTE.VIOLETA },
                        { label: "Horas Jugadas", value: formatNumber(userProfile.stats.hoursPlayed), icon: Clock, color: PALETTE.CEL_AZUL },
                        { label: "Logros", value: formatNumber(userProfile.stats.achievements), icon: Trophy, color: PALETTE.AMARILLO },
                        { label: "Amigos", value: userProfile.stats.friends, icon: Users, color: PALETTE.VERDE },
                    ].map((stat, i) => (
                        <div 
                            key={i} 
                            className="p-4 md:p-6 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-white/5 md:border-r border-white/5 last:border-r-0 border-b md:border-b-0"
                        >
                            <stat.icon size={18} className="mb-1 opacity-80 md:w-5 md:h-5" style={{ color: stat.color }} />
                            <span className="text-xl md:text-2xl font-black text-white">{stat.value}</span>
                            <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch flex-1">
                
                <div className="xl:col-span-2 space-y-8 flex flex-col h-full">
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity size={20} style={{ color: PALETTE.CEL_AZUL }} /> Actividad Reciente
                            </h3>
                            <button 
                                onClick={() => setShowActivityModal(true)}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors focus:outline-none"
                            >
                                Ver actividad
                            </button>
                        </div>

                        <div className="space-y-3">
                            {userProfile.recentActivity.map((game) => (
                                <Link 
                                    href={`/game/${game.slug}`} 
                                    key={game.id}
                                    // Añadimos la clase 'game-card-hover' para la animación de hover
                                    className="game-card-hover flex items-center gap-5 p-5 rounded-2xl bg-[#1A1A20] border transition-all duration-300 group relative z-0"
                                    style={{
                                      borderColor: hoveredActivity === game.id ? PALETTE.CEL_AZUL : 'rgba(255,255,255,0.05)',
                                      boxShadow: hoveredActivity === game.id ? `0 4px 12px -2px ${PALETTE.CEL_AZUL}33` : 'none',
                                      transform: hoveredActivity === game.id ? 'translateY(-2px)' : 'none',
                                      backgroundColor: '#1A1A20'
                                    }}
                                    onMouseEnter={() => setHoveredActivity(game.id)}
                                    onMouseLeave={() => setHoveredActivity(null)}
                                >
                                    <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 shadow-md">
                                        <Image src={game.cover} alt={game.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 
                                            className="font-bold text-white text-lg truncate transition-colors"
                                            style={{ color: hoveredActivity === game.id ? PALETTE.CEL_AZUL : 'white' }}
                                        >
                                            {game.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {game.action} <span className="text-gray-200 font-bold">{game.time}</span>
                                        </p>
                                    </div>
                                    <div className="pr-2">
                                        {game.time === 'En línea' ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">Playing</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                <Clock size={12} className="text-gray-500" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Offline</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div 
                        className="p-5 rounded-2xl border flex items-center gap-4 relative overflow-hidden shrink-0"
                        style={{ 
                            background: `linear-gradient(135deg, ${PALETTE.AMARILLO}1A, ${PALETTE.ROSA}1A)`,
                            borderColor: `${PALETTE.AMARILLO}4D`
                        }}
                    >
                        <style>{`
                            @keyframes shimmer {
                                0% { transform: translateX(-150%) skewX(-15deg); }
                                100% { transform: translateX(150%) skewX(-15deg); }
                            }
                        `}</style>
                        
                        <div 
                            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                            style={{ 
                                background: `linear-gradient(90deg, transparent, ${PALETTE.AMARILLO}4D, transparent)`,
                                animation: 'shimmer 2.5s infinite linear' 
                            }}
                        />

                        <div className="absolute inset-0 bg-orange-500/5 blur-xl"></div>
                        <div className="p-3 rounded-full relative z-10" style={{ backgroundColor: `${PALETTE.AMARILLO}33`, color: PALETTE.AMARILLO }}>
                            <Medal size={28} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-base font-bold" style={{ color: PALETTE.AMARILLO }}>Coleccionista Élite</p>
                            <p className="text-xs text-orange-400/80 mt-0.5">Top 5% jugadores del mes</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Heart size={20} style={{ color: PALETTE.ROSA }} /> Favoritos
                            </h3>
                            <button 
                                onClick={() => setShowFavoritesModal(true)}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors focus:outline-none"
                            >
                                Ver todos
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 content-start">
                            {userProfile.favorites.map((game) => (
                                <Link 
                                    href={`/game/${game.slug}`} 
                                    key={game.id}
                                    // Añadimos la clase 'game-card-hover' para la animación de hover
                                    className="game-card-hover relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 transition-transform duration-300 ease-out group shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
                                >
                                    <Image 
                                        src={game.cover} 
                                        alt={game.name} 
                                        fill 
                                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                                        unoptimized 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-sm font-bold text-white leading-tight w-full">{game.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="space-y-8 flex flex-col h-full">
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Trophy size={20} style={{ color: PALETTE.AMARILLO }} /> Logros Recientes
                            </h3>
                            <button 
                                onClick={() => setShowAchievementsModal(true)}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors focus:outline-none"
                            >
                                Ver todos
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {userProfile.achievements.map((ach) => (
                                <div 
                                    key={ach.id} 
                                    // Añadimos la clase 'game-card-hover' para la animación de hover
                                    className="game-card-hover bg-[#1A1A20] p-3 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all duration-300 cursor-default relative z-0"
                                    style={{
                                        borderColor: hoveredAchievement === ach.id ? ach.color : 'rgba(255,255,255,0.05)',
                                        boxShadow: hoveredAchievement === ach.id ? `0 4px 12px -2px ${ach.color}33` : 'none',
                                        transform: hoveredAchievement === ach.id ? 'translateY(-2px)' : 'none'
                                    }}
                                    onMouseEnter={() => setHoveredAchievement(ach.id)}
                                    onMouseLeave={() => setHoveredAchievement(null)}
                                >
                                    <div className="p-2.5 rounded-full" style={{ backgroundColor: `${ach.color}1A`, color: ach.color }}>
                                        <ach.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm leading-tight line-clamp-1">{ach.title}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wide truncate">{ach.game}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 px-1">
                            <Users size={20} style={{ color: PALETTE.VERDE }} /> Amigos
                        </h3>
                        <div className="bg-[#1A1A20] rounded-2xl border border-white/5 p-6 space-y-1 flex flex-col flex-1">
                            {userProfile.friendsList.map((friend) => (
                                <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <User size={14} className="text-gray-500" />
                                        </div>
                                        {friend.isOnline && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#1A1A20] rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-200 truncate group-hover:text-white">{friend.name}</p>
                                        <p className={`text-xs truncate ${friend.isOnline ? 'text-green-400/80' : 'text-gray-600'}`}>
                                            {friend.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-auto">
                                <button 
                                    onClick={() => setShowFriendsModal(true)}
                                    className="w-full py-2 text-center text-xs font-bold text-gray-500 hover:text-white transition-colors mt-2"
                                >
                                    Ver todos los amigos
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}