import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[PereiraLabs Hub] Supabase URL ou Anon Key não configuradas no ambiente. Verifique o arquivo .env.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Função utilitária para checar a conectividade real com o Supabase
 */
export async function testSupabaseConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: 'Credenciais ausentes no .env' };
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
    return { success: false, message: err.message || 'Falha de rede ao conectar' };
  }
}
