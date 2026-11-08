import { createClient } from '@supabase/supabase-js';

// Credenciais com fallback seguro para build e produção
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 'https://vynnjkswidzkfsvhpmyn.supabase.co';
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v8ulrtvfZ8-RMSaxmZhOCg_XWha5sRL';

let clientInstance = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('[PereiraLabs Hub] Falha ao inicializar client Supabase:', err);
}

export const supabase = clientInstance;

/**
 * Função utilitária para checar a conectividade real com o Supabase
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return { success: false, message: 'Cliente Supabase não inicializado (modo offline/local).' };
  }
  try {
    const { error } = await supabase.from('clientes_crm').select('id').limit(1);
    if (error && error.code === '42P01') {
      // Tabela não existe ainda no banco de dados remoto
      return { 
        success: true, 
        needsSchema: true, 
        message: 'Conectado! Tabela clientes_crm não criada ainda (execute o SQL schema).' 
      };
    }
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Conectado com sucesso ao Supabase!' };
  } catch (err) {
    return { success: false, message: err?.message || 'Falha de rede ao conectar' };
  }
}
