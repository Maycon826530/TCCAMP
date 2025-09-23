package com.pharmalife;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/medicamentos")
@CrossOrigin(origins = "*")
public class MedicamentoController {
    
    @Autowired
    private MedicamentoRepository medicamentoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Medicamento> listarMedicamentosUsuario(@PathVariable Integer usuarioId) {
        return medicamentoRepository.findByUsuarioId(usuarioId);
    }
    
    @PostMapping
    public ResponseEntity<?> criarMedicamento(@RequestBody Map<String, Object> request) {
        Integer usuarioId = (Integer) request.get("usuarioId");
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
        }
        
        Medicamento medicamento = new Medicamento();
        medicamento.setNome((String) request.get("nome"));
        medicamento.setDosagem((String) request.get("dosagem"));
        medicamento.setHorario(LocalTime.parse((String) request.get("horario")));
        medicamento.setFrequencia((String) request.get("frequencia"));
        medicamento.setObservacao((String) request.get("observacao"));
        medicamento.setUsuario(usuario.get());
        
        Medicamento novoMedicamento = medicamentoRepository.save(medicamento);
        return ResponseEntity.ok(novoMedicamento);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarMedicamento(@PathVariable Integer id, @RequestBody Medicamento medicamento) {
        if (!medicamentoRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento não encontrado"));
        }
        medicamento.setId(id);
        Medicamento medicamentoAtualizado = medicamentoRepository.save(medicamento);
        return ResponseEntity.ok(medicamentoAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarMedicamento(@PathVariable Integer id) {
        if (!medicamentoRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento não encontrado"));
        }
        medicamentoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Medicamento deletado"));
    }
}