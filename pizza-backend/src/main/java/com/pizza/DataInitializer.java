package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Criar usuário admin se não existir
        if (!usuarioRepository.findByEmail("admin@pharmalife.com").isPresent()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@pharmalife.com");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setIsAdmin(true);
            usuarioRepository.save(admin);
        }
    }
}