package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {
    
    @Autowired
    private HistoricoRepository historicoRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public List<HistoricoMedicamento> listarHistoricoUsuario(@PathVariable Integer usuarioId) {
        return historicoRepository.findByUsuario_IdOrderByDataHoraDesc(usuarioId);
    }
}