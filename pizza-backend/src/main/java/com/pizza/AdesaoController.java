package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/adesao")
@CrossOrigin(origins = "*")
public class AdesaoController {
    
    @Autowired
    private MedicamentoTomadoRepository medicamentoTomadoRepository;
    
    @Autowired
    private MedicamentoRepository medicamentoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @PostMapping("/marcar-tomado")
    public ResponseEntity<?> marcarComoTomado(@RequestBody Map<String, Object> request) {
        Integer medicamentoId = (Integer) request.get("medicamentoId");
        Integer usuarioId = (Integer) request.get("usuarioId");
        
        Optional<Medicamento> medicamento = medicamentoRepository.findById(medicamentoId);
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!medicamento.isPresent() || !usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento ou usuário não encontrado"));
        }
        
        MedicamentoTomado tomado = new MedicamentoTomado();
        tomado.setMedicamento(medicamento.get());
        tomado.setUsuario(usuario.get());
        tomado.setDataHoraTomado(LocalDateTime.now());
        
        medicamentoTomadoRepository.save(tomado);
        return ResponseEntity.ok(Map.of("mensagem", "Medicamento marcado como tomado"));
    }
    
    @GetMapping("/estatisticas/{usuarioId}")
    public ResponseEntity<?> obterEstatisticas(@PathVariable Integer usuarioId) {
        LocalDateTime inicioSemana = LocalDateTime.now().minusDays(7);
        
        Long totalMedicamentos = medicamentoRepository.countByUsuarioId(usuarioId) * 7; // 7 dias
        Long medicamentosTomados = medicamentoTomadoRepository.countByUsuarioIdAndDataAfter(usuarioId, inicioSemana);
        
        int adesao = totalMedicamentos > 0 ? (int) Math.round((medicamentosTomados.doubleValue() / totalMedicamentos) * 100) : 0;
        
        return ResponseEntity.ok(Map.of(
            "adesao", adesao,
            "tomados", medicamentosTomados,
            "total", totalMedicamentos
        ));
    }
}