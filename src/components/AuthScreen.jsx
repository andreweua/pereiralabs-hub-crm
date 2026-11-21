import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (!supabase || !supabase.auth) {
        setErrorMessage('Serviço de autenticação Supabase indisponível.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error || !data?.user) {
        setErrorMessage('E-mail ou senha incorretos. Acesso negado pelo Supabase Auth.');
        setIsLoading(false);
        return;
      }

      onLoginSuccess({
        id: data.user.id,
        name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
        email: data.user.email,
        role: 'Master / Superadmin',
      });
    } catch (err) {
      console.warn('Erro ao autenticar no Supabase:', err);
      setErrorMessage('Falha de comunicação com o servidor de autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card Principal de Autenticação */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-cyan-950/30">
          
          {/* Logo e Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/30 text-white font-extrabold text-2xl border border-cyan-400/40 mb-3">
              PL
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              Pereira<span className="text-cyan-400">Labs</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/60">
                HUB CRM
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Divisão de Tecnologia e IA | <strong className="text-slate-300">Louzada &amp; Pereira</strong>
            </p>
          </div>

          {/* Badge de Proteção RLS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1">
                Acesso Corporativo Restrito <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <span className="text-slate-400 text-[11px]">
                Autenticação Supabase Auth &amp; Row Level Security
              </span>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="mb-5 bg-rose-950/60 border border-rose-800/80 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@dominio.com"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando no Supabase...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Rodapé da Tela de Login */}
        <p className="text-[11px] text-slate-500 text-center mt-6">
          PereiraLabs - Divisão de Tecnologia e IA | Louzada &amp; Pereira - Soluções Digitais. v1.1.0
        </p>

      </div>
    </div>
  );
}
