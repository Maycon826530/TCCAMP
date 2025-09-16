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
        Integer usuarioId = (Integer) request.get("usuarioId");
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
        }
        
        Lembrete lembrete = new Lembrete();
        lembrete.setTitulo((String) request.get("titulo"));
        lembrete.setDescricao((String) request.get("descricao"));
        lembrete.setData(LocalDate.parse((String) request.get("data")));
        lembrete.setHorario(LocalTime.parse((String) request.get("horario")));
        lembrete.setUsuario(usuario.get());
        
        Lembrete novoLembrete = lembreteRepository.save(lembrete);
        return ResponseEntity.ok(novoLembrete);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarLembrete(@PathVariable Integer id) {
        if (!lembreteRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Lembrete não encontrado"));
        }
        lembreteRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Lembrete deletado"));
    }
}