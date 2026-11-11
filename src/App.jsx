import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import ClientDrawer from './components/ClientDrawer';
import SecretsVault from './components/SecretsVault';
import DroneModule from './components/DroneModule';
import TelemetryAlerts from './components/TelemetryAlerts';
import GrowthFinanceHub from './components/GrowthFinanceHub';
import WhatsAppDispatcherModal from './components/WhatsAppDispatcherModal';
import ChangelogModal from './components/ChangelogModal';
import AuthScreen from './components/AuthScreen';
import { 
  INITIAL_CLIENTS, 
  INITIAL_SECRETS, 
  INITIAL_EQUIPMENT, 
  INITIAL_TELEMETRY_LOGS 
} from './data/initialData';
import { supabase, testSupabaseConnection } from './lib/supabase';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeUnit, setActiveUnit] = useState('todas');
  const [activeTab, setActiveTab] = useState('kanban');
  const [supabaseStatus, setSupabaseStatus] = useState({ success: false, message: 'Verificando...' });
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Estados locais com persistência inteligente e defensiva
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('pereiralabs_crm_clients');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [secrets, setSecrets] = useState(() => {
    try {
      const saved = localStorage.getItem('pereiralabs_crm_secrets');
      return saved ? JSON.parse(saved) : INITIAL_SECRETS;
    } catch {
      return INITIAL_SECRETS;
    }
  });

  const [equipment, setEquipment] = useState(() => {
    try {
      const saved = localStorage.getItem('pereiralabs_crm_equipment');
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [telemetryLogs, setTelemetryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('pereiralabs_crm_telemetry');
      return saved ? JSON.parse(saved) : INITIAL_TELEMETRY_LOGS;
    } catch {
      return INITIAL_TELEMETRY_LOGS;
    }
  });

  const [n8nConfig, setN8nConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('pereiralabs_crm_n8n_config');
      return saved ? JSON.parse(saved) : { webhookUrl: '', autoTrigger: false };
    } catch {
      return { webhookUrl: '', autoTrigger: false };
    }
  });

  // Autenticação de Usuário Master
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pereiralabs_crm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('pereiralabs_crm_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleChangeRole = (newRole) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, role: newRole };
      try {
        localStorage.setItem('pereiralabs_crm_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleLogout = async () => {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('pereiralabs_crm_user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  // Gaveta lateral e Modais
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [whatsappClient, setWhatsappClient] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // Sincronizar com localStorage de forma segura
  useEffect(() => {
    try {
      localStorage.setItem('pereiralabs_crm_clients', JSON.stringify(clients));
    } catch { /* ignore */ }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('pereiralabs_crm_secrets', JSON.stringify(secrets));
    } catch { /* ignore */ }
  }, [secrets]);

  useEffect(() => {
    try {
      localStorage.setItem('pereiralabs_crm_equipment', JSON.stringify(equipment));
    } catch { /* ignore */ }
  }, [equipment]);

  useEffect(() => {
    try {
      localStorage.setItem('pereiralabs_crm_telemetry', JSON.stringify(telemetryLogs));
    } catch { /* ignore */ }
  }, [telemetryLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('pereiralabs_crm_n8n_config', JSON.stringify(n8nConfig));
    } catch { /* ignore */ }
  }, [n8nConfig]);

  // Testar conexão Supabase e carregar tabelas remotas se disponíveis
  const checkConnection = useCallback(async () => {
    try {
      const res = await testSupabaseConnection();
      setSupabaseStatus(res);

      if (res.success && !res.needsSchema && supabase) {
        const [cliRes, secRes, eqRes, logRes] = await Promise.all([
          supabase.from('clientes_crm').select('*').order('created_at', { ascending: false }),
          supabase.from('projeto_credenciais').select('*').order('created_at', { ascending: false }),
          supabase.from('equipamentos_inventario').select('*'),
          supabase.from('telemetria_n8n_logs').select('*').order('created_at', { ascending: false }).limit(30),
        ]);

        if (!cliRes.error && cliRes.data?.length > 0) setClients(cliRes.data);
        if (!secRes.error && secRes.data?.length > 0) setSecrets(secRes.data);
        if (!eqRes.error && eqRes.data?.length > 0) setEquipment(eqRes.data);
        if (!logRes.error && logRes.data?.length > 0) setTelemetryLogs(logRes.data);
      }
    } catch (err) {
      console.warn('Usando armazenamento local de apoio:', err);
      setSupabaseStatus({ success: false, message: 'Operando localmente' });
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Subscrição Supabase Realtime (WebSockets)
  useEffect(() => {
    if (!supabase || !supabaseStatus.success || supabaseStatus.needsSchema) {
      setRealtimeConnected(false);
      return;
    }

    const channel = supabase
      .channel('pereiralabs-hub-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clientes_crm' },
        () => {
          supabase
            .from('clientes_crm')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) setClients(data);
            });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'equipamentos_inventario' },
        () => {
          supabase
            .from('equipamentos_inventario')
            .select('*')
            .then(({ data }) => {
              if (data && data.length > 0) setEquipment(data);
            });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetria_n8n_logs' },
        (payload) => {
          if (payload.new) {
            setTelemetryLogs((prev) => [payload.new, ...prev.filter((l) => l.id !== payload.new.id)]);
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setRealtimeConnected(false);
    };
  }, [supabaseStatus.success, supabaseStatus.needsSchema]);

  // Disparador auxiliar de webhook n8n
  const executeWebhookDispatch = async (targetUrl, payloadObj, workflowName = 'Webhook Automação n8n') => {
    const start = performance.now();
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof payloadObj === 'string' ? payloadObj : JSON.stringify(payloadObj),
      });
      const elapsed = Math.round(performance.now() - start);

      const logEntry = {
        id: 'log_' + Date.now(),
        workflow_nome: workflowName,
        workflow_id: 'n8n_webhook_live',
        status: response.ok ? 'sucesso' : 'falha',
        tempo_resposta_ms: elapsed,
        payload_resumo: `POST para ${targetUrl} retornou HTTP ${response.status}`,
        erro_mensagem: response.ok ? null : `HTTP Status ${response.status} (${response.statusText})`,
        tentativas: 1,
        created_at: new Date().toISOString(),
      };
      setTelemetryLogs((prev) => [logEntry, ...prev]);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      const logEntry = {
        id: 'log_' + Date.now(),
        workflow_nome: workflowName,
        workflow_id: 'n8n_webhook_live',
        status: 'falha',
        tempo_resposta_ms: elapsed,
        payload_resumo: `Falha ao enviar POST para ${targetUrl}`,
        erro_mensagem: err?.message || 'Erro de rede / CORS no endpoint de destino',
        tentativas: 1,
        created_at: new Date().toISOString(),
      };
      setTelemetryLogs((prev) => [logEntry, ...prev]);
    }
  };

  // Handlers para o Kanban e Clientes
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleAddNewClient = () => {
    setSelectedClient(null);
    setIsDrawerOpen(true);
  };

  const handleOpenWhatsAppModal = (client) => {
    setWhatsappClient(client);
    setIsWhatsAppModalOpen(true);
  };

  const handleLogWhatsAppDispatch = (client, templateId) => {
    const logEntry = {
      id: 'log_' + Date.now(),
      workflow_nome: `Disparo WhatsApp Template (${templateId})`,
      workflow_id: 'whatsapp_dispatcher_v2',
      status: 'sucesso',
      tempo_resposta_ms: 120,
      payload_resumo: `Mensagem personalizada preparada e aberta para ${client.nome} (${client.whatsapp}).`,
      erro_mensagem: null,
      tentativas: 1,
      created_at: new Date().toISOString(),
    };
    setTelemetryLogs((prev) => [logEntry, ...prev]);
  };

  const handleSaveClient = async (clientData) => {
    if (clientData.id) {
      setClients((prev) =>
        prev.map((c) => (c.id === clientData.id ? { ...clientData, updated_at: new Date().toISOString() } : c))
      );
      if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('clientes_crm').update(clientData).eq('id', clientData.id);
      }
    } else {
      const newClient = {
        ...clientData,
        id: 'client_' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('clientes_crm').insert([newClient]);
      }
      if (n8nConfig.autoTrigger && n8nConfig.webhookUrl) {
        executeWebhookDispatch(
          n8nConfig.webhookUrl,
          { event: 'client.created', client: newClient },
          `Novo Card CRM: ${newClient.nome}`
        );
      }
    }
    setIsDrawerOpen(false);
  };

  const handleDeleteClient = async (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('clientes_crm').delete().eq('id', clientId);
    }
    setIsDrawerOpen(false);
  };

  const handleUpdateClientStatus = async (clientId, newStatus) => {
    const targetClient = clients.find((c) => c.id === clientId);
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c))
    );
    if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('clientes_crm').update({ status: newStatus }).eq('id', clientId);
    }
    if (n8nConfig.autoTrigger && n8nConfig.webhookUrl && targetClient) {
      executeWebhookDispatch(
        n8nConfig.webhookUrl,
        { event: 'client.status_changed', client_id: clientId, nome: targetClient.nome, new_status: newStatus },
        `Mudança de Fase: ${targetClient.nome} ➔ ${newStatus}`
      );
    }
  };

  const handleApplyUtmToClient = async (clientId, utmData) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, ...utmData, updated_at: new Date().toISOString() }
          : c
      )
    );
    if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('clientes_crm').update(utmData).eq('id', clientId);
    }
  };

  // Handlers do Cofre de Segredos
  const handleSaveSecret = async (secretData) => {
    const newSecret = {
      ...secretData,
      id: 'sec_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setSecrets((prev) => [newSecret, ...prev]);
    if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('projeto_credenciais').insert([newSecret]);
    }
  };

  const handleDeleteSecret = async (secretId) => {
    if (window.confirm('Tem certeza que deseja revogar esta credencial?')) {
      setSecrets((prev) => prev.filter((s) => s.id !== secretId));
      if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('projeto_credenciais').delete().eq('id', secretId);
      }
    }
  };

  // Handlers Drone Ops
  const handleUpdateEquipmentStatus = async (equipmentId, newStatus) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === equipmentId ? { ...eq, status: newStatus } : eq))
    );
    if (supabase && supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('equipamentos_inventario').update({ status: newStatus }).eq('id', equipmentId);
    }
  };

  // Handlers Telemetria n8n
  const handleRetryWorkflow = (logId) => {
    setTelemetryLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: 'sucesso',
              erro_mensagem: null,
              tentativas: l.tentativas + 1,
              payload_resumo: 'Reexecutado com sucesso via manual retry no PereiraLabs Hub.',
            }
          : l
      )
    );
  };

  const handleTriggerTestPing = async () => {
    const newLog = {
      id: 'log_' + Date.now(),
      workflow_nome: 'Webhook Teste de Conectividade (Ping Manual)',
      workflow_id: 'n8n_wf_ping_manual',
      status: 'sucesso',
      tempo_resposta_ms: Math.floor(Math.random() * 200) + 95,
      payload_resumo: 'Ping disparado e reconhecido pelo Gateway PereiraLabs.',
      erro_mensagem: null,
      tentativas: 1,
      created_at: new Date().toISOString(),
    };
    setTelemetryLogs((prev) => [newLog, ...prev]);
  };

  const handleExecuteRealWebhook = async (url, jsonString) => {
    await executeWebhookDispatch(url, jsonString, 'Teste Manual POST n8n');
  };

  // Se não estiver autenticado, exibe a tela de Login Master
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeUnit={activeUnit}
        setActiveUnit={setActiveUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        supabaseStatus={supabaseStatus}
        realtimeConnected={realtimeConnected}
        onRefreshConnection={checkConnection}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        currentUser={currentUser}
        onChangeRole={handleChangeRole}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Informativo se precisar rodar o schema SQL no Supabase */}
        {supabaseStatus.needsSchema && (
          <div className="mb-6 bg-cyan-950/40 border border-cyan-800/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cyan-200 print:hidden">
            <div>
              <strong>Conexão com Supabase ativa!</strong> Para persistência remota e Realtime Live no seu banco, execute o script SQL <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">supabase-schema.sql</code> no SQL Editor do Supabase. O app está operando em modo híbrido com persistência local garantida.
            </div>
          </div>
        )}

        {/* Tab 1: Kanban Pipeline CRM */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            clients={clients}
            activeUnit={activeUnit}
            onSelectClient={handleSelectClient}
            onUpdateClientStatus={handleUpdateClientStatus}
            onAddNewClient={handleAddNewClient}
            onOpenWhatsApp={handleOpenWhatsAppModal}
          />
        )}

        {/* Tab 2: Consolidação Financeira & Gerador de UTMs */}
        {activeTab === 'growth' && (
          <GrowthFinanceHub
            clients={clients}
            activeUnit={activeUnit}
            onApplyUtmToClient={handleApplyUtmToClient}
          />
        )}

        {/* Tab 3: Cofre de Segredos e API Keys */}
        {activeTab === 'secrets' && (
          <SecretsVault
            secrets={secrets}
            activeUnit={activeUnit}
            onSaveSecret={handleSaveSecret}
            onDeleteSecret={handleDeleteSecret}
            currentUser={currentUser}
          />
        )}

        {/* Tab 4: Drone Ops e Frota Audiovisual */}
        {activeTab === 'drone' && (
          <DroneModule
            equipment={equipment}
            onUpdateStatus={handleUpdateEquipmentStatus}
          />
        )}

        {/* Tab 5: Telemetria e Logs n8n */}
        {activeTab === 'telemetry' && (
          <TelemetryAlerts
            logs={telemetryLogs}
            onRetryWorkflow={handleRetryWorkflow}
            onTriggerTestPing={handleTriggerTestPing}
            n8nConfig={n8nConfig}
            onSaveN8nConfig={setN8nConfig}
            onExecuteRealWebhook={handleExecuteRealWebhook}
          />
        )}
      </main>

      {/* Gaveta Lateral do Cliente */}
      <ClientDrawer
        client={selectedClient}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
      />

      {/* Modal Disparador WhatsApp com Templates */}
      <WhatsAppDispatcherModal
        client={whatsappClient}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        onLogDispatch={handleLogWhatsAppDispatch}
      />

      {/* Modal de Changelog */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      {/* Rodapé Padrão PereiraLabs */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-6 px-4 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-slate-400 font-medium">
            Desenvolvido por: <strong className="text-white">PereiraLabs - Divisão de Tecnologia e IA</strong> | Louzada &amp; Pereira - Soluções Digitais.{' '}
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-mono underline ml-1 cursor-pointer"
            >
              v1.1.0
            </button>
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Row Level Security Habilitado
            </span>
            <span className="text-slate-700">•</span>
            <a
              href="https://github.com/andreweua"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub: @andreweua
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
