package com.pizza;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/vendas")
@CrossOrigin(origins = "*")
public class VendaController {
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("mensagem", "Vendas API funcionando"));
    }
}