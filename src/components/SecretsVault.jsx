import React, { useState } from 'react';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2,
  Server,
  Lock,
  Sparkles
} from 'lucide-react';

export default function SecretsVault({ 
  secrets, 
  activeUnit, 
  onSaveSecret, 
  onDeleteSecret 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedIds, setRevealedIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSecret, setNewSecret] = useState({
    projeto_nome: '',
    servico: 'Supabase',
    unidade: 'pereiralabs',
    ambiente: 'production',
    chave_identificador: '',
    segredo_valor: '',
    descricao: '',
  });

  const toggleReveal = (id) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newSecret.projeto_nome || !newSecret.chave_identificador || !newSecret.segredo_valor) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    onSaveSecret(newSecret);
    setNewSecret({
      projeto_nome: '',
      servico: 'Supabase',
      unidade: 'pereiralabs',
      ambiente: 'production',
      chave_identificador: '',
      segredo_valor: '',
      descricao: '',
    });
    setIsModalOpen(false);
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchUnit = activeUnit === 'todas' || s.unidade === activeUnit;
    const search = searchTerm.toLowerCase();
    const matchSearch =
      s.projeto_nome.toLowerCase().includes(search) ||
      s.servico.toLowerCase().includes(search) ||
      s.chave_identificador.toLowerCase().includes(search);
    return matchUnit && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner de Segurança RLS Master */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-cyan-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Cofre de Segredos & API Keys</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RLS Ativo
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tabela <code className="text-cyan-300">projeto_credenciais</code> protegida por Row Level Security no Supabase. Acesso restrito ao papel Superadmin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova Chave / Segredo
          </button>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por projeto, serviço ou nome da chave..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total de chaves armazenadas: <span className="font-bold text-white">{filteredSecrets.length}</span>
        </div>
      </div>

      {/* Grid de Credenciais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSecrets.map((secret) => {
          const isRevealed = !!revealedIds[secret.id];
          const isCopied = copiedId === secret.id;

          return (
            <div
              key={secret.id}
              className="bg-[#111827]/90 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-cyan-500/30 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{secret.projeto_nome}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">{secret.servico}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                        {secret.ambiente}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] uppercase font-bold text-cyan-400">
                        {secret.unidade}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteSecret(secret.id)}
                  title="Excluir Credencial"
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Identificador da Chave */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Identificador da Variável (KEY NAME)
                </label>
                <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
                  <span>{secret.chave_identificador}</span>
                  <button
                    onClick={() => handleCopy(`id-${secret.id}`, secret.chave_identificador)}
                    className="text-slate-400 hover:text-white text-[11px]"
                    title="Copiar nome da variável"
                  >
                    {copiedId === `id-${secret.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Valor Mascarado / Revelado */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Valor Secreto (SECRET VALUE)
                  </label>
                  <span className="text-[10px] text-slate-500">Criptografado em repouso</span>
                </div>
                <div className="relative flex items-center">
                  <div className="w-full bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 tracking-wider truncate pr-20">
                    {isRevealed ? secret.segredo_valor : '••••••••••••••••••••••••••••••••••••••••'}
                  </div>

                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      onClick={() => toggleReveal(secret.id)}
                      title={isRevealed ? 'Ocultar Valor' : 'Revelar Valor'}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors"
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleCopy(secret.id, secret.segredo_valor)}
                      title="Copiar Chave Secreta"
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                        isCopied 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {secret.descricao && (
                <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  {secret.descricao}
                </p>
              )}
            </div>
          );
        })}

        {filteredSecrets.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-500">
            Nenhuma credencial encontrada para o filtro atual.
          </div>
        )}
      </div>

      {/* Modal para Adicionar Novo Segredo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Cadastrar Nova Credencial
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nome do Projeto / Aplicação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Camilla Louzada Advocacia"
                  value={newSecret.projeto_nome}
                  onChange={(e) => setNewSecret({ ...newSecret, projeto_nome: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Serviço</label>
                  <select
                    value={newSecret.servico}
                    onChange={(e) => setNewSecret({ ...newSecret, servico: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Supabase">Supabase</option>
                    <option value="OpenAI">OpenAI API</option>
                    <option value="Google Cloud">Google Cloud (GCP)</option>
                    <option value="Z-API WhatsApp">Z-API WhatsApp</option>
                    <option value="Stripe">Stripe Payments</option>
                    <option value="Stone Ton">Stone Ton Partner</option>
                    <option value="Outro">Outro Provedor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidade</label>
                  <select
                    value={newSecret.unidade}
                    onChange={(e) => setNewSecret({ ...newSecret, unidade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="pereiralabs">PereiraLabs</option>
                    <option value="ton">Ton Afiliados</option>
                    <option value="films">Louzada Films</option>
                    <option value="drone">Drone Ops</option>
                    <option value="holding">Holding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Identificador da Chave (ex: OPENAI_API_KEY) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="EXEMPLO_API_KEY"
                  value={newSecret.chave_identificador}
                  onChange={(e) => setNewSecret({ ...newSecret, chave_identificador: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Valor do Segredo (Token / Private Key) *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Insira o token ou string confidencial..."
                  value={newSecret.segredo_valor}
                  onChange={(e) => setNewSecret({ ...newSecret, segredo_valor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição / Finalidade</label>
                <input
                  type="text"
                  placeholder="Ex: Utilizado no chatbot de atendimento IA"
                  value={newSecret.descricao}
                  onChange={(e) => setNewSecret({ ...newSecret, descricao: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Gravar no Cofre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
