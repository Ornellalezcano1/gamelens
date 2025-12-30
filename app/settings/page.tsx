'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Search, User, Bell, Shield, 
  Gamepad2, Globe, Mail, Lock, LogOut, 
  AlertTriangle, Save, Smartphone, Eye
} from 'lucide-react';
import { VerticalMenu } from '@/components/VerticalMenu';

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

// --- ESTILOS CSS PUROS PARA ICONOS (Solo para Discord) ---
const iconStyle = {
  width: '24px',
  height: '24px',
  fill: 'currentColor',
  display: 'block'
};

// --- ICONOS INLINE (Solo Discord, el resto usa archivos de public/) ---
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" style={iconStyle} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// --- COMPONENTE: TOGGLE SWITCH (MEJORADO) ---
const ToggleSwitch = ({ checked, onChange, color = PALETTE.VERDE }: { checked: boolean; onChange: () => void; color?: string }) => (
  <button 
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none hover:opacity-90 active:scale-95 ${checked ? '' : 'bg-white/10 hover:bg-white/20'}`}
    style={{ backgroundColor: checked ? color : undefined }}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${checked ? 'left-7' : 'left-1'}`} />
  </button>
);

// Definición de tipos para las conexiones para mayor claridad
type Connection = {
  id: string;
  name: string;
  connected: boolean;
  user: string;
  color: string;
  image?: string; // Ruta al archivo en /public
  icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Componente SVG inline (para Discord)
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'account' | 'connections' | 'privacy' | 'notifications'>('account');

  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    displayName: "Valentín", 
    username: "valentin_dev", 
    email: "valentin_dev@gamelens.com",
    bio: "Amante de los RPGs de mundo abierto y los shooters competitivos.",
    language: "es-la", 
    twoFactor: true,
    publicProfile: true,
    showActivity: true,
    allowFriendRequests: true,
    emailNotifs: true,
    pushNotifs: false,
    marketingEmails: false
  });

  // --- ESTADOS DE CONEXIONES ---
  const [connections, setConnections] = useState<Connection[]>([
    { 
      id: 'steam', 
      name: 'Steam', 
      connected: true, 
      user: 'Valen_Dev', 
      color: '#171a21', // Fondo oscuro
      image: '/Steam.svg' // Archivo en public
    },
    { 
      id: 'epic', 
      name: 'Epic Games', 
      connected: true, 
      user: 'Valen_Dev', 
      color: '#2a2a2a', // Fondo gris oscuro Epic
      image: '/Epic.svg' // Archivo en public
    },
    { 
      id: 'discord', 
      name: 'Discord', 
      connected: true, 
      user: 'Valentin#0001', 
      color: '#5865F2',
      icon: DiscordIcon // Mantenemos el componente inline
    },
    { 
      id: 'psn', 
      name: 'PlayStation', 
      connected: false, 
      user: '', 
      color: '#003791',
      image: '/Play.svg' // Archivo en public
    },
    { 
      id: 'xbox', 
      name: 'Xbox Live', 
      connected: false, 
      user: '', 
      color: '#107C10', 
      image: '/Xbox.svg' // Archivo en public
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleConnection = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, connected: !c.connected } : c));
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white bg-[#131119]">Cargando configuración...</div>;
  }

  // --- RENDERIZADO DE CONTENIDO SEGÚN TAB ---
  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Sección Información Pública */}
            <div className="bg-[#1A1A20] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-500" /> Información de la Cuenta
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Nombre Visible */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nombre Visible</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="Tu nombre público"
                    className="w-full bg-[#131119] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 hover:border-white/30 transition-all"
                  />
                  <p className="text-[11px] text-gray-500 ml-1">Este es el nombre que verán tus amigos.</p>
                </div>

                {/* 2. Nombre de Usuario Único (@) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nombre de Usuario (ID)</label>
                  <div className="relative group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-blue-500 transition-colors">@</span>
                     <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                      placeholder="usuario_unico"
                      className="w-full bg-[#131119] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 hover:border-white/30 transition-all font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 ml-1">Identificador único. Se usa para menciones y URLs.</p>
                </div>

                {/* 3. Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Correo Electrónico</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                     <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#131119] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 hover:border-white/30 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Idioma */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Idioma</label>
                  <select 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full bg-[#131119] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 hover:border-white/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="es-la">Español (Latinoamérica)</option>
                    <option value="es-es">Español (España)</option>
                    <option value="en-us">English (US)</option>
                    <option value="en-uk">English (UK)</option>
                    <option value="pt-br">Português (Brasil)</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="ja">日本語 (Japonés)</option>
                    <option value="ko">한국어 (Coreano)</option>
                    <option value="zh">中文 (Chino)</option>
                    <option value="ru">Русский (Ruso)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Sección Seguridad */}
            <div className="bg-[#1A1A20] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-green-500" /> Seguridad
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#131119] border border-white/5 hover:border-green-500/30 hover:bg-[#1f1f25] transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">Autenticación de dos pasos (2FA)</p>
                      <p className="text-sm text-gray-500">Añade una capa extra de seguridad.</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={formData.twoFactor} onChange={() => setFormData({...formData, twoFactor: !formData.twoFactor})} />
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white">Contraseña</p>
                    <p className="text-sm text-gray-500">Último cambio hace 3 meses</p>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/10 hover:border-white/30 transition-all">
                    Cambiar
                  </button>
                </div>
              </div>
            </div>

             {/* Zona de Peligro */}
             <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 hover:bg-red-500/10 transition-colors duration-300">
              <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Zona de Peligro
              </h3>
              <p className="text-gray-400 text-sm mb-6">Estas acciones son irreversibles. Ten cuidado.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all">
                    Eliminar Cuenta
                 </button>
                 <button className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2">
                    <LogOut size={16} /> Cerrar Sesión en todos lados
                 </button>
              </div>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#1A1A20] border border-white/5 rounded-2xl p-6 md:p-8">
               <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Globe size={20} className="text-green-500" /> Plataformas Conectadas
                  </h3>
                  <p className="text-gray-400">Sincroniza tus juegos, logros y actividad conectando tus cuentas.</p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {connections.map((conn) => (
                    <div 
                      key={conn.id}
                      className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        conn.connected 
                        ? 'bg-[#131119] border-green-500/30 shadow-[0_0_15px_-5px_rgba(0,255,98,0.1)] hover:shadow-[0_0_20px_-5px_rgba(0,255,98,0.2)] hover:border-green-500/50' 
                        : 'bg-[#131119]/50 border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                        <div className="flex items-center gap-4 md:gap-6">
                            {/* CONTENEDOR DEL ICONO */}
                            <div 
                              className={`w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 transition-colors ${conn.connected ? 'text-white' : 'text-gray-500'}`} 
                              style={{ backgroundColor: conn.connected ? conn.color : '#ffffff10' }}
                            >
                                {conn.image ? (
                                  <Image 
                                    src={conn.image} 
                                    alt={conn.name} 
                                    width={28} 
                                    height={28} 
                                    className="object-contain"
                                    unoptimized
                                  />
                                ) : (
                                  conn.icon && <conn.icon />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{conn.name}</h4>
                                {conn.connected ? (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-sm text-gray-300 font-medium">Conectado como <span className="text-white">{conn.user}</span></p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-0.5">No conectado</p>
                                )}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleToggleConnection(conn.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                conn.connected 
                                ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/30' 
                                : 'bg-white text-black hover:bg-gray-200 shadow-lg hover:scale-105 active:scale-95'
                            }`}
                        >
                            {conn.connected ? 'Desconectar' : 'Conectar'}
                        </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-[#1A1A20] border border-white/5 rounded-2xl p-6 md:p-8">
                {/* ICONO Y TEXTO ACTUALIZADOS A MORADO */}
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Eye size={20} className="text-purple-500" /> Privacidad y Visibilidad
                </h3>
                
                <div className="space-y-6">
                    {[
                        { label: "Perfil Público", desc: "Cualquier persona puede ver tu perfil y estadísticas.", state: formData.publicProfile, key: 'publicProfile' },
                        { label: "Mostrar Actividad de Juego", desc: "Muestra qué estás jugando en tiempo real.", state: formData.showActivity, key: 'showActivity' },
                        { label: "Permitir Solicitudes de Amistad", desc: "Los usuarios pueden enviarte invitaciones.", state: formData.allowFriendRequests, key: 'allowFriendRequests' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#131119] border border-white/5 flex items-center justify-between hover:border-purple-500/30 hover:bg-[#1A1A20] transition-all duration-300">
                             <div>
                                <p className="font-bold text-white text-base">{item.label}</p>
                                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                             </div>
                             <ToggleSwitch checked={item.state} onChange={() => setFormData({ ...formData, [item.key as keyof typeof formData]: !item.state })} color={PALETTE.VIOLETA} />
                        </div>
                    ))}
                </div>
             </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#1A1A20] border border-white/5 rounded-2xl p-6 md:p-8">
                {/* ICONO Y TEXTO ACTUALIZADOS A AMARILLO */}
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-yellow-500" /> Preferencias de Notificaciones
                </h3>
                
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#131119] border border-white/5 flex items-center justify-between hover:border-yellow-500/30 hover:bg-[#1A1A20] transition-all duration-300">
                        <div className="flex items-center gap-4">
                             <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Mail size={20}/></div>
                             <div>
                                <p className="font-bold text-white">Correos Electrónicos</p>
                                <p className="text-sm text-gray-500">Resumen semanal, seguridad y soporte.</p>
                             </div>
                        </div>
                        <ToggleSwitch checked={formData.emailNotifs} onChange={() => setFormData({...formData, emailNotifs: !formData.emailNotifs})} color={PALETTE.AMARILLO} />
                    </div>

                    <div className="p-4 rounded-xl bg-[#131119] border border-white/5 flex items-center justify-between hover:border-yellow-500/30 hover:bg-[#1A1A20] transition-all duration-300">
                        <div className="flex items-center gap-4">
                             <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500"><Smartphone size={20}/></div>
                             <div>
                                <p className="font-bold text-white">Notificaciones Push</p>
                                <p className="text-sm text-gray-500">Alertas en tiempo real en tu dispositivo.</p>
                             </div>
                        </div>
                        <ToggleSwitch checked={formData.pushNotifs} onChange={() => setFormData({...formData, pushNotifs: !formData.pushNotifs})} color={PALETTE.AMARILLO} />
                    </div>

                    <div className="p-4 rounded-xl bg-[#131119] border border-white/5 flex items-center justify-between hover:border-yellow-500/30 hover:bg-[#1A1A20] transition-all duration-300">
                        <div className="flex items-center gap-4">
                             <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Gamepad2 size={20}/></div>
                             <div>
                                <p className="font-bold text-white">Novedades y Ofertas</p>
                                <p className="text-sm text-gray-500">Noticias sobre juegos en tu wishlist.</p>
                             </div>
                        </div>
                        <ToggleSwitch checked={formData.marketingEmails} onChange={() => setFormData({...formData, marketingEmails: !formData.marketingEmails})} color={PALETTE.AMARILLO} />
                    </div>
                </div>
              </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#131119]"
      style={{ colorScheme: 'dark' }}
    >
        {/* --- ESTILOS GLOBALES --- */}
        <style jsx global>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.4s ease-out forwards;
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>

      {/* 1. HEADER (Idéntico a Profile Page) */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-white/5 bg-[#131119]/80 backdrop-blur-xl shrink-0">
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
          <div className="relative hidden md:block group ml-14">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar juegos, creadores..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-neutral-900 focus:border-blue-500/50 focus:text-white focus:ring-1 focus:ring-blue-500/20 transition-all w-64 lg:w-80 placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-500 rounded-full transition-colors font-semibold border border-pink-600/50">
            <Heart size={18} fill="currentColor" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-none">Valentín</p>
              <p className="text-xs text-blue-400 font-medium mt-1">PC</p>
            </div>
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                 <User size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 2. MAIN WRAPPER */}
      <main className="flex-1 px-6 md:px-10 max-w-[1920px] mx-auto w-full relative flex flex-col">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1 items-stretch">
          
          {/* Menú Lateral */}
          <aside className="hidden md:block w-[260px] shrink-0 relative">
             <div className="sticky top-[74px] pt-10 pb-10 h-[calc(100vh-74px)] overflow-y-auto no-scrollbar">
                {/* Cambiamos activeItem a 'settings' si tu componente VerticalMenu lo soporta, o lo mantenemos para consistencia visual */}
                <VerticalMenu activeItem="settings" />
             </div>
          </aside>

          {/* Área Derecha: Contenido de Settings */}
          <div className="flex-1 w-full min-w-0 space-y-8 flex flex-col pt-6 md:pt-10 pb-10">
            
            {/* Header de la Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Configuración</h2>
                    <p className="text-gray-400 text-sm">Administra tu cuenta, conexiones y preferencias de GameLens.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/5 hover:scale-105 active:scale-95">
                    <Save size={18} />
                    Guardar Cambios
                </button>
            </div>

            {/* Navegación por Pestañas */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 gap-8">
                {[
                    { id: 'account', label: 'Cuenta', icon: User },
                    { id: 'connections', label: 'Conexiones', icon: Globe },
                    { id: 'privacy', label: 'Privacidad', icon: Shield },
                    { id: 'notifications', label: 'Notificaciones', icon: Bell },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    let activeColor = 'text-blue-500';
                    let activeBorder = 'border-blue-500';

                    if (tab.id === 'connections') {
                        activeColor = 'text-green-500';
                        activeBorder = 'border-green-500';
                    } else if (tab.id === 'privacy') {
                        activeColor = 'text-purple-500';
                        activeBorder = 'border-purple-500';
                    } else if (tab.id === 'notifications') {
                        activeColor = 'text-yellow-500';
                        activeBorder = 'border-yellow-500';
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                isActive 
                                ? `text-white ${activeBorder}` 
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                        >
                            <tab.icon size={18} className={isActive ? activeColor : ''} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Contenido Dinámico */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}