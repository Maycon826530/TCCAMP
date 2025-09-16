package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping("/conexao")
    public Map<String, String> testarConexao() {
        try (Connection conn = dataSource.getConnection()) {
            return Map.of("status", "Conectado", "database", conn.getCatalog());
        } catch (Exception e) {
            return Map.of("status", "Erro", "erro", e.getMessage());
        }
    }
    
    @GetMapping("/usuarios")
    public Map<String, Object> contarUsuarios() {
        try {
            long count = usuarioRepository.count();
            return Map.of("status", "OK", "totalUsuarios", count);
        } catch (Exception e) {
            return Map.of("status", "Erro", "erro", e.getMessage());
        }
    }
}