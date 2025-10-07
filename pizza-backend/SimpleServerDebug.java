import java.io.*;
import java.net.*;
import java.util.*;
import java.sql.*;
import java.security.MessageDigest;

public class SimpleServerDebug {
    private static final String DB_URL = System.getenv().getOrDefault("DB_URL", "jdbc:sqlserver://tccamp2.mssql.somee.com:1433;databaseName=tccamp2;encrypt=true;trustServerCertificate=true");
    private static final String DB_USER = System.getenv().getOrDefault("DB_USERNAME", "Noc");
    private static final String DB_PASS = System.getenv().getOrDefault("DB_PASSWORD", "12345678");
    
    static {
        try {
            System.out.println("Carregando driver JDBC...");
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("Driver carregado com sucesso!");
        } catch (ClassNotFoundException e) {
            System.out.println("ERRO: Driver não encontrado - " + e.getMessage());
        }
    }
    
    public static void main(String[] args) throws IOException {
        System.out.println("=== INICIANDO SERVIDOR DEBUG ===");
        System.out.println("DB_URL: " + DB_URL);
        System.out.println("DB_USER: " + DB_USER);
        System.out.println("DB_PASS: " + (DB_PASS.isEmpty() ? "VAZIO" : "CONFIGURADO"));
        
        // Testar conexão com banco
        try {
            System.out.println("Testando conexão com banco...");
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            System.out.println("✓ Conexão com banco OK!");
            conn.close();
        } catch (Exception e) {
            System.out.println("✗ ERRO na conexão: " + e.getMessage());
            e.printStackTrace();
        }
        
        try {
            System.out.println("Iniciando servidor na porta 8080...");
            ServerSocket server = new ServerSocket(8080);
            System.out.println("✓ Servidor iniciado! Aguardando conexões...");
            
            while (true) {
                Socket client = server.accept();
                System.out.println("Nova conexão recebida!");
                new Thread(() -> handleRequest(client)).start();
            }
        } catch (Exception e) {
            System.out.println("✗ ERRO no servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void handleRequest(Socket client) {
        try {
            System.out.println("Processando requisição...");
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            PrintWriter out = new PrintWriter(client.getOutputStream());
            
            String requestLine = in.readLine();
            System.out.println("Request: " + requestLine);
            
            out.println("HTTP/1.1 200 OK");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Content-Type: application/json");
            out.println();
            out.println("{\"message\": \"Server running\", \"status\": \"OK\"}");
            out.flush();
            client.close();
            
        } catch (Exception e) {
            System.out.println("Erro na requisição: " + e.getMessage());
        }
    }
}