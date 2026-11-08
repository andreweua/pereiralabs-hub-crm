# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-08

### Adicionado (Added)
- **Identidade e Governança Corporativa**:
  - Organização Matriz: **Louzada & Pereira - Soluções Digitais**.
  - Divisão de Tecnologia: **PereiraLabs (Divisão de Tecnologia e IA)**.
  - Suporte completo e unificado para as unidades de negócio: *Holding*, *PereiraLabs (Tech & Apps)*, *Louzada Films*, *Drone Ops* e *Consultoria Ton (Afiliados)*.
  - Assinatura oficial e padronizada de rodapé apontando para este documento de versionamento.
- **Cliente Supabase & Infraestrutura Cloud**:
  - Inicialização do SDK Supabase em `src/lib/supabase.js` com leitura segura das variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
  - Script SQL de governança (`supabase-schema.sql`) com criação de tabelas, índices e políticas de Row Level Security (RLS) habilitadas.
  - Indicador em tempo real no Navbar com status de conectividade (conectado / mock local).
- **Navbar Operacional Multiunidades**:
  - Barra superior responsiva com logo oficial PereiraLabs e badge Superadmin.
  - Seletor dinâmico de Unidade de Negócio com filtragem instantânea nos módulos.
  - Abas de navegação direta entre CRM, Cofre, Drone Ops e Telemetria.
- **Pipeline Kanban Adaptativo**:
  - Pipeline B2B padrão para PereiraLabs, Films, Drone e Holding: `Lead`, `Onboarding`, `Em Desenvolvimento`, `Revisão`, `Ativo/Publicado`, `Pausado`.
  - Pipeline especializado para Consultoria Ton (Afiliados): `Lead Tráfego`, `Contato Inicial`, `Link Enviado`, `Aguardando Ativação`, `Ativo / Comissão Paga`.
  - Cards enriquecidos com botão de disparo direto para WhatsApp formatado (`+55...`), link para Google Drive, tag de versão do site e valor mensal/comissão.
  - Controles rápidos para avançar ou recuar estágios no pipeline.
- **ClientDrawer Lateral**:
  - Painel deslizante para visualização e edição detalhada de clientes.
  - Suporte a URLs de produção, IDs de pacotes para Google Play e Apple App Store.
  - Gestão de parâmetros de rastreamento UTM (`utm_source`, `utm_medium`, `utm_campaign`).
- **Cofre de Credenciais (SecretsVault)**:
  - Módulo de gerenciamento para `projeto_credenciais` com campos mascarados por padrão (`••••••••`).
  - Botão de revelar/ocultar senha e botão de cópia rápida com feedback visual.
  - Restrição de governança RLS para papéis Master/Superadmin.
- **Drone Ops & Frota Audiovisual**:
  - Controle de inventário de equipamentos (`equipamentos_inventario`) com status (*disponível*, *em uso*, *manutenção*).
  - Métricas de horas de voo acumuladas e ciclos de vida de baterias inteligentes.
  - Checklist regulatório rigoroso em conformidade com RBAC-E nº 94 (ANAC SISANT), ICA 100-40 (DECEA / SARPAS) e Seguro RETA obrigatório.
- **Central de Telemetria n8n & Webhooks**:
  - Monitoramento de pipelines de automação, webhooks de tráfego pago e notificações WhatsApp Z-API.
  - Métricas de taxa de sucesso, tempo médio de resposta (ms) e visualização de stack traces de erros.
  - Botão de reexecução manual (*retry*) e disparo de ping de teste.

### Segurança (Security)
- Políticas de Row Level Security (RLS) para proteção das tabelas no banco PostgreSQL Supabase.
- Arquivo `.gitignore` configurado para isolar variáveis locais (`.env`, `.env*.local`) e dependências.
