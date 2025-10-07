const http = require('http');
const url = require('url');
const crypto = require('crypto');

// Simulando dados do Somee
const usuarios = new Map();

// Admins pré-cadastrados
const admins = [
    { nome: 'mayconmoreira', email: 'maycon@pharmalife.com', senha: 'rm94602', isAdmin: true },
    { nome: 'felipeprestes', email: 'felipe@pharmalife.com', senha: 'rm94325', isAdmin: true },
    { nome: 'adrielfelipe', email: 'adriel@pharmalife.com', senha: 'rm94608', isAdmin: true },
    { nome: 'murilokffiner', email: 'murilo@pharmalife.com', senha: 'rm94705', isAdmin: true }
];

admins.forEach(admin => {
    const hashedSenha = hashSenha(admin.senha);
    usuarios.set(admin.nome, { ...admin, senha: hashedSenha });
    usuarios.set(admin.email, { ...admin, senha: hashedSenha });
});

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end('{}');
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (req.method === 'POST' && path === '/auth/registro') {
        handleRegistro(req, res);
    } else if (req.method === 'POST' && (path === '/auth/login' || path === '/auth/admin/login')) {
        handleLogin(req, res);
    } else {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Server running', database: 'Somee Connected' }));
    }
});

function handleRegistro(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { nome, email, senha, idade, comorbidade } = JSON.parse(body);
            
            if (usuarios.has(nome) || usuarios.has(email)) {
                res.writeHead(200);
                res.end(JSON.stringify({ erro: 'Email já cadastrado' }));
                return;
            }

            const novoUsuario = {
                nome,
                email,
                senha: hashSenha(senha),
                idade: idade || 0,
                comorbidade: comorbidade || null,
                isAdmin: false
            };

            usuarios.set(nome, novoUsuario);
            usuarios.set(email, novoUsuario);

            console.log(`✓ Usuário cadastrado: ${nome} (${email})`);

            res.writeHead(200);
            res.end(JSON.stringify({
                token: `token-${nome}`,
                usuario: { id: usuarios.size, nome, email }
            }));
        } catch (error) {
            res.writeHead(200);
            res.end(JSON.stringify({ erro: 'Erro interno do servidor' }));
        }
    });
}

function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { email, senha } = JSON.parse(body);
            const usuario = usuarios.get(email);

            if (usuario && usuario.senha === hashSenha(senha)) {
                console.log(`✓ Login: ${usuario.nome}${usuario.isAdmin ? ' (ADMIN)' : ''}`);
                
                res.writeHead(200);
                res.end(JSON.stringify({
                    token: `token-${usuario.nome}`,
                    usuario: { nome: usuario.nome, email: usuario.email },
                    isAdmin: usuario.isAdmin
                }));
            } else {
                res.writeHead(200);
                res.end(JSON.stringify({ erro: 'Credenciais inválidas' }));
            }
        } catch (error) {
            res.writeHead(200);
            res.end(JSON.stringify({ erro: 'Erro interno do servidor' }));
        }
    });
}

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`=== SERVIDOR JAVASCRIPT INICIADO ===`);
    console.log(`Porta: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Banco: Simulado com dados do Somee`);
});

module.exports = server;