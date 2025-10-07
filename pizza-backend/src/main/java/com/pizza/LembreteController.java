package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/lembretes")
@CrossOrigin(origins = "*")
public class LembreteController {
    
    @Autowired
    private LembreteRepository lembreteRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Lembrete> listarLembretesUsuario(@PathVariable Integer usuarioId) {
        return lembreteRepository.findByUsuarioId(usuarioId);
    }
    
    @PostMapping
    public ResponseEntity<?> criarLembrete(@RequestBody Map<String, Object> request) {
        try {
            Integer usuarioId = (Integer) request.get("usuarioId");
            if (usuarioId == null || usuarioId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("erro", "ID de usuário inválido"));
            }
            
            Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
            if (!usuario.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }
        
            String titulo = (String) request.get("titulo");
            String data = (String) request.get("data");
            String horario = (String) request.get("horario");
            
            if (titulo == null || titulo.trim().isEmpty() || data == null || horario == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Dados obrigatórios não informados"));
            }
            
            Lembrete lembrete = new Lembrete();
            lembrete.setTitulo(titulo.trim());
            lembrete.setDescricao((String) request.get("descricao"));
            lembrete.setData(LocalDate.parse(data));
            lembrete.setHorario(LocalTime.parse(horario));
            lembrete.setUsuario(usuario.get());
            
            Lembrete novoLembrete = lembreteRepository.save(lembrete);
            return ResponseEntity.ok(novoLembrete);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao criar lembrete"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarLembrete(@PathVariable Integer id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "ID inválido"));
        }
        
        try {
            if (!lembreteRepository.existsById(id)) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Lembrete não encontrado"));
            }
            lembreteRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensagem", "Lembrete deletado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao deletar lembrete"));
        }
    }
}