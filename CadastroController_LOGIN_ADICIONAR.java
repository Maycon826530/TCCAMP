// ADICIONE ESTE CÓDIGO NO SEU CadastroController.java (na API, outra aba)
// Cole este método DENTRO da classe CadastroController, antes da última chave }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Cadastro loginRequest) {
    List<Cadastro> cadastros = cadastroService.findAll();
    
    for (Cadastro c : cadastros) {
        if (c.getEmail().equals(loginRequest.getEmail()) && 
            c.getSenha().equals(loginRequest.getSenha())) {
            return ResponseEntity.ok(c);
        }
    }
    
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body("Credenciais inválidas");
}
