<?php
/**
 * SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)
 * Ecrã de Confirmação e Código de Rastreio (confirmacao.php)
 */

require_once 'includes/config.php';
require_once 'includes/functions.php';

// Impedir que entrem sem submeter uma denúncia ativa
if (!isset($_SESSION['ultimo_codigo_sucesso'])) {
    header("Location: index.php");
    exit();
}

$codigo_rastreio = $_SESSION['ultimo_codigo_sucesso'];

// Limpar o código da sessão de modo a não re-exibir duplicados por recarga de página acidental
// No entanto, seguramos o valor numa variável local antes de apagar.
unset($_SESSION['ultimo_codigo_sucesso']);
?>
<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SDB-MZ - Denúncia Submetida com Sucesso!</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Font Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-light">

    <div class="flag-ribbon"></div>

    <div class="container py-5 my-md-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-7">
                
                <div class="card border-0 rounded-4 shadow p-4 p-md-5 text-center bg-white">
                    
                    <!-- Success Anim -->
                    <div class="mb-4">
                        <span class="p-4 bg-success bg-opacity-10 text-success rounded-circle d-inline-block" style="width: 100px; height: 100px; display: flex !important; align-items: center; justify-content: center; margin: 0 auto;">
                            <i class="fas fa-check-circle fa-4x text-moz-green animate-bounce"></i>
                        </span>
                    </div>
                    
                    <h1 class="fw-extrabold text-moz-green mb-3" style="font-weight: 850;">Denúncia Registada!</h1>
                    <p class="lead text-muted mb-4 small">
                        Agradecemos o seu contributo para tornar Moçambique um espaço digital mais seguro. A sua denúncia foi registada sob anonimato total nas nossas bases de dados federais.
                    </p>

                    <!-- Tracking Box -->
                    <div class="p-4 bg-light rounded-3 mb-4 border border-moz-green text-center">
                        <span class="text-uppercase text-muted font-monospace small d-block mb-1" style="letter-spacing:1px">CÓDIGO DE RASTREIO ÚNICO</span>
                        <h2 id="codigoRastreio" class="fw-bold text-dark font-monospace mb-3 select-all"><?php echo htmlspecialchars($codigo_rastreio); ?></h2>
                        
                        <!-- Copy Button with dynamic JS -->
                        <button id="btnCopiarRastreio" class="btn btn-outline-dark px-4 py-2 rounded-pill btn-sm">
                            <i class="far fa-copy me-2"></i>Copiar Código
                        </button>
                    </div>

                    <!-- Informative Alert -->
                    <div class="alert alert-warning border-0 bg-warning bg-opacity-10 p-3 mb-4 rounded-3 text-start text-dark">
                        <div class="d-flex align-items-start">
                            <i class="fas fa-exclamation-triangle text-warning me-3 mt-1 fs-5"></i>
                            <div>
                                <strong class="d-block mb-1">Aviso Crítico de Segurança:</strong>
                                <span class="small">Lembre-se de guardar ou tirar captura de ecrã (screenshot) deste código de imediato. Sendo um formulário totalmente anónimo, <strong>não fornecemos recuperação de códigos perdidos</strong> nas bases de dados, pois não temos logins associados de utilizadores comuns.</span>
                            </div>
                        </div>
                    </div>

                    <!-- Steps Timeline -->
                    <div class="text-start bg-light p-4 rounded-3 mb-5 border">
                        <h6 class="fw-bold mb-3"><i class="fas fa-info-circle me-2 text-primary"></i>O que acontece a seguir?</h6>
                        <ul class="list-unstyled mb-0 text-muted small" style="line-height: 1.7">
                            <li class="mb-2 d-flex"><i class="fas fa-search me-2 text-secondary mt-1"></i><span><strong>1. Fase de Triagem:</strong> O painel administrativo avalia e consolida o caso dentro das próximas 24-48 horas.</span></li>
                            <li class="mb-2 d-flex"><i class="fas fa-university me-2 text-secondary mt-1"></i><span><strong>2. Encaminhamento:</strong> Dados consolidados são submetidos anonimizados para provedores como Vodacom, Movitel, Tmcel e intermediários bancários.</span></li>
                            <li class="d-flex"><i class="fas fa-globe me-2 text-secondary mt-1"></i><span><strong>3. Alertas públicos:</strong> Indicadores confirmados de números de telefone fraudulentos e links falsos são atualizados em tempo real no nosso ecrã público.</span></li>
                        </ul>
                    </div>

                    <!-- Navigation Action buttons -->
                    <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
                        <a href="acompanhar.php?codigo=<?php echo urlencode($codigo_rastreio); ?>" class="btn btn-primary bg-moz-green border-0 px-4 py-3 rounded-pill fw-bold col-sm-6">
                            <i class="fas fa-search me-2"></i>Ir para Acompanhar
                        </a>
                        <a href="index.php" class="btn btn-outline-secondary px-4 py-3 rounded-pill col-sm-6">
                            <i class="fas fa-home me-2"></i>Voltar ao Início
                        </a>
                    </div>

                </div>

            </div>
        </div>
    </div>

    <!-- Bootstrap 5 Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
</body>
</html>
