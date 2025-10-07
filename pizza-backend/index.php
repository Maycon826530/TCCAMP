<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo '{}';
    exit;
}

$servername = "tccamp2.mssql.somee.com";
$username = "Noc";
$password = "12345678";
$dbname = "tccamp2";

try {
    $pdo = new PDO("sqlsrv:server=$servername;Database=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['erro' => 'Erro de conexão']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'POST' && $path === '/auth/registro') {
    registrarUsuario($pdo);
} elseif ($method === 'POST' && ($path === '/auth/login' || $path === '/auth/admin/login')) {
    loginUsuario($pdo);
} else {
    echo json_encode(['message' => 'Server running', 'database' => 'Somee Connected']);
}

function registrarUsuario($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $nome = $input['nome'] ?? '';
    $email = $input['email'] ?? '';
    $senha = $input['senha'] ?? '';
    $idade = $input['idade'] ?? 0;
    $comorbidade = $input['comorbidade'] ?? null;
    
    // Verificar se email já existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuario WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['erro' => 'Email já cadastrado']);
        return;
    }
    
    // Inserir usuário
    $stmt = $pdo->prepare("INSERT INTO usuario (nome, email, senha, idade, comorbidade, isAdmin, dataCadastro) VALUES (?, ?, ?, ?, ?, 0, GETDATE())");
    $stmt->execute([$nome, $email, hash('sha256', $senha), $idade, $comorbidade]);
    
    $id = $pdo->lastInsertId();
    
    echo json_encode([
        'token' => "token-$id",
        'usuario' => ['id' => $id, 'nome' => $nome, 'email' => $email]
    ]);
}

function loginUsuario($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $senha = $input['senha'] ?? '';
    
    $stmt = $pdo->prepare("SELECT id, nome, email, isAdmin FROM usuario WHERE (email = ? OR nome = ?) AND senha = ?");
    $stmt->execute([$email, $email, hash('sha256', $senha)]);
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode([
            'token' => "token-{$row['id']}",
            'usuario' => ['id' => $row['id'], 'nome' => $row['nome'], 'email' => $row['email']],
            'isAdmin' => (bool)$row['isAdmin']
        ]);
    } else {
        echo json_encode(['erro' => 'Credenciais inválidas']);
    }
}
?>