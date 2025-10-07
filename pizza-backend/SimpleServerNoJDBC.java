import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.Pattern;

public class SimpleServerNoJDBC {
    private static Map<String, Map<String, String>> usuarios = new HashMap<>();
    
    // Usuários admin pré-cadastrados
    static {
        Map<String, String> admin1 = new HashMap<>();
        admin1.put("nome", "mayconmoreira");
        admin1.put("email", "maycon@pharmalife.com");
        admin1.put("senha", "rm94602");
        admin1.put("isAdmin", "true");
        usuarios.put("mayconmoreira", admin1);
        usuarios.put("maycon@pharmalife.com", admin1);
        
        Map<String, String> admin2 = new HashMap<>();
        admin2.put("nome", "felipeprestes");
        admin2.put("email", "felipe@pharmalife.com");
        admin2.put("senha", "rm94325");
        admin2.put("isAdmin", "true");
        usuarios.put("felipeprestes", admin2);
        usuarios.put("felipe@pharmalife.com", admin2);
        
        Map<String, String> admin3 = new HashMap<>();
        admin3.put("nome", "adrielfelipe");
        admin3.put("email", "adriel@pharmalife.com");
        admin3.put("senha", "rm94608");
        admin3.put("isAdmin", "true");
        usuarios.put("adrielfelipe", admin3);
        usuarios.put("adriel@pharmalife.com", admin3);
        
        Map<String, String> admin4 = new HashMap<>();
        admin4.put("nome", "murilokffiner");
        admin4.put("email", "murilo@pharmalife.com");
        admin4.put("senha", "rm94705");
        admin4.put("isAdmin", "true");
        usuarios.put("murilokffiner", admin4);
        usuarios.put("murilo@pharmalife.com", admin4);
    }
    
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8081);
        // Servidor iniciado na porta 8081
        // Usando armazenamento temporário
        
        while (true) {
            Socket client = server.accept();
            new Thread(() -> handleRequest(client)).start();
        }
    }
    
    private static void handleRequest(Socket client) {
        BufferedReader in = null;
        PrintWriter out = null;
        try {
            in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            out = new PrintWriter(client.getOutputStream());
            
            String requestLine = in.readLine();
            if (requestLine == null || requestLine.trim().isEmpty()) return;
            
            // Validar contra path traversal
            if (requestLine.contains("../") || requestLine.contains("..\\")) {
                out.println("HTTP/1.1 400 Bad Request");
                out.println();
                out.println("{\"erro\": \"Requisição inválida\"}");
                out.flush();
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
                try {
                    int length = Integer.parseInt(contentLength);
                    if (length > 0 && length < 10000) { // Limite de segurança
                        char[] buffer = new char[length];
                        in.read(buffer, 0, length);
                        body = new String(buffer);
                    }
                } catch (NumberFormatException e) {
                    // Invalid content length
                }
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
            } else if (requestLine.contains("POST /auth/registro")) {
                String response = registrarUsuario(body);
                out.println(response);
            } else if (requestLine.contains("POST /auth/login") || requestLine.contains("POST /auth/admin/login")) {
                String response = loginUsuario(body);
                out.println(response);
            } else {
                out.println("{\"message\": \"Server running\"}");
            }
            
            out.flush();
        } catch (Exception e) {
            // Error handling request
        } finally {
            try {
                if (in != null) in.close();
                if (out != null) out.close();
                if (client != null) client.close();
            } catch (IOException e) {
                // Error closing resources
            }
        }
    }
    
    private static String registrarUsuario(String body) {
        try {
            String nome = extrairCampo(body, "nome");
            String email = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            
            if (nome.isEmpty() || email.isEmpty() || senha.isEmpty()) {
                return "{\"erro\": \"Dados incompletos\"}";
            }
            
            if (!isValidEmail(email)) {
                return "{\"erro\": \"Email inválido\"}";
            }
            
            if (usuarios.containsKey(nome) || usuarios.containsKey(email)) {
                return "{\"erro\": \"Usuário já cadastrado\"}";
            }
            
            Map<String, String> novoUsuario = new HashMap<>();
            novoUsuario.put("nome", nome);
            novoUsuario.put("email", email);
            novoUsuario.put("senha", senha);
            novoUsuario.put("isAdmin", "false");
            
            usuarios.put(nome, novoUsuario);
            usuarios.put(email, novoUsuario);
            
            // User registered
            
            return "{\"token\": \"token-" + nome + "\", \"usuario\": {\"nome\": \"" + nome + "\", \"email\": \"" + email + "\"}}";
            
        } catch (Exception e) {
            return "{\"erro\": \"Erro interno do servidor\"}";
        }
    }
    
    private static String loginUsuario(String body) {
        try {
            String emailOrNome = extrairCampo(body, "email");
            String senha = extrairCampo(body, "senha");
            
            if (emailOrNome.isEmpty() || senha.isEmpty()) {
                return "{\"erro\": \"Dados incompletos\"}";
            }
            
            Map<String, String> usuario = usuarios.get(emailOrNome);
            
            if (usuario != null && usuario.get("senha").equals(senha)) {
                String nome = usuario.get("nome");
                String email = usuario.get("email");
                boolean isAdmin = "true".equals(usuario.get("isAdmin"));
                
                // Login successful
                
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
            if (fim == -1) return "";
            return json.substring(inicio, fim);
        } catch (Exception e) {
            return "";
        }
    }
    

    

    

    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    private static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }
    

}