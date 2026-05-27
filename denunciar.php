<?php
/**
 * SDB-MZ (Sistema de Denúncia de Burlas de Moçambique)
 * Formulário de Denúncias Anónimas (denunciar.php)
 */

require_once 'includes/config.php';
require_once 'includes/functions.php';

$erro_mensagem = null;
$sucesso_mensagem = null;

// Processar submissão do formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Verificar Termo de Verdade
    if (!isset($_POST['confirma_verdade'])) {
        $erro_mensagem = "Deve confirmar que as declarações desta denúncia são autênticas.";
    } 
    // 2. Verificar Rate Limiting Básico (máximo de 3 denúncias por minuto do mesmo IP)
    elseif (!verificarRateLimit($pdo)) {
        $erro_mensagem = "Detetada atividade excessiva. Por favor, aguarde um minuto antes de submeter outra denúncia.";
    } 
    else {
        // Capturar e sanitizar inputs
        $tipo_burla = filter_input(INPUT_POST, 'tipo_burla', FILTER_DEFAULT);
        $descricao = filter_input(INPUT_POST, 'descricao', FILTER_DEFAULT);
        $numero_suspeito = filter_input(INPUT_POST, 'numero_suspeito', FILTER_DEFAULT);
        $valor_envolvido = filter_input(INPUT_POST, 'valor_envolvido', FILTER_VALIDATE_FLOAT);
        $data_incidente = filter_input(INPUT_POST, 'data_incidente', FILTER_DEFAULT);
        $email_denunciante = filter_input(INPUT_POST, 'email_denunciante', FILTER_VALIDATE_EMAIL);
        
        // Se email for vazio na submissão, definir como NULL (para anonimato)
        if (empty($_POST['email_denunciante'])) {
            $email_denunciante = null;
        }

        // Validar campos obrigatórios
        $tipos_permitidos = ['M-Pesa/E-Mola', 'Redes Sociais', 'Phishing', 'Falso Investimento', 'Comércio Online', 'Outro'];
        
        if (!in_array($tipo_burla, $tipos_permitidos)) {
            $erro_mensagem = "Por favor, selecione um tipo de burla válido.";
        } elseif (empty($descricao) || strlen($descricao) < 15) {
            $erro_mensagem = "Por favor, descreva o incidente detalhadamente (no mínimo 15 caracteres).";
        } elseif (empty($data_incidente)) {
            $erro_mensagem = "Por favor, especifique a data aproximada em que ocorreu o incidente.";
        } else {
            // Processamento do Upload da Evidência
            $anexo_id = null;
            $ficheiro_config = null;
            $upload_ok = true;
            
            if (isset($_FILES['evidencias']) && $_FILES['evidencias']['error'] !== UPLOAD_ERR_NO_FILE) {
                $verificador = validarUpload($_FILES['evidencias']);
                
                if (!$verificador['valido']) {
                    $erro_mensagem = $verificador['erro'];
                    $upload_ok = false;
                } else {
                    $ficheiro_config = $_FILES['evidencias'];
                }
            }
            
            if ($upload_ok) {
                try {
                    // Iniciar transação para integridade referencial
                    $pdo->beginTransaction();
                    
                    // Gerar Código de Rastreio SDB-AAAA-XXXXX
                    $codigo_rastreio = gerarCodigoRastreio($pdo);
                    $ip_origem = obterIP();
                    
                    // Inserir denúncia no Banco de Dados
                    $stmt = $pdo->prepare("
                        INSERT INTO denuncias (codigo_rastreio, tipo_burla, descricao, numero_suspeito, valor_envolvido, data_incidente, email_denunciante, ip_origem, estado) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Em Análise')
                    ");
                    $stmt->execute([
                        $codigo_rastreio,
                        $tipo_burla,
                        $descricao,
                        $numero_suspeito ?: null,
                        $valor_envolvido ?: 0.00,
                        $data_incidente,
                        $email_denunciante,
                        $ip_origem
                    ]);
                    
                    $denuncia_id = $pdo->lastInsertId();
                    
                    // Processar e guardar o anexo se existir
                    if ($ficheiro_config) {
                        // Criar pasta de upload se não existir no servidor
                        $pasta_destino = 'uploads/';
                        if (!file_exists($pasta_destino)) {
                            mkdir($pasta_destino, 0755, true);
                        }
                        
                        // Gerar nome único seguro para o arquivo
                        $novo_nome = 'EVIDENCIA_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $verificador['extensao'];
                        $caminho_completo = $pasta_destino . $novo_nome;
                        
                        if (move_uploaded_file($ficheiro_config['tmp_name'], $caminho_completo)) {
                            // Inserir metadados da evidência
                            $stmtAnexo = $pdo->prepare("
                                INSERT INTO evidencias (denuncia_id, nome_ficheiro, caminho, tipo) 
                                VALUES (?, ?, ?, ?)
                            ");
                            $stmtAnexo->execute([
                                $denuncia_id,
                                $ficheiro_config['name'], // Nome original útil para visualização do Admin
                                $caminho_completo,
                                $verificador['tipo']
                            ]);
                        } else {
                            throw new Exception("Erro ao mover o ficheiro carregado para a pasta de destino.");
                        }
                    }
                    
                    // Concluir transação
                    $pdo->commit();
                    
                    // Guardar código na sessão para exibir de imediato no ecrã de confirmação de forma segura
                    $_SESSION['ultimo_codigo_sucesso'] = $codigo_rastreio;
                    
                    header("Location: confirmacao.php");
                    exit();
                    
                } catch (Exception $e) {
                    $pdo->rollBack();
                    $erro_mensagem = "Ocorreu um erro ao registar a denúncia: " . $e->getMessage();
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SDB-MZ - Registrar Denúncia Anónima</title>
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
            <div class="d-flex">
                <a href="index.php" class="btn btn-outline-light btn-sm px-3 py-2 rounded-pill"><i class="fas fa-home me-1"></i>Início</a>
            </div>
        </div>
    </nav>

    <!-- Main Form Section -->
    <main class="py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    
                    <!-- Back Link -->
                    <div class="mb-4">
                        <a href="index.php" class="text-decoration-none text-muted"><i class="fas fa-arrow-left me-2"></i>Voltar para a Página Inicial</a>
                    </div>
                    
                    <!-- Form Card Header -->
                    <div class="text-center mb-5">
                        <span class="p-3 bg-moz-green text-white rounded-circle d-inline-block shadow-sm mb-3">
                            <i class="fas fa-bullhorn fa-2x text-moz-yellow"></i>
                        </span>
                        <h2 class="fw-bold text-dark">Efetuar Denúncia de Burla</h2>
                        <p class="text-muted">Preencha o formulário abaixo de forma anónima. Guarde o seu código de rastreio para acompanhar o progresso.</p>
                    </div>

                    <!-- Alertas de erro/sucesso -->
                    <?php if ($erro_mensagem): ?>
                        <div class="alert alert-danger d-flex align-items-center border-0 shadow-sm p-3 mb-4 rounded-3" role="alert">
                            <i class="fas fa-exclamation-circle text-danger me-3 fa-lg"></i>
                            <div><strong>Erro: </strong> <?php echo htmlspecialchars($erro_mensagem); ?></div>
                        </div>
                    <?php endif; ?>

                    <!-- Form Content -->
                    <div class="p-4 p-md-5 form-container">
                        <form id="formDenuncia" method="POST" action="denunciar.php" enctype="multipart/form-data">
                            
                            <!-- Tipo de Burla -->
                            <div class="mb-4">
                                <label for="tipo_burla" class="form-label fw-bold text-dark">Tipo de Burla <span class="text-danger">*</span></label>
                                <select class="form-select form-select-lg" id="tipo_burla" name="tipo_burla" required>
                                    <option value="" disabled selected>Selecione o tipo de incidente...</option>
                                    <option value="M-Pesa/E-Mola" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'M-Pesa/E-Mola') ? 'selected' : ''; ?>>M-Pesa, E-Mola ou mKesh (SMS / Ligações / Códigos)</option>
                                    <option value="Redes Sociais" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'Redes Sociais') ? 'selected' : ''; ?>>Redes Sociais (WhatsApp, Facebook, Perfis falsos)</option>
                                    <option value="Phishing" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'Phishing') ? 'selected' : ''; ?>>Phishing (Links internet, SMS bancários falsos)</option>
                                    <option value="Falso Investimento" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'Falso Investimento') ? 'selected' : ''; ?>>Falso Investimento (Pirâmides financeiras, MZ-Rico, etc.)</option>
                                    <option value="Comércio Online" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'Comércio Online') ? 'selected' : ''; ?>>Comércio Online (Páginas de compras / Venda fictícia)</option>
                                    <option value="Outro" <?php echo (isset($_POST['tipo_burla']) && $_POST['tipo_burla'] == 'Outro') ? 'selected' : ''; ?>>Outro Tipo de Burla</option>
                                </select>
                                <div class="form-text">Assegure a escolha da categoria que melhor enquadra o incidente.</div>
                            </div>

                            <!-- Descrição -->
                            <div class="mb-4">
                                <label for="descricao" class="form-label fw-bold text-dark">Descrição Detalhada <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="descricao" name="descricao" rows="6" placeholder="Explique por favor como ocorreu a burla. Quais foram as instruções dadas pelos indivíduos? Quanto dinheiro pediram? O que disseram?" minlength="15" required><?php echo isset($_POST['descricao']) ? htmlspecialchars($_POST['descricao']) : ''; ?></textarea>
                                <div class="form-text d-flex justify-content-between">
                                    <span>Mínimo de 15 caracteres essenciais para a análise.</span>
                                    <span class="text-danger fw-bold">Não insira o seu próprio PIN ou palavras-passe!</span>
                                </div>
                            </div>

                            <div class="row">
                                <!-- Número Suspeito -->
                                <div class="col-md-6 mb-4">
                                    <label for="numero_suspeito" class="form-label fw-bold text-dark">Número do Burlão/Suspeito <span class="text-muted">(Opcional)</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-phone-alt"></i></span>
                                        <input type="text" class="form-control" id="numero_suspeito" name="numero_suspeito" value="<?php echo isset($_POST['numero_suspeito']) ? htmlspecialchars($_POST['numero_suspeito']) : ''; ?>" placeholder="ex: 84XXXXXXX / 85XXXXXXX">
                                    </div>
                                    <div class="form-text">O número que ligou, enviou SMS ou recebeu a transferência de dinheiro.</div>
                                </div>

                                <!-- Valor Envolvido -->
                                <div class="col-md-6 mb-4">
                                    <label for="valor_envolvido" class="form-label fw-bold text-dark">Valor Envolvido (MZN) <span class="text-muted">(Opcional)</span></label>
                                    <div class="input-group">
                                        <input type="number" step="0.01" class="form-control" id="valor_envolvido" name="valor_envolvido" value="<?php echo isset($_POST['valor_envolvido']) ? htmlspecialchars($_POST['valor_envolvido']) : ''; ?>" placeholder="ex: 5000">
                                        <span class="input-group-text font-monospace fw-bold">MZN</span>
                                    </div>
                                    <div class="form-text">Caso tenha havido prejuízo financeiro direto, indique para fins estatísticos.</div>
                                </div>
                            </div>

                            <div class="row">
                                <!-- Data do Incidente -->
                                <div class="col-md-6 mb-4">
                                    <label for="data_incidente" class="form-label fw-bold text-dark">Data do Incidente <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="data_incidente" name="data_incidente" value="<?php echo isset($_POST['data_incidente']) ? htmlspecialchars($_POST['data_incidente']) : date('Y-m-d'); ?>" required>
                                    <div class="form-text">Data aproximada em que o acontecimento ocorreu.</div>
                                </div>

                                <!-- E-mail de Atualização -->
                                <div class="col-md-6 mb-4">
                                    <label for="email_denunciante" class="form-label fw-bold text-dark">E-mail para Acompanhar <span class="text-muted">(Opcional)</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                        <input type="email" class="form-control" id="email_denunciante" name="email_denunciante" value="<?php echo isset($_POST['email_denunciante']) ? htmlspecialchars($_POST['email_denunciante']) : ''; ?>" placeholder="ex: usuario@gmail.com">
                                    </div>
                                    <div class="form-text">OPCIONAL. Usado apenas para receber e-mails de alteração de estado. Preserva o seu anonimato.</div>
                                </div>
                            </div>

                            <!-- Upload de Evidências -->
                            <div class="mb-4">
                                <label for="evidencias" class="form-label fw-bold text-dark">Carregar Prova / Anexo <span class="text-muted">(Opcional - Máx 5MB)</span></label>
                                <input type="file" class="form-control" id="evidencias" name="evidencias" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf">
                                <div id="ficheiroFeedback" class="form-text">Formatos permitidos: Imagens (JPG, PNG, WEBP, GIF) ou PDFs (ex: Capturas de ecrã SMS, talões de depósito M-Pesa).</div>
                            </div>

                            <!-- Checkbox Confirmação -->
                            <div class="form-check mb-4 p-3 bg-light rounded border border-warning border-opacity-50">
                                <input class="form-check-input ms-0 me-2" type="checkbox" value="1" id="confirma_verdade" name="confirma_verdade" required>
                                <label class="form-check-label text-dark small fw-medium" for="confirma_verdade">
                                    Confirmo voluntariamente que as informações prestadas são totalmente verdadeiras com base no meu leal conhecimento e que não estou a efetuar uma denúncia enganosa de má-fé contra terceiros.
                                </label>
                            </div>

                            <!-- Botões de Ação -->
                            <div class="d-grid gap-2 flex-md-row">
                                <button type="submit" class="btn btn-success btn-lg py-3 fw-bold bg-moz-green text-white border-0"><i class="fas fa-paper-plane me-2 text-moz-yellow"></i>SUBMETER DENÚNCIA ANÓNIMA</button>
                                <a href="index.php" class="btn btn-outline-secondary btn-lg py-3">Cancelar e Voltar</a>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-black text-white py-4 border-top border-white-50 border-opacity-10">
        <div class="container text-center">
            <span class="text-white-50 small">SDB-MZ &copy; 2026. Processamento sob encriptação robusta e confidencialidade.</span>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
</body>
</html>
