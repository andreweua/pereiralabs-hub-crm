import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  RotateCw, 
  Zap, 
  Server, 
  Send, 
  Terminal,
  Filter
} from 'lucide-react';

export default function TelemetryAlerts({ 
  logs, 
  onRetryWorkflow,
  onTriggerTestPing 
}) {
  const [filter, setFilter] = useState('all');
  const [isPinging, setIsPinging] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const totalRuns = logs.length;
  const successRuns = logs.filter(l => l.status === 'sucesso').length;
  const failureRuns = logs.filter(l => l.status === 'falha').length;
  const successRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 100;
  const avgResponseTime = totalRuns > 0 
    ? Math.round(logs.reduce((acc, l) => acc + (l.tempo_resposta_ms || 0), 0) / totalRuns) 
    : 0;

  const handleTestPing = async () => {
    setIsPinging(true);
    await onTriggerTestPing();
    setTimeout(() => setIsPinging(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Status do Cluster n8n */}
      <div className="bg-gradient-to-r from-slate-900 via-[#111827] to-cyan-950/30 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Central de Telemetria n8n & Webhooks</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Operacional
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoramento em tempo real de webhooks de leads, notificações Z-API WhatsApp e pipelines de dados.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestPing}
          disabled={isPinging}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <Zap className={`w-4 h-4 ${isPinging ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
          {isPinging ? 'Enviando Ping...' : 'Disparar Webhook Teste'}
        </button>
      </div>

      {/* Cards de Métricas de Automação */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Execuções (24h)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalRuns}</span>
            <span className="text-xs text-slate-500">workflows</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Taxa de Sucesso</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{successRate}%</span>
            <span className="text-xs text-emerald-500/80">alta disponibilidade</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tempo Médio Resposta</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">{avgResponseTime} ms</span>
            <span className="text-xs text-cyan-500/80">latência baixa</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Falhas Críticas</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${failureRuns > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {failureRuns}
            </span>
            <span className="text-xs text-slate-500">requer atenção</span>
          </div>
        </div>
      </div>

      {/* Filtros e Histórico de Logs */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Eventos & Logs Recentes do n8n</h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('sucesso')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'sucesso' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Sucessos
            </button>
            <button
              onClick={() => setFilter('falha')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'falha' ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Falhas
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isSuccess = log.status === 'sucesso';

            return (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSuccess
                    ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    : 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{log.workflow_nome}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {log.workflow_id}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1">
                        {log.payload_resumo}
                      </p>

                      {log.erro_mensagem && (
                        <div className="mt-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 font-mono">
                          <strong>Erro:</strong> {log.erro_mensagem}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <span className="flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {log.tempo_resposta_ms}ms
                      </span>
                      <span className="text-[10px] text-slate-500">Tentativas: {log.tentativas}</span>
                    </div>

                    {!isSuccess && (
                      <button
                        onClick={() => onRetryWorkflow(log.id)}
                        title="Reexecutar Automação"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-800 text-rose-200 text-xs font-semibold border border-rose-700 transition-colors"
                      >
                        <RotateCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhum log encontrado para o filtro selecionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
