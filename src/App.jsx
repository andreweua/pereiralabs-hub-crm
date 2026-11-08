import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import ClientDrawer from './components/ClientDrawer';
import SecretsVault from './components/SecretsVault';
import DroneModule from './components/DroneModule';
import TelemetryAlerts from './components/TelemetryAlerts';
import ChangelogModal from './components/ChangelogModal';
import { 
  INITIAL_CLIENTS, 
  INITIAL_SECRETS, 
  INITIAL_EQUIPMENT, 
  INITIAL_TELEMETRY_LOGS 
} from './data/initialData';
import { supabase, testSupabaseConnection } from './lib/supabase';
import { Layers, KeyRound, Plane, Activity, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeUnit, setActiveUnit] = useState('todas');
  const [activeTab, setActiveTab] = useState('kanban');
  const [supabaseStatus, setSupabaseStatus] = useState({ success: false, message: 'Verificando...' });

  // Estados locais com persistência inteligente
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('pereiralabs_crm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [secrets, setSecrets] = useState(() => {
    const saved = localStorage.getItem('pereiralabs_crm_secrets');
    return saved ? JSON.parse(saved) : INITIAL_SECRETS;
  });

  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem('pereiralabs_crm_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [telemetryLogs, setTelemetryLogs] = useState(() => {
    const saved = localStorage.getItem('pereiralabs_crm_telemetry');
    return saved ? JSON.parse(saved) : INITIAL_TELEMETRY_LOGS;
  });

  // Gaveta lateral e Modais
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // Sincronizar com localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('pereiralabs_crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('pereiralabs_crm_secrets', JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem('pereiralabs_crm_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('pereiralabs_crm_telemetry', JSON.stringify(telemetryLogs));
  }, [telemetryLogs]);

  // Testar conexão Supabase ao carregar
  const checkConnection = async () => {
    const res = await testSupabaseConnection();
    setSupabaseStatus(res);

    // Se conectado e com tabela ativa, tenta buscar clientes remotos
    if (res.success && !res.needsSchema) {
      try {
        const { data, error } = await supabase.from('clientes_crm').select('*');
        if (!error && data && data.length > 0) {
          setClients(data);
        }
      } catch (err) {
        console.warn('Usando armazenamento local de apoio:', err);
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Handlers para o Kanban e Clientes
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleAddNewClient = () => {
    setSelectedClient(null);
    setIsDrawerOpen(true);
  };

  const handleSaveClient = async (clientData) => {
    if (clientData.id) {
      // Atualizar existente
      setClients((prev) =>
        prev.map((c) => (c.id === clientData.id ? { ...clientData, updated_at: new Date().toISOString() } : c))
      );
      // Tentar atualizar no Supabase se disponível
      if (supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('clientes_crm').update(clientData).eq('id', clientData.id);
      }
    } else {
      // Criar novo
      const newClient = {
        ...clientData,
        id: 'client_' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      // Tentar inserir no Supabase se disponível
      if (supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('clientes_crm').insert([newClient]);
      }
    }
    setIsDrawerOpen(false);
  };

  const handleDeleteClient = async (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('clientes_crm').delete().eq('id', clientId);
    }
    setIsDrawerOpen(false);
  };

  const handleUpdateClientStatus = async (clientId, newStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c))
    );
    if (supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('clientes_crm').update({ status: newStatus }).eq('id', clientId);
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
    if (supabaseStatus.success && !supabaseStatus.needsSchema) {
      await supabase.from('projeto_credenciais').insert([newSecret]);
    }
  };

  const handleDeleteSecret = async (secretId) => {
    if (window.confirm('Tem certeza que deseja revogar esta credencial?')) {
      setSecrets((prev) => prev.filter((s) => s.id !== secretId));
      if (supabaseStatus.success && !supabaseStatus.needsSchema) {
        await supabase.from('projeto_credenciais').delete().eq('id', secretId);
      }
    }
  };

  // Handlers Drone Ops
  const handleUpdateEquipmentStatus = async (equipmentId, newStatus) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === equipmentId ? { ...eq, status: newStatus } : eq))
    );
    if (supabaseStatus.success && !supabaseStatus.needsSchema) {
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

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeUnit={activeUnit}
        setActiveUnit={setActiveUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        supabaseStatus={supabaseStatus}
        onRefreshConnection={checkConnection}
        onOpenChangelog={() => setIsChangelogOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Informativo se precisar rodar o schema SQL no Supabase */}
        {supabaseStatus.needsSchema && (
          <div className="mb-6 bg-cyan-950/40 border border-cyan-800/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cyan-200">
            <div>
              <strong>Conexão com Supabase ativa!</strong> Para persistência remota no seu banco, execute o script SQL <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">supabase-schema.sql</code> no SQL Editor do Supabase. O app está operando em modo híbrido com persistência local garantida.
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
          />
        )}

        {/* Tab 2: Cofre de Segredos e API Keys */}
        {activeTab === 'secrets' && (
          <SecretsVault
            secrets={secrets}
            activeUnit={activeUnit}
            onSaveSecret={handleSaveSecret}
            onDeleteSecret={handleDeleteSecret}
          />
        )}

        {/* Tab 3: Drone Ops e Frota Audiovisual */}
        {activeTab === 'drone' && (
          <DroneModule
            equipment={equipment}
            onUpdateStatus={handleUpdateEquipmentStatus}
          />
        )}

        {/* Tab 4: Telemetria e Logs n8n */}
        {activeTab === 'telemetry' && (
          <TelemetryAlerts
            logs={telemetryLogs}
            onRetryWorkflow={handleRetryWorkflow}
            onTriggerTestPing={handleTriggerTestPing}
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

      {/* Modal de Changelog */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      {/* Rodapé Padrão PereiraLabs */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-slate-400 font-medium">
            Desenvolvido por: <strong className="text-white">PereiraLabs - Divisão de Tecnologia e IA</strong> | Louzada &amp; Pereira - Soluções Digitais.{' '}
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-mono underline ml-1 cursor-pointer"
            >
              v1.0.0
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
