package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private boolean isAdmin(String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
            Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
            return usuario.isPresent() && usuario.get().getIsAdmin();
        } catch (Exception e) {
            return false;
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
        }
        
        long totalUsuarios = usuarioRepository.count();
        long usuariosAtivos = usuarioRepository.countByUltimoLoginAfter(LocalDateTime.now().minusDays(30));
        long novosUsuarios = usuarioRepository.countByDataCadastroAfter(LocalDateTime.now().minusDays(7));
        
        return ResponseEntity.ok(Map.of(
            "totalUsuarios", totalUsuarios,
            "usuariosAtivos", usuariosAtivos,
            "novosUsuarios", novosUsuarios,
            "taxaAtividade", usuariosAtivos > 0 ? (usuariosAtivos * 100.0 / totalUsuarios) : 0
        ));
    }
    
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
        }
        
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao buscar usuários"));
        }
    }
    
    @PutMapping("/usuario/{id}/admin")
    public ResponseEntity<?> toggleAdmin(@PathVariable Integer id, @RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
        }
        
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "ID de usuário inválido"));
        }
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (!usuario.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }
            
            Usuario user = usuario.get();
            user.setIsAdmin(!user.getIsAdmin());
            usuarioRepository.save(user);
            
            return ResponseEntity.ok(Map.of("mensagem", "Status de admin atualizado", "usuario", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao atualizar usuário"));
        }
    }
    
    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Integer id, @RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
        }
        
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "ID de usuário inválido"));
        }
        
        try {
            if (!usuarioRepository.existsById(id)) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }
            
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensagem", "Usuário deletado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao deletar usuário"));
        }
    }
}