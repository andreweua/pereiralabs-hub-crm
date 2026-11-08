import React, { useState } from 'react';
import { 
  Plane, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  BatteryCharging, 
  FileCheck, 
  Wrench, 
  CheckCircle2, 
  Wind, 
  Compass, 
  ExternalLink,
  Plus
} from 'lucide-react';

export default function DroneModule({ 
  equipment, 
  onUpdateStatus 
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredEquipment = equipment.filter((eq) => {
    if (filterStatus === 'all') return true;
    return eq.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disponivel':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disponível para Voo
          </span>
        );
      case 'em_uso':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
            <Plane className="w-3.5 h-3.5 animate-pulse" /> Em Operação de Voo
          </span>
        );
      case 'manutencao':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800">
            <Wrench className="w-3.5 h-3.5" /> Em Manutenção Técnica
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Checklist Regulatório e Condições de Voo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Compliance ANAC / DECEA / RETA */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Plane className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Drone Ops & Audiovisual Aéreo</h2>
                <p className="text-xs text-slate-400">Controle de Frota, Horas de Voo e Checklist Regulatório</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Todas as operações aéreas PereiraLabs e Louzada Films cumprem rigorosamente os protocolos da <strong>RBAC-E nº 94 (ANAC)</strong>, <strong>ICA 100-40 (DECEA)</strong> e <strong>Seguro RETA obrigatório</strong> contra danos a terceiros.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">DECEA / SARPAS</span>
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> 100% Regular
              </p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Seguro RETA</span>
              <p className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Válido até Nov/26
              </p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">ANAC SISANT</span>
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Cadastrado
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Briefing Meteorológico / Status Operacional */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" /> Condições para Voo
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                CÉU CLARO (VFR)
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Vento de Superfície:</span>
                <span className="font-semibold text-slate-200">8 nós (14 km/h) - Seguro</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Visibilidade Horizontal:</span>
                <span className="font-semibold text-slate-200">&gt; 10 km (Excelente)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Índice KP Solar:</span>
                <span className="font-semibold text-emerald-400">KP 2 (GPS Estável)</span>
              </div>
            </div>
          </div>

          <a
            href="https://sarpas.decea.mil.br"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Portal SARPAS DECEA
          </a>
        </div>
      </div>

      {/* Filtros da Frota */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2">Filtrar Frota:</span>
          {['all', 'disponivel', 'em_uso', 'manutencao'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st === 'all' && 'Todos os Equipamentos'}
              {st === 'disponivel' && 'Disponíveis'}
              {st === 'em_uso' && 'Em Uso'}
              {st === 'manutencao' && 'Manutenção'}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Total: <strong className="text-white">{filteredEquipment.length}</strong> equipamentos
        </span>
      </div>

      {/* Grid de Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEquipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-[#111827]/90 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-cyan-500/30 transition-all shadow-md"
          >
            {/* Header do Equipamento */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {eq.tipo}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{eq.modelo}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">S/N: {eq.numero_serie}</p>
              </div>

              <div>{getStatusBadge(eq.status)}</div>
            </div>

            {/* Métricas de Uso */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-950/50 text-blue-400 border border-blue-900/60">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Horas de Voo</span>
                  <span className="text-xs font-bold text-slate-100">{eq.horas_voo} hrs</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-900/60">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Ciclos de Bateria</span>
                  <span className="text-xs font-bold text-slate-100">{eq.baterias_ciclos} ciclos</span>
                </div>
              </div>
            </div>

            {/* Checklist Regulatório do Equipamento */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" /> ANAC SISANT:
                </span>
                <span className="font-mono font-medium text-slate-200">{eq.anac_sisant_id}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Apólice Seguro RETA:
                </span>
                <span className="font-mono font-medium text-emerald-400">{eq.seguro_reta_numero}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Plane className="w-3.5 h-3.5 text-blue-400" /> Status SARPAS:
                </span>
                <span className="font-medium text-cyan-300">{eq.sarpas_status}</span>
              </div>
            </div>

            {eq.observacoes && (
              <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                {eq.observacoes}
              </p>
            )}

            {/* Ações de Alteração de Status */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Modificar Status:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpdateStatus(eq.id, 'disponivel')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    eq.status === 'disponivel'
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Disponível
                </button>
                <button
                  onClick={() => onUpdateStatus(eq.id, 'em_uso')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    eq.status === 'em_uso'
                      ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Em Voo
                </button>
                <button
                  onClick={() => onUpdateStatus(eq.id, 'manutencao')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    eq.status === 'manutencao'
                      ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Manutenção
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
