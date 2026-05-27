-- ==========================================
-- SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)
-- Script de Configuração da Base de Dados (setup.sql)
-- Compatível com PHPMyAdmin, XAMPP, InfinityFree, 000webhost
-- ==========================================

-- Criar a base de dados se não existir (se tiver permissões)
CREATE DATABASE IF NOT EXISTS sdb_mz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sdb_mz;

-- 1. TABELA DE ADMINISTRADORES
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABELA DE DENÚNCIAS
CREATE TABLE IF NOT EXISTS denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_rastreio VARCHAR(20) NOT NULL UNIQUE,
    tipo_burla VARCHAR(50) NOT NULL, -- 'M-Pesa/E-Mola', 'Redes Social', 'Phishing', etc.
    descricao TEXT NOT NULL,
    numero_suspeito VARCHAR(50) DEFAULT NULL,
    valor_envolvido DECIMAL(12,2) DEFAULT NULL,
    data_incidente DATE NOT NULL,
    email_denunciante VARCHAR(150) DEFAULT NULL, -- Opcional, anónimo
    estado ENUM('Em Análise', 'Confirmada', 'Em Investigação', 'Resolvida', 'Rejeitada') DEFAULT 'Em Análise',
    ip_origem VARCHAR(45) DEFAULT NULL, -- Registo básico para rate limit e segurança
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABELA DE EVIDÊNCIAS (Anexos carregados pelas testemunhas/vítimas)
CREATE TABLE IF NOT EXISTS evidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    denuncia_id INT NOT NULL,
    nome_ficheiro VARCHAR(255) NOT NULL,
    caminho VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- ex: 'image/jpeg', 'application/pdf'
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABELA DE ALERTAS PÚBLICOS
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'Alerta', -- 'Alerta', 'Número Suspeito', 'Website Falso'
    ativo TINYINT(1) DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- POPULAR DADOS INICIAIS (SEED DATA)
-- ==========================================

-- Administrador Padrão
-- Email: admin@sdb.co.mz
-- Senha: admin123 (Criptografada com bcrypt standard PASSWORD_DEFAULT no PHP)
-- Hash correspondente: $2y$10$wTInF6LpbyP9g6R6Z2N1WeLOnY3nZzL1o3gP1tA3P9C6t92P/11lC
INSERT INTO admins (nome, email, password_hash) VALUES 
('Administrador Geral SDB-MZ', 'admin@sdb.co.mz', '$2y$10$wTInF6LpbyP9g6R6Z2N1WeLOnY3nZzL1o3gP1tA3P9C6t92P/11lC')
ON DUPLICATE KEY UPDATE id=id;

-- Alertas Iniciais para a Landing Page
INSERT INTO alertas (titulo, descricao, tipo, ativo) VALUES
('Falso prémio M-Pesa de 50.000 MZN', 'Cuidado com SMS provenientes de números individuais alegando que ganhou um prémio M-Pesa da Vodacom. A Vodacom só contacta através de canais oficiais.', 'Alerta', 1),
('Falsas vagas de emprego na Electricidade de Moçambique (EDM)', 'Campanhas de phishing estão a circular nas redes sociais e WhatsApp, direcionando para um formulário fraudulento que pede dinheiro para prosseguir com o processo de seleção.', 'Alerta', 1),
('Website Falso: sdb-mz-login-fake.com', 'Detetamos uma tentativa de simulação do nosso painel. Lembre-se de certificar-se que a URL correta termina no endereço oficial do seu alojamento.', 'Website Falso', 1)
ON DUPLICATE KEY UPDATE id=id;

-- Seed inicial de denúncias para o Admin visualizar (simulação inicial)
INSERT INTO denuncias (codigo_rastreio, tipo_burla, descricao, numero_suspeito, valor_envolvido, data_incidente, email_denunciante, estado) VALUES
('SDB-2026-X83F1', 'M-Pesa/E-Mola', 'Recebi uma chamada de um indivíduo que se identificou como funcionário da Vodacom, dizendo que a minha conta M-Pesa seria bloqueada se eu não digitasse o código *150# e executasse uma transferência para o número listado. Acabei perdendo 5.000 MZN.', '841234567', 5000.00, '2026-05-10', 'vitima1@gmail.com', 'Em Investigação'),
('SDB-2026-Z44B9', 'Redes Sociais', 'Perfil falso no Facebook vendendo computadores portáteis seminovos abaixo do preço. Enviei o sinal de 3.500 MZN por M-Pesa e o vendedor bloqueou-me logo a seguir.', '857654321', 3500.00, '2026-05-18', NULL, 'Em Análise'),
('SDB-2026-W11A5', 'Phishing', 'SMS imitando o banco Millennium BIM com um link clicável contendo "actualizacao-bim-mz". O link pede chaves de acesso ao NetBanking. Não cheguei a abrir mas denuncio o link.', NULL, 0.00, '2026-05-22', 'denunciante_anon@gmail.com', 'Confirmada')
ON DUPLICATE KEY UPDATE id=id;
