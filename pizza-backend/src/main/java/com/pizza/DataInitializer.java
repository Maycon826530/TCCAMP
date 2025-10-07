package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("=== INICIALIZANDO DADOS DO SISTEMA ===");
        
        // Criar usuários administradores se não existirem
        String[][] admins = {
            {"mayconmoreira", "maycon@pharmalife.com", "rm94602"},
            {"felipeprestes", "felipe@pharmalife.com", "rm94325"},
            {"adrielfelipe", "adriel@pharmalife.com", "rm94608"},
            {"murilokffiner", "murilo@pharmalife.com", "rm94705"}
        };
        
        for (String[] adminData : admins) {
            if (!usuarioRepository.findByEmail(adminData[1]).isPresent()) {
                Usuario admin = new Usuario();
                admin.setNome(adminData[0]);
                admin.setEmail(adminData[1]);
                admin.setSenha(passwordEncoder.encode(adminData[2]));
                admin.setIsAdmin(true);
                usuarioRepository.save(admin);
                
                logger.info("✓ Usuário administrador criado:");
                logger.info("  Nome: {}", admin.getNome());
                logger.info("  Email: {}", admin.getEmail());
                logger.info("  Senha: {}", adminData[2]);
            }
        }
        
        logger.info("=== SISTEMA PRONTO PARA USO ===");
    }
}