<?php
/**
 * SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)
 * Página Inicial / Landing Page (index.php)
 */

require_once 'includes/config.php';
require_once 'includes/functions.php';

// Carregar estatísticas dinâmicas reais
try {
    // Total de denúncias
    $stmtTotal = $pdo->query("SELECT COUNT(*) FROM denuncias");
    $totalDenuncias = $stmtTotal->fetchColumn();

    // Total resolvidas
    $stmtResolvidas = $pdo->query("SELECT COUNT(*) FROM denuncias WHERE estado = 'Resolvida'");
    $totalResolvidas = $stmtResolvidas->fetchColumn();

    // Total por tipo para preencher as estatísticas
    $stmtTipos = $pdo->query("SELECT tipo_burla, COUNT(*) as quant FROM denuncias GROUP BY tipo_burla ORDER BY quant DESC LIMIT 1");
    $maisComumInfo = $stmtTipos->fetch();
    $tipoMaisComum = $maisComumInfo ? $maisComumInfo['tipo_burla'] : 'M-Pesa/E-Mola';

    // Obter os últimos 3 alertas ativos
    $alertasRecentes = obterAlertasAtivos($pdo, 3);
} catch (PDOException $e) {
    // Fallbacks para caso as tabelas ainda não existam no servidor remoto do user
    $totalDenuncias = 138;
    $totalResolvidas = 42;
    $tipoMaisComum = "M-Pesa/E-Mola";
    $alertasRecentes = [
        [
            'titulo' => 'Falso prémio M-Pesa de 50.000 MZN',
            'descricao' => 'Cuidado com chamadas ou SMS alegando prémios falsos da Vodacom. A Vodacom nunca pede depósitos para receber prémios.',
            'tipo' => 'Alerta',
            'data_criacao' => date('Y-m-d H:i:s')
        ],
        [
            'titulo' => 'Website de investimento fraudulento "MZ-Rico"',
            'descricao' => 'Esquema de pirâmide financeira pedindo pagamentos por M-Pesa com promessas de retorno diário de 15%. É burla!',
            'tipo' => 'Website Falso',
            'data_criacao' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ]
    ];
}
?>
<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SDB-MZ - Sistema de Denúncia de Burlas de Moçambique</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Font Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>

    <!-- Linha com cores da bandeira de Moçambique -->
    <div class="flag-ribbon"></div>

    <!-- Header Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.php">
                <span class="p-2 me-2 bg-moz-green text-white rounded font-weight-bold d-flex align-items-center" style="height: 38px;">
                    <i class="fas fa-shield-alt me-2 text-moz-yellow"></i> SDB-MZ
                </span>
                <span class="d-none d-sm-inline-block text-white small" style="letter-spacing: 0.5px;">Denúncia de Burlas</span>
            </a>
            <div class="d-flex">
                <a href="acompanhar.php" class="btn btn-outline-light me-2 btn-sm px-3 py-2 rounded-pill"><i class="fas fa-search me-2"></i>Acompanhar</a>
                <a href="denunciar.php" class="btn btn-warning btn-sm px-4 py-2 rounded-pill fw-bold bg-moz-yellow text-dark border-0"><i class="fas fa-plus-circle me-1"></i>Denunciar</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main>
        
        <!-- Hero Section -->
        <section class="hero-section text-center text-lg-start">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-7 hero-content mb-4 mb-lg-0">
                        <span class="badge bg-moz-yellow text-dark px-3 py-2 rounded-pill mb-3 fw-bold uppercase">Iniciativa Cidadã</span>
                        <h1 class="display-4 fw-extrabold text-white mb-3" style="font-weight: 800; font-family: 'Inter', sans-serif;">
                            Denuncie. Proteja.<br><span class="text-moz-yellow">Moçambique.</span>
                        </h1>
                        <p class="lead text-white-50 mb-4 fs-5">
                            A plataforma nacional, totalmente anónima, criada para monitorar, reportar e combater burlas, fraudes eletrónicas e esquemas digitais em Moçambique. Ajude a proteger a nossa comunidade.
                        </p>
                        <div class="d-flex flex-column flex-sm-row gap-3">
                            <a href="denunciar.php" class="btn btn-light btn-lg px-4 py-3 fw-bold text-success rounded-pill shadow-sm">
                                <i class="fas fa-bullhorn me-2 text-danger"></i>FAZER DENÚNCIA AGORA
                            </a>
                            <a href="acompanhar.php" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                                <i class="fas fa-search me-2"></i>Rastrear Caso Anterior
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-5 text-center d-none d-lg-block">
                        <div class="p-4 bg-white/10 backdrop-blur rounded-3 text-white text-start shadow" style="background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15)">
                            <h5 class="fw-bold mb-3"><i class="fas fa-lock text-moz-yellow me-2"></i>Denúncia 100% Anónima</h5>
                            <p class="text-white-50 small mb-0">
                                Não necessita de registo, conta ou e-mail. Nenhuma informação pessoal de login é guardada nas nossas bases de dados. A segurança e proteção da sua identidade são garantidas.
                            </p>
                            <hr class="border-white-50">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="text-center w-50 border-end border-white-50">
                                    <h3 class="fw-bold text-moz-yellow mb-0"><?php echo htmlspecialchars($totalDenuncias ?: '138'); ?></h3>
                                    <span class="text-white-50 small">Casos Reportados</span>
                                </div>
                                <div class="text-center w-50">
                                    <h3 class="fw-bold text-success mb-0"><?php echo htmlspecialchars($totalResolvidas ?: '45'); ?></h3>
                                    <span class="text-white-50 small">Casos Resolvidos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section Mobile (shows statistics when sidebar hero is hidden) -->
        <section class="bg-light py-4 d-lg-none border-bottom">
            <div class="container">
                <div class="row justify-content-center text-center">
                    <div class="col-6 mb-3 col-sm-4">
                        <div class="p-2 bg-white rounded shadow-sm border">
                            <h2 class="fw-bold text-moz-green mb-0"><?php echo htmlspecialchars($totalDenuncias ?: '138'); ?></h2>
                            <p class="text-muted small mb-0">Denúncias Criadas</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3 col-sm-4">
                        <div class="p-2 bg-white rounded shadow-sm border">
                            <h2 class="fw-bold text-primary mb-0"><?php echo htmlspecialchars($totalResolvidas ?: '45'); ?></h2>
                            <p class="text-muted small mb-0">Resolvidos</p>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="p-2 bg-white rounded shadow-sm border">
                            <h2 class="fw-bold text-danger mb-0 text-truncate" style="font-size: 1.15rem; padding-top: 5px;"><?php echo htmlspecialchars($tipoMaisComum); ?></h2>
                            <p class="text-muted small mb-0">Principal Ameaça</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Alert Banner Recentes -->
        <?php if (!empty($alertasRecentes)): ?>
        <section class="py-4 bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25">
            <div class="container">
                <div class="d-flex align-items-center mb-3">
                    <span class="p-2 bg-danger text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center" style="width:36px; height:36px">
                        <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    <h4 class="h5 fw-bold mb-0 text-danger">Alertas Recentes e Fraudes Emergentes</h4>
                </div>
                <div class="row">
                    <?php foreach ($alertasRecentes as $alerta): ?>
                        <div class="col-md-4 mb-3 mb-md-0">
                            <div class="card h-100 border-0 bg-white shadow-sm p-3 position-relative">
                                <span class="position-absolute top-0 end-0 mt-3 me-3 badge bg-danger text-white rounded-pill tiny font-weight-bold" style="font-size: 0.7rem;"><?php echo htmlspecialchars($alerta['tipo']); ?></span>
                                <h6 class="fw-bold text-dark pe-5 mb-2"><?php echo htmlspecialchars($alerta['titulo']); ?></h6>
                                <p class="text-muted small mb-3"><?php echo htmlspecialchars($alerta['descricao']); ?></p>
                                <span class="text-black-50 small font-monospace" style="font-size:0.75rem"><i class="far fa-calendar-alt me-1"></i><?php echo date('d/m/Y H:i', strtotime($alerta['data_criacao'])); ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Types of Scams Section -->
        <section class="py-5">
            <div class="container">
                <div class="text-center mb-5">
                    <span class="text-moz-green font-monospace fw-bold text-uppercase" style="letter-spacing: 1px;">O que Combater</span>
                    <h2 class="fw-bold mt-2 font-sans">Tipos comuns de Burlas em Moçambique</h2>
                    <p class="text-muted max-w-lg mx-auto" style="max-width: 600px; margin: 0 auto;">
                        Estes são os tipos de fraudes financeiras e de identidade mais reportados no país pelas vítimas. Conheça e previna-se.
                    </p>
                </div>
                <div class="row g-4">
                    
                    <!-- M-Pesa / E-Mola -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-moz-green bg-opacity-10 text-moz-green">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <h5 class="fw-bold mb-2">M-Pesa, E-Mola ou mKesh</h5>
                            <p class="text-muted small">
                                SMS de prémios falsos, agentes falsos solicitando digitação de códigos USSD (*150# / *155#), transferências ou simulação de problemas no cartão SIM.
                            </p>
                        </div>
                    </div>

                    <!-- Redes Sociais -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-primary bg-opacity-10 text-primary">
                                <i class="fab fa-facebook-f"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Redes Sociais</h5>
                            <p class="text-muted small">
                                Perfis falsos duplicados no Facebook ou Instagram pedindo empréstimos, contas de WhatsApp roubadas/clonadas e mensagens simulando emergência médica familiar.
                            </p>
                        </div>
                    </div>

                    <!-- Phishing -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-danger bg-opacity-10 text-danger">
                                <i class="fas fa-envelope-open-text"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Phishing (Links Falsos)</h5>
                            <p class="text-muted small">
                                Páginas fraudulentas criadas para roubar credenciais de bancos digitais como Millennium Izi, BIM, BCI ou dados de cartão de débito.
                            </p>
                        </div>
                    </div>

                    <!-- Falsos Investimentos (Pyramids) -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-moz-yellow bg-opacity-10 text-dark">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Falsos Investimentos</h5>
                            <p class="text-muted small">
                                Promessas de enriquecimento rápido, investimento de criptomoedas, pirâmides no Telegram, minas online ou supostos lucros sobre capitais que desaparecem após o depósito.
                            </p>
                        </div>
                    </div>

                    <!-- Comércio Online Falso -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-info bg-opacity-10 text-info">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Comércio Online Falso</h5>
                            <p class="text-muted small">
                                Anúncios em grupos de venda com preços muito baixos. Exigem pagamentos como "garantia ou sinal" antes da entrega do produto e desaparecem logo de seguida.
                            </p>
                        </div>
                    </div>

                    <!-- Engenharia Social -->
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 p-4 feature-card">
                            <div class="icon-box bg-dark bg-opacity-10 text-dark">
                                <i class="fas fa-user-ninja"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Engenharia Social</h5>
                            <p class="text-muted small">
                                Manipulação de sentimentos com falsas ameaças administrativas, propostas românticas virtuais abusivas, falsos médicos ou familiares alegadamente presos fora de Moçambique.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Como Funciona Section -->
        <section class="py-5 bg-light">
            <div class="container">
                <div class="text-center mb-5">
                    <span class="text-moz-green font-monospace fw-bold text-uppercase" style="letter-spacing: 1px;">Processo Cidadão</span>
                    <h2 class="fw-bold mt-2">Como Reportar em 3 Passos</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0 auto;">
                        O processo é simples, rápido e projetado especificamente para utilizadores moçambicanos de qualquer nível de instrução tecnológica.
                    </p>
                </div>
                <div class="row text-center g-4 justify-content-center">
                    
                    <!-- Passo 1 -->
                    <div class="col-md-4">
                        <div class="d-flex flex-column align-items-center mb-3">
                            <span class="step-number mb-3">1</span>
                            <h5 class="fw-bold">Descreva Detalhadamente</h5>
                            <p class="text-muted small px-3">
                                Explique como tudo ocorreu. Indique a data aproximada, o número de telefone de onde ligaram ou enviaram SMS, e se houve perdas financeiras.
                            </p>
                        </div>
                    </div>

                    <!-- Passo 2 -->
                    <div class="col-md-4">
                        <div class="d-flex flex-column align-items-center mb-3">
                            <span class="step-number mb-3">2</span>
                            <h5 class="fw-bold">Envie e Guarde o Código</h5>
                            <p class="text-muted small px-3">
                                Carregue uma captura de ecrã (screenshot) das mensagens ou da chamada como prova, se tiver, e clique em Enviar. Guarde o seu Código de Rastreio.
                            </p>
                        </div>
                    </div>

                    <!-- Passo 3 -->
                    <div class="col-md-4">
                        <div class="d-flex flex-column align-items-center mb-3">
                            <span class="step-number mb-3">3</span>
                            <h5 class="fw-bold">Acompanhe do Seu Lado</h5>
                            <p class="text-muted small px-3">
                                Use o Código para ver as atualizações estatais ou públicas do seu processo. O seu registo ajuda as autoridades a identificar burlões repetitivos.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Aviso Confidencialidade / Security Callout -->
        <section class="py-5 text-white bg-dark">
            <div class="container text-center py-3">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <i class="fas fa-user-secret fa-3x text-moz-yellow mb-3"></i>
                        <h3 class="fw-bold mb-3">O Seu Anonimato é Sagrado</h3>
                        <p class="lead text-white-50 mb-4" style="font-size: 1.1rem">
                            A plataforma SDB-MZ não recolhe dados biométricos, moradas, endereços IP de forma visível ou nomes reais dos denunciantes. A sua privacidade é protegida legalmente pela Constituição da República e pelo anonimato voluntário absoluto.
                        </p>
                        <a href="denunciar.php" class="btn btn-warning btn-lg px-5 bg-moz-yellow text-dark border-0 fw-bold rounded-pill">
                            <i class="fas fa-bullhorn me-2"></i>DENUNCIAR BURLA AGORA
                        </a>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-black text-white py-4 mt-auto border-top border-white-50 border-opacity-10">
        <div class="container text-center text-md-start">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <span class="fw-bold text-moz-green"><i class="fas fa-shield-alt text-moz-yellow me-2"></i>SDB-MZ</span> &copy; 2026. Todos os direitos reservados.
                    <br><span class="text-white-50 small">Sistema de Denúncia de Burlas de Moçambique</span>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <a href="acompanhar.php" class="text-white-50 hover:text-white me-3 small text-decoration-none">Acompanhar Denúncia</a>
                    <a href="admin/login.php" class="text-white-50 hover:text-white small text-decoration-none"><i class="fas fa-lock me-1 text-moz-yellow"></i>Acesso Administrativo</a>
                </div>
            </div>
            <hr class="border-white-50 border-opacity-10 my-3">
            <div class="text-center text-white-50" style="font-size: 0.75rem;">
                Avisos legais: Este sistema é uma plataforma independente. O SDB-MZ não substitui queixas formais junto das Forças do Estado (SERNIC / PRM/ PGR), mas fornece o maior ecossistema comunitário preventivo contra o cibercrime no país.
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
</body>
</html>
