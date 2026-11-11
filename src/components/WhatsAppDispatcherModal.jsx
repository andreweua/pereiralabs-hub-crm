import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  FileText 
} from 'lucide-react';

const MESSAGE_TEMPLATES = [
  {
    id: 'b2b_onboarding',
    label: 'Boas-vindas & Onboarding B2B',
    unit: 'pereiralabs',
    buildText: (c) =>
      `Olá, equipe *${c.nome}*! Aqui é Andrew Pereira da *PereiraLabs (Louzada & Pereira)*.\n\nEstamos iniciando o onboarding do seu projeto (${c.segmento}). Já organizamos sua pasta compartilhada no Google Drive para centralizarmos acessos e materiais:\n📁 ${c.drive_url || 'Link em preparação'}\n\nQualquer dúvida, sigo à disposição por aqui!`
  },
  {
    id: 'ton_link',
    label: 'Envio de Link & Ativação Ton',
    unit: 'ton',
    buildText: (c) =>
      `Olá, *${c.nome}*! Tudo bem? Aqui é da *Consultoria Ton | Louzada & Pereira*.\n\nConforme conversamos sobre as taxas promocionais para o segmento *${c.segmento}*, segue o seu link exclusivo com desconto ativo para solicitação da maquininha:\n🔗 ${c.production_url || 'https://ton.com.br/checkout?ref=PEREIRALABS'}\n\nAssim que concluir o pedido ou receber o equipamento, me avise para fazermos a primeira transação de ativação!`
  },
  {
    id: 'release_deploy',
    label: 'Notificação de Release Publicada',
    unit: 'pereiralabs',
    buildText: (c) =>
      `Olá, *${c.nome}*! Temos novidades!\n\nA versão *${c.site_version || 'v1.0.0'}* do seu ambiente já está publicada e validada em produção:\n🌐 ${c.production_url || 'URL em validação'}\n\nFicamos à disposição para os próximos passos e evoluções.`
  },
  {
    id: 'drone_sarpas',
    label: 'Liberação SARPAS & Briefing Drone Ops',
    unit: 'drone',
    buildText: (c) =>
      `Prezado(a) *${c.nome}*, informamos que a missão *${c.segmento}* pela *Drone Ops (PereiraLabs)* está com documentação aeronáutica regularizada (ANAC SISANT, Seguro RETA e solicitação SARPAS/DECEA).\n\nPasta de entregas aéreas em alta resolução:\n📁 ${c.drive_url || 'Em breve'}\n\nConfirmamos a janela operacional de voo!`
  },
  {
    id: 'films_review',
    label: 'Entrega / Revisão Louzada Films',
    unit: 'films',
    buildText: (c) =>
      `Olá, *${c.nome}*! O corte e a finalização do material *${c.segmento}* pela *Louzada Films* já estão disponíveis para sua revisão:\n📁 ${c.drive_url || c.production_url || 'Link do Drive'}\n\nAguardamos seu feedback para fecharmos a versão final!`
  }
];

export default function WhatsAppDispatcherModal({ client, isOpen, onClose, onLogDispatch }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('b2b_onboarding');
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!client || !isOpen) return;

    // Escolhe automaticamente o template mais adequado à unidade do cliente
    let defaultTpl = MESSAGE_TEMPLATES[0];
    if (client.unidade === 'ton') defaultTpl = MESSAGE_TEMPLATES[1];
    else if (client.unidade === 'drone') defaultTpl = MESSAGE_TEMPLATES[3];
    else if (client.unidade === 'films') defaultTpl = MESSAGE_TEMPLATES[4];
    else if (client.status === 'Ativo/Publicado') defaultTpl = MESSAGE_TEMPLATES[2];

    setSelectedTemplateId(defaultTpl.id);
    setMessageText(defaultTpl.buildText(client));
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const handleTemplateChange = (tplId) => {
    setSelectedTemplateId(tplId);
    const found = MESSAGE_TEMPLATES.find((t) => t.id === tplId);
    if (found) {
      setMessageText(found.buildText(client));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const cleanNumber = (client.whatsapp || '').replace(/\D/g, '');
    if (!cleanNumber) {
      alert('Este cliente não possui um número de WhatsApp válido cadastrado.');
      return;
    }
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');

    if (onLogDispatch) {
      onLogDispatch(client, selectedTemplateId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Disparador WhatsApp PereiraLabs</h3>
              <p className="text-xs text-slate-400">
                Destinatário: <strong className="text-emerald-400">{client.nome}</strong> ({client.whatsapp || 'Sem número'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Template */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Selecionar Template Institucional
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MESSAGE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateChange(tpl.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedTemplateId === tpl.id
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-sm'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor da Mensagem */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Mensagem Personalizada
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar texto'}
            </button>
          </div>
          <textarea
            rows="6"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            Abrir no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
