package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Produto> listarProdutosUsuario(@PathVariable Integer usuarioId) {
        return produtoRepository.findByUsuarioId(usuarioId);
    }
    
    @PostMapping
    public ResponseEntity<?> criarProduto(@RequestBody Map<String, Object> request) {
        Integer usuarioId = (Integer) request.get("usuarioId");
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
        }
        
        Produto produto = new Produto();
        produto.setNome((String) request.get("nome"));
        produto.setPreco(((Number) request.get("preco")).doubleValue());
        produto.setDescricao((String) request.get("descricao"));
        produto.setCategoria((String) request.get("categoria"));
        produto.setUsuario(usuario.get());
        
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produto) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Produto não encontrado"));
        }
        produto.setId(id);
        Produto produtoAtualizado = produtoRepository.save(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable Integer id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Produto não encontrado"));
        }
        produtoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Produto deletado"));
    }
}