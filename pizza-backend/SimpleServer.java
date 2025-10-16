import java.io.*;
import java.net.*;
import java.util.*;
import java.sql.*;
import java.security.MessageDigest;

public class SimpleServer {
    private static final String DB_URL = System.getenv().getOrDefault("DB_URL", "jdbc:sqlserver://localhost:1433;databaseName=pharmalife;encrypt=true;trustServerCertificate=true");
    private static final String DB_USER = System.getenv().getOrDefault("DB_USERNAME", "sa");
    private static final String DB_PASS = System.getenv().getOrDefault("DB_PASSWORD", "password");
    
    static {
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        } catch (ClassNotFoundException e) {
            // Driver não encontrado
        }
    }
    
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8080);
        // Servidor iniciado na porta 8080
        
        while (true) {
            Socket client = server.accept();
            new Thread(() -> handleRequest(client)).start();
        }
    }
    
    private static void handleRequest(Socket client) {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            PrintWriter out = new PrintWriter(client.getOutputStream());
            
            String requestLine = in.readLine();
            if (requestLine == null || requestLine.trim().isEmpty()) {
                return;
            }
            
            // Validar contra path traversal
            if (requestLine.contains("../") || requestLine.contains("..\\")) {
                out.println("HTTP/1.1 400 Bad Request");
                out.println();
                out.println("{\"erro\": \"Requisição inválida\"}");
                out.flush();
                client.close();
                return;
            }
            
            String contentLength = "";
            String line;
            
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                if (line.startsWith("Content-Length:")) {
                    contentLength = line.split(":")[1].trim();
                }
            }
            
            String body = "";
            if (!contentLength.isEmpty()) {
                int length = Integer.parseInt(contentLength);
                char[] buffer = new char[length];
                in.read(buffer, 0, length);
                body = new String(buffer);
            }
            
            // Request processed
            
            out.println("HTTP/1.1 200 OK");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type, Authorization");
            out.println("Content-Type: application/json");
            out.println();
            
            if (requestLine.contains("OPTIONS")) {
                out.println("{}");
            } else if (requestLine.contains("POST /auth/login") || requestLine.contains("POST /auth/admin/login")) {
                String response = loginUsuario(body);
                out.println(response);
            } else if (requestLine.contains("POST /auth/registro")) {
                String response = registrarUsuario(body);
                out.println(response);
            } else if (requestLine.contains("PUT /usuarios/atualizar-senha-nome")) {
                String response = atualizarSenhaNome(body);
                out.println(response);
            } else if (requestLine.contains("POST /medicamentos")) {
                out.println("{\"id\": 1, \"nome\": \"Medicamento\", \"dosagem\": \"50mg\", \"horario\": \"08:00\", \"frequencia\": \"Diario\"}");
            } else if (requestLine.contains("GET /medicamentos/usuario/")) {
                out.println("[]");
            } else {
                out.println("{\"message\": \"Server running\"}");
            }
            
            out.flush();
            client.close();
        } catch (Exception e) {
            // Erro no processamento da requisição
        }
    }
    
    private static String registrarUsuario(String body) {
        try {
            // Parse JSON simples
            String nome = extrairCampo(body, "nome");
            String email = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            String idade = extrairCampo(body, "idade");
            String comorbidade = extrairCampo(body, "comorbidade");
            
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            
            // Verificar se email já existe
            PreparedStatement checkStmt = conn.prepareStatement("SELECT COUNT(*) FROM usuario WHERE email = ?");
            checkStmt.setString(1, email);
            ResultSet rs = checkStmt.executeQuery();
            rs.next();
            if (rs.getInt(1) > 0) {
                conn.close();
                return "{\"erro\": \"Email já cadastrado\"}";
            }
            
            // Inserir usuário
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO usuario (nome, email, senha, idade, comorbidade, isAdmin, dataCadastro) VALUES (?, ?, ?, ?, ?, 0, GETDATE())",
                Statement.RETURN_GENERATED_KEYS
            );
            stmt.setString(1, nome);
            stmt.setString(2, email);
            stmt.setString(3, hashSenha(senha));
            stmt.setInt(4, idade.isEmpty() ? 0 : Integer.parseInt(idade));
            stmt.setString(5, comorbidade.isEmpty() ? null : comorbidade);
            
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();
            keys.next();
            int id = keys.getInt(1);
            
            conn.close();
            return "{\"token\": \"token-" + id + "\", \"usuario\": {\"id\": " + id + ", \"nome\": \"" + nome + "\", \"email\": \"" + email + "\"}}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String loginUsuario(String body) {
        try {
            String email = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT id, nome, email, isAdmin FROM usuario WHERE (email = ? OR nome = ?) AND senha = ?"
            );
            stmt.setString(1, email);
            stmt.setString(2, email);
            stmt.setString(3, hashSenha(senha));
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                String emailDb = rs.getString("email");
                boolean isAdmin = rs.getBoolean("isAdmin");
                
                conn.close();
                return "{\"token\": \"token-" + id + "\", \"usuario\": {\"id\": " + id + ", \"nome\": \"" + nome + "\", \"email\": \"" + emailDb + "\"}, \"isAdmin\": " + isAdmin + "}";
            }
            
            conn.close();
            return "{\"erro\": \"Credenciais inválidas\"}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String extrairCampo(String json, String campo) {
        String busca = "\"" + campo + "\":\"";
        int inicio = json.indexOf(busca);
        if (inicio == -1) return "";
        inicio += busca.length();
        int fim = json.indexOf("\"", inicio);
        return json.substring(inicio, fim);
    }
    

    
    private static String atualizarSenhaNome(String body) {
        try {
            String userId = extrairCampo(body, "userId");
            String nome = extrairCampo(body, "nome");
            String senhaAtual = extrairCampo(body, "senhaAtual");
            String novaSenha = extrairCampo(body, "novaSenha");
            
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            
            // Verificar senha atual
            PreparedStatement checkStmt = conn.prepareStatement("SELECT senha FROM usuario WHERE id = ?");
            checkStmt.setInt(1, Integer.parseInt(userId));
            ResultSet rs = checkStmt.executeQuery();
            
            if (!rs.next()) {
                conn.close();
                return "{\"erro\": \"Usuário não encontrado\"}";
            }
            
            String senhaDb = rs.getString("senha");
            if (!senhaDb.equals(hashSenha(senhaAtual))) {
                conn.close();
                return "{\"erro\": \"Senha atual incorreta\"}";
            }
            
            // Atualizar nome e senha
            PreparedStatement updateStmt = conn.prepareStatement(
                "UPDATE usuario SET nome = ?, senha = ? WHERE id = ?"
            );
            updateStmt.setString(1, nome);
            updateStmt.setString(2, hashSenha(novaSenha));
            updateStmt.setInt(3, Integer.parseInt(userId));
            
            updateStmt.executeUpdate();
            conn.close();
            
            return "{\"sucesso\": true, \"message\": \"Nome e senha atualizados com sucesso\"}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String hashSenha(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(senha.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return senha;
        }
    }
    

}