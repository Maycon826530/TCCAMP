package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }
        return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Integer id, @RequestBody Map<String, String> dados) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (dados.containsKey("nome")) {
            usuario.setNome(dados.get("nome"));
        }
        
        if (dados.containsKey("email")) {
            usuario.setEmail(dados.get("email"));
        }
        
        if (dados.containsKey("senha") && !dados.get("senha").isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(dados.get("senha")));
        }
        
        if (dados.containsKey("idade")) {
            try {
                usuario.setIdade(Integer.parseInt(dados.get("idade")));
            } catch (NumberFormatException e) {
                usuario.setIdade(null);
            }
        }
        
        if (dados.containsKey("comorbidade")) {
            usuario.setComorbidade(dados.get("comorbidade"));
        }
        
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensagem", "Usuário atualizado com sucesso", "usuario", usuario));
    }
}