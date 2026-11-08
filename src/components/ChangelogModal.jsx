import React from 'react';
import { X, Sparkles, CheckCircle2, Shield, Layers, FileText } from 'lucide-react';

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
              <p className="text-xs text-slate-400">PereiraLabs Hub CRM & Painel Operacional</p>
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
              Lançamento oficial da infraestrutura unificada PereiraLabs Hub CRM, integrando governança da holding Louzada & Pereira, pipelines adaptativos e segurança RLS com Supabase.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Adicionado (Added)
              </h4>
              <ul className="space-y-2 pl-4 list-disc marker:text-cyan-400 text-slate-300">
                <li>
                  <strong>Arquitetura Multiunidades:</strong> Suporte unificado para Holding Louzada & Pereira, PereiraLabs (Tech & Apps), Louzada Films, Drone Ops e Consultoria Ton (Afiliados).
                </li>
                <li>
                  <strong>Pipeline Kanban Dinâmico Adaptativo:</strong>
                  <ul className="list-circle pl-4 mt-1 space-y-1 text-slate-400">
                    <li>Fluxo B2B padrão: Lead ➔ Onboarding ➔ Em Desenvolvimento ➔ Revisão ➔ Ativo/Publicado ➔ Pausado.</li>
                    <li>Fluxo Ton Afiliados: Lead Tráfego ➔ Contato Inicial ➔ Link Enviado ➔ Aguardando Ativação ➔ Ativo / Comissão Paga.</li>
                  </ul>
                </li>
                <li>
                  <strong>Cards Operacionais:</strong> Atalho direto para WhatsApp internacionalizado (<code className="text-emerald-400">+55...</code>), integração de links Google Drive e badges de versão de release.
                </li>
                <li>
                  <strong>ClientDrawer Lateral:</strong> Painel para edição rápida de URLs de produção, IDs de pacotes das lojas de aplicativos (Google Play e Apple App Store) e parâmetros UTM para análise de tráfego.
                </li>
                <li>
                  <strong>Cofre de Segredos (SecretsVault):</strong> Módulo seguro com ofuscação de credenciais padrão (<code className="text-slate-400">••••••••</code>), botão de cópia de alta precisão e conformidade com RLS.
                </li>
                <li>
                  <strong>Módulo Drone Ops:</strong> Gerenciamento da frota de aeronaves não tripuladas e câmeras cinema com checklist regulatório ANAC SISANT, Seguro RETA e aprovação DECEA/SARPAS.
                </li>
                <li>
                  <strong>Painel de Telemetria n8n:</strong> Monitoramento de fluxos de automação, webhooks de leads, tempo de resposta em milissegundos e suporte a reexecução manual (retry).
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Segurança & Governança (Security)
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-cyan-400 text-slate-300">
                <li>Configuração de Row Level Security (RLS) habilitada no Supabase para as tabelas principais.</li>
                <li>Garantia de isolamento de variáveis de ambiente no arquivo <code className="text-slate-200">.gitignore</code>.</li>
                <li>Script SQL completo de inicialização e permissões (<code className="text-slate-200">supabase-schema.sql</code>).</li>
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
