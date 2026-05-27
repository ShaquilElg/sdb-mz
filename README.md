# SDB-MZ — Sistema de Denúncia de Burlas de Moçambique

Denuncie. Proteja. Moçambique.

Plataforma web 100% anónima para monitorar, reportar e combater cibercrimes, fraudes eletrónicas e burlas de pagamentos móveis em Moçambique.

Site em produção: https://sdb-mz.onrender.com  
 Repositório:** https://github.com/ShaquilElg/sdb-mz



## Sobre o Projecto

O SDB-MZ permite que qualquer cidadão moçambicano denuncie burlas digitais de forma totalmente anónima — sem login, sem e-mail, sem identificação. O sistema foi desenhado com foco em utilizadores de baixa literacia digital, com interface simples, linguagem clara e compatibilidade com dispositivos móveis.



 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + TypeScript |
| Build | Vite |
| Backend | Node.js + Express |
| Base de Dados | PostgreSQL via Supabase |
| Hospedagem | Render.com (Free Tier) |
| Estilos | Tailwind CSS |
| Ícones | Lucide React |



 Funcionalidades

- **Denúncia anónima em 4 passos** com stepper e barra de progresso
- **Código único de rastreio** gerado automaticamente (ex: `SDB-2026-XXXXX`)
- **Biblioteca de Burlas** — guia educativo com 6 tipos de fraudes comuns em Moçambique
- **Lista Negra de Números** — números suspeitos reportados pela comunidade
- **Alerta automático** quando um número atinge 3 ou mais denúncias
- **Verificação pública de números** suspeitos
- **Estatísticas e Transparência** — dados públicos em tempo real
- **Upload de evidências** — capturas de ecrã e PDFs (até 5MB)
- **Contactos de emergência reais** na página de confirmação (Vodacom, PRM, Polícia)
- **Checklist de segurança** obrigatória antes de submeter
- **Design dark mode** responsivo, optimizado para mobile



 Estrutura do Código

```
sdb-mz/
├── src/
│   ├── App.tsx          # Aplicação React principal (todas as vistas)
│   ├── main.tsx         # Ponto de entrada React
│   └── index.css        # Estilos globais + Tailwind
├── server.ts            # Backend Node.js + Express + PostgreSQL
├── index.html           # HTML base
├── vite.config.ts       # Configuração Vite
├── package.json         # Dependências
└── setup.sql            # Script SQL de criação das tabelas
```

---

 Base de Dados (Supabase / PostgreSQL)

 Tabelas criadas

| Tabela | Descrição |
|--------|-----------|
| `denuncias` | Registo de todas as denúncias submetidas |
| `alertas` | Alertas públicos de fraudes activas |
| `evidencias` | Ficheiros de prova associados às denúncias |
| `numeros_lista_negra` | Números suspeitos e total de ocorrências |



Segurança Implementada

- Anonimato total por defeito** — sem login, sem cookies de identificação
- Toggle de anonimato** — o utilizador escolhe se quer ser contactado
- Prepared Statements** — proteção contra SQL Injection
- Validação de ficheiros** — tipo MIME, tamanho máximo 5MB
- Alerta automático por reincidência** — quando um número acumula 3+ denúncias
- Sem exposição de dados pessoais** na consulta pública



 Instalação Local

```bash
# Clonar o repositório
git clone https://github.com/ShaquilElg/sdb-mz.git
cd sdb-mz

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as credenciais do Supabase

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm run start
```



 Variáveis de Ambiente

```env
SUPABASE_PG_HOST=aws-0-eu-west-1.pooler.supabase.com
SUPABASE_PG_PORT=5432
SUPABASE_PG_DATABASE=postgres
SUPABASE_PG_USER=postgres.XXXXXXXX
SUPABASE_PG_PASSWORD=SUA_PASSWORD
```

---

Tipos de Burlas Cobertos

1. M-Pesa / E-Mola / mKesh** — SMS falsos, códigos USSD, falsos prémios
2. Phishing** — websites clonados de bancos moçambicanos (BIM, BCI, Standard Bank)
3. Redes Sociais** — perfis duplicados no WhatsApp e Facebook
4. Falso Investimento** — pirâmides financeiras e criptomoedas falsas
5. Falso Emprego** — vagas falsas da EDM, CFM, Portos com taxas ilegais
6. Comércio Falso** — anúncios fantasma no OLX e Facebook Marketplace

---

Projecto Académico

Desenvolvido no âmbito do curso universitário como iniciativa cidadã digital para Moçambique.

Grupo 5
