import React from 'react';
import { X, Sparkles, Shield, FileText } from 'lucide-react';

export default function ChangelogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notas de Versão - CHANGELOG.md</h3>
              <p className="text-xs text-slate-400">PereiraLabs Hub CRM &amp; Painel Operacional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Changelog */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6 text-xs text-slate-300 pr-2">
          
          {/* v1.1.0 - Fase 2 */}
          <div className="space-y-3">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">[1.1.0] - 2026-11-11</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    FASE 2 - ATUAL
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Build v1.1.0-prod</span>
              </div>
              <p className="text-slate-400">
                Expansão completa com Supabase Realtime, Disparador WhatsApp com Templates, Consolidação Financeira Holding, Gerador de Links UTM e Integração Real de Webhooks n8n.
              </p>
            </div>

            <ul className="space-y-1.5 pl-4 list-disc marker:text-emerald-400 text-slate-300">
              <li><strong>Supabase Realtime &amp; Papéis RLS:</strong> Sincronização automática via WebSockets (<code>postgres_changes</code>) e controle de acesso por perfil (Master, Drone Ops, Afiliado Ton, Atendimento).</li>
              <li><strong>Disparador Ativo WhatsApp:</strong> Modal com templates institucionais por unidade de negócio e registro automático de envio na telemetria.</li>
              <li><strong>Consolidação Financeira &amp; Relatórios:</strong> KPIs da Holding, breakdown por unidade e exportação em CSV (UTF-8) e impressão executiva/PDF.</li>
              <li><strong>Gerador de Links UTM &amp; Ton:</strong> Construção instantânea de URLs rastreáveis com vinculação direta aos cards do CRM.</li>
              <li><strong>Webhooks n8n Reais:</strong> Configuração de endpoint POST, disparo automático em eventos do CRM e testador de payload JSON.</li>
            </ul>
          </div>

          {/* v1.0.0 - Release Inicial */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">[1.0.0] - 2026-11-08</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RELEASE INICIAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Build v1.0.0-prod</span>
            </div>
            <p className="text-slate-400">
              Lançamento oficial da infraestrutura unificada PereiraLabs Hub CRM, integrando governança da holding Louzada &amp; Pereira, pipelines adaptativos e segurança RLS com Supabase.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Adicionado na v1.0.0
              </h4>
              <ul className="space-y-2 pl-4 list-disc marker:text-cyan-400 text-slate-300">
                <li><strong>Arquitetura Multiunidades:</strong> Holding, PereiraLabs, Louzada Films, Drone Ops e Consultoria Ton.</li>
                <li><strong>Pipeline Kanban Dinâmico Adaptativo:</strong> Fluxo B2B e fluxo dedicado para Ton Afiliados.</li>
                <li><strong>ClientDrawer Lateral:</strong> URLs de produção, Google Play / App Store IDs e UTMs.</li>
                <li><strong>Cofre de Segredos (SecretsVault):</strong> Credenciais mascaradas por padrão e proteção RLS Master.</li>
                <li><strong>Módulo Drone Ops:</strong> Frota, horas de voo, baterias e checklist ANAC SISANT, DECEA/SARPAS e Seguro RETA.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Segurança &amp; Governança
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-cyan-400 text-slate-300">
                <li>Políticas Row Level Security (RLS) habilitadas no Supabase e Portal de Autenticação Master.</li>
                <li>Script SQL completo de inicialização (<code>supabase-schema.sql</code>).</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            PereiraLabs - Divisão de Tecnologia e IA
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
