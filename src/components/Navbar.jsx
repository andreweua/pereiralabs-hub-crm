import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  Cpu, 
  Plane, 
  Activity, 
  KeyRound, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  FileText,
  LogOut
} from 'lucide-react';

export const UNITS = [
  { id: 'todas', label: 'Todas as Unidades', color: 'from-slate-700 to-slate-800' },
  { id: 'pereiralabs', label: 'PereiraLabs (Tech & Apps)', color: 'from-cyan-600 to-blue-700' },
  { id: 'ton', label: 'Consultoria Ton (Afiliados)', color: 'from-emerald-600 to-teal-700' },
  { id: 'films', label: 'Louzada Films', color: 'from-purple-600 to-indigo-700' },
  { id: 'drone', label: 'Drone Ops', color: 'from-amber-600 to-orange-700' },
  { id: 'holding', label: 'Holding Louzada & Pereira', color: 'from-blue-600 to-slate-800' },
];

export default function Navbar({ 
  activeUnit, 
  setActiveUnit, 
  activeTab, 
  setActiveTab,
  supabaseStatus, 
  onRefreshConnection,
  onOpenChangelog,
  currentUser,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-md shadow-cyan-500/20 text-white font-bold text-xl border border-cyan-400/30">
              <span className="font-extrabold tracking-tighter">PL</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0B0F19]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Pereira<span className="text-cyan-400">Labs</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-700/50">
                    HUB CRM
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Divisão de Tecnologia e IA | <span className="text-slate-300">Louzada & Pereira</span>
              </p>
            </div>
          </div>

          {/* Abas Principais de Navegação */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kanban'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Pipeline CRM
            </button>
            <button
              onClick={() => setActiveTab('secrets')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'secrets'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Cofre RLS
            </button>
            <button
              onClick={() => setActiveTab('drone')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'drone'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              Drone Ops
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Telemetria n8n
            </button>
          </nav>

          {/* Área Direita: Seletor de Unidades, Status Supabase & Usuário Master */}
          <div className="flex items-center gap-3">
            {/* Seletor de Unidade de Negócio */}
            <div className="relative">
              <select
                value={activeUnit}
                onChange={(e) => setActiveUnit(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer shadow-inner hover:border-slate-600 transition-colors"
                title="Filtrar por Unidade de Negócio"
              >
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200 py-1">
                    {u.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Status Supabase Connection */}
            <button
              onClick={onRefreshConnection}
              title={`Status Supabase: ${supabaseStatus.message} (Clique para testar)`}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                supabaseStatus.success
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className={`w-2 h-2 rounded-full ${supabaseStatus.success ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="hidden md:inline">
                {supabaseStatus.success ? 'Supabase Conectado' : 'Supabase Local/Mock'}
              </span>
              <RefreshCw className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
            </button>

            {/* Badge Usuário Master / Superadmin */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-cyan-500/40 shadow-sm">
                {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AP'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-100">{currentUser?.name || 'Andrew Pereira'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                    {currentUser?.role || 'Master / Superadmin'}
                  </span>
                </div>
              </div>

              {/* Botão Logout */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Bloquear Painel / Sair"
                  className="p-1.5 ml-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800/80"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botão Changelog */}
            <button
              onClick={onOpenChangelog}
              title="Ver Changelog v1.0.0"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
            >
              <FileText className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'kanban' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pipeline CRM
          </button>
          <button
            onClick={() => setActiveTab('secrets')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'secrets' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cofre RLS
          </button>
          <button
            onClick={() => setActiveTab('drone')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'drone' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drone Ops
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'telemetry' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Telemetria n8n
          </button>
        </div>

      </div>
    </header>
  );
}
