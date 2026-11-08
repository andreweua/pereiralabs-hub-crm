import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  ExternalLink, 
  FolderOpen, 
  MessageCircle, 
  Globe, 
  Smartphone, 
  Radio, 
  DollarSign, 
  Tag, 
  FileText,
  UserCheck
} from 'lucide-react';
import { PIPELINE_B2B, PIPELINE_TON } from './KanbanBoard';

export default function ClientDrawer({ 
  client, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) {
  const [formData, setFormData] = useState({
    nome: '',
    segmento: '',
    unidade: 'pereiralabs',
    status: 'Lead',
    whatsapp: '',
    drive_url: '',
    site_version: 'v1.0.0',
    valor_mensal: 0,
    production_url: '',
    app_store_id: '',
    google_play_id: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    notas: '',
    responsavel: 'Andrew Pereira',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        valor_mensal: client.valor_mensal ?? 0,
      });
    } else {
      setFormData({
        nome: '',
        segmento: '',
        unidade: 'pereiralabs',
        status: 'Lead',
        whatsapp: '+55',
        drive_url: '',
        site_version: 'v1.0.0',
        valor_mensal: 0,
        production_url: '',
        app_store_id: '',
        google_play_id: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        notas: '',
        responsavel: 'Andrew Pereira',
      });
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja remover o cliente "${formData.nome}"?`)) {
      onDelete(formData.id);
    }
  };

  const isTon = formData.unidade === 'ton';
  const availableStatuses = isTon ? PIPELINE_TON.map(p => p.id) : PIPELINE_B2B.map(p => p.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-xl bg-[#0F172A] border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col">
          
          {/* Header da Gaveta */}
          <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {formData.id ? 'EDITAR REGISTRO' : 'NOVO CLIENTE'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {formData.site_version || 'v1.0.0'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {formData.nome || 'Novo Cliente / Oportunidade'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Scrollável */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Seção 1: Dados Cadastrais Principais */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Informações Básicas
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Cliente / Projeto *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Dra. Camilla Louzada Advocacia"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Segmento / Atuação
                  </label>
                  <input
                    type="text"
                    name="segmento"
                    value={formData.segmento}
                    onChange={handleChange}
                    placeholder="Ex: Jurídico & Compliance"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Unidade de Negócio
                  </label>
                  <select
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="pereiralabs">PereiraLabs (Tech & Apps)</option>
                    <option value="ton">Consultoria Ton (Afiliados)</option>
                    <option value="films">Louzada Films</option>
                    <option value="drone">Drone Ops</option>
                    <option value="holding">Holding Louzada & Pereira</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status no Pipeline
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {availableStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isTon ? 'Comissão Estimada (R$)' : 'Valor Mensal / Projeto (R$)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="valor_mensal"
                      value={formData.valor_mensal}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp (+55...)
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+5521998765432"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Versão da Release
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="site_version"
                      value={formData.site_version}
                      onChange={handleChange}
                      placeholder="v1.0.0"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Links e Ambientes de Produção */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Produção & Armazenamento
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL de Produção / Domínio
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    name="production_url"
                    value={formData.production_url}
                    onChange={handleChange}
                    placeholder="https://exemplo.com.br"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pasta Google Drive
                </label>
                <div className="relative">
                  <FolderOpen className="w-4 h-4 text-blue-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    name="drive_url"
                    value={formData.drive_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Google Play Package ID
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="google_play_id"
                      value={formData.google_play_id}
                      onChange={handleChange}
                      placeholder="com.empresa.app"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Apple App Store Bundle ID
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="app_store_id"
                      value={formData.app_store_id}
                      onChange={handleChange}
                      placeholder="com.empresa.ios"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 3: Parâmetros de Tráfego / UTMs */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> Tráfego Pago & Rastreamento UTM
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    utm_source
                  </label>
                  <input
                    type="text"
                    name="utm_source"
                    value={formData.utm_source}
                    onChange={handleChange}
                    placeholder="facebook_ads"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    utm_medium
                  </label>
                  <input
                    type="text"
                    name="utm_medium"
                    value={formData.utm_medium}
                    onChange={handleChange}
                    placeholder="cpc"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    utm_campaign
                  </label>
                  <input
                    type="text"
                    name="utm_campaign"
                    value={formData.utm_campaign}
                    onChange={handleChange}
                    placeholder="lancamento_2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Seção 4: Notas e Responsável */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Notas de Engenharia e Requisitos
                </label>
                <div className="flex items-center gap-1 text-[11px] text-cyan-400">
                  <UserCheck className="w-3 h-3" />
                  <span>Responsável: {formData.responsavel || 'Andrew Pereira'}</span>
                </div>
              </div>
              <textarea
                name="notas"
                rows="3"
                value={formData.notas}
                onChange={handleChange}
                placeholder="Insira detalhes técnicos, stack utilizada, credenciais associadas ou próximos passos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Ações da Gaveta */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3 sticky bottom-0 bg-[#0F172A] py-3">
              {formData.id ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Salvar Registro
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
