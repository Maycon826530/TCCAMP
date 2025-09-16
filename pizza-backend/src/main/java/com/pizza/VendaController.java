package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {
    
    @Autowired
    private HistoricoMedicamentoRepository historicoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MedicamentoRepository medicamentoRepository;
    
    @PostMapping("/marcar-tomado")
    public ResponseEntity<?> marcarComoTomado(@RequestBody Map<String, Object> request) {
        Integer usuarioId = (Integer) request.get("usuarioId");
        Integer medicamentoId = (Integer) request.get("medicamentoId");
        
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        Optional<Medicamento> medicamento = medicamentoRepository.findById(medicamentoId);
        
        if (!usuario.isPresent() || !medicamento.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário ou medicamento não encontrado"));
        }
        
        HistoricoMedicamento historico = new HistoricoMedicamento();
        historico.setUsuario(usuario.get());
        historico.setMedicamento(medicamento.get());
        historico.setTomado(true);
        
        HistoricoMedicamento novoHistorico = historicoRepository.save(historico);
        return ResponseEntity.ok(novoHistorico);
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public List<HistoricoMedicamento> listarHistoricoUsuario(@PathVariable Integer usuarioId) {
        return historicoRepository.findByUsuarioId(usuarioId);
    }
    
    @GetMapping("/medicamento/{medicamentoId}")
    public List<HistoricoMedicamento> listarHistoricoMedicamento(@PathVariable Integer medicamentoId) {
        return historicoRepository.findByMedicamentoId(medicamentoId);
    }
}