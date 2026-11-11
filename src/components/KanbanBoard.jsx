import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, 
  FolderOpen, 
  Tag, 
  DollarSign, 
  Plus, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Briefcase
} from 'lucide-react';

export const PIPELINE_B2B = [
  { id: 'Lead', label: 'Lead', color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
  { id: 'Onboarding', label: 'Onboarding', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
  { id: 'Em Desenvolvimento', label: 'Em Desenvolvimento', color: 'border-amber-500/50 bg-amber-950/20 text-amber-300' },
  { id: 'Revisão', label: 'Revisão', color: 'border-purple-500/50 bg-purple-950/20 text-purple-300' },
  { id: 'Ativo/Publicado', label: 'Ativo / Publicado', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' },
  { id: 'Pausado', label: 'Pausado', color: 'border-slate-500/50 bg-slate-950/20 text-slate-400' },
];

export const PIPELINE_TON = [
  { id: 'Lead Tráfego', label: 'Lead Tráfego', color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
  { id: 'Contato Inicial', label: 'Contato Inicial', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
  { id: 'Link Enviado', label: 'Link Enviado', color: 'border-amber-500/50 bg-amber-950/20 text-amber-300' },
  { id: 'Aguardando Ativação', label: 'Aguardando Ativação', color: 'border-purple-500/50 bg-purple-950/20 text-purple-300' },
  { id: 'Ativo / Comissão Paga', label: 'Ativo / Comissão Paga', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' },
];

export default function KanbanBoard({ 
  clients, 
  activeUnit, 
  onSelectClient, 
  onUpdateClientStatus,
  onAddNewClient,
  onOpenWhatsApp
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Define se a visualização ativa usa o pipeline Ton ou o pipeline B2B padrão
  const isTonView = activeUnit === 'ton';
  const columns = isTonView ? PIPELINE_TON : PIPELINE_B2B;

  // Filtragem dos clientes por unidade e termo de busca
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Filtro de unidade
      const matchUnit = activeUnit === 'todas' || client.unidade === activeUnit;
      // Filtro de busca
      const search = searchTerm.toLowerCase();
      const matchSearch =
        client.nome.toLowerCase().includes(search) ||
        client.segmento.toLowerCase().includes(search) ||
        (client.notas && client.notas.toLowerCase().includes(search));

      return matchUnit && matchSearch;
    });
  }, [clients, activeUnit, searchTerm]);

  // Cálculos rápidos de métricas
  const totalValue = filteredClients.reduce((acc, c) => acc + (Number(c.valor_mensal) || 0), 0);
  const activeCount = filteredClients.filter(c => 
    c.status === 'Ativo/Publicado' || c.status === 'Ativo / Comissão Paga'
  ).length;

  const handleWhatsAppClick = (e, client) => {
    e.stopPropagation();
    if (onOpenWhatsApp) {
      onOpenWhatsApp(client);
      return;
    }
    if (!client.whatsapp) return;
    const cleanNumber = client.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleDriveClick = (e, driveUrl) => {
    e.stopPropagation();
    if (!driveUrl) return;
    window.open(driveUrl, '_blank');
  };

  const moveColumn = (e, client, direction) => {
    e.stopPropagation();
    const colIds = columns.map(c => c.id);
    const currentIndex = colIds.indexOf(client.status);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < colIds.length) {
      onUpdateClientStatus(client.id, colIds[nextIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior do Kanban com Métricas & Controles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, segmento ou notas..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Métricas e Botão Novo */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-xs bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400">Total Cards: </span>
              <span className="font-bold text-white">{filteredClients.length}</span>
            </div>
            <div className="w-px h-4 bg-slate-800"></div>
            <div>
              <span className="text-slate-400">Ativos: </span>
              <span className="font-bold text-emerald-400">{activeCount}</span>
            </div>
            <div className="w-px h-4 bg-slate-800"></div>
            <div>
              <span className="text-slate-400">{isTonView ? 'Comissões: ' : 'Pipeline: '}</span>
              <span className="font-bold text-cyan-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
              </span>
            </div>
          </div>

          <button
            onClick={onAddNewClient}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Novo Registro
          </button>
        </div>
      </div>

      {/* Grid de Colunas do Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colClients = filteredClients.filter(c => c.status === col.id);
          const colTotal = colClients.reduce((acc, c) => acc + (Number(c.valor_mensal) || 0), 0);

          return (
            <div 
              key={col.id} 
              className="flex flex-col bg-slate-900/40 rounded-2xl border border-slate-800/80 p-3 min-h-[540px] shadow-sm backdrop-blur-sm"
            >
              {/* Header da Coluna */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[0]}`}></span>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {colClients.length}
                  </span>
                </div>
              </div>

              {/* Subtotal da coluna */}
              {colTotal > 0 && (
                <div className="mb-3 px-2 py-1 rounded bg-slate-950/40 text-[10px] text-slate-400 flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-300">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(colTotal)}
                  </span>
                </div>
              )}

              {/* Lista de Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
                {colClients.map((client) => {
                  const colIds = columns.map(c => c.id);
                  const curIdx = colIds.indexOf(client.status);
                  const canMoveLeft = curIdx > 0;
                  const canMoveRight = curIdx < colIds.length - 1;

                  return (
                    <div
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      className="group relative bg-[#111827]/90 hover:bg-[#152033] p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-md hover:shadow-cyan-500/10"
                    >
                      {/* Topo do Card: Unidade & Versão */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          client.unidade === 'pereiralabs' 
                            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                            : client.unidade === 'ton'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                            : client.unidade === 'films'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                            : client.unidade === 'drone'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {client.unidade.toUpperCase()}
                        </span>

                        {client.site_version && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-cyan-400" />
                            {client.site_version}
                          </span>
                        )}
                      </div>

                      {/* Nome do Cliente */}
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {client.nome}
                      </h4>

                      {/* Segmento */}
                      <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{client.segmento}</span>
                      </p>

                      {/* Valor do Projeto / Comissão */}
                      {client.valor_mensal > 0 && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 mb-3 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40">
                          <DollarSign className="w-3 h-3" />
                          <span>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.valor_mensal)}
                            <span className="text-[9px] text-slate-400 ml-1 font-normal">
                              {client.unidade === 'ton' ? '/comissão' : '/mensal'}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Botões Rápidos de Ação: WhatsApp, Drive e Navegação de Coluna */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          {/* Botão Rápido WhatsApp com Templates */}
                          {client.whatsapp && (
                            <button
                              onClick={(e) => handleWhatsAppClick(e, client)}
                              title={`Disparar WhatsApp com Template: ${client.whatsapp}`}
                              className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-800/60 border border-emerald-800/60 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Botão Rápido Google Drive */}
                          {client.drive_url && (
                            <button
                              onClick={(e) => handleDriveClick(e, client.drive_url)}
                              title="Abrir Pasta no Google Drive"
                              className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 hover:bg-blue-800/60 border border-blue-800/60 transition-colors"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Link de Produção / Checkout se existir */}
                          {client.production_url && (
                            <a
                              href={client.production_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Abrir URL de Produção"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Controles de Mudança de Coluna */}
                        <div className="flex items-center gap-1">
                          {canMoveLeft && (
                            <button
                              onClick={(e) => moveColumn(e, client, -1)}
                              title="Mover para coluna anterior"
                              className="p-1 rounded bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canMoveRight && (
                            <button
                              onClick={(e) => moveColumn(e, client, 1)}
                              title="Avançar para próxima coluna"
                              className="p-1 rounded bg-slate-800/80 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}

                {colClients.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-800 text-slate-600 text-center text-xs">
                    <span>Sem cards nesta fase</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
