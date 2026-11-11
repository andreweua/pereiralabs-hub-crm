# PereiraLabs Hub CRM & Painel Operacional

[![Versão](https://img.shields.io/badge/versão-1.1.0-06B6D4.svg)](./CHANGELOG.md)
[![Desenvolvedor](https://img.shields.io/badge/desenvolvedor-Andrew%20Pereira-blue.svg)](https://github.com/andreweua)
[![Empresa](https://img.shields.io/badge/organiza%C3%A7%C3%A3o-Louzada%20%26%20Pereira-111827.svg)](https://github.com/andreweua)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-Propriet%C3%A1ria-0891B2.svg)](#)

Painel Operacional e CRM Multiunidades da **PereiraLabs - Divisão de Tecnologia e IA**, pertencente à **Louzada & Pereira - Soluções Digitais**.

Construído com **React**, **Vite**, **Tailwind CSS**, **Lucide Icons** e conectado à infraestrutura **Supabase (Auth + Realtime + PostgreSQL)** com **Row Level Security (RLS)**.

---

## 🏢 1. Governança & Estrutura de Unidades de Negócio

O sistema consolida operações e métricas de cinco unidades estratégicas em uma única interface inteligente:

| Unidade | Segmento Principal | Pipeline Aplicável |
| :--- | :--- | :--- |
| **PereiraLabs** | Engenharia de Software, Aplicativos & IA | Pipeline B2B Padrão (6 Fases) |
| **Louzada Films** | Produção Audiovisual & Cinema Comercial | Pipeline B2B Padrão (6 Fases) |
| **Drone Ops** | Inspeções Industriais & Filmagem Aérea | Pipeline B2B + Módulo de Frota |
| **Consultoria Ton** | Afiliação & Gestão de Máquinas Stone/Ton | Pipeline Adaptativo de Tráfego |
| **Holding** | Governança Louzada & Pereira e M&A | Gestão Centralizada & Cofre RLS |

---

## 🚀 2. Stack Tecnológica

- **Frontend**: React 18, Vite 6, Tailwind CSS 3
- **Ícones**: Lucide React
- **Banco de Dados & Autenticação**: Supabase Database (PostgreSQL), Supabase Auth & Realtime WebSockets (`postgres_changes`) com Row Level Security (RLS)
- **Persistência**: Híbrida (Supabase Cloud Realtime + LocalStorage de alta resiliência offline)
- **Integrações de Tráfego & Comunicação**: Disparador WhatsApp com Templates (`https://wa.me/...`), Google Drive links, Webhooks n8n POST em tempo real

---

## 🛠️ 3. Módulos do Sistema

### 3.1. Pipeline Kanban Dinâmico Adaptativo & Disparador WhatsApp
- **Modo B2B**: `Lead` ➔ `Onboarding` ➔ `Em Desenvolvimento` ➔ `Revisão` ➔ `Ativo/Publicado` ➔ `Pausado`.
- **Modo Ton Afiliados**: `Lead Tráfego` ➔ `Contato Inicial` ➔ `Link Enviado` ➔ `Aguardando Ativação` ➔ `Ativo / Comissão Paga`.
- Cards com disparador WhatsApp com templates institucionais (`WhatsAppDispatcherModal`), pasta do Google Drive, tag de versão do site e movimentação rápida entre colunas.

### 3.2. Financeiro & Growth UTM (`GrowthFinanceHub`)
- Consolidação executiva da Holding Louzada & Pereira (Receita Ativa, Pipeline em Negociação, Comissões Ton, Ticket Médio e breakdown por unidade).
- Exportação de relatórios completos em **CSV (UTF-8 BOM)** e impressão executiva / PDF.
- Gerador inteligente de links rastreáveis (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) com vinculação direta a cards do CRM.

### 3.3. ClientDrawer Lateral
- Painel para edição detalhada do cliente ou oportunidade.
- Gestão de URLs de produção, IDs de pacotes nas lojas (*Google Play Store* e *Apple App Store*) e parâmetros de campanha UTM.

### 3.4. Cofre de Credenciais (`SecretsVault`) & Governança por Papéis
- Gerenciamento de chaves e variáveis sensíveis (`projeto_credenciais`).
- Mascaramento por padrão (`••••••••`), botão de visualização e cópia com um clique.
- Controle estrito de acesso baseado em papel (`Master / Superadmin` vs `Operador Drone Ops`, `Afiliado Ton`, `Atendimento`).

### 3.5. Drone Ops & Frota Audiovisual
- Inventário de aeronaves não tripuladas e câmeras cinema (`equipamentos_inventario`).
- Checklist regulatório oficial: **ANAC SISANT**, **DECEA / SARPAS** e **Seguro RETA**.
- Monitoramento de horas de voo e ciclos de bateria.

### 3.6. Central de Telemetria & Webhooks n8n (`TelemetryAlerts`)
- Configuração de endpoint POST real do n8n, disparo automático ao criar/mover cards e testador interativo de payload JSON.
- Estatísticas de latência, taxa de disponibilidade e botão de reexecução manual (*retry*).

---

## ⚙️ 4. Instalação e Execução Local

### Pré-requisitos
- Node.js versão 18 ou superior
- Gerenciador de pacotes npm, pnpm ou yarn

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/andreweua/pereiralabs-hub-crm.git
   cd pereiralabs-hub-crm
   ```

2. **Configure as variáveis de ambiente:**
   Crie ou edite o arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://sua-url.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:3000`

5. **Build & Deploy no GitHub Pages:**
   ```bash
   npm run build
   npm run deploy
   ```

---

## 🗄️ 5. Configuração do Banco de Dados Supabase (SQL)

Para provisionar o banco de dados e ativar as políticas de segurança Row Level Security (RLS), acesse o **SQL Editor** no painel do Supabase e execute o script disponibilizado em:
- [`./supabase-schema.sql`](./supabase-schema.sql)

O script cria as tabelas:
- `clientes_crm`
- `projeto_credenciais`
- `equipamentos_inventario`
- `telemetria_n8n_logs`

Com todas as políticas RLS devidamente habilitadas.

---

## 👨‍💻 6. Identidade & Créditos

**Desenvolvido por: PereiraLabs - Divisão de Tecnologia e IA | Louzada & Pereira - Soluções Digitais. v1.1.0**

- **Líder Técnico**: Andrew Pereira
- **GitHub**: [https://github.com/andreweua](https://github.com/andreweua)
- **Documento de Mudanças**: [`./CHANGELOG.md`](./CHANGELOG.md)
