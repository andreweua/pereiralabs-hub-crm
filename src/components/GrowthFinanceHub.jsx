import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Download, 
  Printer, 
  Link2, 
  Copy, 
  Check, 
  Sparkles, 
  Radio,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

const URL_PRESETS = [
  { label: 'Checkout Ton T3 Black', url: 'https://ton.com.br/checkout?ref=PEREIRALABS_TON_T3' },
  { label: 'Checkout Ton Smart', url: 'https://ton.com.br/checkout?ref=PEREIRALABS_TON_SMART' },
  { label: 'Portal PereiraLabs', url: 'https://pereiralabs.com.br' },
  { label: 'Louzada Films', url: 'https://louzadafilms.com' },
];

export default function GrowthFinanceHub({ clients, activeUnit, onApplyUtmToClient }) {
  // Estado do Gerador UTM
  const [baseUrl, setBaseUrl] = useState('https://ton.com.br/checkout?ref=PEREIRALABS_TON_T3');
  const [utmSource, setUtmSource] = useState('meta_ads');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('campanha_q4_2026');
  const [utmContent, setUtmContent] = useState('criativo_video_01');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [appliedMsg, setAppliedMsg] = useState('');

  // Filtra clientes conforme unidade selecionada no Navbar
  const scopedClients = useMemo(() => {
    return clients.filter((c) => activeUnit === 'todas' || c.unidade === activeUnit);
  }, [clients, activeUnit]);

  // Cálculos Financeiros Consolidados
  const financeMetrics = useMemo(() => {
    const activeStatuses = ['Ativo/Publicado', 'Ativo / Comissão Paga'];
    let activeRevenue = 0;
    let pipelineRevenue = 0;
    let activeCount = 0;
    let tonComissions = 0;

    const unitBreakdown = {
      pereiralabs: { label: 'PereiraLabs (Tech & Apps)', total: 0, count: 0, color: 'bg-cyan-500' },
      films: { label: 'Louzada Films', total: 0, count: 0, color: 'bg-purple-500' },
      drone: { label: 'Drone Ops', total: 0, count: 0, color: 'bg-amber-500' },
      ton: { label: 'Consultoria Ton (Afiliados)', total: 0, count: 0, color: 'bg-emerald-500' },
      holding: { label: 'Holding Louzada & Pereira', total: 0, count: 0, color: 'bg-blue-500' },
    };

    scopedClients.forEach((c) => {
      const val = Number(c.valor_mensal) || 0;
      const isActive = activeStatuses.includes(c.status);

      if (isActive) {
        activeRevenue += val;
        activeCount++;
      } else if (c.status !== 'Pausado') {
        pipelineRevenue += val;
      }

      if (c.unidade === 'ton' && isActive) {
        tonComissions += val;
      }

      if (unitBreakdown[c.unidade]) {
        unitBreakdown[c.unidade].total += val;
        unitBreakdown[c.unidade].count += 1;
      }
    });

    const totalVolume = activeRevenue + pipelineRevenue;
    const avgTicket = scopedClients.length > 0 ? totalVolume / scopedClients.length : 0;

    return {
      activeRevenue,
      pipelineRevenue,
      totalVolume,
      activeCount,
      tonComissions,
      avgTicket,
      unitBreakdown: Object.entries(unitBreakdown).map(([id, data]) => ({ id, ...data })),
    };
  }, [scopedClients]);

  // Construção da URL UTM final
  const generatedUtmUrl = useMemo(() => {
    if (!baseUrl.trim()) return '';
    try {
      const urlObj = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (utmSource.trim()) urlObj.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) urlObj.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) urlObj.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmContent.trim()) urlObj.searchParams.set('utm_content', utmContent.trim());
      return urlObj.toString();
    } catch {
      return baseUrl;
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmContent]);

  const handleCopyUtm = () => {
    if (!generatedUtmUrl) return;
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleApplyToClient = () => {
    if (!selectedClientId || !onApplyUtmToClient) return;
    onApplyUtmToClient(selectedClientId, {
      utm_source: utmSource.trim(),
      utm_medium: utmMedium.trim(),
      utm_campaign: utmCampaign.trim(),
      production_url: generatedUtmUrl,
    });
    setAppliedMsg('Parâmetros UTM aplicados ao cliente com sucesso!');
    setTimeout(() => setAppliedMsg(''), 3000);
  };

  // Exportação CSV UTF-8 com BOM para abrir acentos perfeitamente no Excel
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nome do Cliente',
      'Unidade',
      'Segmento',
      'Status',
      'Valor Mensal / Comissao (BRL)',
      'WhatsApp',
      'Versao',
      'URL Producao',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Responsavel'
    ];

    const rows = scopedClients.map((c) => [
      c.id,
      `"${(c.nome || '').replace(/"/g, '""')}"`,
      c.unidade,
      `"${(c.segmento || '').replace(/"/g, '""')}"`,
      `"${(c.status || '').replace(/"/g, '""')}"`,
      (Number(c.valor_mensal) || 0).toFixed(2),
      c.whatsapp || '',
      c.site_version || '',
      c.production_url || '',
      c.utm_source || '',
      c.utm_medium || '',
      c.utm_campaign || '',
      c.responsavel || 'Andrew Pereira'
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pereiralabs-relatorio-holding-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBRL = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho Financeiro & Ações de Exportação */}
      <div className="bg-gradient-to-r from-slate-900 via-[#111827] to-emerald-950/30 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Consolidação Financeira & Growth UTM</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visão executiva Holding Louzada & Pereira — Receita recorrente, comissões Ton e gerador de campanhas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar Relatório CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Receita Ativa Consolidada</span>
          <div className="text-2xl font-black text-emerald-400">{formatBRL(financeMetrics.activeRevenue)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {financeMetrics.activeCount} contratos/comissões pagas
          </span>
        </div>

        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Pipeline em Negociação</span>
          <div className="text-2xl font-black text-cyan-400">{formatBRL(financeMetrics.pipelineRevenue)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Leads, onboarding e em desenvolvimento
          </span>
        </div>

        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Comissões Ton Liquidadas</span>
          <div className="text-2xl font-black text-teal-300">{formatBRL(financeMetrics.tonComissions)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Consultoria Ton Afiliados (Stone)
          </span>
        </div>

        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Ticket Médio Global</span>
          <div className="text-2xl font-black text-white">{formatBRL(financeMetrics.avgTicket)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Base: {scopedClients.length} registros filtrados
          </span>
        </div>
      </div>

      {/* Grid Principal: Distribuição por Unidade + Gerador Inteligente UTM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco 1: Receita por Unidade de Negócio */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Distribuição de Volume por Unidade
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Total: {formatBRL(financeMetrics.totalVolume)}
            </span>
          </div>

          <div className="space-y-4">
            {financeMetrics.unitBreakdown.map((unit) => {
              const pct =
                financeMetrics.totalVolume > 0
                  ? Math.round((unit.total / financeMetrics.totalVolume) * 100)
                  : 0;

              return (
                <div key={unit.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {unit.label}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">({unit.count} cards)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-100">
                      {formatBRL(unit.total)}{' '}
                      <span className="text-[10px] text-cyan-400 ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${unit.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco 2: Gerador Inteligente de Links de Tráfego & UTMs */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Gerador de Links UTM & Afiliados Ton
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Growth Ops
            </span>
          </div>

          {/* Presets Rápidos */}
          <div className="flex flex-wrap gap-1.5">
            {URL_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBaseUrl(preset.url)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">URL de Destino</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">utm_source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">utm_content</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Resultado Gerado */}
            <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" /> URL Rastreável Pronta:
                </span>
                <button
                  type="button"
                  onClick={handleCopyUtm}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-colors"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? 'Copiado!' : 'Copiar Link'}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-300 break-all select-all">
                {generatedUtmUrl}
              </p>
            </div>

            {/* Vincular diretamente a um cliente no CRM */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Vincular UTMs a um card do CRM...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.unidade.toUpperCase()})
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedClientId}
                onClick={handleApplyToClient}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Aplicar no Card
              </button>
            </div>

            {appliedMsg && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{appliedMsg}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
