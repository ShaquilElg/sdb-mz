<?php
/**
 * SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)
 * Acompanhamento de Denúncias via Código de Rastreio (acompanhar.php)
 */

require_once 'includes/config.php';
require_once 'includes/functions.php';

$codigo_pesquisado = '';
$denuncia = null;
$erro = null;

// Capturar código enviado por GET (pesquisa imediata após redirecionamento) ou por POST
if (isset($_GET['codigo'])) {
    $codigo_pesquisado = trim($_GET['codigo']);
} elseif (isset($_POST['codigo'])) {
    $codigo_pesquisado = trim($_POST['codigo']);
}

if (!empty($codigo_pesquisado)) {
    // Sanitização básica do código de rastreio para evitar caracteres nocivos
    $codigo_pesquisado = strtoupper(preg_replace('/[^a-zA-Z0-9\-]/', '', $codigo_pesquisado));
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM denuncias WHERE codigo_rastreio = ?");
        $stmt->execute([$codigo_pesquisado]);
        $denuncia = $stmt->fetch();
        
        if (!$denuncia) {
            $erro = "Nenhum caso encontrado com o código especificado. Verifique a grafia (ex: SDB-2026-F89A5) e tente novamente.";
        }
    } catch (PDOException $e) {
        $erro = "Erro interno do servidor ao processar a consulta.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SDB-MZ - Acompanhar Denúncia de Burlas</title>
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
            <div class="d-flex w-sm-auto">
                <a href="index.php" class="btn btn-outline-light me-2 btn-sm px-3 py-2 rounded-pill"><i class="fas fa-home me-1"></i>Início</a>
                <a href="denunciar.php" class="btn btn-warning btn-sm px-3 py-2 rounded-pill fw-bold bg-moz-yellow text-dark border-0"><i class="fas fa-plus-circle me-1"></i>Denunciar</a>
            </div>
        </div>
    </nav>

    <!-- Main Section -->
    <main class="py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    
                    <!-- Search Card Box -->
                    <div class="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-5 bg-white">
                        <div class="text-center mb-4">
                            <span class="p-3 bg-secondary bg-opacity-10 text-dark rounded-circle d-inline-block shadow-sm mb-3" style="width: 70px; height: 70px; display: inline-flex !important; align-items: center; justify-content: center;">
                                <i class="fas fa-search fa-2x text-moz-green"></i>
                            </span>
                            <h2 class="fw-bold">Rastrear Código de Denúncia</h2>
                            <p class="text-muted small">Insira abaixo o código de rastreio gerado no final do registo da sua denúncia para verificar o estado de avanço.</p>
                        </div>

                        <form method="POST" action="acompanhar.php" class="row g-2 justify-content-center">
                            <div class="col-md-8">
                                <div class="input-group input-group-lg border-2">
                                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="fas fa-key"></i></span>
                                    <input type="text" 
                                           class="form-control border-start-0 font-monospace text-uppercase" 
                                           id="codigo" 
                                           name="codigo" 
                                           value="<?php echo htmlspecialchars($codigo_pesquisado); ?>" 
                                           placeholder="SDB-2026-F89A5" 
                                           required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <button type="submit" class="btn btn-success btn-lg w-100 py-3 fw-bold bg-moz-green border-0"><i class="fas fa-search me-2 text-moz-yellow"></i>PESQUISAR</button>
                            </div>
                        </form>
                    </div>

                    <!-- Mensagem de Erro se houver -->
                    <?php if ($erro): ?>
                        <div class="alert alert-danger d-flex align-items-center border-0 shadow-sm p-4 rounded-3" role="alert">
                            <i class="fas fa-times-circle text-danger me-3 fa-2x"></i>
                            <div><strong>Rastreamento Inválido: </strong><br> <?php echo htmlspecialchars($erro); ?></div>
                        </div>
                    <?php endif; ?>

                    <!-- Resultados do Caso Encontrado -->
                    <?php if ($denuncia): ?>
                        <div class="card border-0 rounded-4 shadow-sm tracking-card bg-white p-4 p-md-5 mb-5">
                            
                            <!-- Header Estado do Caso -->
                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-4 mb-4 gap-3">
                                <div>
                                    <span class="text-muted font-monospace small">CÓDIGO DE RASTREIO</span>
                                    <h4 class="fw-bold text-dark font-monospace mb-0"><?php echo htmlspecialchars($denuncia['codigo_rastreio']); ?></h4>
                                </div>
                                <div>
                                    <span class="text-muted small d-block mb-1 text-sm-end">ESTADO DA DENÚNCIA</span>
                                    <span class="badge <?php echo obterClasseEstado($denuncia['estado']); ?> py-2 px-4 rounded-pill fw-bold fs-6">
                                        <i class="fas fa-circle-notch fa-spin me-2 scale-110"></i><?php echo htmlspecialchars($denuncia['estado']); ?>
                                    </span>
                                </div>
                            </div>

                            <!-- Case Timeline Details -->
                            <h5 class="fw-bold mb-4 text-dark"><i class="fas fa-stream me-2 text-moz-green"></i>Informações Consolidadas do Incidente</h5>
                            <div class="table-responsive">
                                <table class="table table-bordered bg-light">
                                    <tbody>
                                        <tr>
                                            <th class="w-33 bg-light-gray small text-uppercase py-3 px-3">Tipo de Burla</th>
                                            <td class="py-3 px-3 fw-bold"><?php echo htmlspecialchars($denuncia['tipo_burla']); ?></td>
                                        </tr>
                                        <tr>
                                            <th class="bg-light-gray small text-uppercase py-3 px-3">Data do Incidente</th>
                                            <td class="py-3 px-3"><?php echo date('d/m/Y', strtotime($denuncia['data_incidente'])); ?></td>
                                        </tr>
                                        <tr>
                                            <th class="bg-light-gray small text-uppercase py-3 px-3">Número Suspeito Reportado</th>
                                            <td class="py-3 px-3 font-monospace fw-bold <?php echo $denuncia['numero_suspeito'] ? 'text-danger' : 'text-muted'; ?>">
                                                <?php echo $denuncia['numero_suspeito'] ? htmlspecialchars($denuncia['numero_suspeito']) : 'Nenhum especificado'; ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="bg-light-gray small text-uppercase py-3 px-3">Dança Monetária (Prejuízo)</th>
                                            <td class="py-3 px-3 font-monospace fw-bold text-success">
                                                <?php echo formatarMeticais($denuncia['valor_envolvido']); ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="bg-light-gray small text-uppercase py-3 px-3">Data de Envio</th>
                                            <td class="py-3 px-3"><?php echo date('d/m/Y H:i:s', strtotime($denuncia['data_criacao'])); ?></td>
                                        </tr>
                                        <tr>
                                            <th class="bg-light-gray small text-uppercase py-3 px-3">Última Atualização estatal</th>
                                            <td class="py-3 px-3 text-muted"><?php echo date('d/m/Y H:i:s', strtotime($denuncia['data_atualizacao'])); ?></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Timeline Progress UI -->
                            <div class="my-4">
                                <h6 class="fw-bold text-dark mb-3"><i class="fas fa-project-diagram me-2 text-primary"></i>Fluxo de Resolução do seu Processo</h6>
                                <div class="d-flex flex-column gap-3 mt-3">
                                    
                                    <!-- Passo 1: Receção -->
                                    <div class="d-flex border-start border-2 border-success ps-3 pb-2 position-relative">
                                        <div class="position-absolute" style="left: -9px; top: 0; width: 16px; height: 16px; border-radius: 50%; background-color: #198754;"></div>
                                        <div>
                                            <span class="fw-bold d-block small">Denúncia Recebida com Sucesso</span>
                                            <p class="text-muted small mb-0">O incidente foi encapsulado sob criptografia e guardado de forma anónima às autoridades.</p>
                                        </div>
                                    </div>

                                    <!-- Passo 2: Triagem (condicionado ao estado) -->
                                    <?php 
                                    $estAnalisando = in_array($denuncia['estado'], ['Confirmada', 'Em Investigação', 'Resolvida']);
                                    $estRejeitada = $denuncia['estado'] == 'Rejeitada';
                                    $borderTriagemClass = $estAnalisando ? 'border-success' : ($estRejeitada ? 'border-danger' : 'border-secondary');
                                    $bulletTriagemClass = $estAnalisando ? 'bg-success' : ($estRejeitada ? 'bg-danger' : 'bg-secondary');
                                    ?>
                                    <div class="d-flex border-start border-2 <?php echo $borderTriagemClass; ?> ps-3 pb-2 position-relative">
                                        <div class="position-absolute" style="left: -9px; top: 0; width: 16px; height: 16px; border-radius: 50%; background-color: <?php echo $estAnalisando ? '#198754' : ($estRejeitada ? '#dc3545' : '#6c757d'); ?>;"></div>
                                        <div>
                                            <span class="fw-bold d-block small">Avaliação & Consolidação das Capturas</span>
                                            <p class="text-muted small mb-0">
                                                <?php if($estRejeitada): ?>
                                                    O caso foi analisado e rejeitado por falta de consistência ou suspeitas de uso mal-intencionado das evidências.
                                                <?php elseif($estAnalisando): ?>
                                                    Triagem concluída. As provas e capturas carregadas foram consolidadas com sucesso na nossa lista de fraude bancária digital.
                                                <?php else: ?>
                                                    Fase pendente. O caso está na fila de espera dos administradores públicos do SDB-MZ.
                                                <?php endif; ?>
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Passo 3: Resolução (Resolvida) -->
                                    <?php 
                                    $estResolvida = $denuncia['estado'] == 'Resolvida';
                                    $borderResClass = $estResolvida ? 'border-success' : 'border-secondary';
                                    $bulletResClass = $estResolvida ? '#198754' : '#6c757d';
                                    ?>
                                    <div class="d-flex ps-3 pb-2 position-relative">
                                        <div class="position-absolute" style="left: -7px; top: 0; width: 16px; height: 16px; border-radius: 50%; background-color: <?php echo $bulletResClass; ?>;"></div>
                                        <div>
                                            <span class="fw-bold d-block small">Encaminhamento & Alerta Público</span>
                                            <p class="text-muted small mb-0">
                                                <?php if($estResolvida): ?>
                                                    Resolvido! O número do burlão foi indexado nos alertas públicos do site. As provas foram enviadas às operadoras de telecomunicações para bloqueio do cartão SIM.
                                                <?php else: ?>
                                                    Pendente. O número suspeito encontra-se em fase de triagem preventiva até o fecho do processo.
                                                <?php endif; ?>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="bg-light p-3 rounded border text-muted small mt-2">
                                <i class="fas fa-lock me-2 text-success"></i> Segurança assegurada: A sua sessão de pesquisa é realizada sob segurança HTTPS. Nenhuns rastros são gravados nas suas cookies locais.
                            </div>
                        </div>
                    <?php endif; ?>

                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-black text-white py-4 mt-auto border-top border-white-50 border-opacity-10">
        <div class="container text-center">
            <span class="text-white-50 small">SDB-MZ &copy; 2026. Feito por Moçambicanos para Moçambicanos.</span>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
</body>
</html>
