package com.pharmalife;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String senha = request.get("senha");
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent() && passwordEncoder.matches(senha, usuario.get().getSenha())) {
            // Atualizar último login
            Usuario user = usuario.get();
            user.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(user);
            
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token, "usuario", user, "isAdmin", user.getIsAdmin()));
        }
        return ResponseEntity.badRequest().body(Map.of("erro", "Credenciais inválidas"));
    }
    
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Email já cadastrado"));
        }
        
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario novoUsuario = usuarioRepository.save(usuario);
        String token = jwtUtil.generateToken(usuario.getEmail());
        
        return ResponseEntity.ok(Map.of("token", token, "usuario", novoUsuario));
    }
    
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        
        if (usuario.isPresent()) {
            // Aqui você implementaria o envio de email
            return ResponseEntity.ok(Map.of("mensagem", "Email de recuperação enviado"));
        }
        return ResponseEntity.badRequest().body(Map.of("erro", "Email não encontrado"));
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String senha = request.get("senha");
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent() && usuario.get().getIsAdmin() && passwordEncoder.matches(senha, usuario.get().getSenha())) {
            Usuario user = usuario.get();
            user.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(user);
            
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token, "usuario", user, "isAdmin", true));
        }
        return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado - Apenas administradores"));
    }
    
    @GetMapping("/admin/usuarios")
    public ResponseEntity<?> listarUsuarios(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<Usuario> admin = usuarioRepository.findByEmail(email);
            
            if (!admin.isPresent() || !admin.get().getIsAdmin()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
            }
            
            List<Usuario> usuarios = usuarioRepository.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token inválido"));
        }
    }
    
    @GetMapping("/admin/estatisticas")
    public ResponseEntity<?> obterEstatisticas(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<Usuario> admin = usuarioRepository.findByEmail(email);
            
            if (!admin.isPresent() || !admin.get().getIsAdmin()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Acesso negado"));
            }
            
            long totalUsuarios = usuarioRepository.count();
            long usuariosAtivos = usuarioRepository.countByUltimoLoginAfter(LocalDateTime.now().minusDays(30));
            
            return ResponseEntity.ok(Map.of(
                "totalUsuarios", totalUsuarios,
                "usuariosAtivos", usuariosAtivos,
                "novosUsuarios", usuarioRepository.countByDataCadastroAfter(LocalDateTime.now().minusDays(7))
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token inválido"));
        }
    }
}