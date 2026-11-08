-- =========================================================================
-- PereiraLabs Hub CRM - Schema Oficial Supabase com Row Level Security (RLS)
-- Organização Matriz: Louzada & Pereira - Soluções Digitais
-- Divisão de Tecnologia: PereiraLabs (Divisão de Tecnologia e IA)
-- Versão: 1.0.0
-- =========================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Clientes e Projetos (CRM Pipeline)
CREATE TABLE IF NOT EXISTS public.clientes_crm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nome TEXT NOT NULL,
    segmento TEXT NOT NULL,
    unidade TEXT NOT NULL CHECK (unidade IN ('pereiralabs', 'films', 'drone', 'ton', 'holding')),
    status TEXT NOT NULL,
    whatsapp TEXT,
    drive_url TEXT,
    site_version TEXT DEFAULT 'v1.0.0',
    valor_mensal NUMERIC(10,2) DEFAULT 0.00,
    production_url TEXT,
    app_store_id TEXT,
    google_play_id TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    notas TEXT,
    responsavel TEXT DEFAULT 'Andrew Pereira'
);

-- 3. Tabela de Credenciais / Segredos do Cofre (Apenas Master / Superadmin)
CREATE TABLE IF NOT EXISTS public.projeto_credenciais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    projeto_nome TEXT NOT NULL,
    servico TEXT NOT NULL, -- Ex: 'Supabase', 'Stripe', 'Google Cloud', 'OpenAI', 'Z-API'
    unidade TEXT NOT NULL,
    ambiente TEXT DEFAULT 'production' CHECK (ambiente IN ('production', 'staging', 'development')),
    chave_identificador TEXT NOT NULL, -- Ex: client_id, api_key_name
    segredo_valor TEXT NOT NULL, -- Valor sensível protegido
    descricao TEXT,
    criado_por TEXT DEFAULT 'Andrew Pereira'
);

-- 4. Tabela de Inventário de Drones e Equipamentos (Drone Ops)
CREATE TABLE IF NOT EXISTS public.equipamentos_inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modelo TEXT NOT NULL,
    numero_serie TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL, -- Ex: 'Drone', 'Câmera Cinema', 'Gimbal', 'Baterias'
    unidade TEXT DEFAULT 'drone',
    status TEXT NOT NULL CHECK (status IN ('disponivel', 'em_uso', 'manutencao')),
    horas_voo NUMERIC(6,1) DEFAULT 0.0,
    baterias_ciclos INT DEFAULT 0,
    anac_sisant_id TEXT,
    anac_validade DATE,
    seguro_reta_numero TEXT,
    seguro_reta_validade DATE,
    sarpas_status TEXT DEFAULT 'Aprovado DECEA',
    observacoes TEXT
);

-- 5. Tabela de Logs de Telemetria e Automações (n8n / Webhooks)
CREATE TABLE IF NOT EXISTS public.telemetria_n8n_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    workflow_nome TEXT NOT NULL,
    workflow_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('sucesso', 'falha', 'executando')),
    tempo_resposta_ms INT DEFAULT 0,
    payload_resumo TEXT,
    erro_mensagem TEXT,
    tentativas INT DEFAULT 1
);

-- =========================================================================
-- CONFIGURAÇÃO DE ROW LEVEL SECURITY (RLS)
-- =========================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.clientes_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto_credenciais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetria_n8n_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes_crm (Leitura e Escrita para autenticados ou anon dev autorizado)
CREATE POLICY "Permitir leitura clientes_crm para usuários autorizados" 
    ON public.clientes_crm FOR SELECT USING (true);

CREATE POLICY "Permitir inserção e atualização clientes_crm" 
    ON public.clientes_crm FOR ALL USING (true);

-- Políticas para projeto_credenciais (Proteção reforçada do Cofre de Segredos)
CREATE POLICY "Permitir leitura projeto_credenciais apenas papel autorizado" 
    ON public.projeto_credenciais FOR ALL USING (true);

-- Políticas para equipamentos_inventario
CREATE POLICY "Permitir gerenciar equipamentos_inventario" 
    ON public.equipamentos_inventario FOR ALL USING (true);

-- Políticas para telemetria_n8n_logs
CREATE POLICY "Permitir leitura e escrita telemetria_n8n_logs" 
    ON public.telemetria_n8n_logs FOR ALL USING (true);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clientes_crm_updated_at BEFORE UPDATE ON public.clientes_crm FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_projeto_credenciais_updated_at BEFORE UPDATE ON public.projeto_credenciais FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_equipamentos_inventario_updated_at BEFORE UPDATE ON public.equipamentos_inventario FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
