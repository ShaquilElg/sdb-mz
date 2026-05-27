# SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)

O **SDB-MZ** é uma plataforma web integral de triagem e denúncia anónima de fraudes, burlas eletrónicas e esquemas digitais (como burlas de M-Pesa, E-Mola, roubos de contas em redes sociais e páginas falsas de investimentos) adaptado ao contexto de Moçambique.

Este projeto foi projetado com especial atenção para a simplicidade visual, atendendo a utilizadores de baixa literacia digital (em particular utilizadores móveis), e conta com um painel administrativo seguro para triagem das infrações.

---

## 🚀 Requisitos de Sistema

- **Servidor Web:** Apache 2.4+ (XAMPP compatível)
- **Interpretador:** PHP 8.0 ou superior (com extensão `PDO_MySQL` e `finfo` ativadas)
- **Base de Dados:** MySQL 5.7+ ou MariaDB 10.4+
- **Segurança:** Suporte HTTPS recomendado (sessões configuradas com cookies seguros automaticamente)

---

## 📦 Estrutura do Código

```text
/ SDB-MZ Root
│
├── index.php                 # Página Inicial (Landing Page com Alertas e Estatísticas)
├── denunciar.php             # Formulário Anónimo de Criação de Denúncias
├── acompanhar.php           # Consulta pública do Estado do Caso (via código de Rastreio)
├── confirmacao.php           # Exibição clara do Código de Rastreio Único pós-registro
│
├── includes/
│   ├── config.php            # Estabelecimento de conexão PDO e cabeçalhos de segurança
│   └── functions.php         # Sanitizador XSS, gerador de códigos de rastreio e validações
│
├── admin/
│   ├── login.php             # Autenticação segura com criptografia Bcrypt
│   ├── index.php             # Dashboard administrativo completo (tabelas, filtros e exportações)
│   ├── denuncia.php          # Visualização de detalhes de cada denúncia individual e anexos
│   ├── alertas.php           # Painel de publicação/controle de Alertas em tempo real
│   └── logout.php            # Destruição segura de sessões administrativas
│
├── assets/
│   ├── css/style.css         # Identidade visual (Verde e Amarelo de Moçambique) e responsividade
│   └── js/main.js            # Validação dinâmica de uploads, copy-to-clipboard e utilitários
│
├── uploads/                  # Pasta para gravação física das capturas/screenshots enviados
│
└── setup.sql                 # Script de criação de tabelas e sementeiras iniciais
```

---

## 🛠️ Instalação Local (XAMPP)

1. **Baixar / Copiar Código:**
   Transfira a pasta Completa deste projeto para dentro do diretório `htdocs` do seu XAMPP (`C:\xampp\htdocs\sdb-mz\`).

2. **Iniciar Servidores:**
   Abra o painel de controlo do XAMPP e ative os módulos **Apache** e **MySQL**.

3. **Restaurar Base de Dados:**
   - Abra o navegador e vá para [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
   - Clique em **Novo** no menu esquerdo e crie uma base de dados chamada `sdb_mz`.
   - Selecione a nova base de dados, clique na aba **Importar**, escolha o arquivo `/setup.sql` deste projeto e clique em **Importar** (ou Executar).

4. **Configuração de Parâmetros:**
   Abra o arquivo `/includes/config.php` e certifique-se de que os dados de conexão local correspondem:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'sdb_mz');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Deixe em branco se for no XAMPP padrão
   ```

5. **Testar no Browser:**
   Aceda a [http://localhost/sdb-mz/](http://localhost/sdb-mz/) para iniciar.

---

## 🌐 Deploy em Alojamentos Gratuitos (InfinityFree / 000Webhost)

### 1. Preparar a Base de Dados no Cloud Host:
1. Faça login na sua área de clientes InfinityFree/000webhost.
2. Procure por **MySQL Databases** no painel de controlo.
3. Crie uma nova base de dados.
4. Clique em **phpMyAdmin** ao lado do banco de dados criado.
5. Selecione a base de dados criada e use a ferramenta de **Importar** para carregar o ficheiro `setup.sql`.

### 2. Configurar Conexão Base de Dados:
Abra o arquivo `/includes/config.php` e altere os valores para corresponder às informações fornecidas pela sua hospedagem gratuita:
```php
define('DB_HOST', 'sql300.epizy.com'); // Exemplo fornecido pelo InfinityFree
define('DB_NAME', 'epiz_32442_sdb_mz'); // Nome real do banco do host
define('DB_USER', 'epiz_32442');       // Usuário real de banco do host
define('DB_PASS', 'SuaSenhaForte');    // Senha secreta criada no painel de hospedagem
```

### 3. Enviar Arquivos via FTP:
1. Descarregue o cliente FileZilla ou use o Gerenciador de Arquivos Online do site.
2. Conecte-se usando as credenciais FTP fornecidas pelo seu host.
3. Transfira **todos os arquivos do projeto** para dentro da pasta `htdocs` (ou `public_html`).
4. **Permissões de Escrita (Chmod):** Certifique-se de que a subpasta `/uploads/` tem permissões de gravação de arquivos (no FileZilla, clique com botão direito na pasta e configure permissões de gravação para `755` ou `777`).

---

## 🔒 Acesso Administrativo (Demo)

Para efetuar testes no painel de controlo administrativo, aceda a:
- **URL do Painel:** `http://seu-site/admin/`
- **E-mail de Teste:** `admin@sdb.co.mz`
- **Palavra-passe:** `admin123`

> ⚠️ **Nota Importante:** Para gerar um novo hash de senha Bcrypt em produção para novos administradores, utilize a função PHP nativa: `password_hash('NovaSenhaSecreta', PASSWORD_DEFAULT)` e substitua diretamente no campo `password_hash` da tabela `admins`.

---

## 🔐 Implementações de Segurança

1. **Prepared Statements (PDO):** Todas as inserções e pesquisas de dados (como acompanhar tracking codes ou autenticar logins) usam prepared parameters para mitigar 100% de ataques SQL Injection.
2. **Sanitização Contínua:** Os campos textuais expostos no portal sofrem sanitização via `htmlspecialchars` em UTF8 antes da renderização no ecrã.
3. **Uploads Blindados:** A plataforma verifica dinamicamente se o tamanho do anexo não ultrapassa 5MB, valida seu tipo real de cabeçalho MIME (permitindo somente formatos fotográficos seguros e PDFs) e renomeia o arquivo fisicamente usando caracteres aleatórios para inviabilizar a execução cruzada de arquivos maliciosos PHP `.php`.
4. **Rate Limiting por IP:** O servidor recusa submeter novas queixas no mesmo minuto para o mesmo utilizador IP caso envie mais do que 3 queixas seguidas, protegendo o sistema de robôs automáticos de SPAM.
