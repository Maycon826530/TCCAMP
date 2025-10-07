import java.sql.*;

public class QueryUsuarios {
    public static void main(String[] args) {
        String url = System.getenv().getOrDefault("DB_URL", "jdbc:sqlserver://localhost:1433;databaseName=pharmalife;encrypt=true;trustServerCertificate=true");
        String user = System.getenv().getOrDefault("DB_USERNAME", "sa");
        String password = System.getenv().getOrDefault("DB_PASSWORD", "password");
        
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM usuario")) {
            
            while (rs.next()) {
                // Dados do usuário processados
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                String email = rs.getString("email");
                // System.out.println("ID: " + id + ", Nome: " + nome + ", Email: " + email);
            }
            
        } catch (Exception e) {
            // Database error
        }
    }
}