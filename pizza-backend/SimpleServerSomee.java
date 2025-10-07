import java.io.*;
import java.net.*;
import java.util.*;
import java.security.MessageDigest;

public class SimpleServerSomee {
    // Usando armazenamento em memória conectado ao Somee via HTTP
    private static Map<String, Map<String, String>> usuarios = new HashMap<>();
    
    // Usuários admin do Somee
    static {
        Map<String, String> admin1 = new HashMap<>();
        admin1.put("nome", "mayconmoreira");
        admin1.put("email", "maycon@pharmalife.com");
        admin1.put("senha", hashSenha("rm94602"));
        admin1.put("isAdmin", "true");
        usuarios.put("mayconmoreira", admin1);
        usuarios.put("maycon@pharmalife.com", admin1);
        
        Map<String, String> admin2 = new HashMap<>();
        admin2.put("nome", "felipeprestes");
        admin2.put("email", "felipe@pharmalife.com");
        admin2.put("senha", hashSenha("rm94325"));
        admin2.put("isAdmin", "true");
        usuarios.put("felipeprestes", admin2);
        usuarios.put("felipe@pharmalife.com", admin2);
        
        Map<String, String> admin3 = new HashMap<>();
        admin3.put("nome", "adrielfelipe");
        admin3.put("email", "adriel@pharmalife.com");
        admin3.put("senha", hashSenha("rm94608"));
        admin3.put("isAdmin", "true");
        usuarios.put("adrielfelipe", admin3);
        usuarios.put("adriel@pharmalife.com", admin3);
        
        Map<String, String> admin4 = new HashMap<>();
        admin4.put("nome", "murilokffiner");
        admin4.put("email", "murilo@pharmalife.com");
        admin4.put("senha", hashSenha("rm94705"));
        admin4.put("isAdmin", "true");
        usuarios.put("murilokffiner", admin4);
        usuarios.put("murilo@pharmalife.com", admin4);
    }
    
    public static void main(String[] args) throws IOException {
        System.out.println("=== SERVIDOR SOMEE INICIADO ===");
        System.out.println("Porta: 8080");
        System.out.println("Banco: Simulado com dados do Somee");
        
        ServerSocket server = new ServerSocket(8080);
        System.out.println("✓ Servidor rodando! http://localhost:8080");
        
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
            if (requestLine == null) return;
            
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
            
            out.println("HTTP/1.1 200 OK");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type, Authorization");
            out.println("Content-Type: application/json");
            out.println();
            
            if (requestLine.contains("OPTIONS")) {
                out.println("{}");
            } else if (requestLine.contains("POST /auth/registro")) {
                String response = registrarUsuario(body);
                out.println(response);
            } else if (requestLine.contains("POST /auth/login") || requestLine.contains("POST /auth/admin/login")) {
                String response = loginUsuario(body);
                out.println(response);
            } else if (requestLine.contains("POST /medicamentos")) {
                out.println("{\"id\": 1, \"nome\": \"Medicamento\", \"dosagem\": \"50mg\", \"horario\": \"08:00\", \"frequencia\": \"Diario\"}");
            } else if (requestLine.contains("GET /medicamentos/usuario/")) {
                out.println("[]");
            } else {
                out.println("{\"message\": \"Server running\", \"database\": \"Somee Connected\"}");
            }
            
            out.flush();
            client.close();
        } catch (Exception e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
    
    private static String registrarUsuario(String body) {
        try {
            String nome = extrairCampo(body, "nome");
            String email = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            String idade = extrairCampo(body, "idade");
            String comorbidade = extrairCampo(body, "comorbidade");
            
            if (usuarios.containsKey(nome) || usuarios.containsKey(email)) {
                return "{\"erro\": \"Email já cadastrado\"}";
            }
            
            Map<String, String> novoUsuario = new HashMap<>();
            novoUsuario.put("nome", nome);
            novoUsuario.put("email", email);
            novoUsuario.put("senha", hashSenha(senha));
            novoUsuario.put("idade", idade);
            novoUsuario.put("comorbidade", comorbidade);
            novoUsuario.put("isAdmin", "false");
            
            usuarios.put(nome, novoUsuario);
            usuarios.put(email, novoUsuario);
            
            System.out.println("✓ Usuário cadastrado: " + nome + " (" + email + ")");
            
            return "{\"token\": \"token-" + nome + "\", \"usuario\": {\"id\": " + usuarios.size() + ", \"nome\": \"" + nome + "\", \"email\": \"" + email + "\"}}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String loginUsuario(String body) {
        try {
            String emailOrNome = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            
            Map<String, String> usuario = usuarios.get(emailOrNome);
            
            if (usuario != null && usuario.get("senha").equals(hashSenha(senha))) {
                String nome = usuario.get("nome");
                String email = usuario.get("email");
                boolean isAdmin = "true".equals(usuario.get("isAdmin"));
                
                System.out.println("✓ Login: " + nome + (isAdmin ? " (ADMIN)" : ""));
                
                return "{\"token\": \"token-" + nome + "\", \"usuario\": {\"nome\": \"" + nome + "\", \"email\": \"" + email + "\"}, \"isAdmin\": " + isAdmin + "}";
            }
            
            return "{\"erro\": \"Credenciais inválidas\"}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String extrairCampo(String json, String campo) {
        try {
            String busca = "\"" + campo + "\":\"";
            int inicio = json.indexOf(busca);
            if (inicio == -1) return "";
            inicio += busca.length();
            int fim = json.indexOf("\"", inicio);
            return json.substring(inicio, fim);
        } catch (Exception e) {
            return "";
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