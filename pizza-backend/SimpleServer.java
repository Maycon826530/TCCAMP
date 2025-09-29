import java.io.*;
import java.net.*;
import java.util.*;

public class SimpleServer {
    private static Map<String, String> users = new HashMap<>();
    private static List<Map<String, Object>> medicamentos = new ArrayList<>();
    
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8080);
        System.out.println("Servidor PharmaLife rodando na porta 8080...");
        
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
            
            System.out.println("Request: " + requestLine);
            System.out.println("Body: " + body);
            
            out.println("HTTP/1.1 200 OK");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type, Authorization");
            out.println("Content-Type: application/json");
            out.println();
            
            if (requestLine.contains("OPTIONS")) {
                out.println("{}");
            } else if (requestLine.contains("POST /auth/login")) {
                out.println("{\"token\": \"fake-token\", \"usuario\": {\"id\": 1, \"nome\": \"Usuario\", \"email\": \"user@test.com\"}, \"isAdmin\": false}");
            } else if (requestLine.contains("POST /auth/registro")) {
                out.println("{\"token\": \"fake-token\", \"usuario\": {\"id\": 1, \"nome\": \"Usuario\", \"email\": \"user@test.com\"}}");
            } else if (requestLine.contains("POST /medicamentos")) {
                out.println("{\"id\": " + (medicamentos.size() + 1) + ", \"nome\": \"Medicamento\", \"dosagem\": \"50mg\", \"horario\": \"08:00\", \"frequencia\": \"Diario\"}");
            } else if (requestLine.contains("GET /medicamentos/usuario/")) {
                out.println("[]");
            } else {
                out.println("{\"message\": \"Server running\"}");
            }
            
            out.flush();
            client.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}