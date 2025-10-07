package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {
    
    @Autowired
    private HistoricoRepository historicoRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarHistoricoUsuario(@PathVariable Integer usuarioId) {
        if (usuarioId == null || usuarioId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "ID de usuário inválido"));
        }
        
        try {
            List<HistoricoMedicamento> historico = historicoRepository.findByUsuario_IdOrderByDataHoraDesc(usuarioId);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao buscar histórico"));
        }
    }
}